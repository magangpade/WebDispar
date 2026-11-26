import DestinasiManager from './components/DestinasiManager';

const AdminDTW = () => (
  <DestinasiManager
    pageTitle="Daya Tarik Wisata"
    pageSubtitle="Kelola destinasi wisata unggulan Sulawesi Tengah."
    addLabel="Tambah DTW"
    entityLabel="Daya Tarik Wisata"
    endpoint="/info-pariwisata/dtw"
    nameKey="judul"
    nameLabel="Nama Destinasi"
    namePlaceholder="cth: Danau Tambing"
    defaultKabupaten="Kota Palu"
    fallbackImg="/images/admin/danau-lindu.jpg"
    showQuickChips
    searchPlaceholder="Cari objek wisata..."
  />
);

export default AdminDTW;
