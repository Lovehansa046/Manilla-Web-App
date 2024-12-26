// server.js
const express = require('express');
const next = require('next');
const {swaggerSpec, swaggerUi} = require('../../swagger/swagger'); // Импортируем конфигурацию Swagger

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // Настройка Swagger UI на /api-docs
    server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Обычные маршруты Next.js
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
        console.log('API Documentation available at http://localhost:3000/api-docs');
    });
});
