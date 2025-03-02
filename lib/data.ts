
"use server"

import { revalidatePath, unstable_noStore } from 'next/cache';
import prisma from './prisma';

export interface PuzzleSolution {
    title: string;
    solution: string;
    revealedLetters: string[];
    datePublished: Date;
}

export interface LeaderboardEntry {
    username: string;
    reveals: number;
    solved: boolean;
    puzzleDate: Date;
}

export async function fetchPuzzleSolution(): Promise<PuzzleSolution> {

    unstable_noStore();

    const puzzles = await prisma.liger_Puzzle.count();

    const puzzle = await prisma.liger_Puzzle.findMany({
        take: 1,
        skip: Math.floor(Math.random() * (puzzles - 1))
    });

    if (!puzzle) {
        throw new Error('No puzzle found for today');
    }

    return puzzle[0];
}

export async function fetchLeaderboard(puzzleDate: Date): Promise<LeaderboardEntry[]> {

    unstable_noStore();

    if (!puzzleDate) {
        throw new Error('Date parameter is required');
    }

    const leaderboard = await prisma.liger_Leaderboard.findMany({
        where: {
            puzzleDate: {
                equals: puzzleDate
            }
        },
        select: {
            username: true,
            reveals: true,
            solved: true,
            puzzleDate: true
        },
        orderBy: [
            {
                solved: 'desc'
            },
            {
                reveals: 'asc'
            }
        ]
    });

    return leaderboard;
}

export async function submitScore({
    username,
    reveals,
    solved,
    puzzleDate,
}: {
    username: string;
    reveals: number;
    solved: boolean;
    puzzleDate: Date;
}) {

    if (!username) {
        throw new Error('Username is required.');
    }
    if (reveals === undefined || reveals === null) {
        throw new Error('Reveals count is required.');
    }
    if (solved === undefined || solved === null) {
        throw new Error('Solved status is required.');
    }
    if (!puzzleDate) {
        throw new Error('Puzzle date is required.');
    }

    try {
        await prisma.liger_Leaderboard.create({
            data: {
                username,
                reveals,
                solved,
                puzzleDate,
            },
        });

        // Revalidate the leaderboard so the UI updates without a refresh
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to submit score:', error);
        return { success: false, error: 'Failed to submit score' };
    }
}