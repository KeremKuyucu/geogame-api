"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Trophy, Target, TrendingUp, RefreshCw } from "lucide-react"

interface DatabaseStats {
  totalUsers: number
  activeUsers: number
  totalPoints: number
  averagePoints: number
  topPlayer: {
    name: string
    puan: number
    profilurl?: string
    uid?: string
  } | null
  source: string
  lastUpdated: string
  error?: string
}

export default function DatabaseStats() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    else setLoading(true)

    try {
      const response = await fetch("/api/stats", {
        cache: "no-store", // Her zaman fresh data al
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error("İstatistikler alınamadı:", response.status)
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          totalPoints: 0,
          averagePoints: 0,
          topPlayer: null,
          source: "error",
          lastUpdated: new Date().toISOString(),
          error: "Veriler alınamadı",
        })
      }
    } catch (error) {
      console.error("İstatistikler alınamadı:", error)
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        totalPoints: 0,
        averagePoints: 0,
        topPlayer: null,
        source: "error",
        lastUpdated: new Date().toISOString(),
        error: "Bağlantı hatası",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleRefresh = () => {
    fetchStats(true)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Refresh Button and Source Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {stats?.lastUpdated && (
            <span className="text-sm text-gray-500">
              Son güncelleme: {new Date(stats.lastUpdated).toLocaleTimeString("tr-TR")}
            </span>
          )}
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Yenileniyor..." : "Yenile"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {stats?.activeUsers || 0} aktif
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Puan</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.totalPoints || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Tüm oyuncular</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Puan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.averagePoints || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Kullanıcı başına</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En İyi Oyuncu</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats?.topPlayer ? (
              <div className="flex items-center space-x-2">
                {stats.topPlayer.profilurl && (
                  <img
                    src={stats.topPlayer.profilurl || "/placeholder.svg"}
                    alt={stats.topPlayer.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="text-sm font-bold">{stats.topPlayer.name}</div>
                  <div className="text-xs text-muted-foreground">{stats.topPlayer.puan.toLocaleString()} puan</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Veri yok</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error Message */}
      {stats?.error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-sm">⚠️ {stats.error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
