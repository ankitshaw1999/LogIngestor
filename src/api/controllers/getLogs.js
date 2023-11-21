/**
 * @swagger
 * /getLogs:
 *   post:
 *     summary: Ingest logs
 *     description: Endpoint to ingest logs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogEntry'
 *     responses:
 *       '200':
 *         description: Matching Logs Found
 *       '204':
 *         description: No-content
 *
 * components:
 *   schemas:
 *     LogEntry:
 *       type: object
 *       properties:
 *         level:
 *           type: string
 *           description: The log level (e.g., "error")
 *         message:
 *           type: string
 *           description: The log message
 *         resourceId:
 *           type: string
 *           description: The resource ID associated with the log entry
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp of the log entry
 *         traceId:
 *           type: string
 *           description: The trace ID associated with the log entry
 *         spanId:
 *           type: string
 *           description: The span ID associated with the log entry
 *         commit:
 *           type: string
 *           description: The commit hash or identifier
 *         metadata:
 *           type: object
 *           properties:
 *             parentResourceId:
 *               type: string
 *               description: The parent resource ID associated with the log entry
 */

const express = require('express');
const router = express.Router();

const elasticsearch = require('../../services/elasticSearch');

router.post('/', async (req, res) => {
    try {
      const filters = req.body;
      const searchResults = await elasticsearch.searchData(filters);
      res.status(200).json({ results: searchResults });
} catch (error) {
      console.error('Error searching logs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = router;
