import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/inquiry-jemaah - Ambil semua inquiry
export async function GET() {
  try {
    const data = await prisma.inquiryJemaah.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/inquiry-jemaah error:", error);
    return NextResponse.json({ error: "Gagal mengambil data inquiry jemaah" }, { status: 500 });
  }
}

// POST /api/inquiry-jemaah - Tambah inquiry baru
export async function POST(request) {
  try {
    const body = await request.json();
    const item = await prisma.inquiryJemaah.create({
      data: {
        nama: body.nama,
        wa: body.wa || "",
        email: body.email || "",
        paket: body.paket,
        status: body.status || "baru",
        tanggal: body.tanggal,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/inquiry-jemaah error:", error);
    return NextResponse.json({ error: "Gagal menambahkan inquiry jemaah" }, { status: 500 });
  }
}
