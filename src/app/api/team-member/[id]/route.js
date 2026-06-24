import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const json = await request.json();
    const { nama, jabatan, foto, urutan } = json;

    if (!nama || !jabatan) {
      return new Response(
        JSON.stringify({ error: "Nama dan Jabatan wajib diisi" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        nama,
        jabatan,
        foto: foto || "",
        urutan: Number(urutan) || 1,
      },
    });

    return new Response(JSON.stringify(member), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT Team Member Error:", error);
    return new Response(
      JSON.stringify({ error: "Gagal memperbarui anggota tim" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.teamMember.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DELETE Team Member Error:", error);
    return new Response(
      JSON.stringify({ error: "Gagal menghapus anggota tim" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
