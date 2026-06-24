import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/banner-promo
export async function GET() {
  try {
    const data = await prisma.bannerPromo.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/banner-promo error:", error);
    return NextResponse.json({ error: "Gagal mengambil data banner promo" }, { status: 500 });
  }
}

// POST /api/banner-promo
export async function POST(request) {
  try {
    const body = await request.json();
    const item = await prisma.bannerPromo.create({
      data: {
        judul: body.judul,
        subjudul: body.subjudul,
        gambar: body.gambar,
        tautan: body.tautan,
        status: body.status || "aktif",
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/banner-promo error:", error);
    return NextResponse.json({ error: "Gagal menambahkan banner promo" }, { status: 500 });
  }
}
