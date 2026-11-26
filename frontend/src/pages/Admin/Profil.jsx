import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  FileText,
  History,
  Image as ImageIcon,
  Pencil,
  Plus,
  Search,
  Target,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import api from '../../services/api';
import { getImageSrc } from '../../utils/imageHelper';
import {
  AdminConfirmModal,
  AdminDrawer,
  AdminDropzone,
  AdminLayout,
  AdminPageShell,
  useAdminToast,
} from './components/AdminUI';
import { SCALE, SPRING, getStaggerContainer, getStaggerItem } from './adminMotion';

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
  const { showToast } = useAdminToast();
  const reduce = useReducedMotion();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [kontenList, setKontenList] = useState([]);
  const [pejabatList, setPejabatList] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [drawerMode, setDrawerMode] = useState('konten');
  const [editItem, setEditItem] = useState(null);
  const [formKonten, setFormKonten] = useState({ judul: '', konten: '', kategori: activeSub });
  const [formPejabat, setFormPejabat] = useState({ nama: '', nip: '', jabatan: '', urutan: 1 });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeSub === 'profil_pimpinan') {
        const [resPejabat, resProfil] = await Promise.all([
          api.get('/profil/pejabat').catch(() => ({ data: [] })),
          api.get('/profil/profil_pimpinan').catch(() => ({ data: [] })),
        ]);
        setPejabatList(Array.isArray(resPejabat.data) ? resPejabat.data : []);
        setKontenList(Array.isArray(resProfil.data) ? resProfil.data : []);
      } else {
        const res = await api.get(`/profil/${activeSub}`);
        setKontenList(Array.isArray(res.data) ? res.data : []);
      }
    } catch {
      showToast('Gagal memuat data profil', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeSub]);

  const currentSub = SUB_MENUS.find((s) => s.id === activeSub) || SUB_MENUS[0];

  const openAdd = () => {
    setEditItem(null);
    setFile(null);
    setPreview(null);
    if (activeSub === 'profil_pimpinan') {
      setDrawerMode('pejabat');
      setFormPejabat({ nama: '', nip: '', jabatan: '', urutan: pejabatList.length + 1 });
    } else {
      setDrawerMode('konten');
      setFormKonten({ judul: '', konten: '', kategori: activeSub });
    }
    setDrawerOpen(true);
  };

  const openEditKonten = (item) => {
    setEditItem(item);
    setDrawerMode('konten');
    setFormKonten({
      judul: item.judul || '',
      konten: item.konten || '',
      kategori: item.kategori || activeSub,
    });
    setFile(null);
    setPreview(item.gambar ? getImageSrc(item.gambar, '/images/admin/kantor-dispar.jpg') : null);
    setDrawerOpen(true);
  };

  const openEditPejabat = (item) => {
    setEditItem(item);
    setDrawerMode('pejabat');
    setFormPejabat({
      nama: item.nama || '',
      nip: item.nip || '',
      jabatan: item.jabatan || '',
      urutan: item.urutan || 1,
    });
    setFile(null);
    setPreview(item.foto ? getImageSrc(item.foto, '') : null);
    setDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      if (drawerMode === 'pejabat') {
        fd.append('nama', formPejabat.nama);
        fd.append('nip', formPejabat.nip);
        fd.append('jabatan', formPejabat.jabatan);
        fd.append('urutan', String(formPejabat.urutan || 1));
        if (file) fd.append('foto', file);
        else if (editItem?.foto) fd.append('foto_lama', editItem.foto);

        if (editItem) {
          await api.put(`/profil/pejabat/${editItem.id}`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          showToast('Data pejabat berhasil diperbarui');
        } else {
          await api.post('/profil/pejabat', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          showToast('Pejabat baru berhasil ditambahkan');
        }
      } else {
        fd.append('judul', formKonten.judul);
        fd.append('konten', formKonten.konten);
        fd.append('kategori', formKonten.kategori || activeSub);
        if (file) fd.append('gambar', file);
        else if (editItem?.gambar) fd.append('gambar_lama', editItem.gambar);

        if (editItem) {
          await api.put(`/profil/${editItem.id}`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          showToast('Konten profil berhasil diperbarui');
        } else {
          await api.post('/profil', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          showToast('Konten profil berhasil ditambahkan');
        }
      }
      setDrawerOpen(false);
      loadData();
    } catch {
      showToast('Gagal menyimpan data profil', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const endpoint =
        deleteTarget.kind === 'pejabat'
          ? `/profil/pejabat/${deleteTarget.id}`
          : `/profil/${deleteTarget.id}`;
      await api.delete(endpoint);
      showToast('Data berhasil dihapus');
      setDeleteTarget(null);
      loadData();
    } catch {
      showToast('Gagal menghapus data', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredKonten = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return kontenList;
    return kontenList.filter(
      (k) =>
        (k.judul || '').toLowerCase().includes(q) ||
        (k.konten || '').toLowerCase().includes(q)
    );
  }, [kontenList, search]);

  const filteredPejabat = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pejabatList;
    return pejabatList.filter(
      (p) =>
        (p.nama || '').toLowerCase().includes(q) ||
        (p.jabatan || '').toLowerCase().includes(q) ||
        (p.nip || '').toLowerCase().includes(q)
    );
  }, [pejabatList, search]);

  const staggerParent = getStaggerContainer(reduce);
  const staggerItem = getStaggerItem(reduce);

  return (
    <AdminLayout drawerOpen={drawerOpen}>
      <AdminPageShell>
        <div className="admin-panel glass">
          <div className="admin-panel-head">
            <div>
              <h1 className="admin-panel-title">Profil — {currentSub.label}</h1>
              <p className="admin-panel-sub">{currentSub.desc}</p>
            </div>
            <motion.button
              type="button"
              onClick={openAdd}
              className="admin-btn admin-btn-amber"
              whileTap={reduce ? undefined : { scale: SCALE.press }}
              transition={SPRING.press}
            >
              <Plus className="ic-sm" strokeWidth={2.4} />
              <span>
                {activeSub === 'profil_pimpinan' ? 'Tambah Pejabat' : `Tambah ${currentSub.label}`}
              </span>
            </motion.button>
          </div>

          <div className="admin-tabs glass" role="tablist" aria-label="Submenu Profil">
            {SUB_MENUS.map((sub) => {
              const Icon = sub.icon;
              const active = activeSub === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setSearchParams({ sub: sub.id });
                    setSearch('');
                  }}
                  className={`admin-tab ${active ? 'active' : ''}`}
                >
                  <Icon className="ic-sm" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          <div className="admin-toolbar" style={{ marginTop: 4 }}>
            <div className="admin-search-box">
              <Search className="ic" />
              <input
                type="text"
                placeholder={`Cari dalam ${currentSub.label}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="admin-count-note">
              {activeSub === 'profil_pimpinan'
                ? `${filteredPejabat.length} pejabat`
                : `${filteredKonten.length} konten`}
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="admin-skeleton" style={{ height: 76 }} />
              ))}
            </div>
          ) : activeSub === 'profil_pimpinan' ? (
            <div className="admin-table-wrap">
              {filteredPejabat.length === 0 ? (
                <div className="admin-empty-note">Belum ada data pejabat yang cocok.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Urutan</th>
                      <th>Pejabat</th>
                      <th>NIP</th>
                      <th>Jabatan</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPejabat.map((p) => (
                      <tr key={p.id}>
                        <td>{p.urutan}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div
                              className="admin-thumb"
                              style={{ width: 42, height: 42, borderRadius: 10 }}
                            >
                              {p.foto ? (
                                <img
                                  src={getImageSrc(p.foto, '')}
                                  alt={p.nama}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <User className="ic-sm" />
                              )}
                            </div>
                            <span className="admin-doc-name">{p.nama}</span>
                          </div>
                        </td>
                        <td>{p.nip || '—'}</td>
                        <td>{p.jabatan}</td>
                        <td>
                          <div className="admin-row-actions">
                            <motion.button
                              type="button"
                              onClick={() => openEditPejabat(p)}
                              className="admin-btn admin-btn-sm admin-btn-edit"
                              whileTap={reduce ? undefined : { scale: SCALE.press }}
                              transition={SPRING.press}
                            >
                              <Pencil className="ic-sm" />
                              <span>Edit</span>
                            </motion.button>
                            <motion.button
                              type="button"
                              onClick={() =>
                                setDeleteTarget({ id: p.id, label: p.nama, kind: 'pejabat' })
                              }
                              className="admin-btn admin-btn-sm admin-btn-del"
                              whileTap={reduce ? undefined : { scale: SCALE.press }}
                              transition={SPRING.press}
                            >
                              <Trash2 className="ic-sm" />
                              <span>Hapus</span>
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : filteredKonten.length === 0 ? (
            <div className="admin-empty-note">Belum ada konten pada bagian {currentSub.label}.</div>
          ) : (
            <motion.div variants={staggerParent} initial="hidden" animate="show">
              {filteredKonten.map((item) => (
                <motion.div
                  key={item.id}
                  variants={staggerItem}
                  className="admin-news-row glass"
                >
                  <div className="admin-thumb">
                    {item.gambar ? (
                      <img
                        src={getImageSrc(item.gambar, '/images/admin/kantor-dispar.jpg')}
                        alt={item.judul}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <FileText className="ic" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="admin-news-title">{item.judul}</div>
                    <div className="admin-news-date" style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {(item.konten || '').replace(/<[^>]+>/g, '').slice(0, 110) || '—'}
                    </div>
                  </div>
                  <span className="admin-badge blue">{currentSub.label}</span>
                  <div className="admin-row-actions">
                    <motion.button
                      type="button"
                      onClick={() => openEditKonten(item)}
                      className="admin-btn admin-btn-sm admin-btn-edit"
                      whileTap={reduce ? undefined : { scale: SCALE.press }}
                      transition={SPRING.press}
                    >
                      <Pencil className="ic-sm" />
                      <span>Edit</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({ id: item.id, label: item.judul, kind: 'konten' })
                      }
                      className="admin-btn admin-btn-sm admin-btn-del"
                      whileTap={reduce ? undefined : { scale: SCALE.press }}
                      transition={SPRING.press}
                    >
                      <Trash2 className="ic-sm" />
                      <span>Hapus</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </AdminPageShell>

      <AdminDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={
          drawerMode === 'pejabat'
            ? editItem
              ? 'Edit Data Pejabat'
              : 'Tambah Pejabat'
            : editItem
              ? `Edit ${currentSub.label}`
              : `Tambah ${currentSub.label}`
        }
        submitting={submitting}
        onSubmit={handleSubmit}
      >
        {drawerMode === 'pejabat' ? (
          <>
            <div className="admin-d-field">
              <label htmlFor="pejabatNama">Nama Lengkap</label>
              <input
                id="pejabatNama"
                type="text"
                placeholder="Masukkan nama pejabat"
                value={formPejabat.nama}
                onChange={(e) => setFormPejabat((f) => ({ ...f, nama: e.target.value }))}
                required
              />
            </div>
            <div className="admin-d-field">
              <label htmlFor="pejabatNip">NIP</label>
              <input
                id="pejabatNip"
                type="text"
                placeholder="Nomor Induk Pegawai"
                value={formPejabat.nip}
                onChange={(e) => setFormPejabat((f) => ({ ...f, nip: e.target.value }))}
              />
            </div>
            <div className="admin-d-field">
              <label htmlFor="pejabatJabatan">Jabatan</label>
              <input
                id="pejabatJabatan"
                type="text"
                placeholder="cth: Kepala Dinas Pariwisata"
                value={formPejabat.jabatan}
                onChange={(e) => setFormPejabat((f) => ({ ...f, jabatan: e.target.value }))}
                required
              />
            </div>
            <div className="admin-d-field">
              <label htmlFor="pejabatUrutan">Urutan Tampil</label>
              <input
                id="pejabatUrutan"
                type="number"
                min="1"
                value={formPejabat.urutan}
                onChange={(e) => setFormPejabat((f) => ({ ...f, urutan: e.target.value }))}
              />
            </div>
            <div className="admin-d-field">
              <label>Foto Pejabat</label>
              <AdminDropzone
                accept="image/jpeg,image/png,image/webp,image/jpg"
                previewUrl={preview}
                fileName={file?.name}
                onFileSelect={(f) => {
                  setFile(f);
                  setPreview(URL.createObjectURL(f));
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="admin-d-field">
              <label htmlFor="profilJudul">Judul</label>
              <input
                id="profilJudul"
                type="text"
                placeholder={`Masukkan judul ${currentSub.label}`}
                value={formKonten.judul}
                onChange={(e) => setFormKonten((f) => ({ ...f, judul: e.target.value }))}
                required
              />
            </div>
            <div className="admin-d-field">
              <label htmlFor="profilKonten">Isi Konten</label>
              <textarea
                id="profilKonten"
                rows={6}
                placeholder="Tulis isi konten..."
                value={formKonten.konten}
                onChange={(e) => setFormKonten((f) => ({ ...f, konten: e.target.value }))}
              />
            </div>
            <div className="admin-d-field">
              <label>Gambar / Lampiran (Opsional)</label>
              <AdminDropzone
                accept="image/*,.pdf"
                previewUrl={preview}
                fileName={file?.name}
                onFileSelect={(f) => {
                  setFile(f);
                  if (f.type.startsWith('image/')) setPreview(URL.createObjectURL(f));
                }}
              />
            </div>
          </>
        )}
      </AdminDrawer>

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Data Profil"
        message={`Yakin ingin menghapus "${deleteTarget?.label}"?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
};

export default AdminProfil;
