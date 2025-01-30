"use client"

import { useEffect, useState } from "react";
import RevealDisplay from "./reveal-display";
import { Button, buttonVariants } from "./ui/button";
import ScreenKeyboard from "./screen-keyboard";
import { Dialog } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { UsernameModal } from "./username-modal";
import PhraseGrid from "./phrase-grid";
import ShareResults from "./share-results";
import ResultsModal from "./results-modal";

import confetti from 'canvas-confetti';
import { submitScore } from "@/lib/data";
import ConfirmSubmission from "./confirm-submission";

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
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

    const findNextAvailableTile = (
        currentTile: SelectedTile,
        solution: string,
        revealedLetters: string[]
    ): SelectedTile | null => {
        const words = solution.split(" ");
        let nextWordIndex = currentTile.wordIndex;
        let nextLetterIndex = currentTile.letterIndex + 1;

        while (nextWordIndex < words.length) {
            const word = words[nextWordIndex];

            while (nextLetterIndex < word.length) {
                const letter = word[nextLetterIndex];

                // Skip non-alphabetic characters like hyphens & apostrophes
                if (!/^[A-Za-z]$/.test(letter)) {
                    nextLetterIndex++;
                    continue;
                }

                // Check if this letter has already been revealed
                if (!revealedLetters.includes(letter.toUpperCase())) {
                    return {
                        letter,
                        letterIndex: nextLetterIndex,
                        wordIndex: nextWordIndex
                    };
                }

                nextLetterIndex++;
            }

            // Move to the next word
            nextWordIndex++;
            nextLetterIndex = 0;
        }

        return null; // No available tile found
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
        // Normalize apostrophes to prevent mismatch (straight vs curly apostrophe)
        const normalizedSolution = solution
            .replace(/'/g, "'") // Convert curly apostrophe to straight apostrophe
            .split(/\s+/) // Split words properly
            .map(word => word.replace(/[^A-Za-z']/g, "")) // Keep only letters & apostrophes
            .filter(word => word.length > 0); // Remove empty words

        let allCorrect = true;

        normalizedSolution.forEach((word, wordIndex) => {
            let reconstructedWord = "";
            const currentWord = solution.split(/\s+/)[wordIndex];

            for (let letterIndex = 0; letterIndex < currentWord.length; letterIndex++) {
                let letter = currentWord[letterIndex];

                // Normalize any curly apostrophes to straight ones
                if (letter === "'") letter = "'";

                // If it's a non-alphabetic character (e.g., apostrophe), just add it
                if (!/^[A-Za-z]$/.test(letter)) {
                    reconstructedWord += letter;
                    continue;
                }

                // If letter is revealed, use it
                if (revealedLetters.includes(letter.toUpperCase())) {
                    reconstructedWord += letter.toUpperCase();
                } else {
                    // Find guessed letter using the original letterIndex
                    const guess = guessedLetters.find(
                        g => g.wordIndex === wordIndex && g.letterIndex === letterIndex
                    );
                    reconstructedWord += guess ? guess.letter.toUpperCase() : "_";
                }
            }

            if (reconstructedWord !== currentWord.toUpperCase()) {
                allCorrect = false;
            }
        });

        setIsCorrect(allCorrect);
        submitScoreHandler(allCorrect);
    };

    const isAllTilesFilled = () => {
        const words = solution.split(" ");

        for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
            const word = words[wordIndex];

            for (let letterIndex = 0; letterIndex < word.length; letterIndex++) {
                const letter = word[letterIndex];

                // Skip non-alphabetic characters (hyphens, apostrophes, punctuation)
                if (!/^[A-Za-z]$/.test(letter)) continue;

                // If this letter isn't revealed and hasn't been guessed, return false
                if (!revealedLetters.includes(letter.toUpperCase()) &&
                    !guessedLetters.some(
                        guess => guess.wordIndex === wordIndex && guess.letterIndex === letterIndex
                    )) {
                    return false;
                }
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

    const getCurrentPhrase = () => {
        return solution.split(" ").map((word, wordIndex) => {
            return word.split("").map((letter, letterIndex) => {
                if (!/^[A-Za-z]$/.test(letter)) return letter;
                if (revealedLetters.includes(letter.toUpperCase())) {
                    return letter.toUpperCase();
                }
                const guess = guessedLetters.find(
                    g => g.wordIndex === wordIndex && g.letterIndex === letterIndex
                );
                return guess ? guess.letter : "_";
            }).join("");
        }).join(" ");
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
                    <Button
                        className={cn(
                            buttonVariants({ variant: "outline" }),
                            "w-full bg-black text-white"
                        )}
                        onClick={() => setShowConfirmDialog(true)}
                        disabled={!isAllTilesFilled()}
                    >
                        <span>Submit Final Phrase</span>
                    </Button>}
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

            {editMode && <ScreenKeyboard onKeyPress={handleKeyPress} />}

            <ResultsModal
                puzzleDate={puzzleDate}
                isCorrect={isCorrect}
                solution={solution}
                reveals={reveals}
                username={username}
            />

            <ConfirmSubmission
                isOpen={showConfirmDialog}
                onConfirm={() => {
                    setShowConfirmDialog(false);
                    checkSolution();
                    setEditMode(false);
                }}
                onCancel={() => setShowConfirmDialog(false)}
                submittedPhrase={getCurrentPhrase()}
            />
        </Dialog>
    );
};

export default PhraseDisplay;
