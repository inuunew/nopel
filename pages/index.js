import { useState, useEffect } from 'react';
import Link from 'next/link';

const GENRES = ['all', 'romance', 'action', 'horror', 'fanfic', 'lgbtq', 'female-fantasy', 'public-book'];
const STATUSES = ['hottest', 'updated', 'completed'];

export default function Home() {
  const [novels, setNovels] = useState([]);
  const [genre, setGenre] = useState('all');
  const [status, setStatus] = useState('hottest');
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNovels = async (p = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/list?genre=${genre}&status=${status}&page=${p}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setNovels(data.novels || []);
      setHasNext(data.has_next_page);
      setPage(p);
    } catch (e) {
      setError(e.message);
      setNovels([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchNovels(1); }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto' }}>
      <h1>NovelToon Web</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={genre} onChange={e => setGenre(e.target.value)}>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => fetchNovels(1)}>Cari</button>
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {loading && <p>Loading...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
        {novels.map((n, i) => (
          <Link
            key={i}
            href={`/detail?url=${encodeURIComponent(n.link)}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div>
              <img src={n.image} alt={n.title} style={{ width: '100%', borderRadius: 8 }} />
              <p style={{ fontSize: 14, fontWeight: 600, margin: '6px 0 2px' }}>{n.title}</p>
              <p style={{ fontSize: 12, color: '#666' }}>{n.likes} likes</p>
            </div>
          </Link>
        ))}
      </div>

      {!loading && novels.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          {page > 1 && <button onClick={() => fetchNovels(page - 1)}>Sebelumnya</button>}
          {hasNext && <button onClick={() => fetchNovels(page + 1)}>Selanjutnya</button>}
        </div>
      )}
    </div>
  );
}