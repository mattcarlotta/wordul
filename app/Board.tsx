"use client";

import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import type { Character, Guess } from "./types";
import { useCallback, useEffect, useState } from "react";
import cookie from "js-cookie";
import Guessed from "./Guessed";
import GuessForm from "./GuessForm";
import Keyboard from "./Keyboard";

const defaultCharacterState: Array<Character> = [
    { id: "1", value: "" },
    { id: "2", value: "" },
    { id: "3", value: "" },
    { id: "4", value: "" },
    { id: "5", value: "" }
];

const ALLOWED_GUESSES = [1, 2, 3, 4, 5, 6];

export default function Board() {
    const [currentGuess, setCurrentGuess] = useState(1);
    const [characters, setCharacters] = useState<Array<Character>>(defaultCharacterState);
    const [addedChar, setAddedChar] = useState(false);
    const [deletedChar, setDeletedChar] = useState(false);
    const [guesses, setGuesses] = useState<Array<Guess>>([]);
    const [gameOver, setGameOver] = useState(false);
    const [showWinOverlay, setShownWinOverlay] = useState(false);
    const [answer, setAnswer] = useState("");
    const [showLossOverlay, setShowLossOverlay] = useState(false);

    const handleCharacterChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (new RegExp(/[^A-Za-z]/, "g").test(e.target.value)) return;

        setCharacters((prevChars) =>
            prevChars.map((c) =>
                c.id === e.target.id
                    ? { ...c, value: e.target.value.replace(c.value, "").toLowerCase() }
                    : c
            )
        );
        setAddedChar(true);
    };

    const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" || e.key === "Delete") {
            setCharacters((prevChars) =>
                prevChars.map((c) =>
                    c.id === (e.target as HTMLInputElement).id ? { ...c, value: "" } : c
                )
            );
            setDeletedChar(true);
        }
    };

    const handleSubmit = useCallback(async () => {
        if (characters.some((c) => !c.value.length)) return;

        const answerDict = new Map();
        const validatedGuess: Guess = {};
        let correctCharacters = 0;
        // check for correct characters only
        for (let i = 0; i < characters.length; ++i) {
            const answerChar = answer[i];
            const guessedChar = characters[i].value;

            if (answerChar !== guessedChar) {
                const val = answerDict.get(answerChar) || 0;
                answerDict.set(answerChar, val + 1);
                continue;
            }

            validatedGuess[i] = { ...characters[i], status: "correct" };
            correctCharacters += 1;
        }


        for (let i = 0; i < characters.length; ++i) {
            if (validatedGuess[i]) continue;

            const guessedChar = characters[i].value;
            const val = answerDict.get(guessedChar) || 0;
            answerDict.set(guessedChar, val - 1);
            validatedGuess[i] = { ...characters[i], status: val > 0 ? "valid" : "invalid" };
        }

        setGuesses((prevGuesses) => [...prevGuesses, validatedGuess]);

        // TODO: Store results to localStorage
        // const gameState = JSON.parse(localStorage.getItem("gameState") || "{}");

        setCharacters(defaultCharacterState);
        setCurrentGuess((p) => (p += 1));

        if (correctCharacters === 5) {
            window.setTimeout(() => {
                setGameOver(true);
                setShownWinOverlay(true);
            }, 2000);
        } else if (currentGuess + 1 === 7 && !gameOver) {
            window.setTimeout(() => {
                setGameOver(true);
                setShowLossOverlay(true);
            }, 2000);
        }
    }, [answer, characters, currentGuess, gameOver]);

    const handleUserKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (!gameOver && event.key === "Enter") {
                handleSubmit();
            }
        },
        [gameOver, handleSubmit]
    );

    const handleButtonPress = (value: string) => {
        switch (value) {
            case "backspace": {
                setCharacters((prevChars) => {
                    const lastChar = prevChars.findLast((c) => c.value.length);
                    return lastChar
                        ? prevChars.map((c) => (c.id === lastChar.id ? { ...c, value: "" } : c))
                        : prevChars;
                });
                setDeletedChar(true);
                break;
            }
            case "enter": {
                handleSubmit();
                break;
            }
            default:
                setCharacters((prevChars) => {
                    const firstChar = prevChars.find((c) => !c.value.length);
                    return firstChar
                        ? prevChars.map((c) => (c.id === firstChar.id ? { ...c, value } : c))
                        : prevChars;
                });
                setAddedChar(true);
                break;
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);

        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    }, [handleUserKeyPress]);

    useEffect(() => {
        // TODO: Obfuscate answer in cookie
        const answer = cookie.get("wordul-a");
        if (answer?.length !== 5) {
            // TODO: Handle cookie error;
        } else {
            setAnswer(answer);
        }
    }, []);

    if (showWinOverlay) {
        return (
            <div>
                <h2>You Win!</h2>
                <button type="button" onClick={() => setShownWinOverlay(false)}>
                    Cancel
                </button>
            </div>
        );
    }

    if (showLossOverlay) {
        return (
            <div>
                <h2>You Lose!</h2>
                <button type="button" onClick={() => setShowLossOverlay(false)}>
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <>
            <div
                aria-label="game board"
                className="w-full max-w-[360px] h-[480px] grid grid-rows-6 gap-1.5"
            >
                {ALLOWED_GUESSES.map((guess) =>
                    currentGuess === guess && !gameOver ? (
                        <GuessForm
                            key={guess}
                            addedChar={addedChar}
                            characters={characters}
                            deletedChar={deletedChar}
                            onCharacterChange={handleCharacterChange}
                            onKeyDown={handleKeyDown}
                            setAddedChar={setAddedChar}
                            setDeletedChar={setDeletedChar}
                            disabled={gameOver}
                        />
                    ) : (
                        <Guessed
                            key={guess}
                            guessed={guesses[guess - 1] || null}
                            selectedGuess={guess}
                        />
                    )
                )}
            </div>
            <div aria-label="keyboard" className="h-52 space-y-1.5 mx-2 mt-4 select-none w-full">
                <Keyboard
                    keys={["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]}
                    disabled={gameOver}
                    onButtonPress={handleButtonPress}
                />
                <Keyboard
                    keys={["a", "s", "d", "f", "g", "h", "j", "k", "l"]}
                    disabled={gameOver}
                    onButtonPress={handleButtonPress}
                    showSpacers
                />
                <Keyboard
                    backspaceDisabled={!characters.some((c) => c.value.length)}
                    enterDisabled={characters.some((c) => !c.value.length)}
                    disabled={gameOver}
                    keys={["z", "x", "c", "v", "b", "n", "m"]}
                    onButtonPress={handleButtonPress}
                    showEnter
                    showBackspace
                />
            </div>
        </>
    );
}
