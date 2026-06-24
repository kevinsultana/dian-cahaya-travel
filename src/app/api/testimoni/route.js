import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/testimoni
export async function GET() {
  try {
    const data = await prisma.testimoni.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/testimoni error:", error);
    return NextResponse.json({ error: "Gagal mengambil data testimoni" }, { status: 500 });
  }
}

// POST /api/testimoni
export async function POST(request) {
  try {
    const body = await request.json();
    const item = await prisma.testimoni.create({
      data: {
        nama: body.nama,
        foto: body.foto || "",
        bintang: Number(body.bintang),
        teks_deskripsi: body.teks_deskripsi,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/testimoni error:", error);
    return NextResponse.json({ error: "Gagal menambahkan testimoni" }, { status: 500 });
  }
}
