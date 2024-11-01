"use client";

import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import type { Character, CharacterStatus, Guess } from "./types";
import { useCallback, useEffect, useMemo, useState } from "react";
import crypto from "crypto-js";
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
    const [showLossOverlay, setShowLossOverlay] = useState(false);
    const keyStatuses = useMemo(() => {
        const kS: Record<string, CharacterStatus> = {};
        for (let i = 0; i < guesses.length; ++i) {
            const guess = guesses[i];
            if (!guess) continue;

            for (let j = 0; j < 5; ++j) {
                const val = guess[j].value;
                const status = guess[j].status;
                if (kS[val] === "correct") continue;

                if (status !== "invalid") {
                    kS[val] = status
                } else if (kS[val] !== "valid") {
                    kS[val] = "invalid";
                }
            }
        }
        return kS;
    }, [guesses]);

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
        const encAnswer = cookie.get("wordul-a") || "";
        const answer = crypto.AES.decrypt(encAnswer, process.env.NEXT_PUBLIC_WORDUL_SECRET).toString(crypto.enc.Utf8);
        if (characters.some((c) => !c.value.length) || !answer) return;

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

        setGuesses((prevGuesses) => {
            const gameState = [...prevGuesses, validatedGuess]
            localStorage.setItem("gameState", JSON.stringify(gameState));
            return gameState;
        });

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
    }, [characters, currentGuess, gameOver]);

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

    const handleGameReset = () => {
        setCurrentGuess(1);
        setCharacters(defaultCharacterState);
        setGuesses([]);
        setGameOver(false);
        localStorage.removeItem("gameState");
    }

    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);

        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    }, [handleUserKeyPress]);

    useEffect(() => {
        const gameState: Array<Guess> = JSON.parse(localStorage.getItem("gameState") || "[]");
        if (!gameState.length) return;

        setGuesses(gameState);
        setCurrentGuess(gameState.length + 1);
        let correctGuessCharacters = 0;
        for (let i = 0; i < gameState.length; ++i) {
            const guess = gameState[i];
            if (!guess) continue;

            for (let j = 0; j < 5; ++j) {
                if (guess[j].status !== "correct") {
                    correctGuessCharacters = 0;
                    break;
                }
                ++correctGuessCharacters;
            }
        }
        setGameOver(correctGuessCharacters === 5 || correctGuessCharacters !== 5 && gameState.length === 6);
        window.setTimeout(() => {
            setShownWinOverlay(correctGuessCharacters === 5);
            setShowLossOverlay(correctGuessCharacters !== 5 && gameState.length === 6);
        }, 2000);
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
            <button type="button" onClick={handleGameReset}>Reset</button>
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
                    keyStatuses={keyStatuses}
                    disabled={gameOver}
                    onButtonPress={handleButtonPress}
                />
                <Keyboard
                    keys={["a", "s", "d", "f", "g", "h", "j", "k", "l"]}
                    keyStatuses={keyStatuses}
                    disabled={gameOver}
                    onButtonPress={handleButtonPress}
                    showSpacers
                />
                <Keyboard
                    backspaceDisabled={!characters.some((c) => c.value.length)}
                    enterDisabled={characters.some((c) => !c.value.length)}
                    disabled={gameOver}
                    keys={["z", "x", "c", "v", "b", "n", "m"]}
                    keyStatuses={keyStatuses}
                    onButtonPress={handleButtonPress}
                    showEnter
                    showBackspace
                />
            </div>
        </>
    );
}
