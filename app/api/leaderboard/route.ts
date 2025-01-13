import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { username, reveals, solved, puzzleDate } = await request.json()

    const entry = await prisma.liger_Leaderboard.create({
      data: {
        username,
        reveals,
        solved,
        puzzleDate,
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Failed to save score:', error);
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  const puzzleDate = new Date(date);

  try {
    const entries = await prisma.liger_Leaderboard.findMany({
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

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}