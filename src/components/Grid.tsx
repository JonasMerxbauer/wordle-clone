import { useAtom } from "jotai";
import { currentGuessAtom, guessedWordsAtom, searchedWordAtom } from "../store/store";
import Key from "./Key";
import { useAutoAnimate } from '@formkit/auto-animate/react';

const Grid: React.FC = () => {
    const [guesses] = useAtom(guessedWordsAtom);
    const [currentGuess] = useAtom(currentGuessAtom);
    const emptyRows = Array(5 - guesses.length).fill("empty");

    return (
        <div className="grid grid-cols-1 grid-rows-5 gap-1">
        {guesses.map((guess) => {
            return (
                <CompletedRow word={guess} />
            )
        })}
        <CurrentRow word={currentGuess} />
        {emptyRows.map((_, index) => {
            return (
                <EmptyRow />
            )}
        )}
        </div>
    )
}

const CompletedRow: React.FC<{ word: string }> = ({ word }) => {
    const [solution] = useAtom(searchedWordAtom);

    let statuses = getStatuses(solution, word);

    console.warn("statuses", statuses);

    return (
        <div className="grid grid-cols-5 gap-1">
        {word.split("").map((letter, i) => {
            console.warn("status", statuses[i]);
            return (
                <Key value={letter} status={statuses[i]}/>
            )
        })}
        </div>
        )
}

const CurrentRow: React.FC<{ word: string[] }> = ({ word }) => {
    
    //const [animationParent] = useAutoAnimate<HTMLDivElement>()
    
    return (
        <div className="grid grid-cols-5 gap-1">
        {word.map((letter, i) => {
            return (
                <Key key={i} value={letter} />
            )}
        )}
        {Array(5 - word.length).fill(null).map((letter, i) => {
            return (
                <Key key={5-i}value={letter} />
            )
        })}
        </div>
        )

}

const EmptyRow: React.FC = () => {
    return (
        <div className="grid grid-cols-5 gap-1">
        {Array(5).fill(null).map((letter) => {
            return (
                <Key value={letter} />
            )
        })}
        </div>
        )
}

const getStatuses = (solution: string, guess: string) => {
    const solutionArray = solution.split("");
    const guessArray = guess.split("");
    let statuses: string[] = [];

    console.warn("solution", solutionArray);
    console.warn("guess", guessArray);

    guessArray.forEach((letter, i) => {
        if (letter === solutionArray[i]) {
            statuses.push("correct");
        } else if (solutionArray.includes(letter)) {
            statuses.push("present");
        } else {
            statuses.push("incorrect");
        }
    })

    console.warn(statuses)

    return statuses;

}

export default Grid;