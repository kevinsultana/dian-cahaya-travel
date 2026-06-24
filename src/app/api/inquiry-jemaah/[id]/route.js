import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/inquiry-jemaah/[id]
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const item = await prisma.inquiryJemaah.update({
      where: { id },
      data: {
        nama: body.nama,
        wa: body.wa || "",
        email: body.email || "",
        paket: body.paket,
        status: body.status,
        tanggal: body.tanggal,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("PUT /api/inquiry-jemaah/[id] error:", error);
    return NextResponse.json({ error: "Gagal memperbarui inquiry jemaah" }, { status: 500 });
  }
}

// DELETE /api/inquiry-jemaah/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.inquiryJemaah.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/inquiry-jemaah/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus inquiry jemaah" }, { status: 500 });
  }
}
