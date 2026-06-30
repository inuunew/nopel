import { useState, useEffect } from 'react';

export default function Home() {
  const [novels, setNovels] = useState([]);
  const [genre, setGenre] = useState('all');
  const [status, setStatus] = useState('hottest');
  const [loading, setLoading] = useState(false);

  const fetchNovels = async () => {
    setLoading(true);
    const res = await fetch(`/api/list?genre=${genre}&status=${status}&page=1`);
    const data = await res.json();
    setNovels(data.novels || []);
    setLoading(false);
  };

  useEffect(() => { fetchNovels(); }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>NovelToon Web</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <select value={genre} onChange={e => setGenre(e.target.value)}>
          <option value="all">All</option>
          <option value="romance">Romance</option>
          <option value="action">Action</option>
          <option value="horror">Horror</option>
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="hottest">Hottest</option>
          <option value="updated">Updated</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={fetchNovels}>Cari</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
          {novels.map((n, i) => (
            <div key={i}>
              <img src={n.image} alt={n.title} style={{ width: '100%', borderRadius: 8 }} />
              <p style={{ fontSize: 14, fontWeight: 600 }}>{n.title}</p>
              <p style={{ fontSize: 12, color: '#666' }}>{n.likes} likes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}