import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const database = getDatabase()

    // Kullanıcıları puana göre sırala
    const sortedUsers = [...database.users].sort((a, b) => b.puan - a.puan)

    const responseData = {
      users: sortedUsers,
      totalUsers: sortedUsers.length,
      lastUpdated: new Date().toISOString(),
    }

    return new NextResponse(JSON.stringify(responseData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="geogame_leaderboard.json"',
      },
    })
  } catch (error: any) {
    console.error("Veritabanı okuma hatası:", error)
    return NextResponse.json({ error: error.message || "Veritabanı okunamadı" }, { status: 500 })
  }
}
