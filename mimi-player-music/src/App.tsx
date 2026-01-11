import { useEffect, useRef, useState } from "react";
import {
  IconPlayPause,
  LoopIcon,
  MimiPlayerIcon,
  MutedIcon,
} from "./components/Icon";
import { formatTime } from "./utils/format";
import { useLooping } from "./hooks/useLooping";
import { useMuted } from "./hooks/useMuted";
import { MusicBtn } from "./components/Button";

const App = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [inputFl, showInputFl] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(true);
  const { loop, setLoop } = useLooping();
  const { muted, setMuted } = useMuted();

  const getAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !audioRef.current) return;

    const rawName = file.name;
    const nonName = rawName.replace(/\.[^/.]+$/, "");

    setName(nonName);

    if (audioRef.current.src.startsWith("blob:")) {
      URL.revokeObjectURL(audioRef.current.src);
    }

    const url = URL.createObjectURL(file);
    audioRef.current.src = url;
    audioRef.current.load();
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setTime(audioRef.current.currentTime);
  };

  useEffect(() => {
    const syncPaused = () => {
      const audio = audioRef.current;

      switch (paused) {
        case true:
          audio?.pause();
          break;
        case false:
          audio?.play();
          break;
      }
    };

    const LoopTime = () => {
      const audio = audioRef.current;

      switch (loop) {
        case true:
          audio!.loop = true;
          break;
        case false:
          audio!.loop = false;
          break;
      }
    };

    const MutedSound = () => {
      const audio = audioRef.current;

      switch (muted) {
        case true:
          audio!.muted = true;
          break;
        case false:
          audio!.muted = false;
          break;
      }
    };

    const verifyTimer = () => {
      const audio = audioRef.current;

      if (audio?.ended) {
        setTime(0);
        setPaused(true);
      }
    };

    syncPaused();
    LoopTime();
    MutedSound();
    verifyTimer();
  }, [paused, loop, muted]);

  return (
    <main className="main-content font-poppins">
      <MimiPlayerIcon />

      <h1 className="text-2xl font-semibold">Mimi Player</h1>

      <audio
        ref={audioRef}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onTimeUpdate={handleTimeUpdate}
      />

      <div className="flex flex-col justify-between items-center gap-4">
        <p>{name === null ? "Nenhum arquivo" : name}</p>
        <div className="flex justify-center items-center gap-3.5">
          <p>{time !== null ? formatTime(time) : "00:00"}</p>
          <input
            className="range-audio"
            type="range"
            min={0}
            max={Number(duration)}
            step={0.01}
            value={time?.toString()}
            onChange={(e) => {
              const time = Number(e.target.value);
              setTime(time);

              if (audioRef.current) {
                audioRef.current.currentTime = time;
              }
            }}
          />
          <p className="font-medium">{duration !== null ? formatTime(duration) : "00:00"}</p>
        </div>
        <div className="flex justify-center items-center gap-3.5">
          <div className="controls-icon" onClick={() => setPaused(!paused)}>
            <IconPlayPause paused={paused} />
          </div>
          <div className="controls-icon" onClick={setLoop}>
            <LoopIcon />
          </div>
          <div className="controls-icon" onClick={setMuted}>
            <MutedIcon />
          </div>
        </div>
      </div>

      <MusicBtn b={inputFl} set={showInputFl} />

      <input
        className={
          inputFl
            ? "file-input bg-amber-300 duration-300 p-1 hover:bg-amber-400 focus:outline-none"
            : "hidden"
        }
        type="file"
        onChange={getAudioFile}
      />
    </main>
  );
};

export default App;
