import axios from "axios"
import fs from "fs"
import path from "path"
import FormData from "form-data"

// Discord'dan son mesajdaki dosyayı indiren fonksiyon
export async function downloadFileFromDiscord(channelId: string): Promise<string | null> {
  if (!process.env.BOT_TOKEN) {
    console.warn("BOT_TOKEN çevre değişkeni tanımlanmamış")
    return null
  }

  try {
    // Discord kanalından son mesajı al
    const response = await axios.get(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
      params: {
        limit: 1,
      },
    })

    if (response.data && response.data.length > 0) {
      const lastMessage = response.data[0]
      if (lastMessage.attachments && lastMessage.attachments.length > 0) {
        const fileUrl = lastMessage.attachments[0].url
        console.log("Discord'dan dosya URL'si alındı:", fileUrl)

        // Dosyayı /tmp dizinine indir
        const fileName = `geogame-${Date.now()}.json`
        const filePath = path.join("/tmp", fileName)

        const fileResponse = await axios.get(fileUrl, { responseType: "stream" })
        const writer = fs.createWriteStream(filePath)

        fileResponse.data.pipe(writer)

        return new Promise((resolve, reject) => {
          writer.on("finish", () => {
            console.log("Dosya başarıyla indirildi:", filePath)
            resolve(filePath)
          })
          writer.on("error", reject)
        })
      } else {
        console.warn("Son mesajda dosya bulunamadı")
        return null
      }
    } else {
      console.warn("Kanalda mesaj bulunamadı")
      return null
    }
  } catch (error: any) {
    console.error("Discord'dan dosya indirme hatası:", error.response?.data || error.message)
    return null
  }
}

// Discord'a dosya yükleyen fonksiyon
export async function uploadFileToDiscord(filePath: string, channelId: string): Promise<boolean> {
  if (!process.env.BOT_TOKEN) {
    console.warn("BOT_TOKEN çevre değişkeni tanımlanmamış")
    return false
  }

  try {
    const form = new FormData()
    form.append("file", fs.createReadStream(filePath))

    await axios.post(`https://discord.com/api/v10/channels/${channelId}/messages`, form, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
        ...form.getHeaders(),
      },
    })

    console.log("Dosya başarıyla Discord'a yüklendi!")
    return true
  } catch (error: any) {
    console.error("Discord'a dosya yükleme hatası:", error.response?.data || error.message)
    return false
  }
}

// JSON dosyasını oku ve parse et
export async function readJsonFile(filePath: string): Promise<any> {
  try {
    const data = await fs.promises.readFile(filePath, "utf8")
    return JSON.parse(data)
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.warn(`${filePath} dosyası bulunamadı, boş veritabanı döndürülüyor.`)
      return { users: [] }
    }
    throw error
  }
}

// JSON dosyasını yaz
export async function writeJsonFile(filePath: string, data: any): Promise<void> {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf8")
    console.log("JSON dosyası başarıyla yazıldı:", filePath)
  } catch (error) {
    console.error("JSON dosyası yazma hatası:", error)
    throw error
  }
}

// Dosyayı sil
export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.promises.unlink(filePath)
    console.log("Dosya başarıyla silindi:", filePath)
  } catch (error) {
    console.warn("Dosya silme hatası:", error)
  }
}
