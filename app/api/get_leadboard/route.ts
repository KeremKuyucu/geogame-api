import { type NextRequest, NextResponse } from "next/server"
import { syncDatabaseFromDiscord } from "@/lib/database-sync"

export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Discord'dan güncel veritabanı indiriliyor...")

    // Discord'dan güncel veritabanını indir
    const database = await syncDatabaseFromDiscord()

    // Kullanıcıları puana göre sırala
    const sortedUsers = [...database.users].sort((a, b) => (Number(b.puan) || 0) - (Number(a.puan) || 0))

    const responseData = {
      users: sortedUsers,
      totalUsers: sortedUsers.length,
      lastUpdated: new Date().toISOString(),
      source: "discord",
    }

    return new NextResponse(JSON.stringify(responseData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="geogame_leaderboard.json"',
      },
    })
  } catch (error: any) {
    console.error("Veritabanı okuma hatası:", error)

    // Hata durumunda varsayılan veri döndür
    const fallbackData = {
      users: [],
      totalUsers: 0,
      lastUpdated: new Date().toISOString(),
      source: "fallback",
      error: "Discord'dan veri alınamadı",
    }

    return new NextResponse(JSON.stringify(fallbackData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="geogame_leaderboard_fallback.json"',
      },
    })
  }
}
