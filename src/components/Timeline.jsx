import dayjs from 'dayjs'

export default function Timeline({ results }) {
  return (
    <ul className="timeline">
      {[...results].reverse().map((r, i) => (
        <li key={i}>
          {dayjs(r.time).format('HH:mm:ss')} - {r.value}
        </li>
      ))}
    </ul>
  )
}
