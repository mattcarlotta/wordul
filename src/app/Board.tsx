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
    const [updated, setUpdated] = useState(false);
    const [guesses, setGuesses] = useState<Array<string>>([]);

    const handleCharacterChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (new RegExp(/[^A-Za-z]/, "g").test(e.target.value)) return;

        setCharacters(prevCharacters =>
            prevCharacters.map(l =>
                l.id === e.target.id
                    ? { ...l, value: e.target.value.replace(l.value, "") }
                    : l
            )
        );
        setUpdated(true);
    }

    const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" || e.key === "Delete") {
            setCharacters(prevCharacters =>
                prevCharacters.map(l =>
                    l.id === (e.target as HTMLInputElement).id
                        ? { ...l, value: "" }
                        : l
                )
            );
        }
    }

    const handleUserKeyPress = useCallback((event: KeyboardEvent) => {
        if (event.key === "Enter" && !characters.some(l => !l.value.length)) {
            // alert(JSON.stringify(characters, null, 4));
            const guessedWord = characters.map(({ value }) => value).join("");
            setGuesses(p => p.concat(guessedWord));
            setCurrentGuess(p => p += 1);
            setCharacters(defaultCharacterState);
        }
    }, [characters]);

    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);

        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        }
    }, [handleUserKeyPress]);

    return (
        <div className="w-full max-w-[360px] h-[480px] grid grid-rows-6 gap-1.5">
            {[1, 2, 3, 4, 5, 6].map(guess => (
                currentGuess === guess
                    ? <FocusTrapper
                        key={guess}
                        className="flex"
                        updated={updated}
                        setUpdated={setUpdated}
                    >
                        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-5 gap-1.5 text-white font-bold text-4xl">
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
    )
}
