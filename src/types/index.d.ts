type TaskWithSession = Task & {
  sessions: Session[];
};

type Timestamp = {
  id: number;
  startTime: number;
  endTime: number;
  secondsElapsed: number;
};