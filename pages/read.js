import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Read() {
  const router = useRouter();
  const { url } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    fetch(`/api/read?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [url]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (error) return <p style={{ padding: 20, color: 'red' }}>Error: {error}</p>;
  if (!data) return null;

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 700, margin: '0 auto' }}>
      <Link href="/">← Kembali ke daftar</Link>
      <h2 style={{ marginTop: 12 }}>{data.novel_title}</h2>
      <h3 style={{ color: '#666' }}>{data.chapter_title}</h3>
      <div style={{ marginTop: 16, lineHeight: 1.8 }}>
        {data.content?.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </div>
  );
}