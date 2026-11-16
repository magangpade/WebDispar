import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';

const Sejarah = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/profil/sejarah').then((res) => setData(res.data[0])).catch(() => {});
  }, []);

  return (
    <>
      <Helmet><title>Sejarah - Dinas Pariwisata Sulteng</title></Helmet>
      <div className="bg-gradient-to-r from-navy-900 to-primary-800 py-16 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white">Sejarah</h1>
          <p className="text-white/70 mt-2">Sejarah Singkat Dinas Pariwisata Provinsi Sulawesi Tengah</p>
        </div>
      </div>
      <section className="py-12 lg:py-16">
        <div className="container-custom max-w-4xl">
          {data ? (
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.konten }}
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