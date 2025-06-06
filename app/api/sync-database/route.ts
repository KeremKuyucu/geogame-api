import { type NextRequest, NextResponse } from "next/server"
import { syncDatabaseFromDiscord, uploadDatabaseToDiscord } from "@/lib/database-sync"

export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Discord'dan veritabanı senkronizasyonu başlatılıyor...")

    // Discord'dan güncel veritabanını indir
    const database = await syncDatabaseFromDiscord()

    return NextResponse.json({
      success: true,
      message: "Veritabanı başarıyla senkronize edildi",
      totalUsers: database.users?.length || 0,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Senkronizasyon hatası:", error)
    return NextResponse.json({ error: error.message || "Senkronizasyon hatası" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { database } = body

    if (!database) {
      return NextResponse.json({ error: "Veritabanı verisi gerekli" }, { status: 400 })
    }

    console.log("📤 Veritabanı Discord'a yükleniyor...")

    // Veritabanını Discord'a yükle
    const uploadSuccess = await uploadDatabaseToDiscord(database)

    if (uploadSuccess) {
      return NextResponse.json({
        success: true,
        message: "Veritabanı başarıyla Discord'a yüklendi",
        lastUpdated: new Date().toISOString(),
      })
    } else {
      return NextResponse.json({ error: "Veritabanı Discord'a yüklenemedi" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Yükleme hatası:", error)
    return NextResponse.json({ error: error.message || "Yükleme hatası" }, { status: 500 })
  }
}
