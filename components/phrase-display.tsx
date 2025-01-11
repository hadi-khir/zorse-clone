"use client"

import { useEffect, useState } from "react";
import Tile from "./tile";
import { fetchPuzzleSolution, PuzzleSolution } from "@/lib/data";
import { Button } from "./ui/button";

interface SelectedTile {
    letter: string;
    letterIndex: number;
    wordIndex: number;
}

const PhraseDisplay = () => {

    const [solution, setSolution] = useState<String>("");
    const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
    const [selectedTile, setSelectedTile] = useState<SelectedTile | null>(null);

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
        }
    }

    return (
        <>
            <div className="flex flex-wrap gap-6 justify-center w-5/6">
                {solution.split(" ").map((word, wordIndex) => (
                    <div key={wordIndex} className="flex justify-center gap-1">
                        {word.split("").map((letter, letterIndex) => {
                            const isRevealed = revealedLetters.includes(letter.toUpperCase());
                            const isSelected = selectedTile?.letterIndex === letterIndex && selectedTile?.wordIndex === wordIndex;
                            
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
            <div id="revealContainer" className="grid grid-cols-2 gap-4 items-center">
                <div id="revealsUsed" className="grid grid-cols-1 justify-items-center">
                    <span>Reveals used:</span>
                    <div className="grid grid-cols-5 gap-1">
                        <span className="rounded-full w-3 h-3 border-black dark:border-white border-2" />
                        <span className="rounded-full w-3 h-3 border-black dark:border-white border-2" />
                        <span className="rounded-full w-3 h-3 border-black dark:border-white border-2" />
                        <span className="rounded-full w-3 h-3 border-black dark:border-white border-2" />
                        <span className="rounded-full w-3 h-3 border-black dark:border-white border-2" />
                    </div>
                </div>
                <div id="revealsUsed" className="">
                    <Button onClick={() => handleRevealClick()} variant="outline" className="bg-black text-white dark:bg-white dark:text-black">Reveal Letter</Button>
                </div>
            </div>
        </>
    );
};

export default PhraseDisplay;
