import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/paket-wisata - Ambil semua paket
export async function GET() {
  try {
    const data = await prisma.paketWisata.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/paket-wisata error:", error);
    return NextResponse.json({ error: "Gagal mengambil data paket wisata" }, { status: 500 });
  }
}

// POST /api/paket-wisata - Tambah paket baru
export async function POST(request) {
  try {
    const body = await request.json();
    const item = await prisma.paketWisata.create({
      data: {
        nama: body.nama,
        durasi: body.durasi,
        harga: Number(body.harga),
        hotel_makkah: body.hotel_makkah,
        hotel_madinah: body.hotel_madinah,
        status: body.status || "active",
        tanggal_keberangkatan: body.tanggal_keberangkatan,
        quota: Number(body.quota),
        terpakai: Number(body.terpakai) || 0,
        featured: Boolean(body.featured),
        deskripsi: body.deskripsi || "",
        gambar: body.gambar || "",
        badge: body.badge || "",
        category: body.category || "",
        airline: body.airline || "",
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/paket-wisata error:", error);
    return NextResponse.json({ error: "Gagal menambahkan paket wisata" }, { status: 500 });
  }
}
