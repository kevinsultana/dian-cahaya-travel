import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/testimoni/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const item = await prisma.testimoni.update({
      where: { id },
      data: {
        nama: body.nama,
        foto: body.foto || "",
        bintang: Number(body.bintang),
        teks_deskripsi: body.teks_deskripsi,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("PUT /api/testimoni/[id] error:", error);
    return NextResponse.json({ error: "Gagal memperbarui testimoni" }, { status: 500 });
  }
}

// DELETE /api/testimoni/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.testimoni.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/testimoni/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus testimoni" }, { status: 500 });
  }
}
