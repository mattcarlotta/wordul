"use client"

import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { Fragment, useCallback, useEffect, useState } from "react";
import FocusTrapper from "./FocusTrapper";
import clsx from "clsx";

type Word = {
    id: string,
    value: string,
    status: string
}

export default function Board() {
    const [activeGuess, setGuess] = useState(1);
    const [letters, setLetters] = useState<Array<Word>>([
        { id: "1", value: "", status: "", },
        { id: "2", value: "", status: "", },
        { id: "3", value: "", status: "", },
        { id: "4", value: "", status: "", },
        { id: "5", value: "", status: "", }
    ]);
    const [updated, setUpdated] = useState(false);
    const [guesses, setGuesses] = useState<Array<string>>([]);

    const handleLetterChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (new RegExp(/[^A-Za-z]/, "g").test(e.target.value)) return;

        setLetters(prevLetters =>
            prevLetters.map(l => l.id === e.target.id
                ? { ...l, value: e.target.value.replace(l.value, "") }
                : l
            )
        );
        setUpdated(true);
    }

    const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" || e.key === "Delete") {
            setLetters(prevLetters =>
                prevLetters.map(l =>
                    l.id === (e.target as HTMLInputElement).id
                        ? { ...l, value: "" }
                        : l
                )
            );
        }
    }

    const handleUserKeyPress = useCallback((event: KeyboardEvent) => {
        if (event.key === "Enter" && !letters.some(l => !l.value.length)) {
            // alert(JSON.stringify(letters, null, 4));
            const guessedWord = letters.map(({ value }) => value).join("");
            setGuesses(p => p.concat(guessedWord));
            setGuess(p => p += 1);
            setLetters(prevLetters => prevLetters.map(l => ({ ...l, value: "", status: "" })));
        }
    }, [letters]);

    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);

        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        }
    }, [handleUserKeyPress]);

    return (
        <div className="w-full max-w-[360px] h-[480px] grid grid-rows-6 gap-1.5">
            {[1, 2, 3, 4, 5, 6].map(guess => (
                activeGuess === guess
                    ? <form onSubmit={(e) => e.preventDefault()} key={guess} className="flex">
                        <FocusTrapper
                            updated={updated}
                            setUpdated={setUpdated}
                            className="grid grid-cols-5 gap-1.5 text-white font-bold text-4xl"
                        >
                            {letters.map(({ id, value }) => (
                                <Fragment key={id}>
                                    <label className="hidden" htmlFor={id}>Letter {id}</label>
                                    <input
                                        maxLength={1}
                                        minLength={1}
                                        id={id}
                                        value={value}
                                        autoComplete="off"
                                        onChange={handleLetterChange}
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
                        </FocusTrapper>
                    </form>
                    :
                    <div key={guess} className="grid grid-cols-5 gap-1.5 text-white font-bold text-4xl">
                        {[1, 2, 3, 4, 5].map(letter =>
                            Boolean(guesses[guess - 1]?.length)
                                ? <p key={letter} className={clsx("uppercase inline-flex justify-center items-center border-2 border-transparent bg-gray-700 before:content-[''] before:inline-block before:pb-[100%]", `delay-${guess}`)}>
                                    {guesses[guess - 1][letter - 1]}
                                </p>
                                : <div key={letter} className={clsx("animate-push border-2 border-gray-700 bg-transparent before:content-[''] before:inline-block before:pb-[100%]", `delay-${guess}`)} />
                        )}
                    </div>
            ))}
        </div>
    )
}
