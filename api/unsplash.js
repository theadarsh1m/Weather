export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { city } = req.query;
  const apiKey = process.env.UNSPLASH_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Unsplash API key not configured' });
  }

  if (!city) {
    return res.status(400).json({ error: 'City parameter required' });
  }

  const url = `https://api.unsplash.com/search/photos?query=${city}&client_id=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error('Unsplash API error:', err);
    return res.status(500).json({ error: 'Failed to fetch image' });
  }
}