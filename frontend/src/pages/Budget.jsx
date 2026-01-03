export default function Budget() {
  return (
    <div className="min-h-screen w-full bg-slate-50">

      {/* ================= NAVBAR ================= */}
      <div className="w-full bg-white border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold text-blue-600">
            GlobeTrotter
          </h1>

          <div className="hidden md:flex gap-6 text-sm text-slate-600">
            <span>Dashboard</span>
            <span>Trips</span>
            <span className="font-semibold text-blue-600">Budget</span>
            <span>Map</span>
          </div>
        </div>
      </div>

      {/* ================= PAGE CONTENT ================= */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8 space-y-8">

        {/* ---------- HEADER ---------- */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">
              Summer in Kyoto Budget
            </h2>
            <p className="text-sm text-slate-500">
              Aug 12 – Aug 24, 2024
            </p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-md border text-sm">
              Export
            </button>
            <button className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm">
              + Add Expense
            </button>
          </div>
        </div>

        {/* ---------- ALERT ---------- */}
        <div className="flex gap-3 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
          <span className="text-red-500">⚠️</span>
          <div>
            <p className="font-medium text-red-700">
              Over Budget Alert
            </p>
            <p className="text-sm text-red-600">
              You have exceeded your daily average limit ($270) for 3 days in a row.
            </p>
          </div>
        </div>

        {/* ---------- SUMMARY CARDS ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ["Total Budget", "$5,000.00", "bg-blue-600", "w-full"],
            ["Total Spent", "$3,250.00", "bg-orange-500", "w-2/3"],
            ["Remaining", "$1,750.00", "bg-green-500", "w-1/3"],
            ["Daily Average", "$270.83", "bg-purple-500", "w-1/2"],
          ].map(([title, value, color, width]) => (
            <div
              key={title}
              className="bg-white rounded-xl border p-5"
            >
              <p className="text-sm text-slate-500">{title}</p>
              <h3 className="text-2xl font-semibold mt-2">{value}</h3>
              <div className="h-1 bg-slate-200 rounded mt-4">
                <div className={`h-1 ${color} rounded ${width}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- BREAKDOWN + TABLE ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* COST BREAKDOWN */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">Cost Breakdown</h3>

            <div
              className="relative mx-auto w-44 h-44 rounded-full"
              style={{
                background:
                  "conic-gradient(#2563eb 0% 37%, #22c55e 37% 83%, #facc15 83% 100%)",
              }}
            >
              <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-slate-400">TOTAL</p>
                  <p className="font-semibold">$3,250</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <p className="flex justify-between">
                <span>Transport</span>
                <span>$1,200 (37%)</span>
              </p>
              <p className="flex justify-between">
                <span>Accommodation</span>
                <span>$1,500 (46%)</span>
              </p>
              <p className="flex justify-between">
                <span>Activities & Food</span>
                <span>$550 (17%)</span>
              </p>
            </div>
          </div>

          {/* TRANSACTIONS */}
          <div className="lg:col-span-2 bg-white rounded-xl border">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="font-semibold">Recent Transactions</h3>
              <button className="text-sm text-blue-600">View All</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    ["Aug 14, 2024", "Bullet Train (Shinkansen)", "Transport", "$185.00"],
                    ["Aug 14, 2024", "Airbnb Tokyo - 3 Nights", "Accommodation", "$450.00"],
                    ["Aug 13, 2024", "Sushi Dinner (Omakase)", "Activities & Food", "$120.00"],
                    ["Aug 13, 2024", "TeamLab Planets Tickets", "Activities & Food", "$64.00"],
                    ["Aug 12, 2024", "Airport Limousine Bus", "Transport", "$22.00"],
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="p-3">{row[0]}</td>
                      <td className="p-3">{row[1]}</td>
                      <td className="p-3">{row[2]}</td>
                      <td className="p-3 text-right font-medium">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ---------- FOOTER ---------- */}
        <div className="flex justify-between text-sm text-slate-500 pt-6 border-t">
          <p>All prices in USD (converted from JPY approx. ¥145/$1)</p>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Help</span>
          </div>
        </div>
      </div>
    </div>
  );
}
