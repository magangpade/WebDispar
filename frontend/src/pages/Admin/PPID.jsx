import { useState, useEffect, useRef } from 'react';
import { FileText, Plus, Trash2, Search, AlertCircle, CheckCircle2, Download, Upload, ExternalLink, X } from 'lucide-react';
import { AdminLayout } from './Dashboard';
import api from '../../services/api';

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || '';

const AdminPPID = () => {
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'regulasi' | 'sk'
  const [kategoriList, setKategoriList] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [regulasiList, setRegulasiList] = useState([]);
  const [skList, setSKList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedKat, setSelectedKat] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [itemForm, setItemForm] = useState({
    kategori_id: '',
    judul: '',
    link: '',
    tahun: new Date().getFullYear().toString()
  });
  const [regulasiForm, setRegulasiForm] = useState({
    judul: '',
    kategori: 'umum'
  });
  const [skForm, setSkForm] = useState({
    judul: '',
    tahun: new Date().getFullYear().toString()
  });

  const [file, setFile] = useState(null);
  const fileRef = useRef();

  // Load Kategori
  const fetchKategori = async () => {
    try {
      const res = await api.get('/ppid/kategori');
      setKategoriList(res.data || []);
      if (res.data?.length > 0 && !selectedKat) {
        setSelectedKat(String(res.data[0].id));
      }
    } catch {
      // Fallback
    }
  };

  // Load Data sesuai Tab
  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'items') {
        if (selectedKat) {
          const res = await api.get(`/ppid/items/${selectedKat}`);
          setItemsList(res.data || []);
        }
      } else if (activeTab === 'regulasi') {
        const res = await api.get('/ppid/regulasi');
        setRegulasiList(res.data || []);
      } else if (activeTab === 'sk') {
        const res = await api.get('/ppid/sk');
        setSKList(res.data || []);
      }
    } catch {
      setError('Gagal memuat data PPID');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  useEffect(() => {
    loadData();
  }, [activeTab, selectedKat]);

  const openModal = () => {
    setFile(null);
    if (fileRef.current) fileRef.current.value = '';
    if (activeTab === 'items') {
      setItemForm({
        kategori_id: selectedKat || (kategoriList[0]?.id ? String(kategoriList[0].id) : ''),
        judul: '',
        link: '',
        tahun: new Date().getFullYear().toString()
      });
    } else if (activeTab === 'regulasi') {
      setRegulasiForm({ judul: '', kategori: 'umum' });
    } else if (activeTab === 'sk') {
      setSkForm({ judul: '', tahun: new Date().getFullYear().toString() });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const fd = new FormData();
      if (file) fd.append('file', file);

      if (activeTab === 'items') {
        if (!itemForm.judul.trim()) { setError('Judul dokumen wajib diisi'); setSubmitting(false); return; }
        fd.append('kategori_id', itemForm.kategori_id);
        fd.append('judul', itemForm.judul);
        fd.append('link', itemForm.link);
        fd.append('tahun', itemForm.tahun);
        await api.post('/ppid/items', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setSuccess('Dokumen PPID berhasil ditambahkan');
      } else if (activeTab === 'regulasi') {
        if (!regulasiForm.judul.trim()) { setError('Judul regulasi wajib diisi'); setSubmitting(false); return; }
        fd.append('judul', regulasiForm.judul);
        fd.append('kategori', regulasiForm.kategori);
        await api.post('/ppid/regulasi', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setSuccess('Regulasi berhasil ditambahkan');
      } else if (activeTab === 'sk') {
        if (!skForm.judul.trim()) { setError('Judul SK wajib diisi'); setSubmitting(false); return; }
        fd.append('judul', skForm.judul);
        fd.append('tahun', skForm.tahun);
        await api.post('/ppid/sk', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setSuccess('SK PPID berhasil ditambahkan');
      }

      setShowModal(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Gagal mengunggah dokumen');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus: "${title}"?`)) return;
    try {
      if (activeTab === 'items') {
        await api.delete(`/ppid/items/${id}`);
      } else if (activeTab === 'regulasi') {
        await api.delete(`/ppid/regulasi/${id}`);
      } else if (activeTab === 'sk') {
        await api.delete(`/ppid/sk/${id}`);
      }
      setSuccess('Dokumen berhasil dihapus');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Gagal menghapus dokumen');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kelola Dokumen PPID</h1>
            <p className="text-slate-500 text-sm">Transparansi dokumen publik, regulasi kepariwisataan, dan Surat Keputusan (SK)</p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Unggah Dokumen
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

        {/* Tab Navigasi */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'items'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" /> Daftar Informasi Publik
          </button>
          <button
            onClick={() => setActiveTab('regulasi')}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'regulasi'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" /> Regulasi Resmi
          </button>
          <button
            onClick={() => setActiveTab('sk')}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'sk'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" /> Surat Keputusan (SK)
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari judul dokumen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
              />
            </div>

            {activeTab === 'items' && (
              <select
                value={selectedKat}
                onChange={(e) => setSelectedKat(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50 text-slate-700"
              >
                {kategoriList.map((kat) => (
                  <option key={kat.id} value={kat.id}>{kat.nama}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">Memuat data dokumen...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5 w-12">No</th>
                    <th className="px-6 py-3.5">Judul Dokumen</th>
                    {activeTab === 'items' && <th className="px-6 py-3.5 w-28">Tahun</th>}
                    {activeTab === 'regulasi' && <th className="px-6 py-3.5 w-32">Kategori</th>}
                    {activeTab === 'sk' && <th className="px-6 py-3.5 w-28">Tahun</th>}
                    <th className="px-6 py-3.5 w-36">Berkas / Link</th>
                    <th className="px-6 py-3.5 w-24 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* TAB ITEMS */}
                  {activeTab === 'items' && itemsList
                    .filter(i => i.judul?.toLowerCase().includes(search.toLowerCase()))
                    .map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{item.judul}</td>
                        <td className="px-6 py-4 text-slate-600 text-xs font-semibold">{item.tahun || '-'}</td>
                        <td className="px-6 py-4">
                          {item.file ? (
                            <a
                              href={`${BASE_URL}/uploads/${item.file}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-semibold"
                            >
                              <Download className="w-3.5 h-3.5" /> Unduh PDF
                            </a>
                          ) : item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:underline font-semibold"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Buka Tautan
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">Tidak ada file</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(item.id, item.judul)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}

                  {/* TAB REGULASI */}
                  {activeTab === 'regulasi' && regulasiList
                    .filter(r => r.judul?.toLowerCase().includes(search.toLowerCase()))
                    .map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{item.judul}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                            {item.kategori || 'umum'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {item.file ? (
                            <a
                              href={item.file.startsWith('/') ? item.file : `${BASE_URL}/uploads/${item.file}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-semibold"
                            >
                              <Download className="w-3.5 h-3.5" /> Unduh PDF
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(item.id, item.judul)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}

                  {/* TAB SK */}
                  {activeTab === 'sk' && skList
                    .filter(s => s.judul?.toLowerCase().includes(search.toLowerCase()))
                    .map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{item.judul}</td>
                        <td className="px-6 py-4 text-slate-600 text-xs font-semibold">{item.tahun || '-'}</td>
                        <td className="px-6 py-4">
                          {item.file ? (
                            <a
                              href={`${BASE_URL}/uploads/${item.file}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-semibold"
                            >
                              <Download className="w-3.5 h-3.5" /> Unduh SK
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(item.id, item.judul)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Form Tambah */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <h2 className="text-lg font-black text-slate-900">
                  {activeTab === 'items' && 'Unggah Informasi Publik Baru'}
                  {activeTab === 'regulasi' && 'Tambah Dokumen Regulasi'}
                  {activeTab === 'sk' && 'Unggah Surat Keputusan (SK)'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === 'items' && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Kategori Informasi</label>
                      <select
                        value={itemForm.kategori_id}
                        onChange={(e) => setItemForm({ ...itemForm, kategori_id: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                      >
                        {kategoriList.map((kat) => (
                          <option key={kat.id} value={kat.id}>{kat.nama}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Judul Dokumen</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Rencana Strategis (Renstra) 2024-2026"
                        value={itemForm.judul}
                        onChange={(e) => setItemForm({ ...itemForm, judul: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Tahun</label>
                        <input
                          type="text"
                          value={itemForm.tahun}
                          onChange={(e) => setItemForm({ ...itemForm, tahun: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Tautan Eksternal (Opsional)</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={itemForm.link}
                          onChange={(e) => setItemForm({ ...itemForm, link: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'regulasi' && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Judul Regulasi</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Perda No. 2 Tahun 2024 tentang Ripparda"
                        value={regulasiForm.judul}
                        onChange={(e) => setRegulasiForm({ ...regulasiForm, judul: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Kategori Regulasi</label>
                      <select
                        value={regulasiForm.kategori}
                        onChange={(e) => setRegulasiForm({ ...regulasiForm, kategori: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                      >
                        <option value="umum">Umum / Kepariwisataan</option>
                        <option value="perda">Peraturan Daerah (Perda)</option>
                        <option value="pergub">Peraturan Gubernur (Pergub)</option>
                        <option value="ppid">Keterbukaan Informasi (PPID)</option>
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'sk' && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Judul SK</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: SK Pengelola PPID Pelaksana Tahun 2025"
                        value={skForm.judul}
                        onChange={(e) => setSkForm({ ...skForm, judul: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Tahun</label>
                      <input
                        type="text"
                        value={skForm.tahun}
                        onChange={(e) => setSkForm({ ...skForm, tahun: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Upload Berkas PDF</label>
                  <input
                    type="file"
                    ref={fileRef}
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files[0] || null)}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Format PDF atau dokumen resmi dinas.</p>
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
                    {submitting ? 'Mengunggah...' : 'Simpan Dokumen'}
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

export default AdminPPID;
