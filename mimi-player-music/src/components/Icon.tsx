import { useLooping } from "../hooks/useLooping";
import {
  Music,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useMuted } from "../hooks/useMuted";

export const MimiPlayerIcon = () => {
  return (
    <div className="mimiplayer-icon">
      <Music size={35} />
    </div>
  );
};

interface IconPlayPauseProps {
  paused: boolean;
}

export const IconPlayPause = ({ paused }: IconPlayPauseProps) => {
  return paused ? <Play /> : <Pause />;
};

export const LoopIcon = () => {
  const { loop } = useLooping();

  return loop ? <Repeat1 /> : <Repeat />;
};

export const MutedIcon = () => {
  const { muted } = useMuted();

  return muted ? <VolumeX /> : <Volume2 />;
};

type ControlsType = {
  p: boolean;
  set: React.Dispatch<React.SetStateAction<boolean>>;
};
export const ControlPlayPause = ({ p, set }: ControlsType) => {
  return (
    <div className="controls-icon" onClick={() => set(!p)}>
      <IconPlayPause paused={p} />
    </div>
  );
};

type ControlsTypeZustand = {
  type: string;
  set: () => void;
};
export const Controls = ({ type, set }: ControlsTypeZustand) => {
  switch (type) {
    case "loop":
      return (
        <div className="controls-icon" onClick={set}>
          <LoopIcon />
        </div>
      );
    case "muted":
      return (
        <div className="controls-icon" onClick={set}>
          <MutedIcon />
        </div>
      );
  }
};