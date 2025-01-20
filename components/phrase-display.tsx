"use client"

import { useEffect, useState } from "react";
import RevealDisplay from "./reveal-display";
import { Button, buttonVariants } from "./ui/button";
import ScreenKeyboard from "./screen-keyboard";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { UsernameModal } from "./username-modal";
import PhraseGrid from "./phrase-grid";
import ShareResults from "./share-results";
import ResultsModal from "./results-modal";

import confetti from 'canvas-confetti';
import { submitScore } from "@/lib/data";

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

const PhraseDisplay = ({ solution, revealed, puzzleDate }: PhraseDisplayProps) => {

    const [revealedLetters, setRevealedLetters] = useState<string[]>(revealed);
    const [selectedTile, setSelectedTile] = useState<SelectedTile | null>(null);
    const [reveals, setReveals] = useState<Reveals[]>(initialReveals);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [guessedLetters, setGuessedLetters] = useState<GuessedLetter[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [username, setUsername] = useState<string | null>(null);
    const [showUsernameModal, setShowUsernameModal] = useState(true);

    // Run confetti effect only when isCorrect changes to true
    useEffect(() => {
        if (isCorrect) {
            confetti({
                particleCount: 400,
                spread: 150,
                origin: { y: 0.6 },
            });
        }
    }, [isCorrect]);

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

    const isAlphabetic = (char: string): boolean => {
        return /^[A-Za-z]$/.test(char);
    };

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

            const letter = words[nextWordIndex][nextLetterIndex];

            // Skip non-alphabetic characters
            if (!isAlphabetic(letter)) {
                nextLetterIndex++;
                continue;
            }

            // Check if the current position is revealed
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

    const findFirstUnrevealedTile = (solution: string, revealedLetters: string[]): SelectedTile | null => {
        const words = solution.split(" ");

        for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
            for (let letterIndex = 0; letterIndex < words[wordIndex].length; letterIndex++) {
                const letter = words[wordIndex][letterIndex];
                if (!revealedLetters.includes(letter.toUpperCase())) {
                    return {
                        letter,
                        letterIndex,
                        wordIndex
                    };
                }
            }
        }
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
        submitScoreHandler(allCorrect);
    };

    const isAllTilesFilled = () => {

        solution = solution.replace(/[^a-zA-Z ]/g, "");
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

    const submitScoreHandler = async (solved: boolean) => {
        if (!username) return;

        const revealsUsed = reveals.filter(r => r.used).length;

        try {
            const result = await submitScore({
                username,
                reveals: revealsUsed,
                solved,
                puzzleDate,
            });

            if (result.success) {
                setSubmitted(true);
            } else {
                console.error('Error submitting score:', result.error);
            }
        } catch (error) {
            console.error('Failed to submit score:', error);
        }
    };

    return (
        <Dialog>
            <UsernameModal isOpen={showUsernameModal} onSubmit={handleUsernameSubmit} />
            <PhraseGrid
                solution={solution}
                revealedLetters={revealedLetters}
                selectedTile={selectedTile}
                guessedLetters={guessedLetters}
                handleTileClick={handleTileClick} />

            {!editMode && (<RevealDisplay tileSelected={selectedTile !== null} onRevealClick={handleRevealClick} reveals={reveals} />)}

            <div id="guessPhraseBtn" className="w-4/6 grid grid-cols-1 justify-items-center gap-4">
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
                {!submitted &&
                    <Button
                        onClick={() => {
                            setGuessedLetters([]);
                            setIsCorrect(null);
                            setEditMode(!editMode);
                            if (!editMode) {
                                // When entering edit mode, find and select first unrevealed tile
                                const firstUnrevealed = findFirstUnrevealedTile(solution, revealedLetters);
                                setSelectedTile(firstUnrevealed);
                            }
                        }}
                        variant={"outline"}
                        className="bg-white text-black w-full"
                    >
                        {!editMode ? <span>Enter a Phrase</span> : <span>Go Back</span>}
                    </Button>}
            </div>

            {!submitted && <span className="text-center text-2xl font-bold">Goodluck, {username}! ☘️</span>}

            {submitted && !editMode && (
                <>

                    <div className={`text-center p-2 rounded-md ${isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {isCorrect ?
                            "Congratulations! You solved it!" :
                            "Not quite right. Better luck next time!"
                        }
                    </div>

                    <ShareResults date={puzzleDate} reveals={reveals} isCorrect={isCorrect} />
                </>
            )}

            <ResultsModal puzzleDate={puzzleDate} isCorrect={isCorrect} solution={solution} reveals={reveals} username={username} />

            {editMode && <ScreenKeyboard onKeyPress={handleKeyPress} />}

        </Dialog>
    );
};

export default PhraseDisplay;
