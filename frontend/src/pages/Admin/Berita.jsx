import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, Newspaper, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { getImageSrc } from '../../utils/imageHelper';
import {
  KATEGORI_BERITA_OPTIONS,
  formatDateId,
  getBeritaBadgeTone,
} from './adminConstants';
import {
  AdminConfirmModal,
  AdminDrawer,
  AdminDropzone,
  AdminLayout,
  AdminPageShell,
  useAdminToast,
} from './components/AdminUI';
import { SCALE, SPRING, getStaggerContainer, getStaggerItem } from './adminMotion';

const generateSlug = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const emptyForm = () => ({
  judul: '',
  slug: '',
  konten: '',
  kategori: 'WARTA PARIWISATA',
  penulis: 'Admin Dispar',
  tanggal: new Date().toISOString().split('T')[0],
});

const AdminBerita = () => {
  const { showToast } = useAdminToast();
  const reduce = useReducedMotion();

  const [beritaList, setBeritaList] = useState([]);
  const [totalBerita, setTotalBerita] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBerita = async () => {
    setLoading(true);
    try {
      const res = await api.get('/berita?limit=150');
      setBeritaList(res.data?.data || []);
      setTotalBerita(res.data?.total || (res.data?.data?.length ?? 0));
    } catch {
      showToast('Gagal memuat daftar berita', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm());
    setFile(null);
    setPreview(null);
    setDrawerOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      judul: item.judul || '',
      slug: item.slug || '',
      konten: item.konten || '',
      kategori: item.kategori || 'WARTA PARIWISATA',
      penulis: item.penulis || 'Admin Dispar',
      tanggal: item.tanggal ? String(item.tanggal).split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setFile(null);
    setPreview(item.gambar ? getImageSrc(item.gambar, '/images/admin/danau-lindu.jpg') : null);
    setDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.judul.trim()) {
      showToast('Judul berita tidak boleh kosong', 'error');
      return;
    }
    setSubmitting(true);
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
      } else if (editItem?.gambar) {
        fd.append('gambar_lama', editItem.gambar);
      }

      if (editItem) {
        await api.put(`/berita/${editItem.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Berita berhasil diperbarui');
      } else {
        await api.post('/berita', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Berita baru berhasil ditambahkan');
      }
      setDrawerOpen(false);
      fetchBerita();
    } catch {
      showToast('Gagal menyimpan berita', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/berita/${deleteTarget.id}`);
      showToast('Berita berhasil dihapus');
      setDeleteTarget(null);
      fetchBerita();
    } catch {
      showToast('Gagal menghapus berita', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return beritaList;
    return beritaList.filter(
      (b) =>
        (b.judul || '').toLowerCase().includes(q) ||
        (b.kategori || '').toLowerCase().includes(q)
    );
  }, [beritaList, search]);

  const kategoriSelectOptions = useMemo(() => {
    const set = new Set(KATEGORI_BERITA_OPTIONS);
    if (form.kategori) set.add(form.kategori);
    return Array.from(set);
  }, [form.kategori]);

  const staggerParent = getStaggerContainer(reduce);
  const staggerItem = getStaggerItem(reduce);

  return (
    <AdminLayout drawerOpen={drawerOpen}>
      <AdminPageShell>
        <div className="admin-panel glass">
          <div className="admin-panel-head">
            <div>
              <h1 className="admin-panel-title">Berita</h1>
              <p className="admin-panel-sub">
                Kelola berita dan artikel website Dinas Pariwisata Provinsi Sulawesi Tengah.
              </p>
            </div>
            <motion.button
              type="button"
              onClick={openAdd}
              className="admin-btn admin-btn-amber"
              whileTap={reduce ? undefined : { scale: SCALE.press }}
              transition={SPRING.press}
            >
              <Plus className="ic-sm" strokeWidth={2.4} />
              <span>Tambah Berita</span>
            </motion.button>
          </div>

          <div className="admin-toolbar">
            <div className="admin-search-box">
              <Search className="ic" />
              <input
                type="text"
                placeholder="Cari judul berita atau kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="admin-count-note">
              Menampilkan {filtered.length} dari {totalBerita} berita
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="admin-skeleton" style={{ height: 90 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty-note">Tidak ada berita yang cocok dengan pencarian.</div>
          ) : (
            <motion.div variants={staggerParent} initial="hidden" animate="show">
              {filtered.map((item) => {
                const tone = getBeritaBadgeTone(item.kategori);
                return (
                  <motion.div
                    key={item.id}
                    variants={staggerItem}
                    className="admin-news-row glass"
                  >
                    <div className="admin-thumb">
                      {item.gambar ? (
                        <img
                          src={getImageSrc(item.gambar, '/images/admin/danau-lindu.jpg')}
                          alt={item.judul}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Newspaper className="ic" />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="admin-news-title">{item.judul}</div>
                      <div className="admin-news-date">
                        <Calendar className="ic-sm" />
                        <span>{formatDateId(item.tanggal)}</span>
                        <span>•</span>
                        <span>{item.penulis || 'Admin'}</span>
                      </div>
                    </div>

                    <span className={`admin-badge ${tone}`}>{item.kategori || 'Berita'}</span>

                    <div className="admin-row-actions">
                      <motion.button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="admin-btn admin-btn-sm admin-btn-edit"
                        whileTap={reduce ? undefined : { scale: SCALE.press }}
                        transition={SPRING.press}
                      >
                        <Pencil className="ic-sm" />
                        <span>Edit</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="admin-btn admin-btn-sm admin-btn-del"
                        whileTap={reduce ? undefined : { scale: SCALE.press }}
                        transition={SPRING.press}
                      >
                        <Trash2 className="ic-sm" />
                        <span>Hapus</span>
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </AdminPageShell>

      <AdminDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editItem ? 'Edit Berita' : 'Tambah Berita'}
        submitting={submitting}
        onSubmit={handleSubmit}
      >
        <div className="admin-d-field">
          <label htmlFor="beritaJudul">Judul Berita</label>
          <input
            id="beritaJudul"
            type="text"
            placeholder="Masukkan judul berita"
            value={form.judul}
            onChange={(e) => {
              const val = e.target.value;
              setForm((prev) => ({
                ...prev,
                judul: val,
                slug: editItem ? prev.slug : generateSlug(val),
              }));
            }}
            required
          />
        </div>
        <div className="admin-d-field">
          <label htmlFor="beritaSlug">Slug URL</label>
          <input
            id="beritaSlug"
            type="text"
            placeholder="otomatis-dari-judul"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
        </div>
        <div className="admin-d-field">
          <label htmlFor="beritaKategori">Kategori</label>
          <select
            id="beritaKategori"
            value={form.kategori}
            onChange={(e) => setForm((f) => ({ ...f, kategori: e.target.value }))}
          >
            {kategoriSelectOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="admin-d-field">
            <label htmlFor="beritaPenulis">Penulis</label>
            <input
              id="beritaPenulis"
              type="text"
              value={form.penulis}
              onChange={(e) => setForm((f) => ({ ...f, penulis: e.target.value }))}
            />
          </div>
          <div className="admin-d-field">
            <label htmlFor="beritaTanggal">Tanggal</label>
            <input
              id="beritaTanggal"
              type="date"
              value={form.tanggal}
              onChange={(e) => setForm((f) => ({ ...f, tanggal: e.target.value }))}
            />
          </div>
        </div>
        <div className="admin-d-field">
          <label htmlFor="beritaKonten">Isi Berita</label>
          <textarea
            id="beritaKonten"
            rows={5}
            placeholder="Tulis isi berita di sini..."
            value={form.konten}
            onChange={(e) => setForm((f) => ({ ...f, konten: e.target.value }))}
          />
        </div>
        <div className="admin-d-field">
          <label>Gambar Cover</label>
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
      </AdminDrawer>

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Berita"
        message={`Yakin ingin menghapus berita "${deleteTarget?.judul}"?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
};

export default AdminBerita;
