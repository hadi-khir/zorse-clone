import ShareResults from "./share-results"
import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

interface ResultsModalProps {
    puzzleDate: Date;
    isCorrect: boolean | null;
    solution: string;
    reveals: { value: number; used: boolean }[];
    username: string | null;
}

const ResultsModal = ({ puzzleDate, isCorrect, solution, reveals, username }: ResultsModalProps) => {

    return (
        <DialogContent>
            <DialogHeader className="text-center">
                <DialogTitle aria-label={isCorrect ? "Congratulations! You won!" : "Better luck next time!"}>
                    {isCorrect ? "Off to the races!" : "Neigh... Next time!"}
                </DialogTitle>
                {isCorrect && username && (
                    <div className="mt-4 text-sm text-muted-foreground">
                        <p>Reveals used: {reveals.filter(r => r.used).length}</p>
                    </div>
                )}
                <div className="flex flex-col items-center space-y-2 text-sm text-muted-foreground">
                    <div className="py-4 text-4xl">
                        {"🔍 ".repeat(reveals.filter(reveal => reveal.used).length)}
                        {isCorrect ? "🦁" : "🤷"}
                    </div>
                    <span>
                        {`You revealed ${reveals.filter(r => r.used).length} letters and ${isCorrect ? "guessed the puzzle correctly!" : "didn't quite get it this time."}`}
                    </span>
                    <span className="text-md">The answer is:</span>
                    <div className="py-2 text-lg font-bold">
                        {solution}
                    </div>
                    <ShareResults date={puzzleDate} reveals={reveals} isCorrect={isCorrect} />
                </div>
            </DialogHeader>
        </DialogContent>
    )
}

export default ResultsModal;