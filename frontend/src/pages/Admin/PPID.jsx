import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Pencil, Plus, Search, Trash2 } from 'lucide-react';
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
import { SCALE, SPRING } from './adminMotion';

const AdminPPID = () => {
  const { showToast } = useAdminToast();
  const reduce = useReducedMotion();

  const [activeTab, setActiveTab] = useState('items');
  const [kategoriList, setKategoriList] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [regulasiList, setRegulasiList] = useState([]);
  const [skList, setSkList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedKat, setSelectedKat] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [drawerType, setDrawerType] = useState('items');
  const [form, setForm] = useState({
    kategori_id: '',
    judul: '',
    link: '',
    tahun: String(new Date().getFullYear()),
    kategori: 'umum',
  });
  const [file, setFile] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [katRes, itemRes, regRes, skRes] = await Promise.all([
        api.get('/ppid/kategori').catch(() => ({ data: [] })),
        api.get('/ppid/items').catch(() => ({ data: [] })),
        api.get('/ppid/regulasi').catch(() => ({ data: [] })),
        api.get('/ppid/sk').catch(() => ({ data: [] })),
      ]);
      const kats = Array.isArray(katRes.data) ? katRes.data : [];
      setKategoriList(kats);
      setItemsList(Array.isArray(itemRes.data) ? itemRes.data : []);
      setRegulasiList(Array.isArray(regRes.data) ? regRes.data : []);
      setSkList(Array.isArray(skRes.data) ? skRes.data : []);
    } catch {
      showToast('Gagal memuat data PPID', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setDrawerType(activeTab);
    setFile(null);
    setForm({
      kategori_id: selectedKat || (kategoriList[0]?.id ? String(kategoriList[0].id) : ''),
      judul: '',
      link: '',
      tahun: String(new Date().getFullYear()),
      kategori: 'umum',
    });
    setDrawerOpen(true);
  };

  const openEdit = (row) => {
    setEditItem(row);
    setDrawerType(activeTab);
    setFile(null);
    setForm({
      kategori_id: String(row.kategori_id || selectedKat || (kategoriList[0]?.id ?? '')),
      judul: row.judul || '',
      link: row.link || '',
      tahun: row.tahun ? String(row.tahun) : String(new Date().getFullYear()),
      kategori: row.kategori || 'umum',
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.judul.trim()) {
      showToast('Judul dokumen wajib diisi', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      if (file) fd.append('file', file);
      else if (editItem?.file) fd.append('file_lama', editItem.file);

      if (drawerType === 'items') {
        fd.append('kategori_id', form.kategori_id);
        fd.append('judul', form.judul);
        fd.append('link', form.link);
        fd.append('tahun', form.tahun);
        if (editItem) {
          await api.put(`/ppid/items/${editItem.id}`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          showToast('Dokumen PPID berhasil diperbarui');
        } else {
          await api.post('/ppid/items', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          showToast('Dokumen PPID berhasil ditambahkan');
        }
      } else if (drawerType === 'regulasi') {
        fd.append('judul', form.judul);
        fd.append('kategori', form.kategori);
        if (editItem) {
          await api.put(`/ppid/regulasi/${editItem.id}`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          showToast('Regulasi berhasil diperbarui');
        } else {
          await api.post('/ppid/regulasi', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          showToast('Regulasi berhasil ditambahkan');
        }
      } else {
        fd.append('judul', form.judul);
        fd.append('tahun', form.tahun);
        if (editItem) {
          await api.put(`/ppid/sk/${editItem.id}`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          showToast('SK PPID berhasil diperbarui');
        } else {
          await api.post('/ppid/sk', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          showToast('SK PPID berhasil ditambahkan');
        }
      }

      setDrawerOpen(false);
      loadAll();
    } catch {
      showToast('Gagal menyimpan dokumen PPID', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const endpoint =
        activeTab === 'items'
          ? `/ppid/items/${deleteTarget.id}`
          : activeTab === 'regulasi'
            ? `/ppid/regulasi/${deleteTarget.id}`
            : `/ppid/sk/${deleteTarget.id}`;
      await api.delete(endpoint);
      showToast('Dokumen berhasil dihapus');
      setDeleteTarget(null);
      loadAll();
    } catch {
      showToast('Gagal menghapus dokumen', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (activeTab === 'items') {
      return itemsList.filter((r) => {
        const matchKat = !selectedKat || String(r.kategori_id) === String(selectedKat);
        const matchQ =
          !q ||
          (r.judul || '').toLowerCase().includes(q) ||
          (r.kategori_nama || '').toLowerCase().includes(q);
        return matchKat && matchQ;
      });
    }
    if (activeTab === 'regulasi') {
      return regulasiList.filter(
        (r) =>
          !q ||
          (r.judul || '').toLowerCase().includes(q) ||
          (r.kategori || '').toLowerCase().includes(q)
      );
    }
    return skList.filter(
      (r) =>
        !q ||
        (r.judul || '').toLowerCase().includes(q) ||
        String(r.tahun || '').includes(q)
    );
  }, [activeTab, itemsList, regulasiList, skList, search, selectedKat]);

  const totalTabCount =
    activeTab === 'items'
      ? itemsList.length
      : activeTab === 'regulasi'
        ? regulasiList.length
        : skList.length;

  const resolveFileHref = (row) => {
    if (row.link) return row.link;
    if (row.file) return getImageSrc(row.file, '');
    return '';
  };

  return (
    <AdminLayout drawerOpen={drawerOpen}>
      <AdminPageShell>
        <div className="admin-panel glass">
          <div className="admin-panel-head">
            <div>
              <h1 className="admin-panel-title">PPID</h1>
              <p className="admin-panel-sub">
                Kelola dokumen Pejabat Pengelola Informasi dan Dokumentasi — {itemsList.length} item,{' '}
                {regulasiList.length} regulasi, {skList.length} SK.
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
              <span>Tambah Dokumen</span>
            </motion.button>
          </div>

          <div className="admin-tabs glass" role="tablist" aria-label="Kategori PPID">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'items'}
              onClick={() => setActiveTab('items')}
              className={`admin-tab ${activeTab === 'items' ? 'active' : ''}`}
            >
              Item ({itemsList.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'regulasi'}
              onClick={() => setActiveTab('regulasi')}
              className={`admin-tab ${activeTab === 'regulasi' ? 'active' : ''}`}
            >
              Regulasi ({regulasiList.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'sk'}
              onClick={() => setActiveTab('sk')}
              className={`admin-tab ${activeTab === 'sk' ? 'active' : ''}`}
            >
              SK ({skList.length})
            </button>
          </div>

          <div className="admin-toolbar" style={{ marginTop: 4 }}>
            <div className="admin-search-box" style={{ maxWidth: 340 }}>
              <Search className="ic" />
              <input
                type="text"
                placeholder="Cari judul dokumen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {activeTab === 'items' && (
              <select
                className="admin-select-inline"
                aria-label="Filter kategori informasi publik"
                value={selectedKat}
                onChange={(e) => setSelectedKat(e.target.value)}
              >
                <option value="">Semua Kategori PPID</option>
                {kategoriList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="admin-table-wrap">
            {loading ? (
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="admin-skeleton" style={{ height: 48 }} />
                ))}
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="admin-empty-note">Tidak ada dokumen PPID yang cocok.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  {activeTab === 'items' && (
                    <tr>
                      <th>No</th>
                      <th>Nama Dokumen</th>
                      <th>Kategori</th>
                      <th>Tahun</th>
                      <th>Aksi</th>
                    </tr>
                  )}
                  {activeTab === 'regulasi' && (
                    <tr>
                      <th>No</th>
                      <th>Nama Regulasi</th>
                      <th>Jenis</th>
                      <th>Berkas</th>
                      <th>Aksi</th>
                    </tr>
                  )}
                  {activeTab === 'sk' && (
                    <tr>
                      <th>No</th>
                      <th>Nama SK</th>
                      <th>Tahun</th>
                      <th>Berkas</th>
                      <th>Aksi</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {filteredRows.map((row, idx) => {
                    const href = resolveFileHref(row);
                    return (
                      <tr key={row.id}>
                        <td>{idx + 1}</td>
                        <td className="admin-doc-name">{row.judul}</td>
                        <td>
                          {activeTab === 'items' && (
                            <span className="admin-badge blue">
                              {row.kategori_nama || `Kategori #${row.kategori_id}`}
                            </span>
                          )}
                          {activeTab === 'regulasi' && (
                            <span className="admin-badge purple">{row.kategori || 'umum'}</span>
                          )}
                          {activeTab === 'sk' && (
                            <span className="admin-badge amber">{row.tahun || '—'}</span>
                          )}
                        </td>
                        <td>
                          {activeTab === 'items' ? (
                            row.tahun || '—'
                          ) : href ? (
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                color: 'var(--blue)',
                                fontWeight: 600,
                                textDecoration: 'none',
                              }}
                            >
                              <span>Buka</span>
                              <ExternalLink className="ic-sm" />
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>
                          <div className="admin-row-actions">
                            {activeTab === 'items' && href && (
                              <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="admin-btn admin-btn-sm admin-btn-ghost"
                                title="Buka dokumen"
                              >
                                <ExternalLink className="ic-sm" />
                              </a>
                            )}
                            <motion.button
                              type="button"
                              onClick={() => openEdit(row)}
                              className="admin-btn admin-btn-sm admin-btn-edit"
                              whileTap={reduce ? undefined : { scale: SCALE.press }}
                              transition={SPRING.press}
                            >
                              <Pencil className="ic-sm" />
                              <span>Edit</span>
                            </motion.button>
                            <motion.button
                              type="button"
                              onClick={() => setDeleteTarget(row)}
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
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <p className="admin-count-note" style={{ marginTop: 12 }}>
            Menampilkan {filteredRows.length} dari {totalTabCount}{' '}
            {activeTab === 'items' ? 'item informasi publik' : activeTab === 'regulasi' ? 'regulasi' : 'SK'}
          </p>
        </div>
      </AdminPageShell>

      <AdminDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editItem ? 'Edit Dokumen PPID' : 'Tambah Dokumen PPID'}
        submitting={submitting}
        onSubmit={handleSubmit}
      >
        {!editItem && (
          <div className="admin-d-field">
            <label htmlFor="ppidJenis">Jenis Dokumen</label>
            <select
              id="ppidJenis"
              value={drawerType}
              onChange={(e) => setDrawerType(e.target.value)}
            >
              <option value="items">Item Informasi Publik</option>
              <option value="regulasi">Regulasi</option>
              <option value="sk">Surat Keputusan (SK)</option>
            </select>
          </div>
        )}

        <div className="admin-d-field">
          <label htmlFor="ppidJudul">Nama / Judul Dokumen</label>
          <input
            id="ppidJudul"
            type="text"
            placeholder="Masukkan nama dokumen"
            value={form.judul}
            onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))}
            required
          />
        </div>

        {drawerType === 'items' && (
          <>
            <div className="admin-d-field">
              <label htmlFor="ppidKategori">Kategori Informasi</label>
              <select
                id="ppidKategori"
                value={form.kategori_id}
                onChange={(e) => setForm((f) => ({ ...f, kategori_id: e.target.value }))}
              >
                {kategoriList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-d-field">
              <label htmlFor="ppidLink">Tautan Eksternal (Opsional)</label>
              <input
                id="ppidLink"
                type="text"
                placeholder="https://..."
                value={form.link}
                onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              />
            </div>
          </>
        )}

        {drawerType === 'regulasi' && (
          <div className="admin-d-field">
            <label htmlFor="ppidRegKat">Jenis Regulasi</label>
            <input
              id="ppidRegKat"
              type="text"
              placeholder="cth: Perda, Pergub, umum"
              value={form.kategori}
              onChange={(e) => setForm((f) => ({ ...f, kategori: e.target.value }))}
            />
          </div>
        )}

        {(drawerType === 'items' || drawerType === 'sk') && (
          <div className="admin-d-field">
            <label htmlFor="ppidTahun">Tahun</label>
            <input
              id="ppidTahun"
              type="text"
              placeholder="cth: 2025"
              value={form.tahun}
              onChange={(e) => setForm((f) => ({ ...f, tahun: e.target.value }))}
            />
          </div>
        )}

        <div className="admin-d-field">
          <label>Berkas Dokumen (PDF / Gambar)</label>
          <AdminDropzone
            accept=".pdf,.doc,.docx,image/*"
            fileName={file?.name || editItem?.file}
            hint="Klik untuk memilih berkas PDF/dokumen, atau seret ke sini"
            onFileSelect={(f) => setFile(f)}
          />
        </div>
      </AdminDrawer>

      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Dokumen PPID"
        message={`Yakin ingin menghapus "${deleteTarget?.judul}"?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
};

export default AdminPPID;
