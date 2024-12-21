const request = require('supertest');
const app = require('../src/app');

describe('App Endpoints', () => {
    describe('GET /health', () => {
        it('should return health status', async () => {
            const res = await request(app)
                .get('/health')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body).toHaveProperty('status', 'ok');
            expect(res.body).toHaveProperty('time');
            expect(res.body).toHaveProperty('environment');
        });
    });

    describe('GET /', () => {
        it('should return home page', async () => {
            const res = await request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200);

            expect(res.text).toContain('Welcome to My First App');
        });
    });

    describe('404 Error', () => {
        it('should return 404 for unknown route', async () => {
            await request(app)
                .get('/unknown-route')
                .expect(404);
        });
    });
});
