import React, { useState } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  HelpCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'
import FarmerAvatar from '../components/common/FarmerAvatar'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'IoT Hardware & Sensors',
    message: '',
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)

  const faqs = [
    {
      q: 'Can AsanKisan run with simulated data before my ESP32 sensors arrive?',
      a: 'Yes! AsanKisan includes a built-in Telemetry Simulator in the IoT microservice. It dynamically generates realistic soil moisture fluctuations, ambient temperature/humidity, rainfall, and water levels so you can test pumps, alerts, and graphs immediately without waiting for hardware.',
    },
    {
      q: 'How does the automated irrigation pump protect against dry-running?',
      a: 'Our smart irrigation engine monitors both soil moisture and reservoir water level. If soil is dry (< 30%) but the reservoir level drops to or below 15%, the system enforces an immediate safety dry-run shutoff to protect your pump motor from burning out, and notifies you immediately.',
    },
    {
      q: 'How do I receive Gmail, SMS, and WhatsApp notifications?',
      a: 'In your Settings page, you can configure your Gmail address, mobile phone number, and WhatsApp number. When alerts trigger (dry soil, rain cut-off, or tank low), the system dispatches styled HTML emails via Gmail SMTP and instant messages via the SMS/WhatsApp gateway.',
    },
    {
      q: 'What hardware devices and sensors does AsanKisan support?',
      a: 'The platform is optimized for the ESP32 microcontroller, Capacitive Soil Moisture Sensor (v1.2 or v2.0), DHT22 Temperature & Humidity Sensor, Raindrop Detection Sensor, Ultrasonic/Float Water Level Sensor, and 5V/12V Relay Modules for AC/DC irrigation pump motors.',
    },
    {
      q: 'How can farmers list their produce on the AsanKisan Marketplace?',
      a: 'Any registered user can navigate to the Marketplace, open the Seller Dashboard, and list their crops, seeds, fertilizers, or tools with fair market rates and direct contact details.',
    },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in your name, email, and message.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success('Your message has been received! Our team will get back to you shortly.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'IoT Hardware & Sensors',
        message: '',
      })
    }, 900)
  }

  return (
    <div className="space-y-10 pb-16">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-900 via-emerald-800 to-teal-950 p-8 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <FarmerAvatar size={50} withRing animated />
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-400/20 px-3 py-1 text-xs font-semibold text-lime-300 ring-1 ring-lime-400/30">
                  <Sparkles size={12} />
                  Kisan Helpdesk & Support
                </span>
                <p className="text-xs text-green-100/70 mt-0.5">We are here for you 24/7</p>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Contact <span className="text-lime-300">AsanKisan</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Have questions about ESP32 wiring, irrigation automation, multi-channel notifications,
              or marketplace listings? Reach out directly to our engineering and agronomy team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a
              href="https://wa.me/923242938640"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-3 text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <MessageSquare size={17} />
              WhatsApp Live (03242938640)
            </a>
            <a
              href="mailto:smaratgriculture076@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white px-5 py-3 text-sm font-semibold ring-1 ring-white/20 transition-all active:scale-95"
            >
              <Mail size={17} />
              smaratgriculture076@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================
          CONTACT CARDS GRID
      ========================================================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-night-raised">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <Mail size={22} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Email Us</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Official &amp; Support Inbox</p>
          <a
            href="mailto:smaratgriculture076@gmail.com"
            className="mt-3 block text-xs font-semibold text-green-600 hover:underline dark:text-green-400 truncate"
          >
            smaratgriculture076@gmail.com
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-night-raised">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400">
            <Phone size={22} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Phone &amp; WhatsApp</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Mon - Sun, 24/7 Direct line</p>
          <a
            href="tel:03242938640"
            className="mt-3 block text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-green-600"
          >
            03242938640
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-night-raised">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
            <MapPin size={22} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Headquarters</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sindh, Pakistan</p>
          <p className="mt-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
            Ward 1 Tando Bago
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-night-raised">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
            <Clock size={22} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Response Time</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Emergency farm alerts</p>
          <p className="mt-3 text-xs font-semibold text-amber-600 dark:text-amber-400">
            Instant via Webhooks / &lt; 2 hrs
          </p>
        </div>
      </div>

      {/* =========================================================
          MAIN CONTACT FORM + SIDEBAR
      ========================================================= */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 shadow-sm dark:border-white/10 dark:bg-night-raised">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Send Us a Message</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Fill in the form below and we will get back to you with custom guidance or technical assistance.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center space-y-3 dark:bg-emerald-950/30 dark:border-emerald-800">
              <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
              <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                Message Sent Successfully!
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-sm mx-auto">
                Thank you for contacting AsanKisan. Abu Hurera and Abrar have received your note
                and will respond promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Muhammad Ali"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="03242938640"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Inquiry Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-white/10 dark:bg-night dark:text-white"
                  >
                    <option value="IoT Hardware & Sensors">IoT Hardware & Sensors (ESP32)</option>
                    <option value="Irrigation Automation">Irrigation Automation & Pump Relay</option>
                    <option value="Notifications & Alerts">Email / SMS / WhatsApp Alerts</option>
                    <option value="Marketplace">Marketplace & Selling Crops</option>
                    <option value="General Feedback">General Feedback / Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Message Details *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your farm, sensor setup, or questions..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-green-700 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span>Sending message...</span>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Send Message to AsanKisan Team</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50/50 p-6 shadow-sm dark:border-white/10 dark:from-night-raised dark:to-night">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="text-green-600 dark:text-green-400" size={20} />
              Core Founders Direct Access
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Every message goes directly to founders <strong>Abu Hurera Junejo</strong> (Roll No: 2K23/BLCS/05) and <strong>Abrar Ali</strong> (Roll No: 2K23/BLCS/03).
              Whether you are an individual smallholder farmer or managing commercial acreage, we assist you directly with hardware firmware and agronomy integration.
            </p>
            <div className="mt-4 border-t border-green-200/60 dark:border-white/10 pt-4 space-y-3 text-xs">
              <div className="text-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Abu Hurera Junejo</span>
                  <span className="rounded-md bg-green-100 dark:bg-green-950/70 text-green-800 dark:text-green-300 px-2 py-0.5 text-[11px] font-mono font-semibold">2K23/BLCS/05</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Gmail: <a href="mailto:junejoabuhurera52@gmail.com" className="hover:underline text-green-600 dark:text-green-400">junejoabuhurera52@gmail.com</a>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Role: Lead IoT Architect &amp; Software Lead</p>
              </div>

              <div className="text-slate-700 dark:text-slate-300 pt-1 border-t border-green-100 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Abrar Ali</span>
                  <span className="rounded-md bg-green-100 dark:bg-green-950/70 text-green-800 dark:text-green-300 px-2 py-0.5 text-[11px] font-mono font-semibold">2K23/BLCS/03</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Gmail: <a href="mailto:abraralimemeon23@gmail.com" className="hover:underline text-green-600 dark:text-green-400">abraralimemeon23@gmail.com</a>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Role: Field Operations &amp; Agronomy Advisory Lead</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-night-raised">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="text-cyan-600 dark:text-cyan-400" size={20} />
              Common Inquiries
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                <span>Firmware flashing assistance for ESP32 DevKit v1</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                <span>Capacitive soil moisture dry/wet ADC calibration values</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                <span>Setting up Twilio WhatsApp Sandbox & Gmail App Passwords</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                <span>Bulk seed and fertilizer verification on the Marketplace</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* =========================================================
          FAQ ACCORDION SECTION
      ========================================================= */}
      <section className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-10 shadow-sm dark:border-white/10 dark:bg-night-raised">
        <div className="max-w-2xl mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
            Self-Help & Guidance
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quick answers about hardware calibration, simulation mode, and automated irrigation.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 transition-colors dark:border-white/5 dark:bg-white/5"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-4 text-left transition hover:bg-slate-100/50 dark:hover:bg-white/10"
                >
                  <span className="text-sm font-semibold text-slate-900 dark:text-white pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-200/40 p-4 pt-2 text-xs leading-relaxed text-slate-600 dark:border-white/10 dark:text-slate-300">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
