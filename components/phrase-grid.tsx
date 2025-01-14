import Tile from "./tile";

interface PhraseGrideProps {
    solution: string;
    revealedLetters: string[];
    selectedTile: { letterIndex: number, wordIndex: number } | null;
    guessedLetters: { letter: string, letterIndex: number, wordIndex: number }[];
    handleTileClick: (letter: string, letterIndex: number, wordIndex: number) => void;
}

const PhraseGrid = ({solution, revealedLetters, selectedTile, guessedLetters, handleTileClick}: PhraseGrideProps) => {

    return (
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
                                guessedLetter={guessedLetter?.toUpperCase()}
                                letter={letter.toUpperCase()}
                                isVisible={isRevealed}
                                isSelected={isSelected}
                                onClick={() => !isRevealed && handleTileClick(letter, letterIndex, wordIndex)}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    )
}

export default PhraseGrid;