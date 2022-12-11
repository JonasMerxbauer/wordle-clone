import { useAtom } from "jotai";
import Link from "next/link";
import { guessedWordsAtom, modalAtom } from "../store/store";
import { useRouter } from 'next/router';

const Modal:React.FC = () => {
    
  const router = useRouter()
    const [isOpen, setIsOpen] = useAtom(modalAtom);
    const [guesses] = useAtom(guessedWordsAtom);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="absolute w-screen h-screen flex justify-center items-center bg-opacity-50 bg-black" onClick={() => {setIsOpen(false)}}>
            <div className="w-64 h-96 bg-slate-500 text-white flex flex-col justify-around items-center">
                <div>
                You win!
                </div>
                <div>
                    Attempts: {guesses.length}
                </div>
                
                <button type="button" onClick={() => router.reload()}>
                Click here to reload
                </button>
            </div>
        </div>
    )
}

export default Modal;