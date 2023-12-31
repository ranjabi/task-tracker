'use client';

import { formatTime } from '@/lib/time';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

type StopwatchProps = {
  data: TaskWithSession[];
  setData: React.Dispatch<React.SetStateAction<TaskWithSession[]>>;
}

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

export default function Stopwatch({ data, setData }: StopwatchProps) {
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

  const { register, resetField, watch, formState: { errors } } = useForm();

  return (
    <div className="border border-gray-200 py-6 rounded-lg w-96 flex flex-col items-center space-y-4 px-4">
      <p className="text-5xl">Stopwatch</p>
      <p className="text-5xl pt-5">{formatTime(secondsElapsed)}</p>
      <form className='w-full pt-4 flex '>
        <input
          className="w-full border border-gray-300 rounded-md px-2 py-1"
          type="text"
          placeholder="Task Name"
          {...register("taskName", { required: true })}
        />
        <button type='button' className='btn-outline-primary rounded-lg text-xs px-3 ml-2' onClick={() => resetField('taskName')}>X</button>
        {errors.exampleRequired && <span>This field is required</span>}
        </form>
      <div className="pt-1">
        <button
          className="btn-outline-primary mr-4"
          onClick={() => setSecondsElapsed(0)}
        >
          RESTART
        </button>
        {isRunning && (
          <button
            className="btn-solid-primary mr-4"
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

                const timeStamp = [
                  ...timestamps,
                  {
                    id: timestamps.length + 1,
                    startTime: Date.now() - secondsDifference * 1000,
                    endTime: Date.now(),
                    secondsElapsed: secondsDifference,
                  },
                ]
                const taskName = watch("taskName");
                const body = {taskName, timeStamp};

                const res = await fetch('/api/stopwatch', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(body),
                });
                const data = await res.json();
                setTimestamps([]);
                setData((prevData) => [data.data, ...prevData]);
              }

              setIsRunning(false);
              setSecondsElapsed(0);
            }}
          >
            STOP
          </button>
        )}

        <button
          className="btn-solid-primary"
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
          {isRunning ? 'PAUSE' : 'START'}
        </button>
      </div>
    </div>
  );
}
