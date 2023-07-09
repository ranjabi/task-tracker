export default function History() {
  return (
    <>
      <div>History</div>
      <table>
        <thead>
          <tr>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((data) => (
            <tr key={data.id}>
              <td>{data.startTime}</td>
              <td>{data.endTime}</td>
              <td>{data.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

const dummyData = [
  {
    id: 1,
    startTime: '2021-01-01 00:00:00',
    endTime: '2021-01-01 00:00:10',
    duration: 20,
  },
  {
    id: 2,
    startTime: '2021-01-01 00:00:00',
    endTime: '2021-01-01 00:00:10',
    duration: 20,
  },
];
