"use client";

import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import type { Character } from "./types";
import { useCallback, useEffect, useState } from "react";
import Guessed from "./Guessed";
import GuessForm from "./GuessForm";
import Keyboard from "./Keyboard";

const defaultCharacterState: Array<Character> = [
    { id: "1", value: "", status: "" },
    { id: "2", value: "", status: "" },
    { id: "3", value: "", status: "" },
    { id: "4", value: "", status: "" },
    { id: "5", value: "", status: "" }
];

const ALLOWED_GUESSES = [1, 2, 3, 4, 5, 6];

export default function Board() {
    const [currentGuess, setCurrentGuess] = useState(1);
    const [characters, setCharacters] = useState<Array<Character>>(defaultCharacterState);
    const [addedChar, setAddedChar] = useState(false);
    const [deletedChar, setDeletedChar] = useState(false);
    const [guesses, setGuesses] = useState<Array<string>>([]);

    const handleCharacterChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (new RegExp(/[^A-Za-z]/, "g").test(e.target.value)) return;

        setCharacters((prevChars) =>
            prevChars.map((c) =>
                c.id === e.target.id ? { ...c, value: e.target.value.replace(c.value, "") } : c
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

    const handleSubmit = useCallback(() => {
        if (characters.some((c) => !c.value.length)) return;

        setGuesses((p) => p.concat(characters.map(({ value }) => value).join("")));
        setCurrentGuess((p) => (p += 1));
        setCharacters(defaultCharacterState);
    }, [characters]);

    const handleUserKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                handleSubmit();
            }
        },
        [handleSubmit]
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

    return (
        <>
            <div
                aria-label="game board"
                className="w-full max-w-[360px] h-[480px] grid grid-rows-6 gap-1.5"
            >
                {ALLOWED_GUESSES.map((guess) =>
                    currentGuess === guess ? (
                        <GuessForm
                            key={guess}
                            addedChar={addedChar}
                            characters={characters}
                            deletedChar={deletedChar}
                            onCharacterChange={handleCharacterChange}
                            onKeyDown={handleKeyDown}
                            setAddedChar={setAddedChar}
                            setDeletedChar={setDeletedChar}
                        />
                    ) : (
                        <Guessed key={guess} guesses={guesses} selectedGuess={guess} />
                    )
                )}
            </div>
            <div aria-label="keyboard" className="h-52 space-y-1.5 mx-2 mt-4 select-none w-full">
                <Keyboard
                    keys={["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]}
                    onButtonPress={handleButtonPress}
                />
                <Keyboard
                    keys={["a", "s", "d", "f", "g", "h", "j", "k", "l"]}
                    onButtonPress={handleButtonPress}
                    showSpacers
                />
                <Keyboard
                    backspaceDisabled={!characters.some((c) => c.value.length)}
                    enterDisabled={characters.some((c) => !c.value.length)}
                    keys={["z", "x", "c", "v", "b", "n", "m"]}
                    onButtonPress={handleButtonPress}
                    showEnter
                    showBackspace
                />
            </div>
        </>
    );
}
