import { useAtom } from "jotai";
import {
  currentGuessAtom,
  guessedWordsAtom,
  incorrectAtom,
  searchedWordAtom,
} from "../store/store";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Grid: React.FC = () => {
  const [guesses] = useAtom(guessedWordsAtom);
  const [currentGuess] = useAtom(currentGuessAtom);
  const rows = 5;
  const emptyRows = Array(
    rows >= guesses.length ? rows - guesses.length : 0
  ).fill("empty");

  return (
    <div className="grid grid-cols-1 grid-rows-5 gap-1">
      {guesses.map((guess, i) => {
        return <CompletedRow key={i} word={guess} />;
      })}
      {guesses.length <= rows && <CurrentRow word={currentGuess} />}
      {emptyRows.map((_, i) => {
        return <EmptyRow key={i} />;
      })}
    </div>
  );
};

const CompletedRow: React.FC<{ word: string }> = ({ word }) => {
  const [solution] = useAtom(searchedWordAtom);

  const statuses = getStatuses(solution!, word);

  return (
    <div className="grid grid-cols-5 gap-1">
      {word.split("").map((letter, i) => {
        return <Letter key={i} value={letter} status={statuses[i]} />;
      })}
    </div>
  );
};

const CurrentRow: React.FC<{ word: string[] }> = ({ word }) => {
  const [incorrect, setIncorrect] = useAtom(incorrectAtom);

  useEffect(() => {
    setIncorrect(false);
  }, [incorrect, setIncorrect]);

  return (
    <motion.div
      className="grid grid-cols-5 gap-1"
      animate={incorrect && { x: [null, 10, 0, -10, 0, 10, 0] }}
    >
      {word.map((letter, i) => {
        return <Letter key={i} value={letter} />;
      })}
      {Array(5 - word.length)
        .fill(null)
        .map((letter, i) => {
          return <Letter key={5 - i} value={letter} />;
        })}
    </motion.div>
  );
};

const EmptyRow: React.FC = () => {
  return (
    <div className="grid grid-cols-5 gap-1">
      {Array(5)
        .fill(null)
        .map((letter, i) => {
          return <Letter key={i} value={letter} />;
        })}
    </div>
  );
};

const getStatuses = (solution: string, guess: string) => {
  const solutionArray = solution.split("");
  const guessArray = guess.split("");
  const statuses: string[] = [];

  guessArray.forEach((letter, i) => {
    if (letter === solutionArray[i]) {
      statuses.push("correct");
    } else if (solutionArray.includes(letter)) {
      statuses.push("present");
    } else {
      statuses.push("incorrect");
    }
  });

  return statuses;
};

const Letter: React.FC<{
  value: string | undefined;
  status?: string | undefined;
}> = ({ value, status }) => {
  let style = " border-2 border-gray-900 dark:border-white";

  switch (status) {
    case "correct":
      style = " bg-green-400 dark:bg-green-600";
      break;
    case "present":
      style = " bg-yellow-400 dark:bg-yellow-600";
      break;
    case "incorrect":
      style = " bg-gray-300 dark:bg-gray-700";
      break;
  }

  if (!value) {
    return (
      <div className="flex h-12 w-12 rounded-sm border-2 border-gray-400 dark:border-gray-600 sm:h-14 sm:w-14">
        {value}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.2 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
      }}
      className={
        "flex h-12 w-12 select-none items-center  justify-center rounded-sm text-xl font-bold text-gray-800 dark:text-gray-100 sm:h-14 sm:w-14" +
        style
      }
    >
      {value}
    </motion.div>
  );
};

export default Grid;
