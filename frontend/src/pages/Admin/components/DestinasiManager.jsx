import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Image as ImageIcon, MapPin, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import api from '../../../services/api';
import { getImageSrc } from '../../../utils/imageHelper';
import { KABUPATEN_OPTIONS, stripHtml } from '../adminConstants';
import {
  AdminConfirmModal,
  AdminDrawer,
  AdminDropzone,
  AdminLayout,
  AdminPageShell,
  useAdminToast,
} from './AdminUI';
import { SCALE, SPRING, getStaggerContainer, getStaggerItem } from '../adminMotion';

const shortKab = (kab = '') => kab.replace(/^Kabupaten\s+/i, 'Kab. ');

const DestinasiManager = ({
  pageTitle,
  pageSubtitle,
  addLabel,
  entityLabel,
  endpoint,
  nameKey,
  nameLabel,
  namePlaceholder,
  defaultKabupaten,
  fallbackImg,
  showQuickChips = false,
  searchPlaceholder,
}) => {
  const { showToast } = useAdminToast();
  const reduce = useReducedMotion();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterKab, setFilterKab] = useState('semua');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ kabupaten: defaultKabupaten, name: '', deskripsi: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoint);
      setList(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast(`Gagal memuat daftar ${entityLabel}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  const kabupatenChips = useMemo(() => {
    if (!showQuickChips) return [];
    const counts = new Map();
    list.forEach((item) => {
      if (item.kabupaten) counts.set(item.kabupaten, (counts.get(item.kabupaten) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([k]) => k);
  }, [list, showQuickChips]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list.filter((item) => {
      const matchKab = filterKab === 'semua' || item.kabupaten === filterKab;
      const itemName = (item[nameKey] || '').toLowerCase();
      const matchQ =
        !q ||
        itemName.includes(q) ||
        (item.kabupaten || '').toLowerCase().includes(q) ||
        (item.deskripsi || '').toLowerCase().includes(q);
      return matchKab && matchQ;
    });
  }, [list, search, filterKab, nameKey]);

  const openAdd = () => {
    setEditItem(null);
    setForm({ kabupaten: defaultKabupaten, name: '', deskripsi: '' });
    setFile(null);
    setPreview(null);
    setDrawerOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      kabupaten: item.kabupaten || defaultKabupaten,
      name: item[nameKey] || '',
      deskripsi: item.deskripsi || '',
    });
    setFile(null);
    setPreview(item.gambar ? getImageSrc(item.gambar, fallbackImg) : null);
    setDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast(`${nameLabel} wajib diisi`, 'error');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('kabupaten', form.kabupaten);
      fd.append(nameKey, form.name);
      fd.append('deskripsi', form.deskripsi);
      if (file) fd.append('gambar', file);
      else if (editItem?.gambar) fd.append('gambar_lama', editItem.gambar);

      if (editItem) {
        await api.put(`${endpoint}/${editItem.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast(`${entityLabel} berhasil diperbarui`);
      } else {
        await api.post(endpoint, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast(`${entityLabel} baru berhasil ditambahkan`);
      }
      setDrawerOpen(false);
      fetchItems();
    } catch {
      showToast(`Gagal menyimpan ${entityLabel}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`${endpoint}/${deleteTarget.id}`);
      showToast(`${entityLabel} berhasil dihapus`);
      setDeleteTarget(null);
      fetchItems();
    } catch {
      showToast(`Gagal menghapus ${entityLabel}`, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const staggerParent = getStaggerContainer(reduce);
  const staggerItem = getStaggerItem(reduce);

  return (
    <AdminLayout drawerOpen={drawerOpen}>
      <AdminPageShell>
        <div className="admin-panel glass">
          <div className="admin-panel-head">
            <div>
              <h1 className="admin-panel-title">{pageTitle}</h1>
              <p className="admin-panel-sub">
                {typeof pageSubtitle === 'function' ? pageSubtitle(list.length) : pageSubtitle}
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
              <span>{addLabel}</span>
            </motion.button>
          </div>

          <div className="admin-toolbar" style={{ marginBottom: showQuickChips ? 14 : 20 }}>
            <div className="admin-search-box" style={{ maxWidth: 320 }}>
              <Search className="ic" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="admin-select-inline"
              aria-label={`Filter wilayah ${entityLabel}`}
              value={filterKab}
              onChange={(e) => setFilterKab(e.target.value)}
            >
              <option value="semua">Semua Wilayah Kabupaten / Kota</option>
              {KABUPATEN_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <span className="admin-count-note" style={{ marginLeft: 'auto' }}>
              Menampilkan {filtered.length} dari {list.length} {entityLabel.toLowerCase()}
            </span>
          </div>

          {kabupatenChips.length > 0 && (
            <div className="admin-filter-bar" style={{ marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => setFilterKab('semua')}
                className={`admin-chip-filter ${filterKab === 'semua' ? 'active' : ''}`}
              >
                Semua
              </button>
              {kabupatenChips.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilterKab(k)}
                  className={`admin-chip-filter ${filterKab === k ? 'active' : ''}`}
                >
                  {shortKab(k)}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="admin-grid-cards">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="admin-skeleton" style={{ height: 275 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty-note">Tidak ada data {entityLabel} yang cocok.</div>
          ) : (
            <motion.div
              className="admin-grid-cards"
              variants={staggerParent}
              initial="hidden"
              animate="show"
            >
              {filtered.map((item) => (
                <motion.article
                  key={item.id}
                  variants={staggerItem}
                  className="admin-card glass"
                >
                  <div className="admin-card-img">
                    {item.gambar ? (
                      <img
                        src={getImageSrc(item.gambar, fallbackImg)}
                        alt={item[nameKey]}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <ImageIcon className="ic" />
                    )}
                    <span className="admin-badge">{shortKab(item.kabupaten || 'Sulteng')}</span>
                  </div>
                  <div className="admin-card-body">
                    <div className="admin-card-name">{item[nameKey]}</div>
                    <div className="admin-card-loc">
                      <MapPin className="ic-sm" />
                      <span>{item.kabupaten || 'Sulawesi Tengah'}</span>
                    </div>
                    <p className="admin-card-desc">
                      {stripHtml(item.deskripsi) || `${entityLabel} unggulan Sulawesi Tengah.`}
                    </p>
                    <div className="admin-card-actions">
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
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </AdminPageShell>

      <AdminDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editItem ? `Edit ${entityLabel}` : `Tambah ${entityLabel}`}
        submitting={submitting}
        onSubmit={handleSubmit}
      >
        <div className="admin-d-field">
          <label htmlFor="destName">{nameLabel}</label>
          <input
            id="destName"
            type="text"
            placeholder={namePlaceholder}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div className="admin-d-field">
          <label htmlFor="destKab">Wilayah Kabupaten / Kota</label>
          <select
            id="destKab"
            value={form.kabupaten}
            onChange={(e) => setForm((f) => ({ ...f, kabupaten: e.target.value }))}
          >
            {KABUPATEN_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-d-field">
          <label htmlFor="destDesc">Deskripsi</label>
          <textarea
            id="destDesc"
            placeholder="Deskripsi singkat..."
            value={form.deskripsi}
            onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))}
          />
        </div>
        <div className="admin-d-field">
          <label>Foto {entityLabel}</label>
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
        title={`Hapus ${entityLabel}`}
        message={`Yakin ingin menghapus "${deleteTarget?.[nameKey]}"?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
};

export default DestinasiManager;
