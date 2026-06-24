import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/banner-promo/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const item = await prisma.bannerPromo.update({
      where: { id },
      data: {
        judul: body.judul,
        subjudul: body.subjudul,
        gambar: body.gambar,
        tautan: body.tautan,
        status: body.status,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("PUT /api/banner-promo/[id] error:", error);
    return NextResponse.json({ error: "Gagal memperbarui banner promo" }, { status: 500 });
  }
}

// DELETE /api/banner-promo/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.bannerPromo.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/banner-promo/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus banner promo" }, { status: 500 });
  }
}
