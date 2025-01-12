"use client"

import { useEffect, useState } from "react";
import Tile from "./tile";
import { fetchPuzzleSolution, PuzzleSolution } from "@/lib/data";
import RevealDisplay from "./reveal-display";
import { Button } from "./ui/button";
import ScreenKeyboard from "./screen-keyboard";

interface SelectedTile {
    letter: string;
    letterIndex: number;
    wordIndex: number;
}

interface Reveals {
    value: number;
    used: boolean;
}

interface GuessedLetter {
    letter: string;
    letterIndex: number;
    wordIndex: number;
}

const initialReveals: Reveals[] = Array.from({ length: 5 }, (_, i) => ({
    value: i,
    used: false
}));

const PhraseDisplay = () => {

    const [solution, setSolution] = useState<string>("");
    const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
    const [selectedTile, setSelectedTile] = useState<SelectedTile | null>(null);
    const [reveals, setReveals] = useState<Reveals[]>(initialReveals);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [guessedLetters, setGuessedLetters] = useState<GuessedLetter[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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

    const findNextAvailableTile = (
        currentTile: SelectedTile,
        solution: string,
        revealedLetters: string[]
    ): SelectedTile | null => {
        const words = solution.split(" ");
        let nextWordIndex = currentTile.wordIndex;
        let nextLetterIndex = currentTile.letterIndex + 1;

        while (nextWordIndex < words.length) {
            // If we've reached the end of the current word
            if (nextLetterIndex >= words[nextWordIndex].length) {
                nextWordIndex++;
                nextLetterIndex = 0;
                continue;
            }

            // Check if the current position is revealed
            const letter = words[nextWordIndex][nextLetterIndex];
            if (!revealedLetters.includes(letter.toUpperCase())) {
                // Found an unrevealed tile
                return {
                    letter,
                    letterIndex: nextLetterIndex,
                    wordIndex: nextWordIndex
                };
            }

            nextLetterIndex++;
        }

        // If we get here, no more tiles are available
        return null;
    };

    const handleKeyPress = (key: string) => {
        if (!selectedTile || !editMode) return;

        if (key === "BACKSPACE") {
            // Remove the letter at the current position
            setGuessedLetters(guessedLetters.filter(
                guess => !(guess.letterIndex === selectedTile.letterIndex &&
                    guess.wordIndex === selectedTile.wordIndex)
            ));
            return;
        }

        const filteredGuesses = guessedLetters.filter(
            guess => !(guess.letterIndex === selectedTile.letterIndex &&
                guess.wordIndex === selectedTile.wordIndex)
        );

        setGuessedLetters([
            ...filteredGuesses,
            {
                letter: key.toUpperCase(),
                letterIndex: selectedTile.letterIndex,
                wordIndex: selectedTile.wordIndex
            }
        ]);

        // Find and set next available tile
        const nextTile = findNextAvailableTile(selectedTile, solution, revealedLetters);
        setSelectedTile(nextTile);
    };

    const checkSolution = () => {
        // Get all non-revealed positions
        const words = solution.split(" ");
        let allCorrect = true;

        words.forEach((word, wordIndex) => {
            word.split("").forEach((letter, letterIndex) => {
                // Skip revealed letters
                if (revealedLetters.includes(letter.toUpperCase())) {
                    return;
                }

                // Find user's guess for this position
                const guess = guessedLetters.find(
                    g => g.wordIndex === wordIndex && g.letterIndex === letterIndex
                );

                console.log(guess, letter)

                // If no guess or incorrect guess, solution is wrong
                if (!guess || guess.letter !== letter.toUpperCase()) {
                    allCorrect = false;
                }
            });
        });

        setIsCorrect(allCorrect);
    };

    const isAllTilesFilled = () => {
        const words = solution.split(" ");
        
        // Check each position that isn't revealed
        for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
            const word = words[wordIndex];
            for (let letterIndex = 0; letterIndex < word.length; letterIndex++) {
                const letter = word[letterIndex];
                
                // Skip revealed letters
                if (revealedLetters.includes(letter.toUpperCase())) {
                    continue;
                }

                // Check if there's a guess for this position
                const hasGuess = guessedLetters.some(
                    guess => guess.wordIndex === wordIndex && 
                            guess.letterIndex === letterIndex
                );

                if (!hasGuess) return false;
            }
        }
        return true;
    };

    return (
        <>
            <div className="flex flex-wrap gap-6 justify-center w-5/6">
                {solution.split(" ").map((word, wordIndex) => (
                    <div key={wordIndex} className="flex justify-center gap-1">
                        {word.split("").map((letter, letterIndex) => {
                            const isRevealed = revealedLetters.includes(letter.toUpperCase());
                            const isSelected = !isRevealed &&
                                selectedTile?.letterIndex === letterIndex &&
                                selectedTile?.wordIndex === wordIndex;
                            const guessedLetter = guessedLetters.find(
                                guess => guess.letterIndex === letterIndex &&
                                    guess.wordIndex === wordIndex
                            )?.letter;

                            return (
                                <Tile
                                    key={letterIndex}
                                    guessedLetter={guessedLetter}
                                    letter={letter}
                                    isVisible={isRevealed}
                                    isSelected={isSelected}
                                    onClick={() => !isRevealed && handleTileClick(letter, letterIndex, wordIndex)}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
            {!editMode && (<RevealDisplay tileSelected={selectedTile !== null} onRevealClick={handleRevealClick} reveals={reveals} />)}
            <div id="guessPhraseBtn" className="w-2/6 grid grid-cols-1 justify-items-center gap-4">
                {editMode && <Button 
                    className="w-full" 
                    onClick={() => {
                        checkSolution();
                        setEditMode(!editMode)
                    }}
                    disabled={!isAllTilesFilled()}
                >
                    <span>Submit Final Phrase</span>
                </Button>}
                <Button
                    onClick={() => {
                        setGuessedLetters([]);
                        setIsCorrect(null);
                        setEditMode(!editMode);
                    }}
                    variant={"outline"}
                    className="bg-white text-black w-5/6"
                >
                    {!editMode ? <span>Enter a Phrase</span> : <span>Go Back</span>}
                </Button>
            </div>

            {isCorrect !== null && !editMode && (
                <div className={`text-center p-2 rounded-md ${isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {isCorrect ?
                        "Congratulations! You solved it!" :
                        "Not quite right. Try again!"
                    }
                </div>
            )}

            {editMode && <ScreenKeyboard onKeyPress={handleKeyPress} />}
        </>
    );
};

export default PhraseDisplay;
