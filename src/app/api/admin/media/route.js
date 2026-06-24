import { createClient } from "@supabase/supabase-js";

// Menggunakan Service Role Key atau Anon Key untuk manipulasi storage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || "paket-wisata";

    // Panggil list files dari bucket 'data-web' di folder terkait
    const { data, error } = await supabase.storage
      .from("data-web")
      .list(folder, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      throw new Error(error.message);
    }

    // Ubah data untuk menyertakan full URL publik untuk preview
    const filesWithUrls = data.map((file) => {
      const { data: urlData } = supabase.storage
        .from("data-web")
        .getPublicUrl(`${folder}/${file.name}`);
        
      return {
        name: file.name,
        id: file.id,
        created_at: file.created_at,
        metadata: file.metadata,
        url: urlData.publicUrl,
        path: `${folder}/${file.name}`,
      };
    });

    return new Response(JSON.stringify(filesWithUrls), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("List Media Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Gagal memuat daftar berkas" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path"); // Format: folder/file_name.jpg

    if (!path) {
      return new Response(
        JSON.stringify({ error: "Parameter path wajib dicantumkan" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase.storage
      .from("data-web")
      .remove([path]);

    if (error) {
      throw new Error(error.message);
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Delete Media Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Gagal menghapus berkas" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
