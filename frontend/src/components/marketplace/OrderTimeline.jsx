// import { Check, X, PackageCheck, Truck, ClipboardCheck, Clock, PackageSearch } from 'lucide-react'

// // Standard forward path. Cancelled/Returned/Refunded are shown as a distinct
// // terminal state rather than forced onto this line.
// const STEPS = [
//   { key: 'Pending', label: 'Order Placed', icon: Clock },
//   { key: 'Confirmed', label: 'Confirmed', icon: ClipboardCheck },
//   { key: 'Packed', label: 'Processing', icon: PackageSearch },
//   { key: 'Shipped', label: 'Shipped', icon: Truck },
//   { key: 'Delivered', label: 'Delivered', icon: PackageCheck },
// ]

// export default function OrderTimeline({ status }) {
//   const isTerminalNegative = ['Cancelled', 'Returned', 'Refunded'].includes(status)

//   if (isTerminalNegative) {
//     return (
//       <div className="flex items-center gap-2 text-danger text-sm font-medium py-2">
//         <X size={16} /> Order {status.toLowerCase()}
//       </div>
//     )
//   }

//   const currentIndex = Math.max(0, STEPS.findIndex((s) => s.key === status))

//   return (
//     <div className="flex items-center w-full py-2">
//       {STEPS.map((step, i) => {
//         const done = i <= currentIndex
//         const Icon = step.icon
//         return (
//           <div key={step.key} className="flex items-center flex-1 last:flex-none">
//             <div className="flex flex-col items-center gap-1">
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
//                   done ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
//                 }`}
//               >
//                 {done && i < currentIndex ? <Check size={15} /> : <Icon size={15} />}
//               </div>
//               <span className={`text-[10px] text-center whitespace-nowrap ${done ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
//                 {step.label}
//               </span>
//             </div>
//             {i < STEPS.length - 1 && (
//               <div className={`h-0.5 flex-1 mx-1 -mt-4 ${i < currentIndex ? 'bg-primary' : 'bg-gray-200'}`} />
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )
// }

import {
  Check, X, PackageCheck, Truck, ClipboardCheck, Clock, PackageSearch, Boxes, Bike,
} from 'lucide-react'
import { orderStatusLabel } from '../../utils/constants'

// Forward path through com.smartagri.entity.OrderStatus.
// CANCELLED / RETURN_REQUESTED / RETURNED / REFUNDED are terminal states shown
// separately rather than forced onto this line.
const STEPS = [
  { key: 'PENDING', label: 'Order Placed', icon: Clock },
  { key: 'CONFIRMED', label: 'Confirmed', icon: ClipboardCheck },
  { key: 'PROCESSING', label: 'Processing', icon: PackageSearch },
  { key: 'READY_TO_SHIP', label: 'Ready to Ship', icon: Boxes },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Bike },
  { key: 'DELIVERED', label: 'Delivered', icon: PackageCheck },
]

const TERMINAL = ['CANCELLED', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED']

export default function OrderTimeline({ status }) {
  const current = String(status || 'PENDING').toUpperCase()

  if (TERMINAL.includes(current)) {
    return (
      <div className="flex items-center gap-2 text-danger text-sm font-medium py-2">
        <X size={16} /> {orderStatusLabel[current] || current}
      </div>
    )
  }

  const currentIndex = Math.max(0, STEPS.findIndex((s) => s.key === current))

  return (
    <div className="flex items-start w-full py-2 overflow-x-auto">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex
        const isCurrent = i === currentIndex
        const Icon = step.icon

        return (
          <div key={step.key} className="flex items-start flex-1 last:flex-none min-w-0">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isCurrent
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : done
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {done && !isCurrent ? <Check size={15} /> : <Icon size={15} />}
              </div>
              <span
                className={`text-[10px] text-center leading-tight w-16 ${
                  done ? 'text-gray-700 font-medium' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 mt-4 min-w-[12px] ${
                  i < currentIndex ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
