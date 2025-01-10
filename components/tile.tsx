interface TileProps {
    letter: string;
    isVisible: boolean;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
}

const Tile = ({
    letter,
    isVisible,
    backgroundColor = 'bg-white',
    borderColor = 'border-gray-300',
    textColor = 'text-black',
}: TileProps) => {
    return (
        <div
            className={`w-12 h-12 flex items-center justify-center ${backgroundColor} ${borderColor} ${textColor} border-2 rounded-lg`}
            aria-hidden={!isVisible}>
            <span
                className={`text-lg font-bold`}
                style={{
                    opacity: isVisible ? 1 : 0,
                }}>
                {letter}
            </span>
        </div>
    );
};

export default Tile;