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
      // console.log('data', data[0].sessions[0]);
      setData(data);
    }

    fetchData();
  }, []);

  return (
    <div className="px-6 w-full mt-10">
      <div className='font-semibold text-xl'>History</div>
      <table className="w-full mt-3">
        <thead>
          <tr className='bg-gray-100'>
            <th className='py-2 text-center font-semibold'>Start Time</th>
            <th className='py-2 text-center font-semibold'>End Time</th>
            <th className='py-2 text-center font-semibold'>Duration</th>
          </tr>
        </thead>
        <tbody>
          {data[0]?.sessions.map((session) => {
            return (
              <tr key={session.id} className="border-b ">
                  <td className='py-2 text-center'>{new Date(session.startTime).toLocaleString()}</td>
                  <td className='py-2 text-center'>{new Date(session.endTime).toLocaleString()}</td>
                  <td className='py-2 text-center'>{session.duration}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
