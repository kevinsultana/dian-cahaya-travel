import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { urutan: "asc" },
    });
    return new Response(JSON.stringify(members), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET Team Member Error:", error);
    return new Response(
      JSON.stringify({ error: "Gagal memuat data anggota tim" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request) {
  try {
    const json = await request.json();
    const { nama, jabatan, foto, urutan } = json;

    if (!nama || !jabatan) {
      return new Response(
        JSON.stringify({ error: "Nama dan Jabatan wajib diisi" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const member = await prisma.teamMember.create({
      data: {
        nama,
        jabatan,
        foto: foto || "",
        urutan: Number(urutan) || 1,
      },
    });

    return new Response(JSON.stringify(member), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST Team Member Error:", error);
    return new Response(
      JSON.stringify({ error: "Gagal menambahkan anggota tim" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
