interface TileProps {
    letter: string;
    isVisible: boolean;
    isSelected: boolean;
    onClick: () => void;
}

const Tile = ({
    letter,
    isVisible,
    isSelected,
    onClick,
}: TileProps) => {

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => e.key === "Enter" && onClick()}
            className={`w-12 h-12 flex items-center justify-center border-2 cursor-pointer transition-all ${isVisible ? "bg-lime-200" : "bg-gray-200"
                } ${isSelected ? "border-4 border-black" : "border-gray-400"}`}
        >
            <span className={`text-xl font-bold ${!isVisible && "invisible"}`}>
                {letter}
            </span>
        </div>
    );
};

export default Tile;