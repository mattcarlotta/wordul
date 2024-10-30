"use client";

import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { Fragment, useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import FocusTrapper from "./FocusTrapper";
import Keyboard from "./Keyboard";

type Character = {
    id: string;
    value: string;
    status: string;
};

const defaultCharacterState: Array<Character> = [
    { id: "1", value: "", status: "" },
    { id: "2", value: "", status: "" },
    { id: "3", value: "", status: "" },
    { id: "4", value: "", status: "" },
    { id: "5", value: "", status: "" }
];

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
                {[1, 2, 3, 4, 5, 6].map((guess) =>
                    currentGuess === guess ? (
                        <FocusTrapper
                            key={guess}
                            className="flex"
                            addedChar={addedChar}
                            setAddedChar={setAddedChar}
                            deletedChar={deletedChar}
                            setDeletedChar={setDeletedChar}
                        >
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="grid grid-cols-5 gap-1.5 text-white font-bold text-3xl"
                            >
                                {characters.map(({ id, value }) => (
                                    <Fragment key={id}>
                                        <label className="hidden" htmlFor={id}>
                                            Character {id}
                                        </label>
                                        <input
                                            id={id}
                                            value={value}
                                            autoComplete="off"
                                            onChange={handleCharacterChange}
                                            onKeyDown={handleKeyDown}
                                            className={clsx(
                                                "inline-flex justify-center items-center select-none uppercase text-center border-2 bg-transparent focus:border-gray-400 focus-visible:border-gray-400 before:content-[''] before:inline-block before:pb-[100%]",
                                                value.length
                                                    ? "border-gray-500 animate-pop"
                                                    : "border-gray-700 animate-push"
                                            )}
                                            type="text"
                                        />
                                    </Fragment>
                                ))}
                            </form>
                        </FocusTrapper>
                    ) : (
                        <div
                            key={guess}
                            className="grid grid-cols-5 gap-1.5 text-white font-bold text-3xl"
                        >
                            {[0, 1, 2, 3, 4].map((characterIdx) =>
                                guesses[guess - 1]?.length ? (
                                    <p
                                        key={characterIdx}
                                        className={clsx(
                                            "uppercase inline-flex animate-reveal justify-center items-center border-2 border-transparent bg-gray-700 before:content-[''] before:inline-block before:pb-[100%]",
                                            characterIdx === 0 && "animation-delay-100",
                                            characterIdx === 1 && "animation-delay-200",
                                            characterIdx === 2 && "animation-delay-300",
                                            characterIdx === 3 && "animation-delay-400",
                                            characterIdx === 4 && "animation-delay-500"
                                        )}
                                    >
                                        {guesses[guess - 1][characterIdx]}
                                    </p>
                                ) : (
                                    <div
                                        key={characterIdx}
                                        className={clsx(
                                            "animate-push border-2 border-gray-700 bg-transparent before:content-[''] before:inline-block before:pb-[100%]",
                                            guess === 1 && "animation-delay-0",
                                            guess === 2 && "animation-delay-100",
                                            guess === 3 && "animation-delay-200",
                                            guess === 4 && "animation-delay-300",
                                            guess === 5 && "animation-delay-400",
                                            guess === 6 && "animation-delay-500"
                                        )}
                                    />
                                )
                            )}
                        </div>
                    )
                )}
            </div>
            <div aria-label="keyboard" className="h-52 space-y-1.5 mx-2 mt-4 select-none w-full">
                <Keyboard
                    handleButtonPress={handleButtonPress}
                    keys={["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]}
                />
                <Keyboard
                    handleButtonPress={handleButtonPress}
                    keys={["a", "s", "d", "f", "g", "h", "j", "k", "l"]}
                    showSpacers
                />
                <Keyboard
                    backspaceDisabled={!characters.some((c) => c.value.length)}
                    enterDisabled={characters.some((c) => !c.value.length)}
                    handleButtonPress={handleButtonPress}
                    keys={["z", "x", "c", "v", "b", "n", "m"]}
                    showEnter
                    showBackspace
                />
            </div>
        </>
    );
}
