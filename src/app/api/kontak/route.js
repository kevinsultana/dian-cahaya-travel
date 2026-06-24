import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/kontak - Ambil data singleton kontak
export async function GET() {
  try {
    let data = await prisma.kontak.findUnique({
      where: { id: "singleton" },
    });
    if (!data) {
      data = await prisma.kontak.create({
        data: {
          id: "singleton",
          alamat: "Jl. Merdeka No. 123, Jakarta Pusat, DKI Jakarta 10110",
          telepon: "+62 21 1234 5678",
          email: "info@diancahayatravel.com",
          wa_cs: "6281234567890",
          jam_kerja: "Senin - Jumat: 08.00 - 17.00\nSabtu: 08.00 - 14.00",
          gmaps_embed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6663923293845!2d106.8249641757833!3d-6.175387060513978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2dbfb2115%3A0x6b306b6b6b6b6b6b!2sMonumen%20Nasional!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
        },
      });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/kontak error:", error);
    return NextResponse.json({ error: "Gagal mengambil data kontak" }, { status: 500 });
  }
}

// PUT /api/kontak - Update/upsert data singleton kontak
export async function PUT(request) {
  try {
    const body = await request.json();
    const data = await prisma.kontak.upsert({
      where: { id: "singleton" },
      update: {
        alamat: body.alamat,
        telepon: body.telepon,
        email: body.email,
        wa_cs: body.wa_cs,
        jam_kerja: body.jam_kerja,
        gmaps_embed: body.gmaps_embed,
      },
      create: {
        id: "singleton",
        alamat: body.alamat,
        telepon: body.telepon,
        email: body.email,
        wa_cs: body.wa_cs,
        jam_kerja: body.jam_kerja,
        gmaps_embed: body.gmaps_embed,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("PUT /api/kontak error:", error);
    return NextResponse.json({ error: "Gagal menyimpan data kontak" }, { status: 500 });
  }
}
