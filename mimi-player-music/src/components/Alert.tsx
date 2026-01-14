import { CircleX } from "lucide-react";

type Alert = {
    show: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
    error: string;
}

export const Alert = ({ show, error, set }: Alert) => {
  return (
    <div
      role="alert"
      className={show ? "alert alert-error w-[70%] mb-3" : "hidden"}
    >
      <div
        className="duration-300 hover:cursor-pointer hover:scale-[1.1]"
        onClick={() => set(false)}
      >
        <CircleX />
      </div>
      <div className="w-full flex-row-center">
        <span className="text-[15px]">{error}</span>
      </div>
    </div>
  );
};
