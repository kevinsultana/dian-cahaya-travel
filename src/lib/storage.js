import { supabase } from "./supabase";

/**
 * Mengompres gambar di client-side menggunakan HTML5 Canvas
 * agar ukurannya di bawah 300KB.
 * 
 * @param {File} file File gambar asli
 * @returns {Promise<Blob>} Blob gambar yang telah dikompres
 */
export async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Batasi resolusi maksimum (misal maks 1200px lebar/tinggi) untuk menghemat ukuran
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Kompresi awal dengan kualitas 0.8
        let quality = 0.8;
        
        const getBlob = (q) => {
          return new Promise((res) => {
            canvas.toBlob(
              (blob) => {
                res(blob);
              },
              "image/jpeg",
              q
            );
          });
        };

        // Rekursif menurunkan kualitas jika ukuran masih di atas 300KB (307,200 bytes)
        const checkAndCompress = async (q) => {
          const blob = await getBlob(q);
          if (blob.size > 300 * 1024 && q > 0.1) {
            // Turunkan kualitas secara bertahap
            return checkAndCompress(q - 0.1);
          }
          return blob;
        };

        checkAndCompress(quality)
          .then((finalBlob) => {
            resolve(finalBlob);
          })
          .catch(reject);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Mengunggah file gambar ke Supabase Storage
 * 
 * @param {File} file File gambar asli dari input
 * @param {string} folder Nama subfolder tujuan (e.g. 'paket-wisata', 'hero', 'banner-promo')
 * @returns {Promise<string>} URL publik gambar yang berhasil diunggah
 */
export async function uploadImageToSupabase(file, folder) {
  try {
    // 1. Kompres gambar
    console.log(`Mengompres gambar... ukuran awal: ${(file.size / 1024).toFixed(2)} KB`);
    const compressedBlob = await compressImage(file);
    console.log(`Kompresi selesai! Ukuran akhir: ${(compressedBlob.size / 1024).toFixed(2)} KB`);

    // 2. Buat nama file unik
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    
    // Tempatkan di subfolder
    const filePath = `${folder}/${fileName}`;

    // 3. Upload ke bucket bernama 'data-web'
    const { data, error } = await supabase.storage
      .from("data-web")
      .upload(filePath, compressedBlob, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      throw new Error(error.message);
    }

    // 4. Dapatkan URL Publik
    const { data: publicUrlData } = supabase.storage
      .from("data-web")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Gagal mengunggah gambar:", error);
    throw error;
  }
}
