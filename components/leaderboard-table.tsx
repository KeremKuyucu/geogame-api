"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"

interface User {
  name: string
  uid: string
  profilurl: string
  puan: number
  mesafepuan: number
  bayrakpuan: number
  baskentpuan: number
}

interface LeaderboardData {
  users: User[]
  totalUsers: number
  lastUpdated: string
  source: string
  error?: string
}

export default function LeaderboardTable() {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchLeaderboard = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    else setLoading(true)

    try {
      const response = await fetch("/api/leaderboard", {
        cache: "no-store", // Her zaman fresh data al
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error("Skor tablosu alınamadı")
      }

      const responseData = await response.json()
      setData(responseData)
    } catch (err) {
      console.error("Leaderboard fetch error:", err)
      setData({
        users: [],
        totalUsers: 0,
        lastUpdated: new Date().toISOString(),
        source: "error",
        error: err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const handleRefresh = () => {
    fetchLeaderboard(true)
  }

  if (loading) {
    return (
      <Card className="border-gray-200">
        <CardContent>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
            <span className="text-gray-500">Skor tablosu yükleniyor...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data?.error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Hata</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{data.error}</p>
          <Button onClick={handleRefresh} className="mt-4" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tekrar Dene
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>🏆 GeoGame Skor Tablosu</CardTitle>
            <Badge variant="outline" className="ml-2">
              {data?.totalUsers || 0} Oyuncu
            </Badge>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Yenileniyor..." : "Yenile"}
          </Button>
        </div>
        {data?.lastUpdated && (
          <p className="text-sm text-gray-500">
            Son güncelleme: {new Date(data.lastUpdated).toLocaleTimeString("tr-TR")}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Sıra</TableHead>
              <TableHead>Oyuncu</TableHead>
              <TableHead className="text-right">Toplam Puan</TableHead>
              <TableHead className="text-right">Mesafe</TableHead>
              <TableHead className="text-right">Bayrak</TableHead>
              <TableHead className="text-right">Başkent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.users && data.users.length > 0 ? (
              data.users.map((user, index) => (
                <TableRow key={user.uid || index}>
                  <TableCell className="font-medium">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    {user.profilurl && (
                      <img
                        src={user.profilurl || "/placeholder.svg"}
                        alt={`${user.name} profil resmi`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    {user.name}
                  </TableCell>
                  <TableCell className="text-right font-bold">{user.puan.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{user.mesafepuan.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{user.bayrakpuan.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{user.baskentpuan.toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Henüz kullanıcı verisi yok
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
