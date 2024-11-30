export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.setHeader('Set-Cookie', `auth_token=; HttpOnly; Path=/; Max-Age=0;`);
  res.json({ message: 'Logout successful' });
}
