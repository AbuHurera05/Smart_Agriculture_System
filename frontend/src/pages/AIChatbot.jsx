import { useEffect, useRef, useState } from 'react'
import { Send, Bot, User, Sparkles, Leaf, Droplet, CloudRain } from 'lucide-react'
import Card from '../components/common/Card'
import { chatbotAPI } from '../services/api'
import useStore from '../store/useStore'

const suggestions = [
  { icon: Droplet, label: 'Should I irrigate today?' },
  { icon: Leaf, label: 'Why are my rice leaves yellowing?' },
  { icon: CloudRain, label: 'What is the rain forecast this week?' },
]

function localFallbackReply(message, sensorData) {
  const lower = message.toLowerCase()
  if (lower.includes('irrigat') || lower.includes('water')) {
    const moisture = sensorData?.moisture ?? 58
    return moisture < 40
      ? `Your soil moisture reading is around ${moisture}%, which is below the optimal 60% zone — I'd recommend running irrigation for zone 1 today.`
      : `Soil moisture is currently around ${moisture}%, which is within the healthy range, so you can likely skip irrigation today.`
  }
  if (lower.includes('yellow') || lower.includes('disease') || lower.includes('pest')) {
    return 'Yellowing leaves are often linked to nitrogen deficiency, overwatering, or early blight. Check the Soil Testing page for nutrient levels, and consider a foliar nitrogen spray if the pattern is spreading from older leaves upward.'
  }
  if (lower.includes('rain') || lower.includes('weather') || lower.includes('forecast')) {
    return 'Based on the Live Weather page, expect scattered showers over the next few days. It may be a good idea to hold off on fertilizer application until after the rain passes.'
  }
  if (lower.includes('temperature') || lower.includes('humid')) {
    return `Current readings from the DHT22 sensor show temperature and humidity within a typical range for this season. I'll flag it if either drifts outside the safe zone.`
  }
  return "I can help with irrigation timing, crop health, sensor readings, and weather-based planning. Could you share a bit more detail about what you're seeing on your farm?"
}

export default function AIChatbot() {
  const { sensorData } = useStore()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm your Smart Agriculture assistant. Ask me about irrigation, sensor readings, crop health, or weather-driven decisions.",
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, typing])

  const send = async (text) => {
    const content = (text ?? input).trim()
    if (!content) return
    const nextMessages = [...messages, { role: 'user', text: content }]
    setMessages(nextMessages)
    setInput('')
    setTyping(true)

    try {
      const res = await chatbotAPI.sendMessage(content, nextMessages)
      const reply = res?.data?.reply || localFallbackReply(content, sensorData)
      setMessages((m) => [...m, { role: 'assistant', text: reply }])
    } catch {
      await new Promise((r) => setTimeout(r, 500))
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: localFallbackReply(content, sensorData) },
      ])
    } finally {
      setTyping(false)
    }
  }

  return (
    <div className="flex h-full flex-col space-y-6">
      <div>
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md shadow-green-600/25">
            <Sparkles size={20} />
          </div>
          AI Chatbot
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          Your on-demand agronomy assistant, aware of live sensor conditions
        </p>
      </div>

      <Card noPadding className="flex min-h-[60vh] flex-1 flex-col overflow-hidden">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm ${
                  m.role === 'user'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                    : 'bg-green-50 text-green-600 ring-1 ring-green-500/20 dark:bg-green-500/10 dark:text-green-400'
                }`}
              >
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${
                  m.role === 'user'
                    ? 'rounded-tr-sm bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md shadow-green-600/20'
                    : 'rounded-tl-sm border border-slate-100 bg-slate-50 text-slate-700 dark:border-white/5 dark:bg-white/5 dark:text-slate-200'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600 ring-1 ring-green-500/20 dark:bg-green-500/10 dark:text-green-400">
                <Bot size={16} />
              </div>
              <div className="flex gap-1 rounded-2xl rounded-tl-sm border border-slate-100 bg-slate-50 px-4 py-3 dark:border-white/5 dark:bg-white/5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length < 3 && (
          <div className="flex flex-wrap gap-2 px-4 pb-2 sm:px-6">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s.label)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-green-500 hover:bg-green-50/50 hover:text-green-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-green-500/50 dark:hover:bg-green-500/10 dark:hover:text-green-400"
              >
                <s.icon size={13} /> {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="flex items-center gap-2 border-t border-slate-100 p-3 sm:p-4 dark:border-white/10"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about irrigation, crops, sensors..."
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md shadow-green-600/25 transition-all hover:from-green-600 hover:to-emerald-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </Card>
    </div>
  )
}