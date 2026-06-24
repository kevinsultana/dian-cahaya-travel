import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/tentang-kami - Ambil data singleton
export async function GET() {
  try {
    let data = await prisma.tentangKami.findUnique({
      where: { id: "singleton" },
    });
    if (!data) {
      data = await prisma.tentangKami.create({
        data: {
          id: "singleton",
          judul: "Tentang Dian Cahaya Travel",
          subjudul: "Biro Umroh dan Haji Terpercaya Sejak 2015",
          deskripsi:
            "Dian Cahaya Travel adalah biro perjalanan ibadah yang berkomitmen memberikan pelayanan terbaik untuk setiap jamaah.",
          visi: "Menjadi biro perjalanan ibadah terdepan yang memberikan pengalaman ibadah yang nyaman, aman, dan berkesan.",
          misi: "Menyediakan paket perjalanan ibadah yang terjangkau dengan pelayanan profesional dan fasilitas premium.",
          nilai_perusahaan: ["Amanah", "Profesional", "Berorientasi Pelayanan", "Terpercaya"],
        },
      });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/tentang-kami error:", error);
    return NextResponse.json({ error: "Gagal mengambil data tentang kami" }, { status: 500 });
  }
}

// PUT /api/tentang-kami - Update data singleton
export async function PUT(request) {
  try {
    const body = await request.json();
    const nilaiArray = Array.isArray(body.nilai_perusahaan)
      ? body.nilai_perusahaan
      : String(body.nilai_perusahaan)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    const data = await prisma.tentangKami.upsert({
      where: { id: "singleton" },
      update: {
        judul: body.judul,
        subjudul: body.subjudul,
        deskripsi: body.deskripsi,
        visi: body.visi,
        misi: body.misi,
        nilai_perusahaan: nilaiArray,
      },
      create: {
        id: "singleton",
        judul: body.judul,
        subjudul: body.subjudul,
        deskripsi: body.deskripsi,
        visi: body.visi,
        misi: body.misi,
        nilai_perusahaan: nilaiArray,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("PUT /api/tentang-kami error:", error);
    return NextResponse.json({ error: "Gagal menyimpan data tentang kami" }, { status: 500 });
  }
}
