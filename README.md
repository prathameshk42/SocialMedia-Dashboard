## 1  Social Dash 🗨️
**A full-stack dashboard that unifies Facebook, Twitter/X, and LinkedIn so brands can schedule posts, track engagement, and leverage AI content suggestions.**

| Metric | Value |
|--------|-------|
| Active test users          | 500 + |
| Codebase size              | 10 K LOC |
| Peak response (load-test)  | < 200 ms |
| API-call reduction (Redis) | ↓ 40 % |

### Tech Stack
React • Node.js • Express • Firebase (Auth & Firestore) • AWS (Amplify, Lambda, CloudWatch) • Redis • OAuth 2.0 • Jest • Cypress • GitHub Actions

### Quick Start
bash

# Front-end
cd client
npm install
npm run dev

# Back-end
cd server
npm install
npm run dev          # nodemon
Create a .env file:

ini

FACEBOOK_APP_ID=xxx
TWITTER_API_KEY=xxx
LINKEDIN_CLIENT_ID=xxx
FIREBASE_CONFIG='…'
REDIS_URL=redis://…

Project Structure
bash
client/   # React SPA
server/   # Express API
scripts/  # Dev scripts

License
MIT

