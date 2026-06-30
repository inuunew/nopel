const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://noveltoon.mobi';

const genreMap = {
  all: '0', romance: '27', action: '32', adventure: '32',
  horror: '36', mystery: '36', fanfic: '39', lgbtq: '69',
  'female-fantasy': '71', 'public-book': '90'
};
const statusMap = { hottest: '0', updated: '1', completed: '2' };

const http = axios.create({
  withCredentials: true,
  headers: {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9',
    'referer': `${BASE_URL}/en`,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
});

async function genreList() {
  const url = `${BASE_URL}/en/genre/novel`;
  const response = await http.get(url);
  const $ = cheerio.load(response.data);
  const genres = [];
  const statuses = [];

  $('.channels').each((i, block) => {
    const title = $(block).find('.channel-title').text().trim();
    $(block).find('.channel-a').each((j, el) => {
      const name = $(el).find('.channel').text().trim();
      const link = $(el).attr('href');
      const slug = link.split('/').pop() || 'all';
      if (title === 'Genres') genres.push({ name, slug, link: `${BASE_URL}${link}` });
      else if (title === 'Current status') statuses.push({ name, slug, link: `${BASE_URL}${link}` });
    });
  });

  return { genres, statuses };
}

async function novelList(genre, status, pageNum) {
  const genreId = genreMap[genre?.toLowerCase()] || '0';
  const statusId = statusMap[status?.toLowerCase()] || '0';
  const url = `${BASE_URL}/en/genre/2/${genreId}/${statusId}?page=${pageNum}`;
  const response = await http.get(url);
  const $ = cheerio.load(response.data);
  const novels = [];

  $('.genre-item-box').each((index, element) => {
    novels.push({
      title: $(element).find('.genre-item-title').text().trim(),
      link: $(element).attr('href'),
      image: $(element).find('.genre-item-image img').attr('src'),
      labels: $(element).find('.genre-item-label').text().trim().split('|').map(l => l.trim()),
      likes: $(element).find('.genre-item-num span').last().text().trim()
    });
  });

  const hasNextPage = $('.page .next').length > 0;
  return { current_page: parseInt(pageNum), has_next_page: hasNextPage, novels };
}

async function novelDetail(slugOrUrl) {
  const url = slugOrUrl.startsWith('http') ? slugOrUrl : `${BASE_URL}${slugOrUrl}`;
  const response = await http.get(url);
  const $ = cheerio.load(response.data);

  const title = $('.detail-title').text().trim();
  const author = $('.web-author').text().replace('Author Name:', '').trim();
  const score = $('.detail-score span').first().text().trim();
  const description = $('.detail-desc-info').text().trim();
  const likes = $('.detail-like-info span').eq(1).text().trim();
  const thoughts = $('.detail-like-info span').eq(3).text().trim();

  const tags = [];
  $('.detail-tag-item span').each((i, el) => tags.push($(el).text().trim()));

  const episodes = [];
  $('#positive .episodes-info-a-item').each((i, el) => {
    episodes.push({
      id: $(el).find('.episodes-item').attr('data-id'),
      num: $(el).find('.episode-item-num').text().trim(),
      title: $(el).find('.episode-item-title').text().trim(),
      link: $(el).attr('href')
    });
  });

  return { title, author, score, likes, thoughts, tags, description, episodes };
}

async function chapterRead(slugOrUrl) {
  const url = slugOrUrl.startsWith('http') ? slugOrUrl : `${BASE_URL}${slugOrUrl}`;
  const response = await http.get(url);
  const $ = cheerio.load(response.data);

  const novelTitle = $('.watch-main-title').first().text().trim();
  const chapterTitle = $('.watch-chapter-title').text().trim();

  const paragraphs = [];
  $('.watch-page-fiction-content').each((i, el) => paragraphs.push($(el).text().trim()));

  return { novel_title: novelTitle, chapter_title: chapterTitle, content: paragraphs };
}

module.exports = { genreList, novelList, novelDetail, chapterRead };