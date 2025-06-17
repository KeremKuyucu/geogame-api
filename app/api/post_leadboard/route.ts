import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { syncDatabaseFromDiscord, uploadDatabaseToDiscord, updateUserInDatabase } from "@/lib/database-sync"

// Discord mesaj gönderme fonksiyonu
const sendMessageToDiscord = async (message: string, channelId: string, embed: any = null) => {
  if (!process.env.BOT_TOKEN) {
    console.warn("BOT_TOKEN çevre değişkeni tanımlanmamış")
    return false
  }

  if (!channelId || typeof channelId !== "string" || channelId.trim() === "") {
    console.error("Geçersiz kanal kimliği.")
    throw new Error("Geçersiz kanal kimliği.")
  }

  try {
    await axios.post(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      {
        content: message,
        embeds: embed ? [embed] : [],
      },
      {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    )
    console.log("Mesaj başarıyla gönderildi!")
    return true
  } catch (error: any) {
    console.error("Mesaj gönderilemedi:", error.response?.data || error.message)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    // Gelen mesajı kontrol et
    if (!message) {
      return NextResponse.json({ error: "Mesaj boş olamaz." }, { status: 400 })
    }

    let obj
    try {
      obj = JSON.parse(message)
    } catch (error) {
      console.error("Gelen mesaj JSON formatında değil:", error)
      return NextResponse.json({ error: "Geçersiz JSON formatı." }, { status: 400 })
    }

    console.log("🔄 Discord'dan veritabanı indiriliyor...")

    // 1. Discord'dan mevcut veritabanını indir
    const database = await syncDatabaseFromDiscord()

    console.log("📝 Kullanıcı verisi güncelleniyor...")

    // 2. Kullanıcı verisini güncelle
    const updatedDatabase = updateUserInDatabase(database, obj)

    console.log("📤 Güncellenmiş veritabanı Discord'a yükleniyor...")

    // 3. Güncellenmiş veritabanını Discord'a yükle
    const uploadSuccess = await uploadDatabaseToDiscord(updatedDatabase)

    // Discord embed mesajı oluştur
    const embed = {
      title: "🏆 Yeni Puan Logu",
      color: 0x2ecc71, // Yeşil renk
      fields: [
        {
          name: "👤 Oyuncu",
          value: `**İsim:** ${obj.name || "Bilinmiyor"}\n**UID:** \`${obj.uid || "Bilinmiyor"}\``,
          inline: false,
        },
        { name: "🌍 Ülke", value: obj.ulke || "Belirtilmedi", inline: true },
        { name: "📊 Toplam Puan", value: obj.toplampuan || 0, inline: true },
        { name: "📊 Sürümü", value: obj.surum || "Belirtilmedi", inline: true },
        {
          name: "Mesafe",
          value: `✅ Doğru: ${obj.mesafedogru || 0}\n❌ Yanlış: ${obj.mesafeyanlis || 0}\n📊 Puan: ${obj.mesafepuan || 0}`,
          inline: true,
        },
        {
          name: "Bayrak",
          value: `✅ Doğru: ${obj.bayrakdogru || 0}\n❌ Yanlış: ${obj.bayrakyanlis || 0}\n📊 Puan: ${obj.bayrakpuan || 0}`,
          inline: true,
        },
        {
          name: "Başkent",
          value: `✅ Doğru: ${obj.baskentdogru || 0}\n❌ Yanlış: ${obj.baskentyanlis || 0}\n📊 Puan: ${obj.baskentpuan || 0}`,
          inline: true,
        },
      ],
      thumbnail: {
        url:
          obj.profilurl || "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/2815428.png?v=1738114346363",
      },
      footer: {
        text: "GeoGame Puan Tablosu",
        icon_url: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/logo.png?v=1740170623412",
      },
      timestamp: new Date(),
    }

    const discordResults = {
      pointLog: false,
      leaderboard: false,
      fileUpload: uploadSuccess,
    }

    // Discord'a puan logu gönder
    if (process.env.BOT_TOKEN && process.env.PUAN_LOG) {
      try {
        const result = await sendMessageToDiscord("", process.env.PUAN_LOG, embed)
        discordResults.pointLog = result
      } catch (error) {
        console.error("Puan logu gönderilemedi:", error)
      }
    }

    try {
      const analyticsResponse = await axios.post('http://analytics.keremkk.com.tr/api/analytics', {
        appId: 'geogame', // Veya obj içinden uygun değer
        userId: obj.uid || 'unknown',
        endpoint: '/game/score', // İstersen endpoint özelleştirilebilir
      })

      if (analyticsResponse.status === 200 || analyticsResponse.status === 201) {
        console.log('Analytics servisine veri gönderildi.')
        discordResults.analyticsPost = true
      } else {
        console.warn('Analytics servisine gönderim başarısız:', analyticsResponse.status)
      }
    } catch (error) {
      console.error('Analytics servisine gönderim hatası:', error)
    }
    
    return NextResponse.json({
      success: true,
      message: "İşlem tamamlandı",
      discord: discordResults,
      databaseSynced: true,
    })
  } catch (error: any) {
    console.error("API hatası:", error)
    return NextResponse.json({ error: error.message || "Bir hata oluştu" }, { status: 500 })
  }
}
