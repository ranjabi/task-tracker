"use client";

import History from '@/components/history'
import Stopwatch from '@/components/stopwatch'
import { useState } from 'react';

export default function Home() {
  const [data, setData] = useState<TaskWithSession[]>([]);
  
  return (
    <div className='flex flex-col items-center'>
      <Stopwatch data={data} setData={setData} />
      <History data={data} setData={setData} />
    </div>
  )
}
