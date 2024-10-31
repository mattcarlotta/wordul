import type { ReactNode } from "react";
import type { CharacterStatus } from "./types";
import clsx from "clsx";

type ButtonProps = {
    char: string;
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    label: string;
    onButtonPress: (value: string) => void;
    status?: CharacterStatus
};

function Button({ char, children, className, disabled, label, onButtonPress, status }: ButtonProps) {
    return (
        <button
            className={clsx(
                "flex justify-center items-center uppercase font-bold border-none p-0 mx-1 h-14 rounded select-none bg-gray-500",
                className,
                status === "correct" && "bg-green-700",
                status === "valid" && "bg-yellow-500",
                status === "invalid" && "bg-gray-700",
            )}
            type="button"
            aria-label={label}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={() => onButtonPress(char)}
        >
            {children}
        </button>
    );
}

type KeyboardProps = {
    backspaceDisabled?: boolean;
    disabled: boolean;
    enterDisabled?: boolean;
    keys: Array<string>;
    keyStatuses: Record<string, CharacterStatus>;
    onButtonPress: (value: string) => void;
    showBackspace?: boolean;
    showEnter?: boolean;
    showSpacers?: boolean;
};

export default function Keyboard({
    backspaceDisabled,
    disabled,
    enterDisabled,
    keys,
    keyStatuses,
    onButtonPress,
    showBackspace,
    showEnter,
    showSpacers
}: KeyboardProps) {
    return (
        <div className="flex w-full mx-auto my-0">
            {showSpacers && <div className="flex-[0.5]" />}
            {showEnter && (
                <Button
                    className="flex-[1.5] text-sm"
                    disabled={disabled || enterDisabled}
                    onButtonPress={onButtonPress}
                    char="enter"
                    label="enter"
                >
                    enter
                </Button>
            )}
            {keys.map((char) => (
                <Button
                    key={char}
                    char={char}
                    className="flex-1 text-2xl"
                    disabled={disabled}
                    label={`added ${char}`}
                    onButtonPress={onButtonPress}
                    status={keyStatuses[char]}
                >
                    {char}
                </Button>
            ))}
            {showSpacers && <div className="flex-[0.5]" />}
            {showBackspace && (
                <Button
                    className="flex-[1.5] text-2xl"
                    label="backspace"
                    char="backspace"
                    disabled={disabled || backspaceDisabled}
                    onButtonPress={onButtonPress}
                >
                    <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        viewBox="0 0 24 24"
                        width="20"
                    >
                        <path
                            fill="white"
                            d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
                        />
                    </svg>
                </Button>
            )}
        </div>
    );
}
