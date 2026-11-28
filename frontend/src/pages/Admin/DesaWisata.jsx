import DestinasiManager from './components/DestinasiManager';

const AdminDesaWisata = () => (
  <DestinasiManager
    pageTitle="Desa Wisata"
    pageSubtitle={(count) => `Kelola ${count} desa wisata binaan Dinas Pariwisata Provinsi Sulawesi Tengah.`}
    addLabel="Tambah Desa Wisata"
    entityLabel="Desa Wisata"
    endpoint="/info-pariwisata/desa-wisata"
    nameKey="nama"
    nameLabel="Nama Desa"
    namePlaceholder="cth: Desa Malangga"
    defaultKabupaten="Kabupaten Donggala"
    fallbackImg="/images/admin/air-terjun-saluopa.jpg"
    searchPlaceholder="Cari nama desa wisata..."
  />
);

export default AdminDesaWisata;
