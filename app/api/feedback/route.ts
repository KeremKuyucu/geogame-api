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
    const { sebep, message, isim, uid } = body

    // Gelen mesajı kontrol et
    if (!message) {
      return NextResponse.json({ error: "Mesaj boş olamaz." }, { status: 400 })
    }

    if (!isim || !uid) {
      return NextResponse.json({ error: "Kullanıcı bilgileri eksik." }, { status: 400 })
    }

    // Embed mesajı tanımla
    const embed = {
      title: "📩 Yeni Geri Bildirim",
      color: 0x2ecc71, // Yeşil renk
      fields: [
        { name: "🔎 Nedeni", value: sebep || "Belirtilmedi", inline: false },
        { name: "📧 Mesaj", value: "```" + message + "```", inline: false },
        { name: "👤 Kullanıcı", value: `**İsim:** ${isim}\n**UID:** \`${uid}\``, inline: false },
      ],
      footer: {
        text: "GeoGame Geri Bildirim",
        icon_url: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/logo.png?v=1740170623412",
      },
      timestamp: new Date(),
    }

    // Discord'a mesaj gönder
    if (process.env.BOT_TOKEN && process.env.FEEDBACK) {
      await sendMessageToDiscord("<@&1329211479219634247>", process.env.FEEDBACK, embed)
    } else {
      console.warn("Discord mesajı gönderilemedi: BOT_TOKEN veya FEEDBACK çevre değişkeni eksik")
    }

    return NextResponse.json({ success: true, message: "Mesaj başarıyla gönderildi!" })
  } catch (error: any) {
    console.error("API hatası:", error)
    return NextResponse.json({ error: error.message || "Bir hata oluştu" }, { status: 500 })
  }
}
