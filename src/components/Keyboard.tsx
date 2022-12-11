import { useAtom } from "jotai";
import { useEffect } from "react";
import { currentGuessAtom, guessedWordsAtom, searchedWordAtom } from "../store/store";


type Props = {
    onChar: (value: string) => void,
    onEnter: () => void,
    onBackspace: () => void
  }

const Keyboard = ({onChar, onEnter, onBackspace} :Props) => {
    
  console.warn("onChar", onChar)
    const keysWithStatus = getStatusOfKeys();

    const onClick = (key: string) => {
        if (key === "ENTER") {
            onEnter()
            return
        }

        if (key === "BACKSPACE") {
            onBackspace()
            return
        }

        onChar(key)
    }

    return <div>
        {keys.map((row:string[]) => {
            return (
                <div className="flex justify-center">
                    {row.map((key) => {
                        return (
                                <Key key={key} onClick={onClick} value={key} status={keysWithStatus?.get(key)}/>
                        );
                    })}
                </div>
            );
        })}
    </div>;
}

const Key: React.FC<{ value: string, status: string | undefined, onClick:any }> = ({ value, status, onClick }) => {
    const [currentGuess, setCurrentGuess] = useAtom(currentGuessAtom)

    console.warn(status)
    let style = "bg-gray-400";


    switch(status) {
        case "correct":
            style = "bg-green-500"
            break;
        case "present":
            style = "bg-yellow-500"
            break;
        case "incorrect":
            style = "bg-gray-700"
            break;
    }
    
    if (value === "BACKSPACE") {
        return (
            <div className="m-1">
                <button className={"bg-gray-400 hover:bg-gray-300 font-bold w-18 h-16 rounded flex justify-center items-center text-white"}
                onClick={() => onClick(value)}>
                    <span className="select-none">{value}</span>
                </button>
            </div>
        )
    }


    return (
        <div className="m-1">
            <button className={" hover:bg-gray-300 font-bold w-12 h-16 rounded flex justify-center items-center text-white " + style}
            onClick={() => onClick(value)}>
                <span className="select-none">{value}</span>
            </button>
        </div>
    );
};

const getStatusOfKeys = () => {
    const [solution] = useAtom(searchedWordAtom)
    const [guessedWords] = useAtom(guessedWordsAtom)
    if (!solution || !guessedWords) {
        return
    }

    const keysWithStatus = new Map<string, string>()

    guessedWords.forEach((word) => {
        word.split('').forEach((letter, i) => {
            if (keysWithStatus.get(letter) === "correct") {
                return
            }
            if (letter === solution[i]) {
                keysWithStatus.set(letter, "correct")
                return
            }

            if (solution.includes(letter)) {
                keysWithStatus.set(letter, "present")
                return
            }

            keysWithStatus.set(letter, "incorrect")
        })
    });

    return keysWithStatus;
}


export default Keyboard;

const keys = [
    [
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
    ],
    [
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
    ],
    [
        "BACKSPACE",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        "Enter",
    ],
]