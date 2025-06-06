import {
  downloadFileFromDiscord,
  uploadFileToDiscord,
  readJsonFile,
  writeJsonFile,
  deleteFile,
} from "./discord-file-manager"
import path from "path"

// Discord'dan veritabanını senkronize et
export async function syncDatabaseFromDiscord(): Promise<any> {
  if (!process.env.KULLANICI_PUANLARI) {
    console.warn("KULLANICI_PUANLARI çevre değişkeni tanımlanmamış")
    return { users: [] }
  }

  try {
    // Discord'dan dosyayı indir
    const downloadedFilePath = await downloadFileFromDiscord(process.env.KULLANICI_PUANLARI)

    if (downloadedFilePath) {
      // Dosyayı oku ve parse et
      const database = await readJsonFile(downloadedFilePath)

      // İndirilen dosyayı sil
      await deleteFile(downloadedFilePath)

      console.log("Veritabanı Discord'dan başarıyla senkronize edildi")
      return database
    } else {
      console.warn("Discord'dan dosya indirilemedi, varsayılan veritabanı kullanılıyor")
      return { users: [] }
    }
  } catch (error) {
    console.error("Discord senkronizasyon hatası:", error)
    return { users: [] }
  }
}

// Veritabanını Discord'a yükle
export async function uploadDatabaseToDiscord(database: any): Promise<boolean> {
  if (!process.env.KULLANICI_PUANLARI) {
    console.warn("KULLANICI_PUANLARI çevre değişkeni tanımlanmamış")
    return false
  }

  try {
    // Geçici dosya oluştur
    const fileName = `geogame-updated-${Date.now()}.json`
    const filePath = path.join("/tmp", fileName)

    // Veritabanını dosyaya yaz
    await writeJsonFile(filePath, database)

    // Discord'a yükle
    const uploadSuccess = await uploadFileToDiscord(filePath, process.env.KULLANICI_PUANLARI)

    // Geçici dosyayı sil
    await deleteFile(filePath)

    if (uploadSuccess) {
      console.log("Veritabanı başarıyla Discord'a yüklendi")
      return true
    } else {
      console.error("Veritabanı Discord'a yüklenemedi")
      return false
    }
  } catch (error) {
    console.error("Discord yükleme hatası:", error)
    return false
  }
}

// Kullanıcı verisini güncelle
export function updateUserInDatabase(database: any, userData: any): any {
  // Kullanıcı adı Misafir ise ekleme yapılmasın
  if (userData.name === "Misafir") {
    console.log(`Misafir kullanıcı adıyla işlem yapılmaz: ${userData.name}`)
    return database
  }

  const userIndex = database.users.findIndex((user: any) => user.uid === userData.uid)

  if (userIndex !== -1) {
    // Aynı uid'ye sahip kullanıcı bulundu - güncelle
    database.users[userIndex] = {
      name: userData.name,
      profilurl: userData.profilurl,
      uid: userData.uid,
      puan: userData.toplampuan,
      mesafedogru: userData.mesafedogru,
      mesafeyanlis: userData.mesafeyanlis,
      bayrakdogru: userData.bayrakdogru,
      bayrakyanlis: userData.bayrakyanlis,
      baskentdogru: userData.baskentdogru,
      baskentyanlis: userData.baskentyanlis,
      mesafepuan: userData.mesafepuan,
      bayrakpuan: userData.bayrakpuan,
      baskentpuan: userData.baskentpuan,
    }
    console.log(`Puan güncellendi: ${userData.name} - ${userData.toplampuan}`)
  } else {
    // Yeni kullanıcıyı ekle
    database.users.push({
      name: userData.name,
      uid: userData.uid,
      profilurl: userData.profilurl,
      puan: userData.toplampuan,
      mesafedogru: userData.mesafedogru,
      mesafeyanlis: userData.mesafeyanlis,
      bayrakdogru: userData.bayrakdogru,
      bayrakyanlis: userData.bayrakyanlis,
      baskentdogru: userData.baskentdogru,
      baskentyanlis: userData.baskentyanlis,
      mesafepuan: userData.mesafepuan,
      bayrakpuan: userData.bayrakpuan,
      baskentpuan: userData.baskentpuan,
    })
    console.log(`Yeni kullanıcı eklendi: ${userData.name} - ${userData.toplampuan}`)
  }

  return database
}
