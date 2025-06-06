import { NextResponse } from "next/server"
import { syncDatabaseFromDiscord } from "@/lib/database-sync"

export async function GET() {
  try {
    console.log("📊 Discord'dan güncel veriler alınıyor...")

    // Discord'dan güncel veritabanını indir
    const database = await syncDatabaseFromDiscord()

    if (!database || !database.users) {
      return NextResponse.json({
        totalUsers: 0,
        activeUsers: 0,
        totalPoints: 0,
        averagePoints: 0,
        topPlayer: null,
        source: "discord",
        error: "Veri bulunamadı",
      })
    }

    // Kullanıcı verilerini normalize et
    const users = database.users.map((user: any) => ({
      ...user,
      puan: Number(user.puan) || 0,
      mesafepuan: Number(user.mesafepuan) || 0,
      bayrakpuan: Number(user.bayrakpuan) || 0,
      baskentpuan: Number(user.baskentpuan) || 0,
    }))

    // İstatistikleri hesapla
    const totalUsers = users.length
    const activeUsers = users.filter((user: any) => user.puan > 0).length
    const totalPoints = users.reduce((sum: number, user: any) => sum + user.puan, 0)
    const averagePoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0

    // En yüksek puanlı oyuncuyu bul
    const topPlayer = users.reduce(
      (top: any, user: any) => (user.puan > (top?.puan || 0) ? user : top),
      users[0] || null,
    )

    const stats = {
      totalUsers,
      activeUsers,
      totalPoints,
      averagePoints,
      topPlayer: topPlayer
        ? {
            name: topPlayer.name,
            puan: topPlayer.puan,
            profilurl: topPlayer.profilurl,
            uid: topPlayer.uid,
          }
        : null,
      source: "discord",
      lastUpdated: new Date().toISOString(),
    }

    console.log("📊 İstatistikler hesaplandı:", {
      totalUsers: stats.totalUsers,
      activeUsers: stats.activeUsers,
      topPlayer: stats.topPlayer?.name,
    })

    return NextResponse.json(stats)
  } catch (error: any) {
    console.error("İstatistik hatası:", error)

    // Hata durumunda boş istatistikler döndür
    return NextResponse.json(
      {
        totalUsers: 0,
        activeUsers: 0,
        totalPoints: 0,
        averagePoints: 0,
        topPlayer: null,
        source: "error",
        error: error.message || "İstatistikler alınamadı",
        lastUpdated: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
