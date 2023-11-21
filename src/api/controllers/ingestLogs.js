/**
 * @swagger
 * /ingestLogs:
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
 *       '202':
 *         description: Log entry created successfully
 *       '400':
 *         description: Bad request
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

const Kafka = require('../../services/Kafka');
const validateJson = require('../../api/services/getLogsService'); // Adjust the path based on your project structure


router.post('/', (req, res) => {

  const isValid = validateJson(req.body);

  if(isValid)
  {
      if (!Object.keys(req.body).length) {
        return res.status(400).json({ error: 'Empty request body' });
      }
      
      const message =JSON.stringify(req.body);

      Kafka.produceMessages(message).catch((error) => console.error('Error producing messages:', error));
      
      res.status(202).json({ message: 'Logs Accepted Successfully' });
  }
else
    {
      res.status(400).json({ message: 'Bad Request' });

    }
});

module.exports = router;
