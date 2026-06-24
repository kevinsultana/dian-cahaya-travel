import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/hero-section/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const item = await prisma.heroSection.update({
      where: { id },
      data: {
        judul: body.judul,
        subjudul: body.subjudul,
        gambar: body.gambar,
        link_tombol: body.link_tombol,
        status: body.status,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("PUT /api/hero-section/[id] error:", error);
    return NextResponse.json({ error: "Gagal memperbarui hero section" }, { status: 500 });
  }
}

// DELETE /api/hero-section/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.heroSection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/hero-section/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus hero section" }, { status: 500 });
  }
}
