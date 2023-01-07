import { useAtom } from "jotai";
import { type NextPage } from "next";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Grid from "../components/Grid";
import Keyboard from "../components/Keyboard";
import {
  currentGuessAtom,
  currentGuessFullAtom,
  guessedWordsAtom,
  searchedWordAtom,
  isGuestAtom,
  gameStatusAtom,
} from "../store/store";
import { WORDS } from "../lib/wordlist";
import Modal from "../components/Modal";

const Home: NextPage = () => {
  const [letter, setLetter] = useAtom(currentGuessAtom);
  const [guessWord] = useAtom(currentGuessFullAtom);
  const [, setGuessedWordsArray] = useAtom(guessedWordsAtom);
  const [searchedWord] = useAtom(searchedWordAtom);
  const [gameStatus, setGameStatus] = useAtom(gameStatusAtom);
  const { data: sessionData } = useSession();
  const [isGuest] = useAtom(isGuestAtom);

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
        alert("Invalid");
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
      <Grid />
      <Keyboard onChar={onChar} onEnter={onEnter} onBackspace={onBackspace} />
      <Modal />
    </div>
  );
};

const Login: React.FC = () => {
  const [, setIsGuest] = useAtom(isGuestAtom);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <h1 className="text-4xl dark:text-white">Wordle</h1>
      <button
        className="rounded-full bg-black/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20 dark:bg-white/10 dark:text-white"
        onClick={() => signIn()}
      >
        Log in
      </button>
      <button
        className="rounded-full bg-black/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20 dark:bg-white/10 dark:text-white"
        onClick={() => setIsGuest(true)}
      >
        Play as guest
      </button>
    </div>
  );
};
