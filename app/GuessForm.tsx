import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import type { Character } from "./types";
import { Fragment } from "react";
import clsx from "clsx";
import FocusTrapper from "./FocusTrapper";

type GuessFormProps = {
    addedChar: boolean;
    characters: Array<Character>;
    deletedChar: boolean;
    disabled: boolean;
    onCharacterChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: ReactKeyboardEvent<HTMLInputElement>) => void;
    setAddedChar: (v: boolean) => void;
    setDeletedChar: (v: boolean) => void;
};

export default function GuessForm({
    addedChar,
    characters,
    deletedChar,
    disabled,
    onCharacterChange,
    onKeyDown,
    setAddedChar,
    setDeletedChar
}: GuessFormProps) {
    return (
        <FocusTrapper
            className="flex"
            disabled={disabled}
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
                            onChange={onCharacterChange}
                            onKeyDown={onKeyDown}
                            className={clsx(
                                "inline-flex justify-center items-center select-none uppercase text-center border-2 bg-transparent focus:border-gray-400 focus-visible:border-gray-400 before:content-[''] before:inline-block before:pb-[100%]",
                                value.length
                                    ? "border-gray-500 animate-pop"
                                    : "border-gray-700 animate-push"
                            )}
                            type="text"
                            readOnly={disabled}
                        />
                    </Fragment>
                ))}
            </form>
        </FocusTrapper>
    );
}
