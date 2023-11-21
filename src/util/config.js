// Kafka Config
module.exports.brokers = ['localhost:9092'];
module.exports.topic = 'Logs';
module.exports.groupId = 'SystemLogs';
module.exports.consumer_batch_size = 1000;


//Elastic Search Config
module.exports.elasticSearchHost = 'http://localhost';
module.exports.elasticSearchPort = 9200;
module.exports.index = 'logs';





