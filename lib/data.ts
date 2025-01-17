
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

    // Get today's date at midnight in Eastern Time
    const now = new Date();
    const offsetInMinutes = now.getTimezoneOffset() + 300; // 300 minutes = 5 hours for Eastern Time
    const adjustedDate = new Date(now.getTime() - offsetInMinutes * 60 * 1000);

    const today = new Date(Date.UTC(adjustedDate.getUTCFullYear(), adjustedDate.getUTCMonth(), adjustedDate.getUTCDate()));

    const puzzle = await prisma.liger_Puzzle.findFirst({
        where: {
            datePublished: today
        },
        select: {
            title: true,
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

    if (!leaderboard) {
        throw new Error('No leaderboard entries found');
    }

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