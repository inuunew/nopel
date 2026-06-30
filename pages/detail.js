import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Detail() {
  const router = useRouter();
  const { url } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    fetch(`/api/detail?url=${encodeURIComponent(url)}`)
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
      <Link href="/">← Kembali</Link>
      <h1 style={{ marginTop: 12 }}>{data.title}</h1>
      <p><b>Author:</b> {data.author}</p>
      <p><b>Score:</b> {data.score} | <b>Likes:</b> {data.likes} | <b>Thoughts:</b> {data.thoughts}</p>
      <p><b>Tags:</b> {data.tags?.join(', ')}</p>
      <p style={{ whiteSpace: 'pre-wrap', color: '#444' }}>{data.description}</p>

      <h3>Episode</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.episodes?.map((ep, i) => (
          <Link
            key={i}
            href={`/read?url=${encodeURIComponent(ep.link)}`}
            style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6, textDecoration: 'none', color: 'inherit' }}
          >
            {ep.num} - {ep.title}
          </Link>
        ))}
      </div>
    </div>
  );
}