const { genreList } = require('../../lib/scraper');

export default async function handler(req, res) {
  try {
    const data = await genreList();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}