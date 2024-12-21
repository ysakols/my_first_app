# My Application

A secure Node.js web application built with Express.js for documentation generation.

## Features

- **Web Server**: Built with Express.js.
- **EJS Templating**: Dynamic HTML rendering using EJS.
- **Security Middleware**: Includes Helmet for secure headers and rate limiting.
- **Logging**: Integrated logging with Winston for tracking errors.
- **Error Handling**: Custom middleware for managing errors.
- **Health Check Endpoint**: Monitor application health.
- **Static File Serving**: Efficient serving of static files with caching.
- **CORS Support**: Configurable Cross-Origin Resource Sharing.
- **Compression**: Gzip compression for faster responses.

## Project Structure

```
.
├── logs/               # Application logs
├── public/             # Static files (CSS, JS, images)
├── src/                # Source code
│   ├── config/         # Configuration files
│   ├── middleware/     # Custom middleware
│   └── routes/         # Route handlers
├── tests/              # Test files
└── views/              # EJS templates
```

## Getting Started

To get started with My Application, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**:
   - Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   - Update the values in the `.env` file as needed.
4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## Available Scripts

| Command         | Description                                      |
|------------------|--------------------------------------------------|
| `npm run dev`    | Start development server with nodemon            |
| `npm start`      | Start production server                          |
| `npm test`       | Run tests                                       |
| `npm run lint`   | Run ESLint for code quality checks               |
| `npm run format` | Format code with Prettier                        |
| `npm run docs`   | Generate documentation                            |

## Environment Variables

| Variable      | Description              | Default                  |
|---------------|--------------------------|--------------------------|
| `PORT`        | Server port              | 3333                     |
| `NODE_ENV`    | Environment              | development              |
| `LOG_LEVEL`   | Winston log level        | info                     |
| `SESSION_SECRET`| Session secret key     | -                        |
| `CORS_ORIGIN` | CORS origin              | http://localhost:3333    |

## Deployment

### Deploying to Vercel

To deploy My Application to Vercel, follow these steps:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```
2. **Login to Vercel**:
   ```bash
   vercel login
   ```
3. **Deploy the Application**:
   ```bash
   vercel
   ```

## Security Features

- **Helmet.js**: Protects against common vulnerabilities by setting HTTP headers.
- **Rate Limiting**: Prevents abuse by limiting requests from a single IP.
- **CORS Protection**: Configurable CORS settings to control access to your APIs.

## Logging

Logs are stored in the `logs` directory:
- `error.log`: Contains error level logs.
- `combined.log`: Contains all logs for comprehensive tracking.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
