import { useAtom } from "jotai";
import Link from "next/link";
import {
  gameStatusAtom,
  guessedWordsAtom,
  modalAtom,
  searchedWordAtom,
} from "../store/store";
import { useRouter } from "next/router";

const Modal: React.FC = () => {
  const router = useRouter();
  const [isOpen] = useAtom(modalAtom);
  const [guesses] = useAtom(guessedWordsAtom);
  const [searchedWord] = useAtom(searchedWordAtom);
  const [gameStatus] = useAtom(gameStatusAtom);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute top-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50">
      <div className="flex h-96 w-64 flex-col items-center justify-around rounded-md bg-gray-200 dark:bg-gray-800 dark:text-white">
        <div className="flex h-36 flex-col items-center justify-around">
          <div className="text-2xl font-bold">
            You {gameStatus === "won" ? "win!" : "lost :("}
          </div>
          <div>
            CORRECT WORD: <span className="font-bold">{searchedWord}</span>
          </div>
          <div>
            ATTEMPTS: <span className="font-bold">{guesses.length}</span>
          </div>
        </div>

        <button
          className="rounded-full bg-black/10 px-10 py-3 font-semibold no-underline transition hover:bg-black/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          onClick={() => router.reload()}
        >
          Play again
        </button>
      </div>
    </div>
  );
};

export default Modal;
