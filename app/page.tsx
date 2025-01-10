import DateDisplay from "@/components/date";
import { ModeToggle } from "@/components/mode-toggle";
import PhraseDisplay from "@/components/phrase-display";
import RevealDisplay from "@/components/reveal-display";
import { Button } from "@/components/ui/button";

export default function Home() {

  return (
    <main>
      <section id="title">
        <div className="flex mx-4 my-4 md:mx-32 md:mt-32 md:mb-4 justify-between items-center">
          <div className="flex gap-4">
            <span className="font-bold text-3xl">Zorse</span>
            <DateDisplay />
          </div>
          <ModeToggle />
        </div>
        <hr />
      </section>
      <section id="game">
        <div className="flex justify-center justify-items-center m-8">
          <div className="grid grid-cols-1 gap-8 justify-items-center">
            <span>Select a space to revel letters.</span>
            <div className="bg-lime-200 text-center p-2 w-5/6">
              <span className="text-2xl text-bold dark:text-black">SUCCESSFULLY KICK YOUR HANGOVERS BUTT</span>
            </div>
            <PhraseDisplay />
            <RevealDisplay />
            <div id="guessPhraseBtn" className="flex justify-center w-2/6">
              <Button variant={"outline"} className="bg-black text-white dark:bg-white dark:text-black w-5/6">
                Enter a Phrase
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
