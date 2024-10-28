"use client"

import type { ChangeEvent, FormEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { Fragment, useCallback, useEffect, useState } from "react";
import FocusTrapper from "./FocusTrapper";
import clsx from "clsx";

type Word = {
    id: string,
    value: string,
    status: string
}

export default function Board() {
    const [activeGuess] = useState(1);
    const [letters, setLetters] = useState<Array<Word>>([
        { id: "1", value: "", status: "", },
        { id: "2", value: "", status: "", },
        { id: "3", value: "", status: "", },
        { id: "4", value: "", status: "", },
        { id: "5", value: "", status: "", }
    ]);

    const handleLetterChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (new RegExp(/[^A-Za-z]/, "g").test(e.target.value)) return;

        setLetters(prevLetters =>
            prevLetters.map(l => l.id === e.target.id
                ? { ...l, value: e.target.value.replace(l.value, "") }
                : l
            )
        );
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
            alert(JSON.stringify(letters, null, 4));
        }
    }, [letters]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert("Hello World!");
    }

    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);

        return () => {
            window.removeEventListener('keydown', handleUserKeyPress);
        }
    }, [handleUserKeyPress]);

    return (
        <div className="w-[300px] grid grid-cols-1 gap-2">
            {[1, 2, 3, 4, 5, 6].map(guess => (
                activeGuess === guess
                    ? <form onSubmit={handleSubmit} key={guess}>
                        <FocusTrapper className="grid grid-cols-5 gap-2 text-white font-bold text-4xl">
                            {letters.map(({ id, value }) => (
                                <Fragment key={id}>
                                    <label className="hidden" htmlFor={`letter {id}`}>Letter {id}</label>
                                    <input
                                        max={1}
                                        min={1}
                                        id={id}
                                        value={value}
                                        autoComplete="off"
                                        onChange={handleLetterChange}
                                        onKeyDown={handleKeyDown}
                                        className={
                                            clsx(
                                                "w-[57px] h-[57px] select-none uppercase text-center border-2 bg-transparent focus:border-gray-400 focus-visible:border-gray-400",
                                                value.length ? "border-gray-500" : "border-gray-700"
                                            )
                                        }
                                        type="text"
                                    />
                                </Fragment>
                            ))}
                        </FocusTrapper>
                    </form>
                    : <div key={guess} className="grid grid-cols-5 gap-2 text-white font-bold text-4xl">
                        {[1, 2, 3, 4, 5].map(letter => <div key={letter} className="w-[57px] h-[57px] border-2 border-gray-700 bg-transparent before:content-[''] before:inline-block before:pb-[100%]" />)}
                    </div>
            ))}
        </div>
    )
}
