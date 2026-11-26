import { useState, useEffect, useRef } from 'react';
import { MapPin, Plus, Trash2, Edit3, Search, AlertCircle, CheckCircle2, Image as ImageIcon, X } from 'lucide-react';
import { AdminLayout } from './Dashboard';
import api from '../../services/api';
import { getImageSrc } from '../../utils/imageHelper';

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || '';

const KABUPATEN_OPTIONS = [
  'Kota Palu',
  'Kabupaten Donggala',
  'Kabupaten Sigi',
  'Kabupaten Parigi Moutong',
  'Kabupaten Poso',
  'Kabupaten Tojo Una-Una',
  'Kabupaten Banggai',
  'Kabupaten Banggai Kepulauan',
  'Kabupaten Banggai Laut',
  'Kabupaten Morowali',
  'Kabupaten Morowali Utara',
  'Kabupaten Tolitoli',
  'Kabupaten Buol'
];

const AdminDTW = () => {
  const [dtwList, setDtwList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filterKab, setFilterKab] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal / Form
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    kabupaten: 'Kota Palu',
    judul: '',
    deskripsi: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [gambarLama, setGambarLama] = useState(null);
  const fileRef = useRef();

  const fetchDTW = async () => {
    setLoading(true);
    try {
      const res = await api.get('/info-pariwisata/dtw');
      setDtwList(res.data || []);
    } catch {
      setError('Gagal memuat daftar Daya Tarik Wisata');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDTW();
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const openAddModal = () => {
    setEditId(null);
    setForm({
      kabupaten: 'Kota Palu',
      judul: '',
      deskripsi: ''
    });
    setFile(null);
    setPreview(null);
    setGambarLama(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditId(item.id);
    setForm({
      kabupaten: item.kabupaten || 'Kota Palu',
      judul: item.judul || '',
      deskripsi: item.deskripsi || ''
    });
    setFile(null);
    setPreview(null);
    setGambarLama(item.gambar);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.judul.trim()) {
      setError('Nama / Judul Daya Tarik Wisata wajib diisi');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('kabupaten', form.kabupaten);
      fd.append('judul', form.judul);
      fd.append('deskripsi', form.deskripsi);

      if (file) {
        fd.append('gambar', file);
      } else if (gambarLama) {
        fd.append('gambar_lama', gambarLama);
      }

      if (editId) {
        await api.put(`/info-pariwisata/dtw/${editId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Daya Tarik Wisata berhasil diperbarui');
      } else {
        await api.post('/info-pariwisata/dtw', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Daya Tarik Wisata baru berhasil ditambahkan');
      }

      setShowModal(false);
      fetchDTW();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Gagal menyimpan DTW. Silakan coba kembali.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, judul) => {
    if (!window.confirm(`Yakin ingin menghapus DTW: "${judul}"?`)) return;
    try {
      await api.delete(`/info-pariwisata/dtw/${id}`);
      setSuccess('DTW berhasil dihapus');
      fetchDTW();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Gagal menghapus DTW');
    }
  };

  const filteredDTW = dtwList.filter(item => {
    const matchSearch = item.judul?.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi?.toLowerCase().includes(search.toLowerCase());
    const matchKab = filterKab ? item.kabupaten === filterKab : true;
    return matchSearch && matchKab;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kelola Daya Tarik Wisata (DTW)</h1>
            <p className="text-slate-500 text-sm">Objek wisata alam, bahari, sejarah, dan budaya di Sulawesi Tengah</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Destinasi
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

        {/* Filter & Pencarian */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama objek wisata..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
              />
            </div>
            <select
              value={filterKab}
              onChange={(e) => setFilterKab(e.target.value)}
              className="w-full sm:w-60 px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50 text-slate-700"
            >
              <option value="">Semua Wilayah Kabupaten / Kota</option>
              {KABUPATEN_OPTIONS.map((kab) => (
                <option key={kab} value={kab}>{kab}</option>
              ))}
            </select>
          </div>
          <div className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Total Destinasi: <span className="text-slate-900 font-bold">{filteredDTW.length}</span>
          </div>
        </div>

        {/* Grid List DTW */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 font-medium">
            Memuat data DTW...
          </div>
        ) : filteredDTW.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>Tidak ada data Daya Tarik Wisata yang cocok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDTW.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                <div className="h-44 bg-slate-100 relative overflow-hidden">
                  {item.gambar ? (
                    <img
                      src={getImageSrc(item.gambar)}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.currentTarget.src = '/hero.png'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-[#0b192c]/80 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/10">
                    {item.kabupaten || 'Sulawesi Tengah'}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 mb-1.5">{item.judul}</h3>
                    <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed mb-4">
                      {item.deskripsi || 'Tidak ada deskripsi detail.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">ID #{item.id}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        title="Edit DTW"
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.judul)}
                        title="Hapus DTW"
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <h2 className="text-lg font-black text-slate-900">
                  {editId ? 'Edit Daya Tarik Wisata' : 'Tambah Destinasi DTW Baru'}
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
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Wilayah Kabupaten / Kota</label>
                  <select
                    value={form.kabupaten}
                    onChange={(e) => setForm({ ...form, kabupaten: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                  >
                    {KABUPATEN_OPTIONS.map((kab) => (
                      <option key={kab} value={kab}>{kab}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Nama Daya Tarik Wisata</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Danau Poso, Tanjung Karang"
                    value={form.judul}
                    onChange={(e) => setForm({ ...form, judul: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Deskripsi & Daya Tarik Utama</label>
                  <textarea
                    rows={4}
                    placeholder="Jelaskan keindahan, rute akses, atau fasilitas objek wisata ini..."
                    value={form.deskripsi}
                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Foto Dokumentasi Wisata</label>
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
                        {preview ? 'Gambar baru siap diunggah' : 'Gambar terpasang'}
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
                    {submitting ? 'Menyimpan...' : editId ? 'Simpan Perubahan' : 'Tambah DTW'}
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

export default AdminDTW;
