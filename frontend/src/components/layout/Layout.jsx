import Sidebar from './Sidebar'
import Header from './Header'
import useStore from '../../store/useStore'

export default function Layout({ children }) {
  const { sidebarOpen } = useStore()

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-[#0e1712]">
      <Sidebar />

      {/* ✅ Dynamic margin-left based on sidebar state */}
      <div
        className={`
          flex min-w-0 flex-1 flex-col overflow-hidden
          transition-all duration-300
          ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-[76px]'}
        `}
      >
        <Header />

        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 dark:bg-[#0e1712]">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}