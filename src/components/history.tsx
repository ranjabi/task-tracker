'use client';

import { Task, Session } from '@prisma/client';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

type TaskWithSession = Task & {
  sessions: Session[];
};

export default function History() {
  const [data, setData] = useState<TaskWithSession[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/stopwatch');
      const _data = await res.json();
      const data: TaskWithSession[] = _data.data;
      setData(data);
    }

    fetchData();
  }, []);

  const [date, setDate] = useState(new Date());

  function incrementDay() {
    setDate((prev) => new Date(prev.getTime() + 86400000));
  }

  function decrementDay() {
    setDate((prev) => new Date(prev.getTime() - 86400000));
  }

  function isDisabledNextDay() {
    const today = new Date();
    const todayDate = formatDateToDayMonthYear(today);
    const dateDate = formatDateToDayMonthYear(date);

    return todayDate === dateDate;
  }

  return (
    <div className="px-6 w-full mt-10">
      <div className="font-semibold text-2xl">History</div>
      <div className='flex justify-between items-center mt-4'>
        <button className='btn-solid-primary ' onClick={decrementDay}>{'<'}</button>
        <p className='text-xl'>{formatDateToDayMonthYear(date)}</p>
        <button className={clsx('btn-solid-primary', isDisabledNextDay() ? 'bg-blue-100 hover:bg-blue-100' : '')} onClick={incrementDay} disabled={isDisabledNextDay() ? true : false}>{'>'}</button>
      </div>
      <div className="">
        {data.map((task) => {
          const taskName = task.name;
          const taskDate = formatDateToDayMonthYear(
            new Date(task.sessions[0].startTime)
          );

          if (taskDate === formatDateToDayMonthYear(date)) {
            return (
              <div key={task.id} className="mt-8">
                <div className="flex justify-between items-center">

                  <p>{taskName}</p>
                  <button className={clsx('btn-outline-primary', 'text-xs px-2 py-0.5 rounded-md')} onClick={() => {
                    fetch(`/api/stopwatch/${task.id}`, {
                      method: 'DELETE',
                    })
                    setData(data.filter((item) => item.id !== task.id))
                  }}>X</button>
                </div>
                <table className="w-full mt-1">
                  <thead className="">
                    <tr className="border bg-blue-100">
                      <th className="py-2 text-center font-semibold">
                        Start Time
                      </th>
                      <th className="py-2 text-center font-semibold">End Time</th>
                      <th className="py-2 text-center font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {task.sessions.map((session) => {
                      return (
                        <tr key={session.id} className="border">
                          <td className="py-2 text-center">
                            {formatDateToHHMMSS(new Date(session.startTime))}
                          </td>
                          <td className="py-2 text-center">
                            {formatDateToHHMMSS(new Date(session.endTime))}
                          </td>
                          <td className="py-2 text-center">
                            {session.duration} detik
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }

          
        })}
      </div>
    </div>
  );
}

function formatDateToHHMMSS(date: Date) {
  // Get the individual components (hour, minute, second) from the Date object
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Convert each component to a two-digit string by adding leading zeros if necessary
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  // Concatenate the formatted components with ':' separator
  const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  return formattedTime;
}

function formatDateToDayMonthYear(date: Date) {
  // Get the individual components (day, month, year) from the Date object
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if necessary
  const year = date.getFullYear();

  // Concatenate the formatted components with '/' separator for day/month/year format
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}
