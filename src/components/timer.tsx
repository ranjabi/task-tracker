import { formatTime } from '@/lib/time';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

type TimerProps = {
  data: TaskWithSession[];
  setData: React.Dispatch<React.SetStateAction<TaskWithSession[]>>;
};

export default function Timer({ data, setData }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timestamps, setTimestamps] = useState<Timestamp[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timer.current = setInterval(() => {
        setSecondsLeft((seconds) => seconds - 1);
      }, 1000);
    }
    return () => clearInterval(timer.current!);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && secondsLeft === 0) {
      handleStop();
    }
  });

  const {
    register,
    resetField,
    watch,
    formState: { errors },
  } = useForm();

  function setTimer(minute: number) {
    setSecondsLeft(minute * 60);
    setTimerSeconds(minute * 60);
  }

  function handleStartOrPause() {
    if (isRunning) {
      clearInterval(timer.current!);

      let secondsDifference = timerSeconds - secondsLeft;

      if (timestamps.length > 0) {
        // if there was a pause, substract with previous timestamp to get the difference
        secondsDifference =
          timerSeconds - timestamps[timestamps.length - 1].secondsElapsed;
      }

      setTimestamps((timestamps) => [
        ...timestamps,
        {
          id: timestamps.length + 1,
          startTime: Date.now() - secondsDifference * 1000,
          endTime: Date.now(),
          secondsElapsed: secondsDifference,
        },
      ]);
    }

    setIsRunning(!isRunning);
  }

  async function handleStop() {
    clearInterval(timer.current!);

    let secondsDifference = timerSeconds - secondsLeft;

    if (timestamps.length > 0) {
      // if there was a pause, substract with previous timestamp to get the difference
      secondsDifference =
        timerSeconds - timestamps[timestamps.length - 1].secondsElapsed;
    }

    const timeStamp = [
      ...timestamps,
      {
        id: timestamps.length + 1,
        startTime: Date.now() - secondsDifference * 1000,
        endTime: Date.now(),
        secondsElapsed: secondsDifference,
      },
    ];

    const taskName = watch('taskName');
    const body = { taskName, timeStamp };

    const res = await fetch('/api/stopwatch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setData((prevData) => [data.data, ...prevData]);

    setTimestamps([]);
    setTimerSeconds(0);
    setSecondsLeft(0);
    setIsRunning(false);
  }

  function handleRestart() {
    setSecondsLeft(0);
  }

  return (
    <div className="border border-gray-200 py-6 rounded-lg w-96 flex flex-col items-center space-y-4 px-4">
      <p className="text-5xl">Timer</p>
      <p className="text-5xl pt-5">{formatTime(secondsLeft)}</p>
      <div className="flex space-x-2 pt-4">
        <button
          className="btn-outline-primary px-2 py-0.5"
          onClick={() => setTimer(50)}
        >
          50 menit
        </button>
        <button className="btn-outline-primary px-2 py-0.5" onClick={() => setTimer(30)}>30 menit</button>
        <button className="btn-outline-primary px-2 py-0.5" onClick={() => setTimer(20)}>20 menit</button>
        <button className="btn-outline-primary px-2 py-0.5" onClick={() => setTimer(10)}>10 menit</button>
      </div>
      <form className="w-full pt-4 flex ">
        <input
          className="w-full border border-gray-300 rounded-md px-2 py-1"
          type="text"
          placeholder="Task Name"
          {...register('taskName', { required: true })}
        />
        <button
          type="button"
          className="btn-outline-primary rounded-lg text-xs px-3 ml-2"
          onClick={() => resetField('taskName')}
        >
          X
        </button>
        {errors.exampleRequired && <span>This field is required</span>}
      </form>
      <div className="pt-1">
        <button className="btn-outline-primary mr-4" onClick={handleRestart}>
          RESTART
        </button>
        {isRunning && (
          <button className="btn-solid-primary mr-4" onClick={handleStop}>
            STOP
          </button>
        )}

        <button
          className={`btn-solid-primary ${
            timerSeconds === 0 ? 'bg-opacity-30 hover:bg-opacity-30' : ''
          }`}
          onClick={handleStartOrPause}
          disabled={timerSeconds === 0}
        >
          {isRunning ? 'PAUSE' : 'START'}
        </button>
      </div>
    </div>
  );
}
