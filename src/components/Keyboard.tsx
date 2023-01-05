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
    <div>
      {keys.map((row: string[], i: number) => {
        return (
          <div key={i} className="flex justify-center">
            {row.map((key) => {
              return (
                <Key
                  key={key}
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
  let style = " bg-gray-500";
  let width = " w-12";

  switch (status) {
    case "correct":
      style = " bg-green-600";
      break;
    case "present":
      style = " bg-yellow-600";
      break;
    case "incorrect":
      style = " bg-gray-700";
      break;
  }

  if (value === "BACKSPACE") {
    width = " w-18";
  }

  return (
    <div className="m-1">
      <button
        type="button"
        className={
          "flex h-14 items-center justify-center rounded font-bold text-gray-100 hover:bg-gray-300" +
          style +
          width
        }
        onClick={() => onClick(value)}
      >
        <span className="select-none">{value}</span>
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
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["BACKSPACE", "Z", "X", "C", "V", "B", "N", "M", "Enter"],
];

export default Keyboard;
