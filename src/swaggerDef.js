const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'Description of your API',
    },
  },
  apis: [
    'src/api/controllers/ingestLogs.js',
    'src/api/controllers/getLogs.js',
  ], // Adjust the path based on your project structure
   // Adjust the path based on your project structure
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
