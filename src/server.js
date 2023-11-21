const http = require('http');
const app = require('./app')
const broker = require('./services/Kafka');

const port = process.env.PORT || 3000;

const server = http.createServer(app);



broker.consumeMessages().then(kafkaConsumeMsg =>{
    console.log(kafkaConsumeMsg)
  }).catch((error) => console.error('Error producing messages:', error));

server.listen(port);