import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";


interface ShareResultsProps {
    date: Date;
    reveals: { value: number; used: boolean }[];
    isCorrect: boolean | null;
}

const ShareResults = ({ date, reveals, isCorrect }: ShareResultsProps) => {

    return (

        <Popover>
            <PopoverTrigger
                aria-label="Share your game results"
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-5/6 bg-black text-white"
                )}
                onClick={() => {
                    const revealEmojis = "🔍".repeat(reveals.filter(reveal => reveal.used).length);
                    const resultEmoji = isCorrect ? "🦁" : "🤷";
                    const dateString = date.toUTCString().split(' ').slice(0, 4).join(' ');
                    navigator.clipboard.writeText(`${dateString}\nLiger Results\n${revealEmojis}${resultEmoji}`);
                }}
            >
                Share Results
            </PopoverTrigger>
            <PopoverContent>Results copied to clipboard!</PopoverContent>
        </Popover>
    )
}

export default ShareResults;