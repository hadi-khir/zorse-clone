
import DateDisplay from "@/components/date";
import Leaderboard from "@/components/leaderboard";
import { ModeToggle } from "@/components/mode-toggle";
import PhraseDisplay from "@/components/phrase-display";
import { fetchLeaderboard, fetchPuzzleSolution, LeaderboardEntry, PuzzleSolution } from "@/lib/data";

export default async function Home() {


  const puzzleData: PuzzleSolution = await fetchPuzzleSolution();
  const leaderboardData: LeaderboardEntry[] = await fetchLeaderboard(puzzleData.datePublished);

  return (
    <main>
      <section id="title">
        <div className="flex mx-4 my-4 md:mx-32 md:mt-32 md:mb-4 justify-between items-center">
          <div className="flex gap-4">
            <span className="font-bold text-3xl">Liger 🦁</span>
            <DateDisplay />
          </div>
          <ModeToggle />
        </div>
        <hr />
      </section>
      <section id="game">
        <div className="flex justify-center m-8 w-11/12 md:w-1/2 mx-auto">
          <div className="grid grid-cols-1 gap-8 justify-items-center w-full">
            <span>Select a space to reveal letters.</span>
            <div className="bg-lime-200 text-center p-2 sm:w-full">
              <span className="text-2xl text-bold dark:text-black">{puzzleData.title.toUpperCase()}</span>
            </div>
            <PhraseDisplay solution={puzzleData.solution} revealed={puzzleData.revealedLetters} puzzleDate={puzzleData.datePublished} />
          </div>
        </div>
        <Leaderboard leaderboardData={leaderboardData} />
      </section>
    </main>
  );
}
