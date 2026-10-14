import React from 'react'
import { Link } from 'react-router-dom'
import {
  Sprout,
  Cpu,
  Droplets,
  ShieldCheck,
  HeartHandshake,
  Users,
  Radio,
  BellRing,
  ShoppingBag,
  CloudSun,
  Mail,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
} from 'lucide-react'
import FarmerAvatar from '../components/common/FarmerAvatar'
import { useAuthContext } from '../context/AuthContext'

export default function About() {
  const { isAuthenticated } = useAuthContext()
  const founders = [
    {
      name: 'Abu Hurera Junejo',
      rollNo: '2K23/BLCS/05',
      role: 'Founder & Lead System Architect',
      title: 'Full-Stack & IoT Systems Engineer',
      email: 'junejoabuhurera52@gmail.com',
      avatarInitial: 'AH',
      badge: 'System Architect',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
      description:
        'Architected and engineered the end-to-end AsanKisan ecosystem — from ESP32 embedded firmware, telemetry ingestion, and automated irrigation engine to Spring Boot microservices, multi-channel alert dispatchers (Gmail, SMS, WhatsApp), and the responsive farmer portal.',
      skills: ['Microservices Architecture', 'ESP32 IoT Firmware', 'Spring Boot 3', 'React & Tailwind', 'Distributed Systems'],
    },
    {
      name: 'Abrar Ali',
      rollNo: '2K23/BLCS/03',
      role: 'Co-Founder & Operations Lead',
      title: 'Agricultural Operations & Product Strategy',
      email: 'abraralimemeon23@gmail.com',
      avatarInitial: 'AB',
      badge: 'Product & Field Lead',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      description:
        'Leads field research with local farming communities, sensor testing in varied soil compositions, agronomy advisory frameworks, and marketplace vendor onboarding. Focused on making complex tech dead-simple and affordable for everyday farmers.',
      skills: ['Agronomy Research', 'Field Deployment', 'Marketplace Logistics', 'Farmer Community Outreach', 'Product Growth'],
    },
  ]

  const milestones = [
    {
      year: 'Vision',
      title: 'The Challenge',
      desc: 'Groundwater depletion, unpredictable rainfall, high electricity/fuel costs for water pumps, and middlemen exploitation leave farmers struggling.',
    },
    {
      year: 'Innovation',
      title: 'Low-Cost IoT Hardware',
      desc: 'Engineered an accessible ESP32 telemetry node that reads soil moisture, ambient temperature/humidity, rainfall, and water reservoir levels with automated relay control.',
    },
    {
      year: 'Intelligence',
      title: 'Multi-Channel Alert Dispatch',
      desc: 'Delivered instant safety notifications directly to farmers via Gmail, SMS, and WhatsApp so no crop dies of thirst and no pump runs dry.',
    },
    {
      year: 'Community',
      title: 'Fair Trade Marketplace',
      desc: 'Created an open direct-to-buyer platform enabling farmers to sell harvest and buy authentic seeds and fertilizers without intermediaries.',
    },
  ]

  const pillars = [
    {
      icon: Droplets,
      title: 'Smart Automated Irrigation',
      desc: 'Automates water pumps based on calibrated capacitive soil moisture and rain detection. Includes dry-run safety shutoff when tank level is below 15%.',
      color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40',
    },
    {
      icon: BellRing,
      title: 'Multi-Channel Alerts',
      desc: 'Instant push alerts, styled Gmail notifications, phone SMS, and WhatsApp messages when soil is dry, rain is detected, or pump state changes.',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      icon: ShoppingBag,
      title: 'Direct Farmer Marketplace',
      desc: 'Connects growers with verified buyers across the country. Eliminates brokers, reduces price gouging, and ensures farm-fresh produce delivery.',
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
    },
    {
      icon: CloudSun,
      title: 'Micro-Climate Weather',
      desc: 'Live localized meteorological tracking with 5-day forecasts, evapotranspiration indicators, and crop-specific sowing & harvest guidelines.',
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
    },
    {
      icon: Radio,
      title: 'Plug-and-Play ESP32 Telemetry',
      desc: 'Lightweight IoT firmware designed to operate on Wi-Fi or cellular GSM hotspots with automated offline caching and reconnection.',
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40',
    },
    {
      icon: HeartHandshake,
      title: 'Farmer-First Usability',
      desc: 'Designed with high accessibility, bilingual English and Urdu terminology, high contrast visuals, and intuitive controls for all skill levels.',
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40',
    },
  ]

  return (
    <div className="space-y-12 pb-16">
      {/* =========================================================
          HERO BANNER
      ========================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-900 via-emerald-800 to-teal-950 p-8 sm:p-12 text-white shadow-xl">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-lime-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <FarmerAvatar size={58} withRing animated />
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-400/20 px-3 py-1 text-xs font-semibold text-lime-300 ring-1 ring-lime-400/30">
                <Sparkles size={13} />
                آسان کسان • Kisan Ka Digital Sathi
              </span>
              <p className="text-xs text-green-100/70 mt-0.5">Empowering Farmers with Precision IoT & Fair Trade</p>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            About <span className="text-lime-300">AsanKisan</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
            AsanKisan was built with a singular mission: to make modern smart agriculture simple,
            affordable, and accessible to every farmer. By pairing low-cost IoT sensor telemetry
            with automated irrigation and a direct-to-buyer marketplace, we help growers save water,
            protect their crops, and maximize harvest profits.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-emerald-950 shadow-md transition-all hover:bg-lime-300 hover:shadow-lg active:scale-95"
              >
                <Cpu size={16} />
                Open IoT Dashboard
              </Link>
            ) : (
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-emerald-950 shadow-md transition-all hover:bg-lime-300 hover:shadow-lg active:scale-95"
              >
                <ShoppingBag size={16} />
                Explore Marketplace
              </Link>
            )}
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 transition-all hover:bg-white/20 active:scale-95"
            >
              <PhoneCall size={16} />
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOUNDERS SECTION (Abu Hurera Junejo & Abrar)
      ========================================================= */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
            <Users size={14} /> The Team Behind AsanKisan
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Meet the Founders
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Driven by a shared commitment to modernize farming through indigenous technology and farmer empowerment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {founders.map((f) => (
            <div
              key={f.name}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:shadow-md hover:border-green-500/40 dark:border-white/10 dark:bg-night-raised"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-800 text-xl font-bold text-white shadow-md ring-2 ring-emerald-500/20">
                  {f.avatarInitial}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{f.name}</h3>
                    <span className="rounded-md bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                      Roll No: {f.rollNo}
                    </span>
                    <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${f.badgeColor}`}>
                      {f.badge}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-green-600 dark:text-green-400 mt-0.5">
                    {f.role}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {f.title}
                  </p>

                  <a
                    href={`mailto:${f.email}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-green-600 dark:text-slate-300 dark:hover:text-green-400 transition-colors"
                  >
                    <Mail size={13} />
                    <span>{f.email}</span>
                  </a>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {f.description}
              </p>

              <div className="mt-5 border-t border-slate-100 dark:border-white/10 pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Areas of Expertise
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {f.skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-white/5 dark:text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          OUR CORE PILLARS
      ========================================================= */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
            <Award size={14} /> Full Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Why AsanKisan is Different
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Most agricultural systems stop at simple charts. AsanKisan unifies live hardware automation, emergency notifications, and national market trade in one place.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-night-raised"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${p.color}`}>
                <p.icon size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          MISSION & JOURNEY TIMELINE
      ========================================================= */}
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-8 sm:p-10 shadow-sm dark:border-white/10 dark:from-night-raised dark:to-night">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
            Evolution & Roadmap
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            How AsanKisan Came to Life
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            From humble prototypes with breadboards and soil sensors to an enterprise microservices agricultural cloud.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div key={m.title} className="relative space-y-2 border-l-2 border-green-500/30 pl-4 sm:pl-5">
              <span className="text-xs font-bold uppercase text-green-600 dark:text-green-400">
                Phase {idx + 1}: {m.year}
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{m.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          CALL TO ACTION
      ========================================================= */}
      <section className="rounded-3xl bg-emerald-800 text-white p-8 sm:p-10 text-center relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <FarmerAvatar size={50} withRing className="mx-auto" />
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to Smarten Your Farm?
          </h3>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Connect your ESP32 node or simulate live telemetry, set your irrigation thresholds,
            and keep full control of your crops right from your phone.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3 text-sm font-bold text-emerald-950 shadow-md transition-all hover:bg-lime-300"
              >
                Go to Dashboard <ArrowRight size={15} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3 text-sm font-bold text-emerald-950 shadow-md transition-all hover:bg-lime-300"
              >
                Sign In to Farm System <ArrowRight size={15} />
              </Link>
            )}
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 transition-all hover:bg-white/20"
            >
              Talk with Founders
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
