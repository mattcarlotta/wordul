import clsx from "clsx";

type GuessedProps = {
    guesses: Array<string>;
    selectedGuess: number;
};

export default function Guessed({ guesses, selectedGuess }: GuessedProps) {
    return (
        <div className="grid grid-cols-5 gap-1.5 text-white font-bold text-3xl">
            {[0, 1, 2, 3, 4].map((characterIdx) =>
                guesses[selectedGuess - 1]?.length ? (
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
                        {guesses[selectedGuess - 1][characterIdx]}
                    </p>
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
