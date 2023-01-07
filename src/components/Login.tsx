import { useAtom } from "jotai";
import { signIn } from "next-auth/react";
import { isGuestAtom } from "../store/store";

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

export default Login;
