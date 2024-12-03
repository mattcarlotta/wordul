import type { ReactNode } from "react";
import type { CharacterStatus, Guess } from "./types";
import clsx from "clsx";

type GuessProps = {
    charPosition: number;
    children: ReactNode;
    status: CharacterStatus;
};

function Guess({ charPosition, children, status }: GuessProps) {
    return (
        <p
            className={clsx(
                "uppercase inline-flex animate-reveal justify-center items-center border-2 border-transparent before:content-[''] before:inline-block before:pb-[100%]",
                status === "correct" && "bg-green-700",
                status === "valid" && "bg-yellow-500",
                status === "invalid" && "bg-gray-700",
                charPosition === 0 && "animation-delay-100",
                charPosition === 1 && "animation-delay-200",
                charPosition === 2 && "animation-delay-300",
                charPosition === 3 && "animation-delay-400",
                charPosition === 4 && "animation-delay-500"
            )}
        >
            {children}
        </p>
    );
}

type GuessedProps = {
    guessed: Guess | null;
    selectedGuess: number;
};

export default function Guessed({ guessed, selectedGuess }: GuessedProps) {
    return (
        <div className="grid grid-cols-5 gap-1.5 text-white font-bold text-2xl xs:text-3xl">
            {[0, 1, 2, 3, 4].map((characterIdx) =>
                guessed?.[characterIdx] ? (
                    <Guess
                        key={characterIdx}
                        charPosition={characterIdx}
                        status={guessed[characterIdx].status}
                    >
                        {guessed[characterIdx].value}
                    </Guess>
                ) : (
                    <div
                        key={characterIdx}
                        className={clsx(
                            "animate-push border-2 border-gray-700 bg-transparent before:content-[''] before:inline-block before:pb-[100%]",
                            selectedGuess === 1 && "animation-delay-0",
                            selectedGuess === 2 && "animation-delay-100",
                            selectedGuess === 3 && "animation-delay-200",
                            selectedGuess === 4 && "animation-delay-300",
                            selectedGuess === 5 && "animation-delay-400",
                            selectedGuess === 6 && "animation-delay-500"
                        )}
                    />
                )
            )}
        </div>
    );
}
