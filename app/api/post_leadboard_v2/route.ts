import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { updateUserInDatabase } from "@/lib/database"

// Discord mesaj gönderme fonksiyonu
const sendMessageToDiscord = async (message: string, channelId: string, embed: any = null) => {
  if (!process.env.BOT_TOKEN) {
    console.warn("BOT_TOKEN çevre değişkeni tanımlanmamış")
    return
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
  } catch (error: any) {
    console.error("Mesaj gönderilemedi:", error.response?.data || error.message)
    throw error
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

    // In-memory veritabanını güncelle
    updateUserInDatabase(obj)

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
        { name: "🌍 Ülke", value: obj.ulke, inline: true },
        { name: "📊 Toplam Puan", value: obj.toplampuan, inline: true },
        { name: "📊 Sürümü", value: obj.surum, inline: true },
        {
          name: "Mesafe",
          value: `✅ Doğru: ${obj.mesafedogru}\n❌ Yanlış: ${obj.mesafeyanlis}\n📊 Puan: ${obj.mesafepuan}`,
          inline: true,
        },
        {
          name: "Bayrak",
          value: `✅ Doğru: ${obj.bayrakdogru}\n❌ Yanlış: ${obj.bayrakyanlis}\n📊 Puan: ${obj.bayrakpuan}`,
          inline: true,
        },
        {
          name: "Başkent",
          value: `✅ Doğru: ${obj.baskentdogru}\n❌ Yanlış: ${obj.baskentyanlis}\n📊 Puan: ${obj.baskentpuan}`,
          inline: true,
        },
      ],
      thumbnail: {
        url: obj.profilurl, // Kullanıcı profil fotoğrafı
      },
      footer: {
        text: "GeoGame Puan Tablosu",
        icon_url: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/logo.png?v=1740170623412",
      },
      timestamp: new Date(),
    }

    // Discord'a mesaj gönder
    if (process.env.BOT_TOKEN && process.env.PUAN_LOG) {
      await sendMessageToDiscord("", process.env.PUAN_LOG, embed)
    }

    return NextResponse.json({ success: true, message: "Puan başarıyla güncellendi ve Discord'a gönderildi!" })
  } catch (error: any) {
    console.error("API hatası:", error)
    return NextResponse.json({ error: error.message || "Bir hata oluştu" }, { status: 500 })
  }
}
