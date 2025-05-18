export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q } = req.query;
  const apiKey = process.env.LOCATIONIQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'LocationIQ API key not configured' });
  }

  if (!q) {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  const url = `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${q}&limit=5`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error('LocationIQ API error:', err);
    return res.status(500).json({ error: 'Failed to fetch city suggestions' });
  }
}