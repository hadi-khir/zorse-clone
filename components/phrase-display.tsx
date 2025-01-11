"use client"

import { useEffect, useState } from "react";
import Tile from "./tile";
import { fetchPuzzleSolution, PuzzleSolution } from "@/lib/data";

const PhraseDisplay = () => {

    const [solution, setSolution] = useState<String>("");
    const [revealedLetters, setRevealedLetters] = useState<string[]>([]);

    useEffect(() => {

        async function fetchData() {
            const data: PuzzleSolution = await fetchPuzzleSolution();
            setSolution(data.solution);
            setRevealedLetters(data.revealedLetters);
        }
        fetchData();
    }, []);

    return (
        <div className="flex flex-wrap gap-6 justify-center w-5/6">
            {solution.split(" ").map((word, wordIndex) => (
                <div key={wordIndex} className="flex justify-center gap-1">
                    {word.split("").map((letter, letterIndex) => {
                        const isRevealed = revealedLetters.includes(letter.toUpperCase());
                        return (
                            <Tile key={letterIndex} letter={letter} isVisible={isRevealed} />
                        )
                    })}
                </div>
            ))}
        </div>
    );
};

export default PhraseDisplay;
