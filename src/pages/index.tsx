import { useAtom } from "jotai";
import { type NextPage } from "next";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Grid from "../components/Grid";
import Keyboard from "../components/Keyboard";
import {
  currentGuessAtom,
  currentGuessFullAtom,
  guessedWordsAtom,
  searchedWordAtom,
  isGuestAtom,
  gameStatusAtom,
  isIncorrectAtom,
} from "../store/store";
import { WORDS } from "../lib/wordlist";
import Modal from "../components/Modal";
import { AnimatePresence, motion } from "framer-motion";
import Login from "../components/Login";

const Home: NextPage = () => {
  const [letter, setLetter] = useAtom(currentGuessAtom);
  const [guessWord] = useAtom(currentGuessFullAtom);
  const [, setGuessedWordsArray] = useAtom(guessedWordsAtom);
  const [searchedWord] = useAtom(searchedWordAtom);
  const [gameStatus, setGameStatus] = useAtom(gameStatusAtom);
  const { data: sessionData } = useSession();
  const [isGuest] = useAtom(isGuestAtom);
  const [, setIncorrect] = useAtom(isIncorrectAtom);

  const allKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const onEnter = () => {
    if (guessWord === searchedWord) {
      const word = guessWord;
      setLetter([]);
      setGuessedWordsArray((prev) => {
        return [...prev, word];
      });
      setGameStatus("won");
    } else {
      if (letter.length < 5) {
        return;
      }

      if (WORDS.includes(guessWord.toLowerCase())) {
        const word = guessWord;
        setLetter([]);
        setGuessedWordsArray((prev) => {
          const guessedWords = [...prev, word];
          if (guessedWords.length === 6) {
            setGameStatus("lost");
          }

          return guessedWords;
        });
      } else {
        setIncorrect(true);
      }
    }
  };

  const onChar = (key: string) => {
    if (gameStatus) {
      return;
    }

    if (key === "Backspace") {
      onBackspace();
    }

    if (key === "Enter") {
      onEnter();
      return;
    }

    const wordLength = letter.length;

    if (wordLength < 5 && allKeys.includes(key.toUpperCase())) {
      setLetter((prev) => {
        if (prev.length < 5) return [...prev, key.toUpperCase()];

        return prev;
      });
      return;
    }
  };

  const onBackspace = () => {
    setLetter((prev) => prev.slice(0, letter.length - 1));
    return;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      onChar(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onEnter]);

  return (
    <>
      <div className="flex w-screen flex-1 flex-col bg-white dark:bg-black">
        {(sessionData || isGuest) && (
          <Game onChar={onChar} onEnter={onEnter} onBackspace={onBackspace} />
        )}
        {!sessionData && !isGuest && <Login />}
      </div>
    </>
  );
};

export default Home;

const Game = ({
  onChar,
  onEnter,
  onBackspace,
}: {
  onChar: (value: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
}) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <Toast />
      <Grid />
      <Keyboard onChar={onChar} onEnter={onEnter} onBackspace={onBackspace} />
      <Modal />
    </div>
  );
};

const Toast: React.FC = () => {
  const [isIncorrect] = useAtom(isIncorrectAtom);

  return (
    <div className="h-6 sm:h-8">
      <AnimatePresence>
        {isIncorrect && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="rounded-md bg-black p-1 text-center font-semibold text-white dark:bg-white dark:text-black"
          >
            Incorrect word
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
