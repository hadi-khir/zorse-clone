import { Button } from "./ui/button"

interface Reveals {
    value: number;
    used: boolean;
}

interface RevealDisplayProps {
    reveals: Reveals[];
    tileSelected: boolean;
    onRevealClick: () => void;
}

const RevealDisplay = ({reveals, tileSelected, onRevealClick}: RevealDisplayProps) => {

    const revealsAvailable = reveals.filter(reveal => !reveal.used).length > 0;

    return revealsAvailable && (
        <div id="revealContainer" className="grid grid-cols-2 gap-4 items-center">
            <div id="revealsUsed" className="grid grid-cols-1 justify-items-center">
                <span>Reveals used:</span>
                <div className="grid grid-cols-5 gap-1">
                    {reveals.map((reveal, index) => (
                        <div key={index} className={`w-4 h-4 rounded-full border-black border-2 ${reveal.used ? "bg-black" : "bg-white"}`}></div>
                    ))}
                </div>
            </div>
            <div id="revealsUsed" className="">
                <Button onClick={onRevealClick} disabled={!tileSelected} variant="outline" className="bg-black text-white dark:bg-white dark:text-black">Reveal Letter</Button>
            </div>
        </div>
    )
}

export default RevealDisplay;