const { novelDetail } = require('../../lib/scraper');

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Parameter url wajib diisi' });
  try {
    const data = await novelDetail(url);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}