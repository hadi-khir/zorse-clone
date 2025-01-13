
import prisma from './prisma';

export interface PuzzleSolution {
    solution: string;
    revealedLetters: string[];
    datePublished: Date;
}

export async function fetchPuzzleSolution(): Promise<PuzzleSolution> {

    // Get today's date at midnight in Eastern Time
    const now = new Date();
    const offsetInMinutes = now.getTimezoneOffset() + 300; // 300 minutes = 5 hours for Eastern Time
    const adjustedDate = new Date(now.getTime() - offsetInMinutes * 60 * 1000);

    const today = new Date(Date.UTC(adjustedDate.getUTCFullYear(), adjustedDate.getUTCMonth(), adjustedDate.getUTCDate()));

    console.log(today);

    const puzzle = await prisma.liger_Puzzle.findFirst({
        where: {
            datePublished: today
        },
        select: {
            solution: true,
            revealedLetters: true,
            datePublished: true
        }
    });

    if (!puzzle) {
        throw new Error('No puzzle found for today');
    }

    return puzzle;
}