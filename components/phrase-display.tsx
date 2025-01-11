"use client"

import { useEffect, useState } from "react";
import Tile from "./tile";
import { fetchPuzzleSolution, PuzzleSolution } from "@/lib/data";
import RevealDisplay from "./reveal-display";

interface SelectedTile {
    letter: string;
    letterIndex: number;
    wordIndex: number;
}

interface Reveals {
    value: number;
    used: boolean;
}

const initialReveals: Reveals[] = Array.from({ length: 5 }, (_, i) => ({
    value: i,
    used: false
}));

const PhraseDisplay = () => {

    const [solution, setSolution] = useState<String>("");
    const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
    const [selectedTile, setSelectedTile] = useState<SelectedTile | null>(null);
    const [reveals, setReveals] = useState<Reveals[]>(initialReveals);

    useEffect(() => {

        async function fetchData() {
            const data: PuzzleSolution = await fetchPuzzleSolution();
            setSolution(data.solution);
            setRevealedLetters(data.revealedLetters);
        }
        fetchData();
    }, []);

    const handleTileClick = (letter: string, letterIndex: number, wordIndex: number) => {
        setSelectedTile({
            letter,
            letterIndex,
            wordIndex
        });
    }

    const handleRevealClick = () => {

        if (selectedTile) {
            
            setRevealedLetters([...revealedLetters, selectedTile.letter.toUpperCase()]);
            setSelectedTile(null);

            updateReveals();
        }
    }

    const updateReveals = () => {

        const firstUnusedRevealIndex = reveals.findIndex(reveal => !reveal.used);
        if (firstUnusedRevealIndex !== -1) {
            const updatedReveals = reveals.map((reveal, index) =>
                index === firstUnusedRevealIndex ? { ...reveal, used: true } : reveal
            );
            setReveals(updatedReveals);
        }
    }

    return (
        <>
            <div className="flex flex-wrap gap-6 justify-center w-5/6">
                {solution.split(" ").map((word, wordIndex) => (
                    <div key={wordIndex} className="flex justify-center gap-1">
                        {word.split("").map((letter, letterIndex) => {
                            const isRevealed = revealedLetters.includes(letter.toUpperCase());
                            const isSelected = !isRevealed &&
                                selectedTile?.letterIndex === letterIndex && selectedTile?.wordIndex === wordIndex;

                            return (
                                <Tile
                                    key={letterIndex}
                                    letter={letter}
                                    isVisible={isRevealed}
                                    isSelected={isSelected}
                                    onClick={() => handleTileClick(letter, letterIndex, wordIndex)}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
            <RevealDisplay onRevealClick={handleRevealClick} reveals={reveals} />
        </>
    );
};

export default PhraseDisplay;
