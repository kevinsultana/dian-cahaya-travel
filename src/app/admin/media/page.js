"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Swal from "sweetalert2";

const folders = [
  { value: "paket-wisata", label: "Paket Wisata" },
  { value: "galeri", label: "Galeri Foto" },
  { value: "banner-promo", label: "Banner Promo" },
  { value: "hero", label: "Hero Slider" },
  { value: "testimoni", label: "Testimoni" },
  { value: "umum", label: "Umum / Lainnya" },
];

export default function MediaManagementPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [activeFolder, setActiveFolder] = useState("paket-wisata");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingPath, setDeletingPath] = useState(null);

  useEffect(() => {
    setMounted(true);
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (!loggedIn) router.push("/admin/login");
  }, [router]);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/media?folder=${activeFolder}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      
      // Filter out folder placeholders if any (usually .emptyFolderPlaceholder)
      const filteredFiles = json.filter(file => file.name !== ".emptyFolderPlaceholder");
      setFiles(filteredFiles);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal memuat berkas foto dari storage.",
      });
    } finally {
      setLoading(false);
    }
  }, [activeFolder]);

  useEffect(() => {
    if (mounted && isLoggedIn) {
      fetchFiles();
    }
  }, [mounted, isLoggedIn, activeFolder, fetchFiles]);

  if (!mounted || !isLoggedIn) return null;

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    Swal.fire({
      icon: "success",
      title: "Disalin!",
      text: "URL gambar berhasil disalin ke clipboard.",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const handleDelete = (file) => {
    Swal.fire({
      title: "Hapus Foto Permanen?",
      text: `Apakah Anda yakin ingin menghapus foto "${file.name}" dari storage Supabase? Tindakan ini tidak dapat dibatalkan.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDeletingPath(file.path);
          const res = await fetch(`/api/admin/media?path=${encodeURIComponent(file.path)}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error();

          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            text: "Foto berhasil dihapus dari storage.",
            timer: 1500,
            showConfirmButton: false,
          });
          
          fetchFiles();
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Gagal menghapus foto dari storage. Pastikan izin RLS di Supabase Storage sudah diatur.",
          });
        } finally {
          setDeletingPath(null);
        }
      }
    });
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        title="Foto Management"
        onLogout={() => {
          localStorage.removeItem("adminLoggedIn");
          router.push("/admin/login");
        }}
      />

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">Storage Explorer</h1>
            <p className="text-sm text-on-surface-variant">
              Kelola berkas foto yang diunggah ke storage bucket <code className="bg-surface-variant px-1 rounded">data-web</code>
            </p>
          </div>
          <button
            onClick={fetchFiles}
            className="flex items-center gap-2 border border-outline-variant hover:bg-surface-variant bg-white px-4 py-2.5 rounded-lg text-sm font-semibold text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Segarkan
          </button>
        </div>

        {/* Folder Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-outline-variant pb-4 mb-6">
          {folders.map((folder) => (
            <button
              key={folder.value}
              onClick={() => setActiveFolder(folder.value)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeFolder === folder.value
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              {folder.label}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-outline-variant">
            <p className="text-sm text-on-surface-variant">Membuka folder {folders.find(f => f.value === activeFolder)?.label}...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-outline-variant flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">folder_open</span>
            <p className="text-sm text-on-surface-variant font-medium">Folder ini kosong</p>
            <p className="text-xs text-on-surface-variant/70 mt-1">Belum ada foto yang diupload di folder ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((file) => (
              <div
                key={file.id || file.name}
                className="bg-white rounded-xl border border-outline-variant overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-all"
              >
                {/* Image Preview Box */}
                <div className="relative h-44 bg-surface-container overflow-hidden border-b border-outline-variant/60 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopyUrl(file.url)}
                      className="p-1.5 bg-white hover:bg-surface-variant text-primary rounded-lg shadow-sm border border-outline-variant cursor-pointer transition-colors"
                      title="Salin URL"
                    >
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                    <button
                      onClick={() => handleDelete(file)}
                      disabled={deletingPath === file.path}
                      className="p-1.5 bg-white hover:bg-error-container text-error rounded-lg shadow-sm border border-outline-variant cursor-pointer transition-colors disabled:opacity-50"
                      title="Hapus permanen"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Metadata & Actions */}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <p
                      className="text-xs font-bold text-on-surface break-all truncate"
                      title={file.name}
                    >
                      {file.name}
                    </p>
                    <div className="mt-2 space-y-1 text-[10px] text-on-surface-variant">
                      <p className="flex justify-between">
                        <span>Ukuran:</span>
                        <span className="font-semibold text-on-surface">
                          {formatBytes(file.metadata?.size || 0)}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Diunggah:</span>
                        <span className="font-semibold text-on-surface">
                          {formatDate(file.created_at)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-outline-variant flex gap-2">
                    <button
                      onClick={() => handleCopyUrl(file.url)}
                      className="flex-1 bg-surface border border-outline-variant hover:bg-surface-variant text-on-surface-variant py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">link</span>
                      Copy URL
                    </button>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-primary-container text-primary hover:opacity-90 py-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      Buka
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
