import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/galeri-foto/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const item = await prisma.galeriFoto.update({
      where: { id },
      data: {
        src: body.src,
        alt: body.alt,
        urutan: Number(body.urutan),
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("PUT /api/galeri-foto/[id] error:", error);
    return NextResponse.json({ error: "Gagal memperbarui foto galeri" }, { status: 500 });
  }
}

// DELETE /api/galeri-foto/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.galeriFoto.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/galeri-foto/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus foto galeri" }, { status: 500 });
  }
}
