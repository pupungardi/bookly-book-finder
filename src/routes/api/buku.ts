import { createFileRoute } from "@tanstack/react-router";
import {
  getDynamicBooks,
  createDynamicBook,
  updateDynamicBook,
  deleteDynamicBook,
  clearAllDynamicBooks,
  syncClientBooks,
  type CreateBookInput,
} from "@/lib/books-store";
import { validateServerApiAuth } from "@/lib/rbac";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/buku")({
  server: {
    handlers: {
      // PUBLIC: browse the catalog
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const page = parseInt(url.searchParams.get("page") || "1", 10);
          const limit = parseInt(url.searchParams.get("limit") || "10", 10);

          const result = await getDynamicBooks({
            keyword: url.searchParams.get("keyword")?.trim() || "",
            genre: url.searchParams.get("genre")?.trim() || "",
            sort: url.searchParams.get("sort")?.trim() || "",
            year: url.searchParams.get("year")?.trim() || "",
            page: isNaN(page) ? 1 : page,
            limit: isNaN(limit) ? 10 : limit,
          });

          return json({ success: true, ...result });
        } catch (error: any) {
          return json(
            { success: false, error: error?.message || "Gagal memuat daftar buku" },
            500,
          );
        }
      },

      // PROTECTED: create / sync / clear
      POST: async ({ request }) => {
        try {
          const authCheck = validateServerApiAuth(request, "books:create");
          if (!authCheck.authorized) {
            return json(
              {
                success: false,
                error:
                  authCheck.error || "Akses Ditolak: Hak akses Administrator diperlukan.",
                code: "UNAUTHORIZED_ACCESS",
              },
              authCheck.statusCode,
            );
          }

          const body = await request.json();

          if (body.action === "sync" && Array.isArray(body.books)) {
            const syncAuth = validateServerApiAuth(request, "books:manage");
            if (!syncAuth.authorized) {
              return json(
                { success: false, error: syncAuth.error, code: "FORBIDDEN" },
                syncAuth.statusCode,
              );
            }
            const { inserted } = await syncClientBooks(body.books);
            return json({
              success: true,
              message: "Katalog berhasil disinkronisasikan ke database",
              count: inserted,
            });
          }

          if (body.action === "clear") {
            const deleteAuth = validateServerApiAuth(request, "books:delete");
            if (!deleteAuth.authorized) {
              return json(
                { success: false, error: deleteAuth.error, code: "FORBIDDEN" },
                deleteAuth.statusCode,
              );
            }
            const { count } = await clearAllDynamicBooks();
            return json({
              success: true,
              message: `Berhasil membersihkan ${count} buku dari katalog dinamis`,
            });
          }

          const input: CreateBookInput = {
            judul: body.judul || body.title,
            author: body.author,
            genre: body.genre || body.category || "General",
            category: body.category || body.genre || "General",
            deskripsi: body.deskripsi || body.description,
            cover: body.cover,
            content: body.content,
            pdfUrl: body.pdfUrl,
            year: body.year,
            isbn: body.isbn,
            publisher: body.publisher,
            pages: body.pages,
            language: body.language,
            length: body.length,
            width: body.width,
          };

          if (!input.judul || !input.judul.trim()) {
            return json({ success: false, error: "Judul buku wajib diisi." }, 400);
          }
          if (!input.author || !input.author.trim()) {
            return json({ success: false, error: "Nama penulis wajib diisi." }, 400);
          }

          const result = await createDynamicBook(input);
          if (!result.success) {
            return json({ success: false, error: result.error }, 400);
          }

          return json(
            {
              success: true,
              message: "eBook berhasil diunggah dan dipublikasikan!",
              book: result.book,
            },
            201,
          );
        } catch (error: any) {
          return json(
            { success: false, error: error?.message || "Gagal memproses permintaan" },
            500,
          );
        }
      },

      // PROTECTED: edit
      PUT: async ({ request }) => {
        try {
          const authCheck = validateServerApiAuth(request, "books:edit");
          if (!authCheck.authorized) {
            return json(
              {
                success: false,
                error:
                  authCheck.error ||
                  "Akses Ditolak: Hak akses Administrator diperlukan untuk mengedit buku.",
                code: "UNAUTHORIZED_ACCESS",
              },
              authCheck.statusCode,
            );
          }

          const body = await request.json();
          if (!body.id) {
            return json(
              { success: false, error: "ID Buku diperlukan untuk memperbarui data." },
              400,
            );
          }

          const result = await updateDynamicBook(body.id, body);
          if (!result.success) {
            return json({ success: false, error: result.error }, 404);
          }

          return json({
            success: true,
            message: "eBook berhasil diperbarui",
            book: result.book,
          });
        } catch (error: any) {
          return json(
            { success: false, error: error?.message || "Gagal memperbarui buku" },
            500,
          );
        }
      },

      // PROTECTED: delete
      DELETE: async ({ request }) => {
        try {
          const authCheck = validateServerApiAuth(request, "books:delete");
          if (!authCheck.authorized) {
            return json(
              {
                success: false,
                error:
                  authCheck.error ||
                  "Akses Ditolak: Hak akses Administrator diperlukan untuk menghapus buku.",
                code: "UNAUTHORIZED_ACCESS",
              },
              authCheck.statusCode,
            );
          }

          const id = new URL(request.url).searchParams.get("id");
          if (!id) {
            return json(
              { success: false, error: "Parameter ID buku diperlukan untuk penghapusan." },
              400,
            );
          }

          const result = await deleteDynamicBook(id);
          if (!result.success) {
            return json({ success: false, error: result.error }, 404);
          }

          return json({ success: true, message: "eBook berhasil dihapus dari katalog" });
        } catch (error: any) {
          return json(
            { success: false, error: error?.message || "Gagal menghapus buku" },
            500,
          );
        }
      },
    },
  },
});
