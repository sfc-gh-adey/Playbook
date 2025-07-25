import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/github-auth', async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.VITE_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json',
      },
    });

    const user = await userResponse.json();

    return res.status(200).json({
      access_token: tokenData.access_token,
      user: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('GitHub auth error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`OAuth server running on port ${PORT}`);
}); 