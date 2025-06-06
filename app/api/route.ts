import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    name: "GeoGame API",
    version: "1.0.0",
    endpoints: [
      { path: "/api/post_leadboard", method: "POST", description: "Oyuncu puanlarını günceller" },
      { path: "/api/get_leadboard", method: "GET", description: "Skor tablosunu indirir" },
      { path: "/api/ulkelog", method: "POST", description: "Ülke tahmin oyunu loglarını kaydeder" },
      { path: "/api/feedback", method: "POST", description: "Kullanıcı geri bildirimlerini kaydeder" },
      { path: "/api/login/callback", method: "POST", description: "Kullanıcı giriş işlemlerini loglar" },
      { path: "/api/geogamesignlog", method: "POST", description: "Kullanıcı çıkış işlemlerini loglar" },
    ],
  })
}
