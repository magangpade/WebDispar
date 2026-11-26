import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../../components/PageHeader';
import { Landmark } from 'lucide-react';
import api from '../../services/api';
import { sanitizeHtml } from '../../utils/sanitize';

const Sejarah = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/profil/sejarah').then((res) => setData(res.data[0])).catch(() => {});
  }, []);

  return (
    <>
      <Helmet><title>Sejarah - Dinas Pariwisata Sulteng</title></Helmet>
      <PageHeader
        badge="Profil Kelembagaan"
        badgeIcon={Landmark}
        title="Sejarah Singkat"
        subtitle="Lintas sejarah pembentukan dan perjalanan Dinas Pariwisata Provinsi Sulawesi Tengah dalam memajukan kepariwisataan daerah."
        breadcrumbs={[
          { label: 'Profil' },
          { label: 'Sejarah' }
        ]}
      />
      <section className="py-12 lg:py-16">
        <div className="container-custom max-w-4xl">
          {data ? (
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.konten) }}
            />
          ) : (
            <div className="skeleton h-96 w-full rounded-2xl" />
          )}
        </div>
      </section>
    </>
  );
};

export default Sejarah;