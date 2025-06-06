import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"

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

    // JSON içeriğini ayrıştır
    let logData
    try {
      logData = JSON.parse(message)
    } catch (error) {
      console.error("Gelen mesaj JSON formatında değil:", error)
      return NextResponse.json({ error: "Geçersiz JSON formatı." }, { status: 400 })
    }

    // Embed mesajı tanımla
    const embed = {
      title: "🌍 Yeni Ülke Logu",
      color: 0x3498db, // Mavi renk
      fields: [
        {
          name: "👤 Oyuncu",
          value: `**İsim:** ${logData.name || "Bilinmiyor"}\n**UID:** \`${logData.uid || "Bilinmiyor"}\``,
          inline: false,
        },
        { name: "🎮 Oyun Modu", value: logData.oyunmodu || "Bilinmiyor", inline: true },
        { name: "📝 Mesaj", value: `\`\`\`${logData.mesaj || "Mesaj yok"}\`\`\``, inline: false },
        { name: "✅ Doğru Cevap", value: logData.dogrucevap || "Belirtilmedi", inline: true },
        { name: "❌ Verilen Cevap", value: logData.verilencevap || "Boş", inline: true },
        { name: "🟢 Yeşil", value: logData.yesil || "Belirtilmedi", inline: true },
        { name: "🟡 Sarı", value: logData.sari || "Belirtilmedi", inline: true },
        { name: "🔵 Mavi", value: logData.mavi || "Belirtilmedi", inline: true },
        { name: "🔴 Kırmızı", value: logData.kirmizi || "Belirtilmedi", inline: true },
      ],
      footer: {
        text: "GeoGame Ülke Logu",
        icon_url: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/logo.png?v=1740170623412",
      },
      timestamp: new Date(),
    }

    // Discord'a mesaj gönder
    if (process.env.BOT_TOKEN && process.env.SECILEN_ULKE_LOG) {
      await sendMessageToDiscord(" ", process.env.SECILEN_ULKE_LOG, embed)
    } else {
      console.warn("Discord mesajı gönderilemedi: BOT_TOKEN veya SECILEN_ULKE_LOG çevre değişkeni eksik")
    }

    return NextResponse.json({ success: true, message: "Log başarıyla gönderildi!" })
  } catch (error: any) {
    console.error("API hatası:", error)
    return NextResponse.json({ error: error.message || "Bir hata oluştu" }, { status: 500 })
  }
}
