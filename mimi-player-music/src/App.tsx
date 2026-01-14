import { useEffect, useRef, useState } from "react";
import {
  ControlPlayPause,
  Controls,
  MimiPlayerIcon,
  MutedIcon,
} from "./components/Icon";
import { formatPorcent, formatTime } from "./utils/format";
import { useLooping } from "./hooks/useLooping";
import { useMuted } from "./hooks/useMuted";
import { MusicBtn } from "./components/Button";
import { Alert } from "./components/Alert";
import { useVolume } from "./hooks/useVolume";

const App = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [inputFl, showInputFl] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(true);
  const [errorAlert, setErrorAlert] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false);
  const { vol, setVol } = useVolume();
  const { loop, setLoop } = useLooping();
  const { muted, setMuted } = useMuted();
  const volRef = useRef<number>(vol);

  const audioFiles = ["mp3", "wav", "ogg", "aac", "m4a"];

  const getAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !audioRef.current) return;

    const audioExtension = file.name.split(".").pop()?.toLowerCase();

    if (!audioExtension || !audioFiles.includes(audioExtension)) {
      setErrorAlert(
        `Apenas arquivos ${audioFiles
          .map((e) => `.${e}`)
          .join(" ")} são suportados!`
      );
      setShowAlert(true);
      e.target.value = "";
      return;
    }

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
    volRef.current = vol;
  }, [vol]);

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
          setVol(0);
          break;
        case false:
          audio!.muted = false;
          setVol(audio!.volume);
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

    const keyboardActions = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Space":
          e.preventDefault();
          setPaused((p) => !p);
          break;
        case "ArrowUp":
          e.preventDefault();
          setVol(Math.min(volRef.current + 0.05, 1));
          break;

        case "ArrowDown":
          e.preventDefault();
          setVol(Math.max(volRef.current - 0.05, 0));
          break;
        case "r":
          e.preventDefault();
          setLoop();
          break;
        case "f":
          e.preventDefault();
          setMuted();
          break;
      }
    };

    syncPaused();
    LoopTime();
    MutedSound();
    verifyTimer();

    window.addEventListener("keydown", keyboardActions);

    return () => window.removeEventListener("keydown", keyboardActions);
  }, [paused, loop, muted, setVol, setMuted, setLoop]);

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setTime(time);

    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleOnVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.valueAsNumber;
    setVol(val);

    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  return (
    <main className="main-content font-poppins">
      <Alert error={errorAlert} set={setShowAlert} show={showAlert} />

      <div className="flex-row-center flex-col gap-4.5">
        <MimiPlayerIcon />
        <h1 className="text-2xl font-semibold">Mimi Player</h1>
      </div>

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
        <div className="flex-row-center gap-3.5">
          <p>{time !== null ? formatTime(time) : "00:00"}</p>
          <input
            className="range-audio"
            type="range"
            min={0}
            max={Number(duration)}
            step={0.01}
            value={time?.toString()}
            onChange={handleInputOnChange}
          />
          <p className="font-medium">
            {duration !== null ? formatTime(duration) : "00:00"}
          </p>
        </div>
        <div className="flex-row-center gap-3.5">
          <Controls type="muted" set={setMuted} />
          <ControlPlayPause p={paused} set={setPaused} />
          <Controls type="loop" set={setLoop} />
        </div>
        <div
          className={`flex-row-center px-3 ${
            showInput ? "gap-4" : "gap-1 py-1.5"
          } bg-amber-200 rounded-full`}
        >
          <div
            className="hover:cursor-pointer"
            onClick={() => setShowInput(!showInput)}
          >
            <MutedIcon />
          </div>

          <div
            className={`flex-row-center input-range-vol ${
              showInput ? "max-w-32 opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            <input
              type="range"
              className={showInput ? "range-audio" : "hidden"}
              min={0}
              max={1}
              step={0.01}
              value={vol}
              onChange={handleOnVolume}
            />
          </div>
          <div>{formatPorcent(vol)}</div>
        </div>
      </div>

      <div className="flex-row-center flex-col gap-3.5">
        <MusicBtn b={inputFl} set={showInputFl} />

        <input
          className={
            inputFl
              ? "file-input input-file bg-amber-300 hover:bg-amber-400"
              : "hidden"
          }
          type="file"
          accept={audioFiles.map((ext) => `.${ext}`).join(",")}
          onChange={getAudioFile}
        />
      </div>
    </main>
  );
};

export default App;
