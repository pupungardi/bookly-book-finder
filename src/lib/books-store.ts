import { Book } from '@/types/book';

// Supabase-backed catalog store (table: public.books).
// All reads/writes happen server-side through the service-role client, so the
// catalog persists across server restarts and deployments.

export interface BookFilterParams {
  keyword?: string;
  genre?: string;
  sort?: string;
  year?: string;
  page?: number;
  limit?: number;
}

export interface CreateBookInput {
  judul: string;
  author: string;
  genre: string;
  category?: string;
  deskripsi: string;
  cover?: string;
  content?: string;
  pdfUrl?: string;
  year?: string;
  isbn?: string;
  publisher?: string;
  pages?: string;
  language?: string;
  length?: string;
  width?: string;
}

type BookRow = {
  id: string;
  judul: string;
  author: string;
  genre: string;
  category: string;
  deskripsi: string;
  cover: string;
  content: string;
  pdf_url: string;
  year: string;
  isbn: string;
  publisher: string;
  pages: string;
  language: string;
  length: string;
  width: string;
};

async function db() {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  return supabaseAdmin;
}

function rowToBook(row: BookRow): Book {
  return {
    id: row.id,
    judul: row.judul,
    title: row.judul,
    author: row.author || '',
    genre: row.genre || 'General',
    category: row.category || row.genre || 'General',
    deskripsi: row.deskripsi || '',
    cover: row.cover || '',
    content: row.content || '',
    pdfUrl: row.pdf_url || '',
    year: row.year || '',
    isbn: row.isbn || '',
    publisher: row.publisher || '',
    pages: row.pages || '',
    language: row.language || 'Bahasa Indonesia',
    length: row.length || '',
    width: row.width || '',
  };
}

function inputToRow(input: Partial<CreateBookInput>): Record<string, string> {
  const row: Record<string, string> = {};
  if (input.judul !== undefined) row['judul'] = String(input.judul).trim();
  if (input.author !== undefined) row['author'] = String(input.author).trim();
  if (input.genre !== undefined) row['genre'] = String(input.genre).trim();
  if (input.category !== undefined) row['category'] = String(input.category).trim();
  if (input.deskripsi !== undefined) row['deskripsi'] = String(input.deskripsi).trim();
  if (input.cover !== undefined) row['cover'] = String(input.cover).trim();
  if (input.content !== undefined) row['content'] = String(input.content);
  if (input.pdfUrl !== undefined) row['pdf_url'] = String(input.pdfUrl);
  if (input.year !== undefined) row['year'] = String(input.year).trim();
  if (input.isbn !== undefined) row['isbn'] = String(input.isbn).trim();
  if (input.publisher !== undefined) row['publisher'] = String(input.publisher).trim();
  if (input.pages !== undefined) row['pages'] = String(input.pages).trim();
  if (input.language !== undefined) row['language'] = String(input.language).trim();
  if (input.length !== undefined) row['length'] = String(input.length).trim();
  if (input.width !== undefined) row['width'] = String(input.width).trim();
  return row;
}

async function fetchAllBooks(): Promise<Book[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) throw new Error(error.message);
  return ((data as unknown as BookRow[]) || []).map(rowToBook);
}

export async function getDynamicBooks(params: BookFilterParams = {}) {
  const {
    keyword = '',
    genre = '',
    sort = '',
    year = '',
    page = 1,
    limit = 10,
  } = params;

  const allBooks = await fetchAllBooks();
  let filtered = [...allBooks];

  if (keyword.trim()) {
    const q = keyword.trim().toLowerCase();
    filtered = filtered.filter((b) => {
      const titleMatch = (b.judul || b.title || '').toLowerCase().includes(q);
      const authorMatch = (b.author || '').toLowerCase().includes(q);
      const genreMatch = (b.genre || b.category || '').toLowerCase().includes(q);
      const descMatch = (b.deskripsi || '').toLowerCase().includes(q);
      const pubMatch = (b.publisher || '').toLowerCase().includes(q);
      const isbnMatch = (b.isbn || '').toLowerCase().includes(q);
      return titleMatch || authorMatch || genreMatch || descMatch || pubMatch || isbnMatch;
    });
  }

  if (genre && genre !== 'All' && genre !== 'All Genres') {
    const g = genre.toLowerCase();
    filtered = filtered.filter(
      (b) => (b.genre || '').toLowerCase() === g || (b.category || '').toLowerCase() === g
    );
  }

  if (year && year.trim()) {
    filtered = filtered.filter((b) => String(b.year) === year.trim());
  }

  if (sort) {
    switch (sort) {
      case 'title_asc':
      case 'title-asc':
        filtered.sort((a, b) => (a.judul || a.title || '').localeCompare(b.judul || b.title || ''));
        break;
      case 'title_desc':
      case 'title-desc':
        filtered.sort((a, b) => (b.judul || b.title || '').localeCompare(a.judul || a.title || ''));
        break;
      case 'year_desc':
      case 'year-desc':
      case 'newest':
        filtered.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
        break;
      case 'year_asc':
      case 'year-asc':
      case 'oldest':
        filtered.sort((a, b) => (Number(a.year) || 0) - (Number(b.year) || 0));
        break;
      case 'author_asc':
        filtered.sort((a, b) => (a.author || '').localeCompare(b.author || ''));
        break;
      case 'author_desc':
        filtered.sort((a, b) => (b.author || '').localeCompare(a.author || ''));
        break;
      default:
        break;
    }
  }

  const totalItems = filtered.length;
  const currentPage = Math.max(1, page);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const startIndex = (currentPage - 1) * limit;
  const paginatedBooks = filtered.slice(startIndex, startIndex + limit);

  const availableGenres = Array.from(
    new Set(
      allBooks
        .map((b) => b.genre || b.category)
        .filter((g): g is string => Boolean(g && g.trim()))
    )
  ).sort();

  return {
    books: paginatedBooks,
    totalItems,
    totalPages,
    currentPage,
    availableGenres,
    totalCatalogCount: allBooks.length,
  };
}

export async function getDynamicBookById(id: string): Promise<Book | undefined> {
  const supabase = await db();
  const { data, error } = await supabase.from('books').select('*').eq('id', id).maybeSingle();
  if (error || !data) return undefined;
  return rowToBook(data as unknown as BookRow);
}

export async function createDynamicBook(
  input: CreateBookInput
): Promise<{ success: boolean; book?: Book; error?: string }> {
  const judul = (input.judul || '').trim();
  const author = (input.author || '').trim();
  const genre = (input.genre || input.category || 'General').trim();

  if (!judul) return { success: false, error: 'Judul buku wajib diisi' };
  if (!author) return { success: false, error: 'Nama penulis wajib diisi' };

  const payload = {
    judul,
    author,
    genre,
    category: (input.category || genre).trim(),
    deskripsi: (input.deskripsi || '').trim() || 'Belum ada deskripsi untuk ebook ini.',
    cover: (input.cover || '').trim(),
    content: input.content || '',
    pdf_url: input.pdfUrl || '',
    year: input.year ? String(input.year).trim() : new Date().getFullYear().toString(),
    isbn: input.isbn ? String(input.isbn).trim() : '',
    publisher: input.publisher ? String(input.publisher).trim() : 'Independent Publishing',
    pages: input.pages ? String(input.pages).trim() : '100',
    language: input.language ? String(input.language).trim() : 'Bahasa Indonesia',
    length: input.length ? String(input.length).trim() : '20 cm',
    width: input.width ? String(input.width).trim() : '14 cm',
  };

  const supabase = await db();
  const { data, error } = await supabase
    .from('books')
    .insert(payload as never)
    .select('*')
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || 'Gagal menyimpan buku ke database' };
  }

  return { success: true, book: rowToBook(data as unknown as BookRow) };
}

export async function updateDynamicBook(
  id: string,
  input: Partial<CreateBookInput>
): Promise<{ success: boolean; book?: Book; error?: string }> {
  const patch = inputToRow(input);
  if (patch['judul'] !== undefined && !patch['judul']) {
    return { success: false, error: 'Judul buku tidak boleh kosong' };
  }
  if (patch['genre'] && input.category === undefined) {
    patch['category'] = patch['genre'];
  }

  const supabase = await db();
  const { data, error } = await supabase
    .from('books')
    .update(patch as never)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) return { success: false, error: error.message };
  if (!data) return { success: false, error: `Buku dengan id ${id} tidak ditemukan` };

  return { success: true, book: rowToBook(data as unknown as BookRow) };
}

export async function deleteDynamicBook(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await db();
  const { data, error } = await supabase.from('books').delete().eq('id', id).select('id');
  if (error) return { success: false, error: error.message };
  if (!data || data.length === 0) {
    return { success: false, error: `Buku dengan id ${id} tidak ditemukan` };
  }
  return { success: true };
}

export async function clearAllDynamicBooks(): Promise<{ success: boolean; count: number }> {
  const supabase = await db();
  const { data, error } = await supabase
    .from('books')
    .delete()
    .not('id', 'is', null)
    .select('id');
  if (error) throw new Error(error.message);
  return { success: true, count: data?.length || 0 };
}

/**
 * Import books coming from a client-side cache into the database.
 * Existing rows are matched by title + author so repeated syncs don't duplicate.
 */
export async function syncClientBooks(books: Book[]): Promise<{ inserted: number }> {
  if (!Array.isArray(books) || books.length === 0) return { inserted: 0 };

  const existing = await fetchAllBooks();
  const seen = new Set(
    existing.map((b) => `${(b.judul || '').toLowerCase()}|${(b.author || '').toLowerCase()}`)
  );

  const toInsert = books
    .filter((b) => {
      const key = `${(b.judul || b.title || '').toLowerCase()}|${(b.author || '').toLowerCase()}`;
      if (!b.judul && !b.title) return false;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((b) => ({
      judul: (b.judul || b.title || '').trim(),
      author: (b.author || '').trim(),
      genre: (b.genre || b.category || 'General').trim(),
      category: (b.category || b.genre || 'General').trim(),
      deskripsi: b.deskripsi || '',
      cover: b.cover || '',
      content: b.content || '',
      pdf_url: b.pdfUrl || '',
      year: b.year ? String(b.year) : '',
      isbn: b.isbn || '',
      publisher: b.publisher || '',
      pages: b.pages ? String(b.pages) : '',
      language: b.language || 'Bahasa Indonesia',
      length: b.length || '',
      width: b.width || '',
    }));

  if (toInsert.length === 0) return { inserted: 0 };

  const supabase = await db();
  const { error } = await supabase.from('books').insert(toInsert as never);
  if (error) throw new Error(error.message);
  return { inserted: toInsert.length };
}
