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
    const { uid, name } = body

    // İsim kontrolü
    if (!name) {
      return NextResponse.json({ error: "İsim boş olamaz." }, { status: 400 })
    }

    // Embed mesajı tanımla
    const embed = {
      title: "🚪 Kullanıcı Çıkış Yaptı",
      color: 0xe74c3c, // Kırmızı renk
      fields: [
        {
          name: "👤 Oyuncu",
          value: `**İsim:** ${name || "Bilinmiyor"}\n**UID:** \`${uid || "Bilinmiyor"}\``,
          inline: false,
        },
      ],
      footer: {
        text: "GeoGame Çıkış Logu",
        icon_url: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/logo.png?v=1740170623412",
      },
      timestamp: new Date(),
    }

    // Discord'a mesaj gönder
    if (process.env.BOT_TOKEN && process.env.SIGNLOG) {
      await sendMessageToDiscord(" ", process.env.SIGNLOG, embed)
    } else {
      console.warn("Discord mesajı gönderilemedi: BOT_TOKEN veya SIGNLOG çevre değişkeni eksik")
    }

    return NextResponse.json({ success: true, message: "Çıkış işlemi başarıyla kaydedildi." })
  } catch (error: any) {
    console.error("API hatası:", error)
    return NextResponse.json({ error: error.message || "Bir hata oluştu" }, { status: 500 })
  }
}
