'use client';

import { Task, Session } from '@prisma/client';
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

  return (
    <div className="px-6 w-full mt-10">
      <div className="font-semibold text-2xl">History</div>
      <div className='mt-4'>
        {data.map((task) => {
          const taskName = task.name;
          const taskDate = formatDateToDayMonthYear(new Date(task.sessions[0].startTime));
          return (
            <div key={task.id} className="mb-8">
              <p>{taskName}</p>
              <p>{taskDate}</p>
              <table className="w-full mt-1">
                <thead className=''>
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
                        <td className="py-2 text-center">{session.duration} detik</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
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
  const day = date.getDate().toString().padStart(2, '0');;
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if necessary
  const year = date.getFullYear();

  // Concatenate the formatted components with '/' separator for day/month/year format
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}