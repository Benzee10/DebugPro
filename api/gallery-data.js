// Vercel API route for gallery data
import galleryData from './gallery-data.json' assert { type: 'json' };

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    res.status(200).json(galleryData);
  } catch (error) {
    console.error('Error serving gallery data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}