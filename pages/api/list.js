const { novelList } = require('../../lib/scraper');

export default async function handler(req, res) {
  const { genre = 'all', status = 'hottest', page = '1' } = req.query;
  try {
    const data = await novelList(genre, status, page);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}