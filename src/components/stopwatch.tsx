'use client';

import React, { useEffect, useRef } from 'react';

type Timestamp = {
  id: number;
  startTime: number;
  endTime: number;
  secondsElapsed: number;
};

function parseTime(timestamp: number) {
  return new Date(timestamp).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function Stopwatch() {
  const [secondsElapsed, setSecondsElapsed] = React.useState(0);
  const [timestamps, setTimestamps] = React.useState<Timestamp[]>([]);
  const [isRunning, setIsRunning] = React.useState(false);

  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timestamps.length > 0) {
      console.log('------');
      timestamps.map((timestamp) => {
        const { startTime, endTime, secondsElapsed } = timestamp;
        console.log('start time', parseTime(startTime));
        console.log('end time', parseTime(endTime));
        console.log('elapsed time', secondsElapsed);
      });
    }
  }, [timestamps]);

  useEffect(() => {
    if (isRunning) {
      timer.current = setInterval(() => {
        setSecondsElapsed((seconds) => seconds + 1);
      }, 1000);
    }
    return () => clearInterval(timer.current!);
  }, [isRunning]);

  return (
    <div className="border border-red-100 flex flex-col items-center space-y-4">
      <div className="">stopwatch</div>
      <p>{formatTime(secondsElapsed)}</p>
      <div>
        <button
          className="border border-gray-400 px-1 m-1"
          onClick={() => setSecondsElapsed(0)}
        >
          restart
        </button>
        {secondsElapsed > 0 && (
          <button
            className="border border-gray-400 px-1 m-1"
            onClick={async () => {
              if (isRunning) {
                clearInterval(timer.current!); // what this does?

                let secondsDifference = secondsElapsed;

                if (timestamps.length > 0) {
                  // if there was a pause, substract with previous timestamp to get the difference
                  secondsDifference =
                    secondsElapsed -
                    timestamps[timestamps.length - 1].secondsElapsed;
                }

                // TODO: handle case when user click stop button but the timestamps still contain the previous timestamp

                const res = await fetch('/api/stopwatch', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify([
                    ...timestamps,
                    {
                      id: timestamps.length + 1,
                      startTime: Date.now() - secondsDifference * 1000,
                      endTime: Date.now(),
                      secondsElapsed: secondsDifference,
                    },
                  ]),
                });
                setTimestamps([]);
              }

              setIsRunning(false);
              setSecondsElapsed(0);
            }}
          >
            stop
          </button>
        )}

        <button
          className="border border-gray-400 px-1 m-1"
          onClick={() => {
            if (isRunning) {
              clearInterval(timer.current!);

              let secondsDifference = secondsElapsed;

              if (timestamps.length > 0) {
                // if there was a pause, substract with previous timestamp to get the difference
                secondsDifference =
                  secondsElapsed -
                  timestamps[timestamps.length - 1].secondsElapsed;
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
          }}
        >
          {isRunning ? 'pause' : 'start'}
        </button>
      </div>
    </div>
  );
}

function formatTime(time: number) {
  let hours: string | number = Math.floor(time / 3600);
  let minutes: string | number = Math.floor((time / 60) % 60);
  let seconds: string | number = Math.floor(time % 60);

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return `${hours}:${minutes}:${seconds}`;
}
