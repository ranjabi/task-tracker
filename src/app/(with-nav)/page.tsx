'use client';

import History from '@/components/history';
import Stopwatch from '@/components/stopwatch';
import Timer from '@/components/timer';
import { useState } from 'react';

export default function Home() {
  const [data, setData] = useState<TaskWithSession[]>([]);
  const [type, setType] = useState<'stopwatch' | 'timer'>('timer');

  return (
    <div className="flex flex-col items-center">
      <div className="flex mt-5 space-x-2">
        <button
          className={`btn-ghost-primary px-2 py-1 rounded-md ${
            type === 'stopwatch' ? 'bg-blue-600 text-white rounded-md' : ''
          }`}
          onClick={() => setType('stopwatch')}
        >
          Stopwatch
        </button>
        <button
          className={`btn-ghost-primary px-2 py-1 rounded-md ${
            type === 'timer' ? 'bg-blue-600 text-white rounded-md' : ''
          }`}
          onClick={() => setType('timer')}
        >
          Timer
        </button>
      </div>
      <div className="mt-8">
        {type === 'stopwatch' && <Stopwatch data={data} setData={setData} />}
        {type === 'timer' && <Timer data={data} setData={setData} />}
      </div>
      <History data={data} setData={setData} />
    </div>
  );
}
