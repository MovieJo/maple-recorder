import dayjs from 'dayjs'

export default function Timeline({ results }) {
  return (
    <ul className="max-h-52 overflow-y-auto bg-white border border-gray-300 rounded p-2 space-y-1 text-sm">
      {[...results].reverse().map((r, i) => (
        <li key={i} className="p-1 border-b last:border-b-0">
          {dayjs(r.time).format('HH:mm:ss')} - {r.value}
        </li>
      ))}
    </ul>
  )
}
