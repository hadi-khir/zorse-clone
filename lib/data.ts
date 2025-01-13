
import prisma from './prisma';

export interface PuzzleSolution {
    solution: string;
    revealedLetters: string[];
    datePublished: Date;
}

export async function fetchPuzzleSolution(): Promise<PuzzleSolution> {

    // Get today's date at midnight UTC
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

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