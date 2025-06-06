import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, MessageSquare, LogIn, Globe, Database, DiscIcon as Discord, Code } from "lucide-react"
import ApiTester from "@/components/api-tester"
import Link from "next/link"
import LeaderboardTable from "@/components/leaderboard-table"
import DatabaseStats from "@/components/database-stats"

export default function GeoGameAPIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">GeoGame</h1>
          </div>
          <div className="mt-4">
            <Link
              href="/leaderboard"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Skor Tablosunu Görüntüle
            </Link>
          </div>
        </div>

        {/* Database Statistics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Veritabanı İstatistikleri</h2>
          <DatabaseStats />
        </div>
        
        {/* Live Leaderboard */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Canlı Skor Tablosu</h2>
          <LeaderboardTable />
        </div>
      </div>
    </div>
  )
}
