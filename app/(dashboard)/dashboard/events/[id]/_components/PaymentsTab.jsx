// app/(dashboard)/dashboard/events/[id]/_components/PaymentsTab.jsx
import { CreditCard, Download, Clock, CheckCircle, AlertCircle } from "lucide-react"

const statusIcons = {
  paid: CheckCircle,
  pending: Clock,
  overdue: AlertCircle,
  refunded: CheckCircle,
}

const statusColors = {
  paid: "text-green-500",
  pending: "text-yellow-500",
  overdue: "text-red-500",
  refunded: "text-blue-500",
}

export default function PaymentsTab({ payments }) {

  const totalPaid = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  const totalOutstanding = payments
    .filter(p => p.status === "pending" || p.status === "overdue")
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  return (
    <div className="space-y-6">

      {/* summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-1">Total paid</p>
          <p className="text-2xl font-semibold text-green-600">
            LKR {totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-1">Outstanding</p>
          <p className="text-2xl font-semibold text-[#001B3C]">
            LKR {totalOutstanding.toLocaleString()}
          </p>
        </div>
      </div>

      {/* payments list */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="font-serif text-lg text-[#001B3C] font-semibold mb-5">
          Payment schedule
        </h3>

        {payments.length === 0 ? (
          <div className="text-center py-10">
            <CreditCard size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No payments yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => {
              const Icon = statusIcons[payment.status] || Clock
              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-5 bg-[#F7F9FB] rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <Icon size={20} className={statusColors[payment.status]} />
                    <div>
                      <p className="text-sm font-semibold text-[#001B3C] capitalize">
                        {payment.type} payment
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Due {new Date(payment.due_date).toLocaleDateString("en-US", {
                          month: "long", day: "numeric", year: "numeric"
                        })}
                        {payment.paid_at && ` · Paid ${new Date(payment.paid_at).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#001B3C]">
                        LKR {parseFloat(payment.amount).toLocaleString()}
                      </p>
                      <span className={`text-xs font-medium capitalize ${statusColors[payment.status]}`}>
                        {payment.status}
                      </span>
                    </div>

                    {payment.status === "pending" || payment.status === "overdue" ? (
                      <button className="bg-[#001B3C] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#1F477B] transition-colors">
                        Pay now
                      </button>
                    ) : payment.invoice_url ? (
                      
                       <a href={payment.invoice_url}
                        className="flex items-center gap-1 text-xs text-[#1F477B] hover:underline"
                      >
                        <Download size={13} /> Invoice
                      </a>
                    ) : null}

                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}