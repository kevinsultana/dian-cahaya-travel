import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/pengaturan-wa - Ambil setting singleton
export async function GET() {
  try {
    let data = await prisma.pengaturanWa.findUnique({
      where: { id: "singleton" },
    });
    if (!data) {
      // Buat default jika belum ada
      data = await prisma.pengaturanWa.create({
        data: {
          id: "singleton",
          nomor: "6281234567890",
          pesan_template:
            "Assalamualaikum Dian Cahaya Travel, saya tertarik dengan paket umroh yang ditawarkan. Mohon informasi lebih lanjut.",
        },
      });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/pengaturan-wa error:", error);
    return NextResponse.json({ error: "Gagal mengambil pengaturan WA" }, { status: 500 });
  }
}

// PUT /api/pengaturan-wa - Update setting singleton
export async function PUT(request) {
  try {
    const body = await request.json();
    const data = await prisma.pengaturanWa.upsert({
      where: { id: "singleton" },
      update: {
        nomor: body.nomor,
        pesan_template: body.pesan_template,
      },
      create: {
        id: "singleton",
        nomor: body.nomor,
        pesan_template: body.pesan_template,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("PUT /api/pengaturan-wa error:", error);
    return NextResponse.json({ error: "Gagal menyimpan pengaturan WA" }, { status: 500 });
  }
}
