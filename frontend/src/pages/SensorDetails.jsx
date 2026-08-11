import { useMemo, useState } from 'react'
import * as Icons from 'lucide-react'
import { Download } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import SearchableTable from '../components/common/SearchableTable'
import { useSensorFeed } from '../hooks/useSensorFeed'
import { sensorDefinitions } from '../utils/constants'

function statusOf(value, thresholds) {
  if (value < thresholds.low) return { label: 'Low', badge: 'badge-warning' }
  if (value > thresholds.high) return { label: 'High', badge: 'badge-danger' }
  return { label: 'Normal', badge: 'badge-success' }
}

export default function SensorDetails() {
  const { readings, history } = useSensorFeed()
  const [selected, setSelected] = useState(sensorDefinitions[0].id)
  const sensor = sensorDefinitions.find((s) => s.id === selected)
  const Icon = Icons[sensor.icon] || Icons.Activity

  const tableData = useMemo(() => {
    return (history[selected] || []).map((point, idx) => {
      const status = statusOf(point.value, sensor.thresholds)
      return {
        id: idx,
        time: point.time,
        value: point.value,
        unit: sensor.unit,
        status: status.label,
        statusBadge: status.badge,
      }
    }).reverse()
  }, [history, selected, sensor])

  const columns = [
    { key: 'time', label: 'Timestamp', sortable: true },
    { key: 'value', label: `Reading (${sensor.unit})`, sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <span className={`badge ${row.statusBadge}`}>{row.status}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sensor Details</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">Inspect readings, thresholds and history per sensor module</p>
        </div>
        <Button variant="secondary" size="sm">
          <Download size={16} /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sensor list */}
        <Card noPadding className="lg:col-span-1 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-white/10">
            {sensorDefinitions.map((s) => {
              const SIcon = Icons[s.icon] || Icons.Activity
              const active = s.id === selected
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${active ? 'bg-primary/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${s.color}1a`, color: s.color }}>
                    <SIcon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${active ? 'text-primary' : ''}`}>{s.name}</p>
                    <p className="text-xs text-gray-400 truncate">{s.module}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Detail panel */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: `${sensor.color}1a`, color: sensor.color }}>
                  <Icon size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{sensor.name}</h2>
                  <p className="text-sm text-gray-400">{sensor.module}</p>
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-gray-400">Current</p>
                  <p className="font-bold text-lg">{readings[sensor.id]} {sensor.unit}</p>
                </div>
                <div>
                  <p className="text-gray-400">Safe Range</p>
                  <p className="font-bold text-lg">{sensor.thresholds.low}&ndash;{sensor.thresholds.high}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <span className={`badge ${statusOf(readings[sensor.id], sensor.thresholds).badge}`}>
                    {statusOf(readings[sensor.id], sensor.thresholds).label}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">{sensor.description}</p>

            <ResponsiveContainer width="100%" height={260} className="mt-4">
              <LineChart data={history[selected] || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[sensor.min, sensor.max]} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={sensor.color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4">Reading History</h3>
            <SearchableTable columns={columns} data={tableData} searchPlaceholder="Search readings..." />
          </Card>
        </div>
      </div>
    </div>
  )
}
