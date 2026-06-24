import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/paket-wisata/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const item = await prisma.paketWisata.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    console.error("GET /api/paket-wisata/[id] error:", error);
    return NextResponse.json({ error: "Gagal mengambil paket wisata" }, { status: 500 });
  }
}

// PUT /api/paket-wisata/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const item = await prisma.paketWisata.update({
      where: { id },
      data: {
        nama: body.nama,
        durasi: body.durasi,
        harga: Number(body.harga),
        hotel_makkah: body.hotel_makkah,
        hotel_madinah: body.hotel_madinah,
        status: body.status,
        tanggal_keberangkatan: body.tanggal_keberangkatan,
        quota: Number(body.quota),
        terpakai: Number(body.terpakai),
        featured: Boolean(body.featured),
        deskripsi: body.deskripsi || "",
        gambar: body.gambar || "",
        badge: body.badge || "",
        category: body.category || "",
        airline: body.airline || "",
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("PUT /api/paket-wisata/[id] error:", error);
    return NextResponse.json({ error: "Gagal memperbarui paket wisata" }, { status: 500 });
  }
}

// DELETE /api/paket-wisata/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.paketWisata.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/paket-wisata/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus paket wisata" }, { status: 500 });
  }
}
