import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/galeri-foto - Ambil semua foto, diurutkan berdasarkan urutan
export async function GET() {
  try {
    const data = await prisma.galeriFoto.findMany({
      orderBy: { urutan: "asc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/galeri-foto error:", error);
    return NextResponse.json({ error: "Gagal mengambil data galeri foto" }, { status: 500 });
  }
}

// POST /api/galeri-foto - Tambah foto baru
export async function POST(request) {
  try {
    const body = await request.json();
    const item = await prisma.galeriFoto.create({
      data: {
        src: body.src,
        alt: body.alt,
        urutan: Number(body.urutan),
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/galeri-foto error:", error);
    return NextResponse.json({ error: "Gagal menambahkan foto galeri" }, { status: 500 });
  }
}
