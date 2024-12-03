import Board from "./Board";

export default function Home() {
    return (
        <>
            <a
                id="skip-to-content"
                aria-label="Skip to main content"
                className="absolute left-[-9999px] top-4 z-50 rounded bg-primary-50 p-2 text-center text-white no-underline shadow-ring focus:left-5"
                href="#main"
            >
                Skip to content
            </a>
            <header id="Wordul" className="text-center border-b border-gray-500 py-4">
                <section>
                    <h1 className="text-3xl font-extrabold xs:text-4xl">
                        W<span className="text-green-700">ord</span>
                        <span className="text-gray-500">u</span>
                        <span className="text-yellow-600">l</span>
                    </h1>
                </section>
            </header>
            <main
                id="main"
                className="flex flex-col justify-center items-center space-y-4 py-10 max-w-lg mx-auto"
            >
                <Board />
            </main>
        </>
    );
}
