// lib/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

// Настройки для генерации спецификации Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Next.js API',
      version: '1.0.0',
      description: 'API documentation for my Next.js app',
    },
  },
  apis: ['./pages/api/**/*.js'], // Путь к вашим API эндпоинтам
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
