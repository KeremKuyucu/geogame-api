// Bu dosyayı artık kullanmıyoruz, sadece tip tanımları için tutuyoruz
export interface User {
  name: string
  uid: string
  profilurl?: string
  puan: number
  mesafedogru: number
  mesafeyanlis: number
  bayrakdogru: number
  bayrakyanlis: number
  baskentdogru: number
  baskentyanlis: number
  mesafepuan: number
  bayrakpuan: number
  baskentpuan: number
}

export interface Database {
  users: User[]
}

export interface DatabaseStats {
  totalUsers: number
  activeUsers: number
  totalPoints: number
  averagePoints: number
  topPlayer: {
    name: string
    puan: number
    profilurl?: string
    uid?: string
  } | null
  source: string
  lastUpdated: string
}

// Artık yerel veritabanı tutmuyoruz - her şey Discord'dan gelecek
// Gerçek kullanıcı verileri
const realUserData = {
  users: [
    {
      name: "Kerem Kuyucu",
      profilurl: "https://lh3.googleusercontent.com/a/ACg8ocI4t5t3GkxnLsdL7WTgLGipD5jRGXSEoTkvoOUuXzxDUkDI4dSB=s96-c",
      uid: "Ko01kg6lpFO0rbHOHFjX3oyxvHC3",
      puan: 14850,
      mesafedogru: 1,
      mesafeyanlis: 5,
      bayrakdogru: 292,
      bayrakyanlis: 55,
      baskentdogru: 22,
      baskentyanlis: 20,
      mesafepuan: 90,
      bayrakpuan: 13810,
      baskentpuan: 950,
    },
    {
      name: "Seyıt Ahmet Özcalık",
      profilurl: "https://lh3.googleusercontent.com/a/ACg8ocLjBowAfIk0OdjkmDh7ppaF7z15TWT4lfmza3bQ3FUOV_m1z6g=s96-c",
      uid: "agsyfCRO3YcjxLcuatARKFIU8Mt2",
      puan: 18440,
      mesafedogru: 4,
      mesafeyanlis: 37,
      bayrakdogru: 376,
      bayrakyanlis: 49,
      baskentdogru: 0,
      baskentyanlis: 0,
      mesafepuan: 130,
      bayrakpuan: 18310,
      baskentpuan: 0,
    },
    {
      name: "Kamil",
      profilurl: "https://lh3.googleusercontent.com/a/ACg8ocLibW9I8Op7MArwX5Ff63zvjhk7aAAdnGkxWIWTO59yLwurfUk=s96-c",
      uid: "mIlRqBBNCOO6nvY0UBsVrOCixdu1",
      puan: 9380,
      mesafedogru: 0,
      mesafeyanlis: 0,
      bayrakdogru: 184,
      bayrakyanlis: 13,
      baskentdogru: 7,
      baskentyanlis: 4,
      mesafepuan: 310,
      bayrakpuan: 9070,
      baskentpuan: 0,
    },
    {
      name: "11E Tahta",
      uid: "11e-tahta-uid",
      profilurl: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/2815428.png?v=1738114346363",
      puan: 55660,
      mesafedogru: 19,
      mesafeyanlis: 119,
      bayrakdogru: 1126,
      bayrakyanlis: 175,
      baskentdogru: 0,
      baskentyanlis: 0,
      mesafepuan: 500,
      bayrakpuan: 55160,
      baskentpuan: 0,
    },
    {
      name: "Marulofrevenge",
      uid: "marulofrevenge-uid",
      profilurl: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/2815428.png?v=1738114346363",
      puan: 2560,
      mesafedogru: 0,
      mesafeyanlis: 0,
      bayrakdogru: 19,
      bayrakyanlis: 14,
      baskentdogru: 39,
      baskentyanlis: 21,
      mesafepuan: 0,
      bayrakpuan: 810,
      baskentpuan: 1750,
    },
    {
      name: "él ",
      uid: "el-uid",
      profilurl: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/2815428.png?v=1738114346363",
      puan: 3270,
      mesafedogru: 0,
      mesafeyanlis: 0,
      bayrakdogru: 28,
      bayrakyanlis: 8,
      baskentdogru: 40,
      baskentyanlis: 18,
      mesafepuan: 0,
      bayrakpuan: 1390,
      baskentpuan: 1880,
    },
    {
      name: "pekin",
      uid: "pekin-uid",
      profilurl: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/2815428.png?v=1738114346363",
      puan: 10660,
      mesafedogru: 0,
      mesafeyanlis: 0,
      bayrakdogru: 82,
      bayrakyanlis: 13,
      baskentdogru: 144,
      baskentyanlis: 52,
      mesafepuan: 0,
      bayrakpuan: 3980,
      baskentpuan: 6680,
    },
    {
      name: "kerembaritci",
      uid: "kerembaritci-uid",
      profilurl: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/2815428.png?v=1738114346363",
      puan: 1670,
      mesafedogru: 1,
      mesafeyanlis: 10,
      bayrakdogru: 34,
      bayrakyanlis: 20,
      baskentdogru: 0,
      baskentyanlis: 0,
      mesafepuan: 50,
      bayrakpuan: 1620,
      baskentpuan: 0,
    },
    {
      name: "eyup",
      uid: "eyup-uid",
      profilurl: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/2815428.png?v=1738114346363",
      puan: 490,
      mesafedogru: 0,
      mesafeyanlis: 0,
      bayrakdogru: 10,
      bayrakyanlis: 1,
      baskentdogru: 0,
      baskentyanlis: 0,
      mesafepuan: 0,
      bayrakpuan: 490,
      baskentpuan: 0,
    },
    {
      name: "havuç",
      uid: "havuc-uid",
      profilurl: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/2815428.png?v=1738114346363",
      puan: 8070,
      mesafedogru: 0,
      mesafeyanlis: 0,
      bayrakdogru: 172,
      bayrakyanlis: 67,
      baskentdogru: 3,
      baskentyanlis: 1,
      mesafepuan: 0,
      bayrakpuan: 7930,
      baskentpuan: 140,
    },
    {
      name: "ucancisim",
      uid: "ucancisim-uid",
      profilurl: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/2815428.png?v=1738114346363",
      puan: 2560,
      mesafedogru: 0,
      mesafeyanlis: 0,
      bayrakdogru: 19,
      bayrakyanlis: 14,
      baskentdogru: 39,
      baskentyanlis: 21,
      mesafepuan: 0,
      bayrakpuan: 810,
      baskentpuan: 1750,
    },
    {
      name: "shinyw_",
      uid: "shinyw-uid",
      profilurl: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/2815428.png?v=1738114346363",
      puan: 0,
      mesafedogru: 0,
      mesafeyanlis: 0,
      bayrakdogru: 0,
      bayrakyanlis: 0,
      baskentdogru: 0,
      baskentyanlis: 0,
      mesafepuan: 0,
      bayrakpuan: 0,
      baskentpuan: 0,
    },
    {
      name: "Kerem K",
      profilurl: "https://lh3.googleusercontent.com/a/ACg8ocIdk-EwB7q62K8ylpX1E5eyzlST0jE3G-fXj4r2X4zYRSoHaAA=s96-c",
      uid: "afKuYhdBvKWmWp3y6bWk8TPr6Ol1",
      puan: 400,
      mesafedogru: 0,
      mesafeyanlis: 0,
      bayrakdogru: 6,
      bayrakyanlis: 8,
      baskentdogru: 4,
      baskentyanlis: 6,
      mesafepuan: 0,
      bayrakpuan: 260,
      baskentpuan: 140,
    },
    {
      name: "Gerçek patron Zenci",
      profilurl: "https://lh3.googleusercontent.com/a/ACg8ocJVewxJGakchwkiR9GjusYXu_zdAP8dN17tOmQOKOt3RaQ7RA=s96-c",
      uid: "jh53ozTZviUQcX40YjJLll0Q2bm1",
      puan: 2510,
      mesafedogru: 0,
      mesafeyanlis: 2,
      bayrakdogru: 38,
      bayrakyanlis: 29,
      baskentdogru: 23,
      baskentyanlis: 28,
      mesafepuan: 0,
      bayrakpuan: 1610,
      baskentpuan: 900,
    },
    {
      name: "SeyitinKalemi",
      uid: "UkrJzu9Py3ZT6iSlWD87E1OetGS2",
      profilurl: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/2815428.png?v=1738114346363",
      puan: 0,
      mesafedogru: 0,
      mesafeyanlis: 0,
      bayrakdogru: 0,
      bayrakyanlis: 0,
      baskentdogru: 0,
      baskentyanlis: 0,
      mesafepuan: 0,
      bayrakpuan: 0,
      baskentpuan: 0,
    },
    {
      name: "Seyıt Ahmet Özçalık",
      profilurl: "https://lh3.googleusercontent.com/a/ACg8ocIc4wyRivTUhFRQ18V8S9CQ1emXQ16g3OGXn8lY_vtBM33UxQ=s96-c",
      uid: "MjpHxsjNbIYFxHolUa5aKippJXG2",
      puan: 0,
      mesafedogru: 0,
      mesafeyanlis: 0,
      bayrakdogru: 0,
      bayrakyanlis: 0,
      baskentdogru: 0,
      baskentyanlis: 0,
      mesafepuan: 0,
      bayrakpuan: 0,
      baskentpuan: 0,
    },
    {
      name: "Enes FZ",
      profilurl: "https://lh3.googleusercontent.com/a/ACg8ocInJII_UdFQSwkshAL3shuoPRr5-rKpSMPmv6MHaoZ9psaVAmdK=s96-c",
      uid: "sjri1ezpuFSgIDuGNu72L4IWAfD3",
      puan: 22810,
      mesafedogru: 1,
      mesafeyanlis: 4,
      bayrakdogru: 474,
      bayrakyanlis: 100,
      baskentdogru: 0,
      baskentyanlis: 0,
      mesafepuan: 100,
      bayrakpuan: 22710,
      baskentpuan: 0,
    },
    {
      name: "Mustafa Semih Aybaş",
      profilurl: "https://lh3.googleusercontent.com/a/ACg8ocLGxePuFwpXB276tl7bIAfAkoKkcAXEvZnwRtfbdNkLTSzn=s96-c",
      uid: "ImMZM9eydFVtIK9R1GBt57PmxO82",
      puan: 19390,
      mesafedogru: 0,
      mesafeyanlis: 0,
      bayrakdogru: 543,
      bayrakyanlis: 787,
      baskentdogru: 0,
      baskentyanlis: 0,
      mesafepuan: 0,
      bayrakpuan: 19390,
      baskentpuan: 0,
    },
    {
      name: "kamilveceyhun",
      uid: "nHmNVn5L47QkPY3pr5YdWw94LQz1",
      profilurl: "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/2815428.png?v=1738114346363",
      puan: 0,
      mesafedogru: 0,
      mesafeyanlis: 0,
      bayrakdogru: 0,
      bayrakyanlis: 0,
      baskentdogru: 0,
      baskentyanlis: 0,
      mesafepuan: 0,
      bayrakpuan: 0,
      baskentpuan: 0,
    },
  ],
}

// Veri tipini normalize et (string'leri number'a çevir)
const normalizeUserData = (users: any[]) => {
  return users.map((user) => ({
    ...user,
    puan: typeof user.puan === "string" ? Number.parseInt(user.puan) : user.puan,
    mesafedogru: typeof user.mesafedogru === "string" ? Number.parseInt(user.mesafedogru) : user.mesafedogru,
    mesafeyanlis: typeof user.mesafeyanlis === "string" ? Number.parseInt(user.mesafeyanlis) : user.mesafeyanlis,
    bayrakdogru: typeof user.bayrakdogru === "string" ? Number.parseInt(user.bayrakdogru) : user.bayrakdogru,
    bayrakyanlis: typeof user.bayrakyanlis === "string" ? Number.parseInt(user.bayrakyanlis) : user.bayrakyanlis,
    baskentdogru: typeof user.baskentdogru === "string" ? Number.parseInt(user.baskentdogru) : user.baskentdogru,
    baskentyanlis: typeof user.baskentyanlis === "string" ? Number.parseInt(user.baskentyanlis) : user.baskentyanlis,
    mesafepuan: typeof user.mesafepuan === "string" ? Number.parseInt(user.mesafepuan) : user.mesafepuan,
    bayrakpuan: typeof user.bayrakpuan === "string" ? Number.parseInt(user.bayrakpuan) : user.bayrakpuan,
    baskentpuan: typeof user.baskentpuan === "string" ? Number.parseInt(user.baskentpuan) : user.baskentpuan,
    // Eksik alanları varsayılan değerlerle doldur
    uid: user.uid || `${user.name.toLowerCase().replace(/\s+/g, "-")}-uid`,
    profilurl:
      user.profilurl || "https://cdn.glitch.global/e74d89f5-045d-4ad2-94c7-e2c99ed95318/2815428.png?v=1738114346363",
  }))
}

// Gerçek kullanıcı verileriyle veritabanını başlat
const gameDatabase: { users: any[] } = {
  users: normalizeUserData(realUserData.users),
}

export const getDatabase = () => {
  return gameDatabase
}

export const updateUserInDatabase = (userData: any) => {
  // Kullanıcı adı Misafir ise ekleme yapılmasın
  if (userData.name === "Misafir") {
    console.log(`Misafir kullanıcı adıyla işlem yapılmaz: ${userData.name}`)
    return
  }

  const userIndex = gameDatabase.users.findIndex((user: any) => user.uid === userData.uid)

  if (userIndex !== -1) {
    // Aynı uid'ye sahip kullanıcı bulundu - güncelle
    gameDatabase.users[userIndex] = {
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
    gameDatabase.users.push({
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

  console.log("Veritabanı başarıyla güncellendi.")
}

// İstatistikler için yardımcı fonksiyonlar
export const getDatabaseStats = (): DatabaseStats => {
  const users = gameDatabase.users
  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.puan > 0).length
  const totalPoints = users.reduce((sum, user) => sum + user.puan, 0)
  const averagePoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0
  const topPlayer = users.reduce((top, user) => (user.puan > top.puan ? user : top), users[0])

  return {
    totalUsers,
    activeUsers,
    totalPoints,
    averagePoints,
    topPlayer:
      topPlayer.puan > 0
        ? { name: topPlayer.name, puan: topPlayer.puan, profilurl: topPlayer.profilurl, uid: topPlayer.uid }
        : null,
    source: "Discord",
    lastUpdated: new Date().toISOString(),
  }
}
