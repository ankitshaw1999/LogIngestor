const { Kafka } = require('kafkajs');
const elasticSearch = require('./elasticSearch');
const config = require('../util/config')

// Define the Kafka broker(s) - replace with your Kafka broker(s)
const brokers = config.brokers;
const topic = config.topic;
const BATCH_SIZE = config.consumer_batch_size;

class KafkaService {
  constructor() {
    // Create a Kafka producer
    this.kafka = new Kafka({ brokers });
    this.producer = this.kafka.producer();

    // Create a Kafka consumer
    this.consumer = this.kafka.consumer({
      groupId: config.groupId,
      heartbeatInterval: 1000,
      minBytes: 1,
      maxBytes: 1000,
      sessionTimeout: 6000,
    });
  }

  // Function to produce messages to Kafka
  async produceMessages(payload) {
    await this.producer.connect();

    try {
      const messages = [{ value: payload }];
      // Produce messages to the specified topic
      await this.producer.send({
        topic,
        messages,
      });

      console.log('Messages produced successfully');
    } finally {
      await this.producer.disconnect();
    }
  }

 

  // Function to consume messages from Kafka
  async consumeMessages() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning: true });

    let batch = [];
    
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const decodedMessage = message.value.toString();
          const decodedJson = JSON.parse(decodedMessage);
          batch.push(decodedJson);

          if (batch.length === BATCH_SIZE) {
            await elasticSearch.insertData(batch);
            console.log('Batch consumed!', batch.length);
            batch = [];
          }          
        } catch (error) {
          console.error(error);
        }
      },
    });
  }
}

// Create an instance of KafkaService
const kafkaService = new KafkaService();

module.exports = {
  produceMessages: kafkaService.produceMessages.bind(kafkaService),
  consumeMessages: kafkaService.consumeMessages.bind(kafkaService),
};
