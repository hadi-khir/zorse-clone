import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Share } from "lucide-react";

interface ShareResultsProps {
    date: Date;
    reveals: { value: number; used: boolean }[];
    isCorrect: boolean | null;
}

const ShareResults = ({ date, reveals, isCorrect }: ShareResultsProps) => {
    const getShareText = () => {
        const revealEmojis = "🔍".repeat(reveals.filter(reveal => reveal.used).length);
        const resultEmoji = isCorrect ? "🦁" : "🤷";
        const dateString = date.toUTCString().split(' ').slice(0, 4).join(' ');
        return `${dateString}\n${revealEmojis}${resultEmoji}`;
    };

    const handleShare = async () => {
        const shareText = getShareText();

        // Check if Web Share API is supported
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Liger Results',
                    text: shareText,
                });
                return;
            } catch (error) {
                // If user cancels or share fails, fall back to clipboard
                console.log('Share failed:', error);
            }
        }

        // Fall back to clipboard copy
        try {
            await navigator.clipboard.writeText(shareText);
            return true;
        } catch (error) {
            console.error('Failed to copy:', error);
            return false;
        }
    };

    return (
        <Popover>
            <PopoverTrigger
                aria-label="Share your game results"
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-5/6 bg-black text-white flex items-center justify-center gap-2"
                )}
                onClick={handleShare}
            >
                <Share className="h-4 w-4" />
                Share Results
            </PopoverTrigger>
            <PopoverContent className="text-center">
                Results copied to clipboard!
            </PopoverContent>
        </Popover>
    );
};

export default ShareResults;