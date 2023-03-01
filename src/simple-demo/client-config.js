const { Kafka, logLevel } = require('kafkajs')

export const kafkaClient = new Kafka({
  clientId: 'simple-nodejs-kafka',
  brokers: ['localhost:9092'],
  connectionTimeout: 3000, // default is 1000
  requestTimeout: 25000, // default is 30000
  retry: {
    initialRetryTime: 100,
    retries: 8
  },
  logLevel: logLevel.INFO
})

// kafka.logger().info('')
