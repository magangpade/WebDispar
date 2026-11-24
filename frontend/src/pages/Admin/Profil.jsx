import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Building2, Users, FileText, Image as ImageIcon, BookOpen, Target, 
  History, Plus, Edit3, Trash2, Search, AlertCircle, CheckCircle2, 
  Upload, X, Shield, ChevronRight
} from 'lucide-react';
import { AdminLayout } from './Dashboard';
import api from '../../services/api';
import { getImageSrc } from '../../utils/imageHelper';

const SUB_MENUS = [
  { id: 'sejarah', label: 'Sejarah', icon: History, desc: 'Kelola catatan sejarah Dinas Pariwisata' },
  { id: 'visi_misi', label: 'Visi & Misi', icon: Target, desc: 'Kelola Visi dan Misi Pariwisata Sulteng' },
  { id: 'profil_pimpinan', label: 'Profil Pimpinan', icon: Users, desc: 'Daftar & bio pimpinan / pejabat struktural' },
  { id: 'tupoksi', label: 'Tupoksi', icon: FileText, desc: 'Tugas Pokok & Fungsi Dinas Pariwisata' },
  { id: 'majalah', label: 'Majalah', icon: BookOpen, desc: 'Publikasi dan majalah promosi pariwisata' },
  { id: 'logo', label: 'Logo Resmi', icon: ImageIcon, desc: 'Aset branding, lambang, dan logo resmi' },
];

const AdminProfil = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSub = searchParams.get('sub') || 'sejarah';

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data states
  const [kontenList, setKontenList] = useState([]);
  const [pejabatList, setPejabatList] = useState([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('konten'); // 'konten' | 'pejabat'
  const [editId, setEditId] = useState(null);

  // Forms
  const [formKonten, setFormKonten] = useState({
    judul: '',
    konten: '',
    kategori: activeSub,
  });
  const [formPejabat, setFormPejabat] = useState({
    nama: '',
    nip: '',
    jabatan: '',
    urutan: 1,
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [gambarLama, setGambarLama] = useState(null);
  const fileRef = useRef();

  const handleSubChange = (id) => {
    setSearchParams({ sub: id });
    setSearch('');
    setError('');
    setSuccess('');
  };

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeSub === 'profil_pimpinan') {
        const [resPejabat, resProfil] = await Promise.all([
          api.get('/profil/pejabat'),
          api.get('/profil/profil_pimpinan'),
        ]);
        setPejabatList(resPejabat.data || []);
        setKontenList(resProfil.data || []);
      } else {
        const res = await api.get(`/profil/${activeSub}`);
        setKontenList(res.data || []);
      }
    } catch {
      setError('Gagal memuat data profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeSub]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // Open Modal Konten (Sejarah, Visi Misi, Tupoksi, Majalah, Logo, dsb.)
  const openAddKontenModal = () => {
    setModalType('konten');
    setEditId(null);
    setFormKonten({
      judul: '',
      konten: '',
      kategori: activeSub,
    });
    setFile(null);
    setPreview(null);
    setGambarLama(null);
    setShowModal(true);
  };

  const openEditKontenModal = (item) => {
    setModalType('konten');
    setEditId(item.id);
    setFormKonten({
      judul: item.judul || '',
      konten: item.konten || '',
      kategori: item.kategori || activeSub,
    });
    setFile(null);
    setPreview(null);
    setGambarLama(item.gambar);
    setShowModal(true);
  };

  // Open Modal Pejabat
  const openAddPejabatModal = () => {
    setModalType('pejabat');
    setEditId(null);
    setFormPejabat({
      nama: '',
      nip: '',
      jabatan: '',
      urutan: (pejabatList.length + 1),
    });
    setFile(null);
    setPreview(null);
    setGambarLama(null);
    setShowModal(true);
  };

  const openEditPejabatModal = (item) => {
    setModalType('pejabat');
    setEditId(item.id);
    setFormPejabat({
      nama: item.nama || '',
      nip: item.nip || '',
      jabatan: item.jabatan || '',
      urutan: item.urutan || 0,
    });
    setFile(null);
    setPreview(null);
    setGambarLama(item.foto);
    setShowModal(true);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();

      if (modalType === 'pejabat') {
        formData.append('nama', formPejabat.nama);
        formData.append('nip', formPejabat.nip);
        formData.append('jabatan', formPejabat.jabatan);
        formData.append('urutan', formPejabat.urutan);
        if (file) {
          formData.append('foto', file);
        } else if (gambarLama) {
          formData.append('foto_lama', gambarLama);
        }

        if (editId) {
          await api.put(`/profil/pejabat/${editId}`, formData);
          setSuccess('Data Pejabat berhasil diperbarui!');
        } else {
          await api.post('/profil/pejabat', formData);
          setSuccess('Pejabat baru berhasil ditambahkan!');
        }
      } else {
        formData.append('judul', formKonten.judul);
        formData.append('konten', formKonten.konten);
        formData.append('kategori', formKonten.kategori || activeSub);
        if (file) {
          formData.append('gambar', file);
        } else if (gambarLama) {
          formData.append('gambar_lama', gambarLama);
        }

        if (editId) {
          await api.put(`/profil/${editId}`, formData);
          setSuccess('Konten profil berhasil diperbarui!');
        } else {
          await api.post('/profil', formData);
          setSuccess('Konten baru berhasil ditambahkan!');
        }
      }

      setShowModal(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDeleteKonten = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus item "${title}"?`)) return;
    try {
      await api.delete(`/profil/${id}`);
      setSuccess('Item berhasil dihapus');
      loadData();
    } catch {
      setError('Gagal menghapus item');
    }
  };

  const handleDeletePejabat = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus pejabat "${nama}"?`)) return;
    try {
      await api.delete(`/profil/pejabat/${id}`);
      setSuccess('Pejabat berhasil dihapus');
      loadData();
    } catch {
      setError('Gagal menghapus pejabat');
    }
  };

  const currentSubInfo = SUB_MENUS.find((s) => s.id === activeSub) || SUB_MENUS[0];

  const filteredKonten = kontenList.filter((k) =>
    (k.judul || '').toLowerCase().includes(search.toLowerCase()) ||
    (k.konten || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredPejabat = pejabatList.filter((p) =>
    (p.nama || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.jabatan || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.nip || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" /> Kelola Informasi Profil
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {currentSubInfo.label}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {currentSubInfo.desc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeSub === 'profil_pimpinan' ? (
              <button
                onClick={openAddPejabatModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1F5BA6] to-[#383087] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Tambah Pejabat
              </button>
            ) : (
              <button
                onClick={openAddKontenModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1F5BA6] to-[#383087] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Tambah {currentSubInfo.label}
              </button>
            )}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="flex-1">{success}</span>
            <button onClick={() => setSuccess('')}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Sub-menu Tabs (Navigasi Antar Fitur Profil) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
          {SUB_MENUS.map((sub) => {
            const isActive = activeSub === sub.id;
            const Icon = sub.icon;
            return (
              <button
                key={sub.id}
                onClick={() => handleSubChange(sub.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1F5BA6] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Cari dalam ${currentSubInfo.label}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm outline-none bg-transparent"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
              Reset
            </button>
          )}
        </div>

        {/* Main Content Render */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">Memuat data {currentSubInfo.label}...</p>
          </div>
        ) : activeSub === 'profil_pimpinan' ? (
          /* Khusus Profil Pimpinan: Tampilkan Tabel Pejabat Struktural */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Daftar Pejabat & Pimpinan ({filteredPejabat.length})
              </span>
            </div>

            {filteredPejabat.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                Belum ada data pejabat yang cocok.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100/60 text-slate-600 text-xs uppercase font-extrabold border-b border-slate-200">
                      <th className="py-3 px-4 w-12 text-center">No</th>
                      <th className="py-3 px-4 w-20 text-center">Foto</th>
                      <th className="py-3 px-4">Nama & NIP</th>
                      <th className="py-3 px-4">Jabatan</th>
                      <th className="py-3 px-4 w-24 text-center">Urutan</th>
                      <th className="py-3 px-4 w-28 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPejabat.map((item, index) => (
                      <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3.5 px-4 text-center text-xs font-bold text-slate-400">
                          {index + 1}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="w-12 h-12 mx-auto rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                            {item.foto ? (
                              <img
                                src={getImageSrc(item.foto)}
                                alt={item.nama}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.src = '/images/ProfilPimpinan/kadis_diah.jpg'; }}
                              />
                            ) : (
                              <Users className="w-6 h-6 text-slate-300" />
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{item.nama}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{item.nip || 'NIP: -'}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 text-xs font-medium">
                          {item.jabatan}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-600 text-xs">
                          {item.urutan}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openEditPejabatModal(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Pejabat"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePejabat(item.id, item.nama)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Pejabat"
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
        ) : (
          /* Konten Profil Umum (Sejarah, Visi Misi, Tupoksi, Majalah, Logo) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKonten.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
                Belum ada konten untuk kategori {currentSubInfo.label}. Klik "Tambah {currentSubInfo.label}" untuk membuat baru.
              </div>
            ) : (
              filteredKonten.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {item.gambar && (
                      <div className="h-44 w-full bg-slate-100 overflow-hidden border-b border-slate-100 flex items-center justify-center p-2">
                        <img
                          src={getImageSrc(item.gambar)}
                          alt={item.judul}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1F5BA6] font-bold text-[10px] uppercase mb-2 border border-blue-100">
                        {item.kategori}
                      </span>
                      <h3 className="font-black text-slate-900 text-base leading-snug line-clamp-2 mb-2">
                        {item.judul}
                      </h3>
                      <div
                        className="text-xs text-slate-600 line-clamp-4 prose prose-slate"
                        dangerouslySetInnerHTML={{ __html: item.konten?.replace(/<[^>]+>/g, ' ').slice(0, 180) + '...' }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">ID #{item.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditKontenModal(item)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteKonten(item.id, item.judul)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <h3 className="text-lg font-black text-slate-900">
                  {modalType === 'pejabat'
                    ? (editId ? 'Edit Pejabat' : 'Tambah Pejabat Baru')
                    : (editId ? `Edit Konten (${currentSubInfo.label})` : `Tambah Konten ${currentSubInfo.label}`)}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {modalType === 'pejabat' ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nama Lengkap Beserta Gelar *
                      </label>
                      <input
                        type="text"
                        required
                        value={formPejabat.nama}
                        onChange={(e) => setFormPejabat({ ...formPejabat, nama: e.target.value })}
                        placeholder="Contoh: Dra. Diah Agustiningsih, M.Pd"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          NIP
                        </label>
                        <input
                          type="text"
                          value={formPejabat.nip}
                          onChange={(e) => setFormPejabat({ ...formPejabat, nip: e.target.value })}
                          placeholder="Contoh: 196808251994122006"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Urutan Tampilan
                        </label>
                        <input
                          type="number"
                          value={formPejabat.urutan}
                          onChange={(e) => setFormPejabat({ ...formPejabat, urutan: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 outline-none font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Jabatan Struktural *
                      </label>
                      <input
                        type="text"
                        required
                        value={formPejabat.jabatan}
                        onChange={(e) => setFormPejabat({ ...formPejabat, jabatan: e.target.value })}
                        placeholder="Contoh: Kepala Dinas"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Judul Konten / Dokumen *
                      </label>
                      <input
                        type="text"
                        required
                        value={formKonten.judul}
                        onChange={(e) => setFormKonten({ ...formKonten, judul: e.target.value })}
                        placeholder={`Masukkan judul ${currentSubInfo.label}`}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 outline-none font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Isi Konten / Deskripsi (HTML / Teks)
                      </label>
                      <textarea
                        rows={8}
                        value={formKonten.konten}
                        onChange={(e) => setFormKonten({ ...formKonten, konten: e.target.value })}
                        placeholder="Tuliskan isi artikel, sejarah, atau kode HTML..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 outline-none font-mono text-xs"
                      />
                    </div>
                  </>
                )}

                {/* File / Foto Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {modalType === 'pejabat' ? 'Foto Pejabat' : 'Gambar / Banner'}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      ref={fileRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    {(preview || gambarLama) && (
                      <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden shrink-0">
                        <img
                          src={preview || getImageSrc(gambarLama)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#1F5BA6] text-white hover:bg-blue-700 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Menyimpan...' : 'Simpan Data'}
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

export default AdminProfil;
