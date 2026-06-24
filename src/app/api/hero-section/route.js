import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/hero-section
export async function GET() {
  try {
    const data = await prisma.heroSection.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/hero-section error:", error);
    return NextResponse.json({ error: "Gagal mengambil data hero section" }, { status: 500 });
  }
}

// POST /api/hero-section
export async function POST(request) {
  try {
    const body = await request.json();
    const item = await prisma.heroSection.create({
      data: {
        judul: body.judul,
        subjudul: body.subjudul,
        gambar: body.gambar,
        link_tombol: body.link_tombol || "/paket-umrah",
        status: body.status || "aktif",
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/hero-section error:", error);
    return NextResponse.json({ error: "Gagal menambahkan hero section" }, { status: 500 });
  }
}
