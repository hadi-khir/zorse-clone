interface TileProps {
    letter: string;
    isAlphabetic: boolean;
    guessedLetter?: string;
    isVisible: boolean;
    isSelected: boolean;
    onClick: () => void;
}

const Tile = ({
    letter,
    isAlphabetic,
    guessedLetter,
    isVisible,
    isSelected,
    onClick,
}: TileProps) => {

    return (
        <>

            {!isAlphabetic &&
                <span className={`text-xl font-bold`}>
                    {letter}
                </span>
            }
            {isAlphabetic &&
                <div
                    role="button"
                    tabIndex={0}
                    onClick={onClick}
                    onKeyDown={(e) => e.key === "Enter" && onClick()}
                    className={`w-6 h-8 flex items-center justify-center border-2 cursor-pointer transition-all ${isVisible ? "bg-lime-200 dark:bg-lime-800" : "bg-gray-200 dark:bg-gray-800"
                        } ${isSelected ? "border-4 border-black" : "border-gray-400"}`}
                >
                    <span className={`text-xl font-bold ${(!isVisible && !guessedLetter) && "invisible"}`}>
                        {guessedLetter ? guessedLetter : letter}
                    </span>
                </div>
            }
        </>
    );
};

export default Tile;