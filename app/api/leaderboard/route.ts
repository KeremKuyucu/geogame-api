import { type NextRequest, NextResponse } from "next/server"
import { syncDatabaseFromDiscord } from "@/lib/database-sync"

export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Discord'dan güncel veritabanı indiriliyor...")

    // Discord'dan güncel veritabanını indir
    const database = await syncDatabaseFromDiscord()

    // Kullanıcıları puana göre sırala ve sayısal değerlere çevir
    const sortedUsers = [...database.users]
      .map((user) => ({
        ...user,
        puan: Number(user.puan) || 0,
        mesafepuan: Number(user.mesafepuan) || 0,
        bayrakpuan: Number(user.bayrakpuan) || 0,
        baskentpuan: Number(user.baskentpuan) || 0,
        mesafedogru: Number(user.mesafedogru) || 0,
        mesafeyanlis: Number(user.mesafeyanlis) || 0,
        bayrakdogru: Number(user.bayrakdogru) || 0,
        bayrakyanlis: Number(user.bayrakyanlis) || 0,
        baskentdogru: Number(user.baskentdogru) || 0,
        baskentyanlis: Number(user.baskentyanlis) || 0,
      }))
      .sort((a, b) => b.puan - a.puan)

    // Web sayfasında görüntülemek için JSON döndür
    return NextResponse.json({
      users: sortedUsers,
      totalUsers: sortedUsers.length,
      lastUpdated: new Date().toISOString(),
      source: "discord",
    })
  } catch (error: any) {
    console.error("Veritabanı okuma hatası:", error)

    // Hata durumunda boş veri döndür
    return NextResponse.json({
      users: [],
      totalUsers: 0,
      lastUpdated: new Date().toISOString(),
      source: "fallback",
      error: "Discord'dan veri alınamadı",
    })
  }
}
