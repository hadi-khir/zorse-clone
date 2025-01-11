import data from "./data.json";


export interface PuzzleSolution {
    solution: string;
    revealedLetters: string[];
}

export async function fetchPuzzleSolution(): Promise<PuzzleSolution> {

    return new Promise((resolve) => {
        setTimeout(() => {

            resolve(data);
        }, 500); // TODO: Remove simulated delay
    })
}