import { useState, useEffect, useRef } from 'react';
import { Newspaper, Plus, Trash2, Edit3, Search, AlertCircle, CheckCircle2, Image as ImageIcon, X } from 'lucide-react';
import { AdminLayout } from './Dashboard';
import api from '../../services/api';
import { getImageSrc } from '../../utils/imageHelper';

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || '';

const KATEGORI_OPTIONS = [
  'WARTA PARIWISATA',
  'BERITA UTAMA',
  'KEGIATAN DINAS',
  'EVENT & PROMOSI',
  'PENGUMUMAN'
];

const AdminBerita = () => {
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    judul: '',
    slug: '',
    konten: '',
    kategori: 'WARTA PARIWISATA',
    penulis: 'Admin Dispar',
    tanggal: new Date().toISOString().split('T')[0],
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [gambarLama, setGambarLama] = useState(null);
  const fileRef = useRef();

  const fetchBerita = async () => {
    setLoading(true);
    try {
      const res = await api.get('/berita?limit=100');
      setBeritaList(res.data?.data || []);
    } catch {
      setError('Gagal memuat daftar berita');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleJudulChange = (e) => {
    const val = e.target.value;
    setForm(prev => ({
      ...prev,
      judul: val,
      slug: editId ? prev.slug : generateSlug(val)
    }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const openAddModal = () => {
    setEditId(null);
    setForm({
      judul: '',
      slug: '',
      konten: '',
      kategori: 'WARTA PARIWISATA',
      penulis: 'Admin Dispar',
      tanggal: new Date().toISOString().split('T')[0],
    });
    setFile(null);
    setPreview(null);
    setGambarLama(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditId(item.id);
    setForm({
      judul: item.judul || '',
      slug: item.slug || '',
      konten: item.konten || '',
      kategori: item.kategori || 'WARTA PARIWISATA',
      penulis: item.penulis || 'Admin Dispar',
      tanggal: item.tanggal ? item.tanggal.split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setFile(null);
    setPreview(null);
    setGambarLama(item.gambar);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.judul.trim()) {
      setError('Judul berita tidak boleh kosong');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('judul', form.judul);
      fd.append('slug', form.slug || generateSlug(form.judul));
      fd.append('konten', form.konten);
      fd.append('kategori', form.kategori);
      fd.append('penulis', form.penulis);
      fd.append('tanggal', form.tanggal);

      if (file) {
        fd.append('gambar', file);
      } else if (gambarLama) {
        fd.append('gambar_lama', gambarLama);
      }

      if (editId) {
        await api.put(`/berita/${editId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Berita berhasil diperbarui');
      } else {
        await api.post('/berita', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Berita baru berhasil ditambahkan');
      }

      setShowModal(false);
      fetchBerita();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Gagal menyimpan berita. Pastikan data terisi dengan benar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, judul) => {
    if (!window.confirm(`Yakin ingin menghapus berita: "${judul}"?`)) return;
    try {
      await api.delete(`/berita/${id}`);
      setSuccess('Berita berhasil dihapus');
      fetchBerita();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Gagal menghapus berita');
    }
  };

  const filteredBerita = beritaList.filter(b => 
    b.judul?.toLowerCase().includes(search.toLowerCase()) ||
    b.kategori?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kelola Berita</h1>
            <p className="text-slate-500 text-sm">Manajemen artikel, warta pariwisata, dan siaran pers dinas</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Berita
          </button>
        </div>

        {/* Notifikasi */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto font-bold">✕</button>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Toolbar: Search & Info */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
            />
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Total Berita: <span className="text-slate-900 font-bold">{filteredBerita.length}</span>
          </div>
        </div>

        {/* Tabel Data Berita */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">Memuat data berita...</div>
          ) : filteredBerita.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Newspaper className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>Belum ada berita yang sesuai.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5 w-16">Cover</th>
                    <th className="px-6 py-3.5">Judul & Kategori</th>
                    <th className="px-6 py-3.5 w-32">Penulis</th>
                    <th className="px-6 py-3.5 w-32">Tanggal</th>
                    <th className="px-6 py-3.5 w-24">Dilihat</th>
                    <th className="px-6 py-3.5 w-28 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBerita.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-14 h-11 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {item.gambar ? (
                            <img
                              src={getImageSrc(item.gambar)}
                              alt={item.judul}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = '/hero.png'; }}
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 line-clamp-1">{item.judul}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                            {item.kategori || 'WARTA'}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">/{item.slug}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                        {item.penulis || 'Admin'}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs font-semibold">
                        {item.dilihat || 0}x
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            title="Edit"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.judul)}
                            title="Hapus"
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Form Tambah / Edit */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <h2 className="text-lg font-black text-slate-900">
                  {editId ? 'Edit Berita' : 'Tambah Berita Baru'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Judul Berita</label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan judul berita yang menarik"
                    value={form.judul}
                    onChange={handleJudulChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Slug URL</label>
                    <input
                      type="text"
                      required
                      placeholder="slug-otomatis-dari-judul"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Kategori</label>
                    <select
                      value={form.kategori}
                      onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                    >
                      {KATEGORI_OPTIONS.map((kat) => (
                        <option key={kat} value={kat}>{kat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Penulis</label>
                    <input
                      type="text"
                      value={form.penulis}
                      onChange={(e) => setForm({ ...form, penulis: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Tanggal Terbit</label>
                    <input
                      type="date"
                      value={form.tanggal}
                      onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Isi Konten Berita</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Tuliskan isi berita di sini..."
                    value={form.konten}
                    onChange={(e) => setForm({ ...form, konten: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Foto Sampul / Gambar</label>
                  <input
                    type="file"
                    ref={fileRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                  />
                  {(preview || gambarLama) && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="w-20 h-14 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        <img
                          src={preview || getImageSrc(gambarLama)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-slate-500">
                        {preview ? 'Gambar baru siap diunggah' : 'Gambar saat ini terpasang'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm text-sm cursor-pointer"
                  >
                    {submitting ? 'Menyimpan...' : editId ? 'Simpan Perubahan' : 'Terbitkan Berita'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBerita;
