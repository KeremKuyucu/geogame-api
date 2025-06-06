import LeaderboardTable from "@/components/leaderboard-table"

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">GeoGame Skor Tablosu</h1>
      <LeaderboardTable />
    </div>
  )
}
