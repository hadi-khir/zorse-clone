import { Button } from "./ui/button"

const RevealDisplay = () => {

    return (
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
                <Button variant="outline" className="bg-black text-white dark:bg-white dark:text-black">Reveal Letter</Button>
            </div>
        </div>
    )
}

export default RevealDisplay;