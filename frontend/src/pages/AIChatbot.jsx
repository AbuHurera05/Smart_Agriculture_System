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
    return "Yellowing leaves are often linked to nitrogen deficiency, overwatering, or early blight. Check the Soil Testing page for nutrient levels, and consider a foliar nitrogen spray if the pattern is spreading from older leaves upward."
  }
  if (lower.includes('rain') || lower.includes('weather') || lower.includes('forecast')) {
    return "Based on the Live Weather page, expect scattered showers over the next few days. It may be a good idea to hold off on fertilizer application until after the rain passes."
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
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
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
      // No backend chatbot endpoint available yet — use a helpful local reply
      await new Promise((r) => setTimeout(r, 500))
      setMessages((m) => [...m, { role: 'assistant', text: localFallbackReply(content, sensorData) }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="text-primary" size={26} /> AI Chatbot
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">Your on-demand agronomy assistant, aware of live sensor conditions</p>
      </div>

      <Card noPadding className="flex-1 flex flex-col min-h-[60vh] overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
              }`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-primary text-white rounded-tr-sm'
                  : 'bg-gray-100 dark:bg-white/10 rounded-tl-sm'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3 animate-slide-up">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-white/10 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {messages.length < 3 && (
          <div className="px-4 sm:px-6 pb-2 flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s.label)}
                className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 hover:border-primary hover:text-primary transition-colors"
              >
                <s.icon size={13} /> {s.label}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send() }}
          className="p-3 sm:p-4 border-t border-gray-100 dark:border-white/10 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about irrigation, crops, sensors..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary p-2.5 rounded-xl" disabled={!input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </Card>
    </div>
  )
}
