import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Image as ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';
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

const SliderContent = () => {
  const { showToast } = useAdminToast();
  const reduce = useReducedMotion();

  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ judul: '', urutan: 1, aktif: '1' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/slider/all');
      setSliders(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast('Gagal memuat data slider', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm({ judul: '', urutan: sliders.length + 1, aktif: '1' });
    setFile(null);
    setPreview(null);
    setDrawerOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      judul: item.judul || '',
      urutan: item.urutan || 1,
      aktif: item.aktif === 1 ? '1' : '0',
    });
    setFile(null);
    setPreview(item.gambar ? getImageSrc(item.gambar, '/slider/Slider.jpg') : null);
    setDrawerOpen(true);
  };

  const handleFileSelect = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editItem && !file) {
      showToast('Pilih gambar slider terlebih dahulu', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('judul', form.judul);
      fd.append('urutan', String(form.urutan || 1));
      if (editItem) {
        fd.append('aktif', form.aktif);
        if (file) fd.append('gambar', file);
        else if (editItem.gambar) fd.append('gambar_lama', editItem.gambar);
        await api.put(`/slider/${editItem.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Slider berhasil diperbarui');
      } else {
        fd.append('gambar', file);
        await api.post('/slider', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Slider baru berhasil ditambahkan');
      }
      setDrawerOpen(false);
      fetchSliders();
    } catch {
      showToast('Gagal menyimpan slider', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (item) => {
    const next = item.aktif === 1 ? 0 : 1;
    setSliders((prev) => prev.map((s) => (s.id === item.id ? { ...s, aktif: next } : s)));
    try {
      await api.patch(`/slider/${item.id}/toggle`, { aktif: next });
      showToast(next === 1 ? 'Slider diaktifkan' : 'Slider dinonaktifkan');
    } catch {
      setSliders((prev) => prev.map((s) => (s.id === item.id ? { ...s, aktif: item.aktif } : s)));
      showToast('Gagal mengubah status slider', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/slider/${deleteTarget.id}`);
      showToast('Slider berhasil dihapus');
      setDeleteTarget(null);
      fetchSliders();
    } catch {
      showToast('Gagal menghapus slider', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = sliders.filter((s) => s.aktif === 1).length;
  const staggerParent = getStaggerContainer(reduce);
  const staggerItem = getStaggerItem(reduce);

  return (
    <AdminLayout drawerOpen={drawerOpen}>
      <AdminPageShell>
        <div className="admin-panel glass">
          <div className="admin-panel-head">
            <div>
              <h1 className="admin-panel-title">Slider</h1>
              <p className="admin-panel-sub">
                Kelola banner slider pada halaman utama website — {sliders.length} slider, {activeCount} aktif.
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
              <span>Tambah Slider</span>
            </motion.button>
          </div>

          {loading ? (
            <div className="admin-slider-list">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="admin-skeleton" style={{ height: 98 }} />
              ))}
            </div>
          ) : sliders.length === 0 ? (
            <div className="admin-empty-note">Belum ada slider. Klik Tambah Slider untuk membuat banner baru.</div>
          ) : (
            <motion.div
              className="admin-slider-list"
              variants={staggerParent}
              initial="hidden"
              animate="show"
            >
              {sliders.map((s) => {
                const imgSrc = getImageSrc(s.gambar, '/slider/Slider.jpg');
                const isActive = s.aktif === 1;
                return (
                  <motion.div
                    key={s.id}
                    variants={staggerItem}
                    className="admin-slider-row glass"
                  >
                    <div className="admin-slider-img">
                      {s.gambar ? (
                        <img
                          src={imgSrc}
                          alt={s.judul || 'Slider'}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <ImageIcon className="ic" />
                      )}
                    </div>

                    <div className="admin-slider-info">
                      <div className="admin-slider-name">{s.judul || '(Tanpa judul)'}</div>
                      <div className="admin-slider-sub">Banner halaman depan — Urutan {s.urutan}</div>
                    </div>

                    <span className="admin-toggle-label">{isActive ? 'Aktif' : 'Nonaktif'}</span>
                    <label className="admin-switch">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => handleToggle(s)}
                        aria-label={`Aktifkan slider ${s.judul || s.id}`}
                      />
                      <span className="admin-switch-track" />
                    </label>

                    <div className="admin-row-actions">
                      <motion.button
                        type="button"
                        onClick={() => openEdit(s)}
                        className="admin-btn admin-btn-sm admin-btn-edit"
                        whileTap={reduce ? undefined : { scale: SCALE.press }}
                        transition={SPRING.press}
                      >
                        <Pencil className="ic-sm" />
                        <span>Edit</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setDeleteTarget(s)}
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
        title={editItem ? 'Edit Slider' : 'Tambah Slider'}
        submitting={submitting}
        onSubmit={handleSubmit}
      >
        <div className="admin-d-field">
          <label htmlFor="sliderJudul">Judul Slider</label>
          <input
            id="sliderJudul"
            type="text"
            placeholder="cth: Danau Poso — Tentena"
            value={form.judul}
            onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))}
          />
        </div>
        <div className="admin-d-field">
          <label htmlFor="sliderUrutan">Urutan Tampil</label>
          <input
            id="sliderUrutan"
            type="number"
            min="1"
            value={form.urutan}
            onChange={(e) => setForm((f) => ({ ...f, urutan: e.target.value }))}
          />
        </div>
        {editItem && (
          <div className="admin-d-field">
            <label htmlFor="sliderStatus">Status</label>
            <select
              id="sliderStatus"
              value={form.aktif}
              onChange={(e) => setForm((f) => ({ ...f, aktif: e.target.value }))}
            >
              <option value="1">Aktif</option>
              <option value="0">Nonaktif</option>
            </select>
          </div>
        )}
        <div className="admin-d-field">
          <label>Gambar Banner</label>
          <AdminDropzone
            accept="image/jpeg,image/png,image/webp,image/jpg"
            previewUrl={preview}
            fileName={file?.name}
            hint="Klik untuk memilih gambar (JPG/PNG/WEBP), atau seret ke sini"
            onFileSelect={handleFileSelect}
          />
        </div>
      </AdminDrawer>

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Slider"
        message={`Yakin ingin menghapus slider "${deleteTarget?.judul || '(Tanpa judul)'}"?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
};

export default SliderContent;
