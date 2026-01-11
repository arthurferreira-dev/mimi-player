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