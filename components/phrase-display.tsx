"use client"

import { useState, useEffect } from "react";
import Tile from "./tile";
import RevealDisplay from "./reveal-display";
import { Button, buttonVariants } from "./ui/button";
import ScreenKeyboard from "./screen-keyboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { UsernameModal } from "./username-modal";
import Leaderboard from "./leaderboard";

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

interface PhraseDisplayProps {
    solution: string;
    revealed: string[];
    puzzleDate: Date;
}

const initialReveals: Reveals[] = Array.from({ length: 5 }, (_, i) => ({
    value: i,
    used: false
}));

const PhraseDisplay = ({solution, revealed, puzzleDate}: PhraseDisplayProps) => {

    const [revealedLetters, setRevealedLetters] = useState<string[]>(revealed);
    const [selectedTile, setSelectedTile] = useState<SelectedTile | null>(null);
    const [reveals, setReveals] = useState<Reveals[]>(initialReveals);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [guessedLetters, setGuessedLetters] = useState<GuessedLetter[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [showUsernameModal, setShowUsernameModal] = useState(true);

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

    const handleUsernameSubmit = (name: string) => {
        setUsername(name);
        setShowUsernameModal(false);
    };

    const submitScore = async () => {
        if (!username || !isCorrect) return;

        const revealsUsed = reveals.filter(r => r.used).length;

        
        try {
            await fetch('/api/leaderboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    reveals: revealsUsed,
                    solved: isCorrect,
                    puzzleDate: puzzleDate
                }),
            });
        } catch (error) {
            console.error('Failed to submit score:', error);
        }
    };

    useEffect(() => {
        if (isCorrect) {
            submitScore();
        }
    }, [isCorrect]);

    return (
        <Dialog>
            <UsernameModal isOpen={showUsernameModal} onSubmit={handleUsernameSubmit} />
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
                {editMode &&
                    <DialogTrigger
                        className={cn(
                            buttonVariants({ variant: "outline" }),
                            "w-full bg-black text-white"
                        )}
                        onClick={() => {
                            checkSolution();
                            setEditMode(!editMode)
                        }}
                        disabled={!isAllTilesFilled()}
                    >
                        <span>Submit Final Phrase</span>
                    </DialogTrigger>}
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

            <DialogContent>
                <DialogHeader className="text-center">
                    <DialogTitle>{isCorrect ? <span>Off to the races!</span> : <span>Neigh... Next time!</span>}</DialogTitle>
                    {isCorrect && username && (
                        <div className="mt-4 text-sm text-muted-foreground">
                            <p>Reveals used: {reveals.filter(r => r.used).length}</p>
                        </div>
                    )}
                    <div className="flex flex-col items-center space-y-2 text-sm text-muted-foreground">
                        <div className="py-4 text-4xl">
                            {"🟩 ".repeat(reveals.length)}
                            {isCorrect ? "🦁" : "🤷"}
                        </div>
                        <span className="text-black">
                            {`You revealed ${reveals.filter(r => r.used).length} letters and ${isCorrect ? "guessed the puzzle correctly!" : "didn't quite get it this time."}`}
                        </span>
                        <span className="text-md text-black">The answer is:</span>
                        <div className="py-2 text-lg font-bold text-black">
                            {solution}
                        </div>
                        <Popover>
                            <PopoverTrigger
                                className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "w-full bg-black text-white"
                                )}
                                onClick={() => {
                                    const revealEmojis = "🟩".repeat(reveals.length);
                                    const resultEmoji = isCorrect ? "🦁" : "🤷";
                                    navigator.clipboard.writeText(`Liger Results\n${revealEmojis}${resultEmoji}`);
                                }}
                            >
                                Share Results
                            </PopoverTrigger>
                            <PopoverContent>Results copied to clipboard!</PopoverContent>
                        </Popover>
                    </div>
                </DialogHeader>
            </DialogContent>

            <Leaderboard puzzleDate={puzzleDate} />

            {editMode && <ScreenKeyboard onKeyPress={handleKeyPress} />}

        </Dialog>
    );
};

export default PhraseDisplay;
