/* eslint-disable */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const puzzles = [
    {
        title: "Bring a *really* cool thing to flaunt at kindergarten",
        solution: "Steal the show and tell",
        revealedLetters: ["S", "L", "O", "T"], // Random hints
        datePublished: new Date("2025-01-13"),
    },
    {
        title: "Advice about what to do after a campaign fundraiser",
        solution: "Take the money and run for office",
        revealedLetters: ["T", "N", "U", "R"], // Random hints
        datePublished: new Date("2025-01-14"),
    },
    {
        title: "What you might say about some kid having a tantrum in public",
        solution: "That’s not my problem child",
        revealedLetters: ["N", "P", "R", "T"], // Random hints
        datePublished: new Date("2025-01-15"),
    },
    {
        title: "Predictable behavior for baboons and mandrills",
        solution: "Monkey business as usual",
        revealedLetters: ["K", "S", "B", "L"], // Random hints
        datePublished: new Date("2025-01-16"),
    },
    {
        title: "What you might say before a date with someone who’s your polar opposite",
        solution: "Here goes nothing in common",
        revealedLetters: ["C", "O", "N", "H"], // Random hints
        datePublished: new Date("2025-01-17"),
    },
    {
        title: "Question from someone on the lookout for a red flag",
        solution: "What’s the big deal breaker?",
        revealedLetters: ["D", "B", "E", "K"], // Random hints
        datePublished: new Date("2025-01-18"),
    },
    {
        title: "Really contemplating what to put on your turkey and mashed potatoes",
        solution: "On the gravy train of thought",
        revealedLetters: ["G", "R", "T", "H"], // Random hints
        datePublished: new Date("2025-01-19"),
    },
    {
        title: "What you might say when you accidentally call your accountant instead of your bookkeeper",
        solution: "Sorry, wrong number cruncher",
        revealedLetters: ["N", "U", "B", "S"], // Random hints
        datePublished: new Date("2025-01-20"),
    },
    {
        title: "Bit of advice about taking a nine-to-five position",
        solution: "Seize the day job",
        revealedLetters: ["D", "E", "S", "A"], // Random hints
        datePublished: new Date("2025-01-21"),
    },
    {
        title: "What you might sing to your still-awake newborn ... yet again",
        solution: "Rock-a-Bye Baby one more time",
        revealedLetters: ["B", "O", "A", "Y"], // Random hints
        datePublished: new Date("2025-01-22"),
    },
    {
        title: "Expression of relief when a hit by the Cure comes on the radio",
        solution: "Thank God it’s ‘Friday I’m in Love’",
        revealedLetters: ["F", "I", "L", "N"], // Random hints
        datePublished: new Date("2025-01-23"),
    },
    {
        title: "Is too busy to climb out of bed",
        solution: "Can’t find the time to get up",
        revealedLetters: ["T", "I", "M", "G"], // Random hints
        datePublished: new Date("2025-01-24"),
    },
    {
        title: "“Sure! Committing to too many things is my thing”",
        solution: "Okay, I’ll bite off more than I can chew",
        revealedLetters: ["B", "O", "W", "L"], // Random hints
        datePublished: new Date("2025-01-25"),
    },
    {
        title: "Request for assistance from a frazzled wedding planner",
        solution: "“A little help … here comes the bride”",
        revealedLetters: ["H", "C", "B", "L"], // Random hints
        datePublished: new Date("2025-01-26"),
    },
    {
        title: "Rhetorical question from someone who has to start all over again",
        solution: "“Guess who’s back to the drawing board?”",
        revealedLetters: ["B", "A", "D", "S"], // Random hints
        datePublished: new Date("2025-01-27"),
    },
    {
        title: "What God said at the Create-A-Universe Brainstorm",
        solution: "“Let there be light bulb moments”",
        revealedLetters: ["B", "M", "L", "E"], // Random hints
        datePublished: new Date("2025-01-28"),
    },
    {
        title: "What you might find in Kraft’s mustard test kitchen",
        solution: "Fifty shades of Grey Poupon",
        revealedLetters: ["G", "R", "Y", "O"], // Random hints
        datePublished: new Date("2025-01-29"),
    },
    {
        title: "Expression about how batters feel after some swings and misses",
        solution: "Three strikes and you’re out of sorts",
        revealedLetters: ["S", "R", "T", "E"], // Random hints
        datePublished: new Date("2025-01-30"),
    },
    {
        title: "Prediction about a popular Netflix show and the dark turns it might take",
        solution: "“Stranger Things” could get ugly",
        revealedLetters: ["G", "C", "L", "S"], // Random hints
        datePublished: new Date("2025-01-31"),
    },
    {
        title: "Title of a biography about a wet blanket",
        solution: "“The Life of the Party Pooper”",
        revealedLetters: ["L", "P", "T", "F"], // Random hints
        datePublished: new Date("2025-02-01"),
    },
    {
        title: "Sentient robot who’s been thoroughly cared for",
        solution: "Alive and well-oiled machine",
        revealedLetters: ["W", "L", "D", "A"], // Random hints
        datePublished: new Date("2025-02-02"),
    },
    {
        title: "Enjoying the luxuries of heaven",
        solution: "Living the high life after death",
        revealedLetters: ["L", "F", "A", "H"], // Random hints
        datePublished: new Date("2025-02-03"),
    },
    {
        title: "Decide it’s time to use your own name on your novels",
        solution: "Give up the ghostwriting",
        revealedLetters: ["G", "P", "W", "R"], // Random hints
        datePublished: new Date("2025-02-04"),
    },
    {
        title: "Kids who want the candy without bothering with the costume",
        solution: "Cheap trick-or-treaters",
        revealedLetters: ["C", "T", "E", "R"], // Random hints
        datePublished: new Date("2025-02-05"),
    },
    {
        title: "“Sesame Street” muppet’s last time saying “3, 2, 1”",
        solution: "The final countdown for The Count",
        revealedLetters: ["C", "T", "O", "N", "F"], // Random hints
        datePublished: new Date("2025-02-06"),
    },
    {
        title: "Decide it’s finally time to watch that 1962 classic you’ve never seen",
        solution: "Face “The Music Man”",
        revealedLetters: ["F", "M", "I", "S"], // Random hints
        datePublished: new Date("2025-02-07"),
    },
    {
        title: "Bits of adornment for a Best Kindergarten Art Project trophy",
        solution: "Googly eyes on the prize",
        revealedLetters: ["G", "Y", "E", "T"], // Random hints
        datePublished: new Date("2025-02-08"),
    },
    {
        title: "What Aladdin said to Jasmine before flying faster than anyone has ever flown on a magic carpet",
        solution: "“I can show you the world record”",
        revealedLetters: ["W", "S", "C", "R"], // Random hints
        datePublished: new Date("2025-02-09"),
    },
    {
        title: "What an Olympic judge might have after watching an athlete make a splash",
        solution: "Diving-in-head-first impression",
        revealedLetters: ["D", "H", "I", "R", "E"], // Random hints
        datePublished: new Date("2025-02-10"),
    },
    {
        title: "Instructions for completing a contract while on a desert island",
        solution: "“Sign on the dotted line in the sand”",
        revealedLetters: ["D", "T", "L", "S"], // Random hints
        datePublished: new Date("2025-02-11"),
    },
    {
        title: "Christmas song with lots of extra features",
        solution: "Carol of the bells and whistles",
        revealedLetters: ["C", "W", "B", "L", "S"], // Random hints
        datePublished: new Date("2025-02-12"),
    },
    {
        title: "Popular lifestyle magazine’s exciting announcement about their Christmas issue",
        solution: "“Santa Claus is coming to Town and Country!”",
        revealedLetters: ["S", "T", "C", "N", "Y"], // Random hints
        datePublished: new Date("2025-02-13"),
    },
    {
        title: "Best. Nana. Ever.",
        solution: "All-time great grandparent",
        revealedLetters: ["A", "G", "R", "P"], // Random hints
        datePublished: new Date("2025-02-14"),
    },
    {
        title: "Really, really expensive mutton dish",
        solution: "An arm and a leg of lamb",
        revealedLetters: ["A", "L", "G", "B"], // Random hints
        datePublished: new Date("2025-02-15"),
    },
    {
        title: "Like a movie that takes place surrounded by big famous rocks",
        solution: "Set in Stonehenge",
        revealedLetters: ["S", "O", "E", "H"], // Random hints
        datePublished: new Date("2025-02-16"),
    },
    {
        title: "“Who hosts ‘The Great British Bake Off?’” and “Who starred in ‘The Mighty Boosh?’” for two",
        solution: "Noel Fielding questions",
        revealedLetters: ["N", "F", "Q", "S"], // Random hints
        datePublished: new Date("2025-02-17"),
    },
    {
        title: "Motto for a go-getter in the orchestra",
        solution: "All work no playing second fiddle",
        revealedLetters: ["A", "W", "S", "D"], // Random hints
        datePublished: new Date("2025-02-18"),
    },
    {
        title: "What you might see if you turn some old clothes into a nest",
        solution: "A bird in the hand-me-downs",
        revealedLetters: ["B", "H", "D", "N"], // Random hints
        datePublished: new Date("2025-02-19"),
    },
    {
        title: "Cry after dropping a Christmas cookie from a ship deck",
        solution: "“Gingerbread man overboard”",
        revealedLetters: ["G", "M", "O", "B"], // Random hints
        datePublished: new Date("2025-02-20"),
    },
    {
        title: "Ethical landscaper who just happens to be a bit stoned",
        solution: "The moral, high groundskeeper",
        revealedLetters: ["T", "M", "H", "G"], // Random hints
        datePublished: new Date("2025-02-21"),
    },
    {
        title: "Season in which weenie roasts are most popular",
        solution: "Hot dog days of summer",
        revealedLetters: ["H", "D", "S", "M"], // Random hints
        datePublished: new Date("2025-02-22"),
    },
    {
        title: "Bribe used to get a kid with a sweet tooth to be quiet",
        solution: "Ice cream cone of silence",
        revealedLetters: ["I", "C", "S", "N"], // Random hints
        datePublished: new Date("2025-02-23"),
    },
    {
        title: "What you might be having when your ‘do is mostly under control",
        solution: "Not-half-bad hair day",
        revealedLetters: ["N", "B", "H", "Y"], // Random hints
        datePublished: new Date("2025-02-24"),
    },
    {
        title: "Bit of advice on how to manufacture drama on reality dating shows",
        solution: "“All You Need Is Love Triangles”",
        revealedLetters: ["A", "L", "N", "T"], // Random hints
        datePublished: new Date("2025-02-25"),
    },
    {
        title: "What you might take at a late-night college party",
        solution: "Jell-O shot in the dark",
        revealedLetters: ["J", "S", "D", "A"], // Random hints
        datePublished: new Date("2025-02-26"),
    },
    {
        title: "What you might say when you’re in a flow state with your sparring partner",
        solution: "“We’re on a roll with the punches”",
        revealedLetters: ["W", "R", "P", "H"], // Random hints
        datePublished: new Date("2025-02-27"),
    },
    {
        title: "Advice about installing an 80-foot Christmas tree, e.g.",
        solution: "“Don’t try this at home for the holidays”",
        revealedLetters: ["D", "T", "H", "O"], // Random hints
        datePublished: new Date("2025-02-28"),
    },
];

async function main() {
    for (const puzzle of puzzles) {
        await prisma.liger_Puzzle.create({
            data: puzzle,
        });
        console.log(`Inserted puzzle: ${puzzle.title}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
