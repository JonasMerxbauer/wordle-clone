import { useAtom } from "jotai";
import { guessedWordsAtom, searchedWordAtom } from "../store/store";

type Props = {
  onChar: (value: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
};

const Keyboard = ({ onChar, onEnter, onBackspace }: Props) => {
  const [solution] = useAtom(searchedWordAtom);
  const [guessedWords] = useAtom(guessedWordsAtom);

  const keysWithStatus = getStatusOfKeys(solution!, guessedWords);

  const onClick = (key: string) => {
    if (key === "ENTER") {
      onEnter();
      return;
    }

    if (key === "BACKSPACE") {
      onBackspace();
      return;
    }

    onChar(key);
  };

  return (
    <div className="w-screen sm:w-[36rem]">
      {keys.map((row: string[], i: number) => {
        return (
          <div key={i} className="flex justify-center">
            {row.map((key, i) => {
              return (
                <Key
                  key={i}
                  onClick={onClick}
                  value={key}
                  status={keysWithStatus?.get(key)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const Key: React.FC<{
  value: string;
  status: string | undefined;
  onClick: any;
}> = ({ value, status, onClick }) => {
  let style = " bg-gray-400";
  let spacing = " flex-1";

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

  if (value === "BACKSPACE" || value === "ENTER") {
    spacing = " flex-[1.5]";
  }

  if (value === "") {
    spacing = " flex-[0.5]";
    style = " hidden";
  }

  return (
    <div className={"m-1" + spacing}>
      <button
        type="button"
        className={
          "flex h-12 w-full items-center justify-center rounded font-bold text-gray-800 shadow-md active:bg-gray-300 dark:text-gray-100 sm:h-14" +
          style
        }
        onClick={() => onClick(value)}
      >
        <span className="select-none">
          {value === "BACKSPACE" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M2.515 10.674a1.875 1.875 0 000 2.652L8.89 19.7c.352.351.829.549 1.326.549H19.5a3 3 0 003-3V6.75a3 3 0 00-3-3h-9.284c-.497 0-.974.198-1.326.55l-6.375 6.374zM12.53 9.22a.75.75 0 10-1.06 1.06L13.19 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L15.31 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            value
          )}
        </span>
      </button>
    </div>
  );
};

const getStatusOfKeys = (solution: string, guessedWords: string[]) => {
  if (!solution || !guessedWords) {
    return;
  }

  const keysWithStatus = new Map<string, string>();

  guessedWords.forEach((word) => {
    word.split("").forEach((letter, i) => {
      if (keysWithStatus.get(letter) === "correct") {
        return;
      }
      if (letter === solution[i]) {
        keysWithStatus.set(letter, "correct");
        return;
      }

      if (solution.includes(letter)) {
        keysWithStatus.set(letter, "present");
        return;
      }

      keysWithStatus.set(letter, "incorrect");
    });
  });

  return keysWithStatus;
};

const keys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["", "A", "S", "D", "F", "G", "H", "J", "K", "L", ""],
  ["BACKSPACE", "Z", "X", "C", "V", "B", "N", "M", "ENTER"],
];

export default Keyboard;
