import { atom } from "jotai";
import { WORDS } from "../lib/wordlist"

const currentGuessAtom = atom<string[]>([]);
const currentGuessFullAtom = atom(
    (get) => get(currentGuessAtom).join("")
  );
// const rowAtom = atom(
//     (get) => get(guessedWordsAtom).length
// );
const guessedWordsAtom = atom<string[]>([]);
const searchedWordAtom = atom(() => {
  return WORDS[Math.floor(Math.random()*WORDS.length)]?.toUpperCase();
});
const modalAtom = atom((get) => get(gameStatusAtom) === "won" || get(gameStatusAtom) === "lost" ? true : false);

const isGuestAtom = atom(false)

const gameStatusAtom = atom("");

const isIncorrectAtom = atom(false)


export { currentGuessAtom, currentGuessFullAtom, guessedWordsAtom, searchedWordAtom, modalAtom, isGuestAtom, gameStatusAtom, isIncorrectAtom };