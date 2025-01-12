import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PuzzleSolution {
    solution: string;
    revealedLetters: string[];
}

export async function fetchPuzzleSolution(): Promise<PuzzleSolution> {
    
    // Get today's date at midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const puzzle = await prisma.liger_Puzzle.findFirst({
        where: {
            datePublished: today
        },
        select: {
            solution: true,
            revealedLetters: true
        }
    });

    if (!puzzle) {
        throw new Error('No puzzle found for today');
    }

    return puzzle;
}