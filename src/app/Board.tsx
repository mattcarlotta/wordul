"use client"

import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { Fragment, useCallback, useEffect, useState } from "react";
import FocusTrapper from "./FocusTrapper";
import clsx from "clsx";

type Character = {
    id: string,
    value: string,
    status: string
}

const defaultCharacterState: Array<Character> = [
    { id: "1", value: "", status: "", },
    { id: "2", value: "", status: "", },
    { id: "3", value: "", status: "", },
    { id: "4", value: "", status: "", },
    { id: "5", value: "", status: "", }
];

export default function Board() {
    const [currentGuess, setCurrentGuess] = useState(1);
    const [characters, setCharacters] = useState<Array<Character>>(defaultCharacterState);
    const [addedChar, setAddedChar] = useState(false);
    const [deletedChar, setDeletedChar] = useState(false);
    const [guesses, setGuesses] = useState<Array<string>>([]);

    const handleCharacterChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (new RegExp(/[^A-Za-z]/, "g").test(e.target.value)) return;

        setCharacters(prevCharacters =>
            prevCharacters.map(c =>
                c.id === e.target.id
                    ? { ...c, value: e.target.value.replace(c.value, "") }
                    : c
            )
        );
        setAddedChar(true);
    }

    const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" || e.key === "Delete") {
            setCharacters(prevCharacters =>
                prevCharacters.map(c =>
                    c.id === (e.target as HTMLInputElement).id
                        ? { ...c, value: "" }
                        : c
                )
            );
        }
    }

    const handleSubmit = useCallback(() => {
        if (characters.some(c => !c.value.length)) return;

        setGuesses(p => p.concat(characters.map(({ value }) => value).join("")));
        setCurrentGuess(p => p += 1);
        setCharacters(defaultCharacterState);
    }, [characters])

    const handleUserKeyPress = useCallback((event: KeyboardEvent) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    }, [handleSubmit]);

    const handleButtonPress = (action: string) => {
        switch (action) {
            case "backspace": {
                setCharacters(prevCharacters => {
                    const lastCharacter = prevCharacters.findLast(c => c.value.length);
                    return lastCharacter
                        ? prevCharacters.map(c => c.id === lastCharacter.id ? { ...c, value: "" } : c)
                        : prevCharacters;
                });
                setDeletedChar(true);
                break;
            }
            case "enter": {
                handleSubmit();
                break;
            }
            default:
                setCharacters(prevCharacters => {
                    const firstCharacter = prevCharacters.find(c => !c.value.length);
                    return firstCharacter
                        ? prevCharacters.map(c => c.id === firstCharacter.id ? { ...c, value: action } : c)
                        : prevCharacters;
                });
                setAddedChar(true);
                break;
        }
    }


    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);

        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        }
    }, [handleUserKeyPress]);


    return (
        <>
            <div aria-label="game board" className="w-full max-w-[360px] h-[480px] grid grid-rows-6 gap-1.5">
                {[1, 2, 3, 4, 5, 6].map(guess => (
                    currentGuess === guess
                        ? <FocusTrapper
                            key={guess}
                            className="flex"
                            addedChar={addedChar}
                            setAddedChar={setAddedChar}
                            deletedChar={deletedChar}
                            setDeletedChar={setDeletedChar}
                        >
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="grid grid-cols-5 gap-1.5 text-white font-bold text-4xl"
                            >
                                {characters.map(({ id, value }) => (
                                    <Fragment key={id}>
                                        <label className="hidden" htmlFor={id}>Character {id}</label>
                                        <input
                                            id={id}
                                            value={value}
                                            autoComplete="off"
                                            onChange={handleCharacterChange}
                                            onKeyDown={handleKeyDown}
                                            className={
                                                clsx(
                                                    "inline-flex justify-center items-center select-none uppercase text-center border-2 bg-transparent focus:border-gray-400 focus-visible:border-gray-400 before:content-[''] before:inline-block before:pb-[100%]",
                                                    value.length ? "border-gray-500 animate-pop" : "border-gray-700 animate-push"
                                                )
                                            }
                                            type="text"
                                        />
                                    </Fragment>
                                ))}
                            </form>
                        </FocusTrapper>
                        : <div key={guess} className="grid grid-cols-5 gap-1.5 text-white font-bold text-4xl">
                            {[0, 1, 2, 3, 4].map(characterIdx =>
                                guesses[guess - 1]?.length
                                    ? <p
                                        key={characterIdx}
                                        className={clsx("uppercase inline-flex justify-center items-center border-2 border-transparent bg-gray-700 before:content-[''] before:inline-block before:pb-[100%]", `delay-${guess}`)}
                                    >
                                        {guesses[guess - 1][characterIdx]}
                                    </p>
                                    : <div
                                        key={characterIdx}
                                        className={clsx("animate-push border-2 border-gray-700 bg-transparent before:content-[''] before:inline-block before:pb-[100%]", `delay-${guess}`)}
                                    />
                            )}
                        </div>
                ))}
            </div>
            <div aria-label="keyboard" className="h-52 space-y-1.5 mx-2 mt-4 select-none w-full">
                <div className="flex w-full mx-auto my-0">
                    {["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map(char => (
                        <button
                            key={char}
                            className="flex flex-1 justify-center items-center uppercase font-bold text-2xl border-none p-0 mx-1 h-14 rounded select-none bg-gray-500"
                            type="button"
                            aria-label={`insert ${char}`}
                            aria-disabled="false"
                            onClick={() => handleButtonPress(char)}
                        >
                            {char}
                        </button>
                    ))}
                </div>
                <div className="flex w-full mx-auto my-0">
                    <div className="flex-[0.5]" />
                    {["a", "s", "d", "f", "g", "h", "j", "k", "l"].map(char => (
                        <button
                            key={char}
                            className="flex flex-1 justify-center items-center uppercase font-bold text-2xl border-none p-0 mx-1 h-14 rounded select-none bg-gray-500"
                            type="button"
                            aria-label={`insert ${char}`}
                            aria-disabled="false"
                            onClick={() => handleButtonPress(char)}
                        >
                            {char}
                        </button>
                    ))}
                    <div className="flex-[0.5]" />
                </div>
                <div className="flex w-full mx-auto my-0">
                    <button
                        className="flex flex-[1.5] justify-center items-center text-sm uppercase font-bold border-none p-0 mx-1 h-14 rounded select-none bg-gray-500"
                        type="button"
                        aria-label="enter"
                        aria-disabled={characters.some(c => !c.value.length)}
                        onClick={() => handleButtonPress("enter")}
                    >
                        enter
                    </button>
                    {["z", "x", "c", "v", "b", "n", "m"].map(char => (
                        <button
                            key={char}
                            className="flex flex-1 justify-center items-center uppercase font-bold text-2xl border-none p-0 mx-1 h-14 rounded select-none bg-gray-500"
                            type="button"
                            aria-label={`insert ${char}`}
                            aria-disabled="false"
                            onClick={() => handleButtonPress(char)}
                        >
                            {char}
                        </button>
                    ))}
                    <button
                        className="flex flex-[1.5] justify-center items-center uppercase font-bold text-2xl border-none p-0 mx-1 h-14 rounded select-none bg-gray-500"
                        type="button"
                        aria-label="backspace"
                        aria-disabled={!characters.some(c => c.value.length)}
                        onClick={() => handleButtonPress("backspace")}
                    >
                        <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            height="20"
                            viewBox="0 0 24 24" width="20"
                        >
                            <path
                                fill="white"
                                d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    )
}
