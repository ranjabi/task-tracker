import History from '@/components/history'
import Stopwatch from '@/components/stopwatch'

export default function Home() {
  return (
    <div className='flex flex-col items-center'>
      <Stopwatch />
      <History />
    </div>
  )
}
