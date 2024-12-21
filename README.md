# Node.js Web Application

A simple and secure Node.js web application with Express.js.

## Features

- Express.js web server
- EJS templating engine
- Security middleware (Helmet, Rate Limiting)
- Logging with Winston
- Error handling middleware
- Health check endpoint
- Static file serving with caching
- CORS support
- Compression enabled

## Project Structure

```
.
├── logs/               # Application logs
├── public/            # Static files (CSS, JS, images)
├── src/               # Source code
│   ├── config/       # Configuration files
│   ├── middleware/   # Custom middleware
│   └── routes/       # Route handlers
├── tests/            # Test files
└── views/            # EJS templates
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update the values
4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run docs` - Generate documentation

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3333 |
| NODE_ENV | Environment | development |
| LOG_LEVEL | Winston log level | info |
| SESSION_SECRET | Session secret key | - |
| CORS_ORIGIN | CORS origin | http://localhost:3333 |

## Deployment

### Deploying to Vercel

This app is configured for easy deployment to Vercel. Follow these steps:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

The deployment will provide you with a URL where your app is live. Vercel automatically:
- Sets up HTTPS
- Provides a global CDN
- Enables automatic deployments on git push
- Offers preview deployments for pull requests

### Environment Variables

When deploying to Vercel, set up these environment variables in the Vercel dashboard:
- `NODE_ENV`: Set to "production"
- `PORT`: Automatically handled by Vercel
- `LOG_LEVEL`: Recommended "info" for production
- `SESSION_SECRET`: Set a secure random string
- `CORS_ORIGIN`: Set to your domain

## Security Features

- Helmet.js for secure headers
- Rate limiting
- CORS protection
- XSS protection
- Security headers
- Content Security Policy

## Logging

Logs are stored in the `logs` directory:
- `error.log` - Error level logs
- `combined.log` - All logs

## License

MIT
