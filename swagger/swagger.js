const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Конфигурация для Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Документация для API проекта Manilla',
        },
    },
    apis: ['./pages/api/**/*.js', './backend/api/**/*.js'], // Пути к вашим API файлам
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
    swaggerSpec,
    swaggerUi,
};
