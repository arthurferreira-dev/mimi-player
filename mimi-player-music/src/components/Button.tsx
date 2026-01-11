interface props {
  b: boolean;
  set: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MusicBtn = ({ b, set }: props) => {
  return (
    <button
      className="btn bg-amber-300 duration-300 hover:bg-amber-400 rounded-md mt-3.5"
      onClick={() => set(!b)}
    >
      Escolher Música
    </button>
  );
};