import React, { useState } from "react";
import { uploadImageToSupabase } from "@/lib/storage";

export default function ImageUpload({ value, onChange, folder = "umum", label = "Gambar" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (PNG, JPG, JPEG, WebP)");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const publicUrl = await uploadImageToSupabase(file, folder);
      onChange(publicUrl);
    } catch (err) {
      console.error(err);
      setError("Gagal mengunggah gambar. Pastikan Bucket Storage 'data-web' sudah dibuat di Supabase.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-primary">
        {label}
      </label>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Preview Box */}
        <div className="w-32 h-32 rounded-xl border border-outline-variant bg-surface-container flex items-center justify-center overflow-hidden relative group">
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Preview upload"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                title="Hapus gambar"
              >
                <span className="material-symbols-outlined text-[24px]">delete</span>
              </button>
            </>
          ) : (
            <div className="text-center text-on-surface-variant/60 flex flex-col items-center">
              <span className="material-symbols-outlined text-[32px] mb-1">image</span>
              <span className="text-[10px]">No Image</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 space-y-2 w-full">
          <div className="flex flex-wrap gap-2">
            <label className="relative flex items-center gap-2 bg-primary text-on-primary hover:opacity-90 px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all disabled:opacity-50">
              <span className="material-symbols-outlined text-[16px]">upload</span>
              {uploading ? "Mengompres & Upload..." : "Upload Gambar"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="absolute inset-0 w-0 h-0 opacity-0"
              />
            </label>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="flex items-center gap-2 border border-outline-variant hover:bg-surface-variant px-4 py-2.5 rounded-lg text-xs font-bold text-on-surface-variant cursor-pointer transition-all"
              >
                Reset
              </button>
            )}
          </div>

          <p className="text-[10px] text-on-surface-variant">
            Gambar otomatis dikompres ke maks 300KB (format WebP/JPEG). Folder penyimpanan: <code className="bg-surface-variant px-1 rounded">data-web/{folder}/</code>
          </p>

          {/* URL Input Fallback */}
          <div className="mt-2">
            <span className="text-[11px] font-semibold text-on-surface-variant block mb-1">Atau masukkan URL gambar secara manual:</span>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="https://example.com/gambar.jpg"
              disabled={uploading}
            />
          </div>

          {error && (
            <p className="text-xs text-error font-medium mt-1">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
