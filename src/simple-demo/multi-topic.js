const { Kafka, logLevel } = require('kafkajs')

const kafkaClient = new Kafka({
  clientId: 'multi-topic-nodejs-kafka',
  brokers: ['localhost:9092'],
  connectionTimeout: 3000, // default is 1000
  requestTimeout: 25000, // default is 30000
  retry: {
    initialRetryTime: 100,
    retries: 8
  },
  logLevel: logLevel.INFO
})

const startProducer = async () => {
  const producer = kafkaClient.producer()

  await producer.connect()

  const messages = [
    {
      topic: 'topic-a',
      messages: [
        {
          key: 'key',
          value: 'Hey from topic A'
        }
      ]
    },
    {
      topic: 'topic-b',
      messages: [
        {
          key: 'key',
          value: 'Hey  from topic B'
        }
      ]
    }
  ]
  await producer.sendBatch({ topicMessages: messages })
  await producer.disconnect()
}

const startConsumer = async () => {
  const consumer = kafkaClient.consumer({ groupId: 'simple-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'topic-a', fromBeginning: true })
  await consumer.subscribe({ topic: 'topic-b', fromBeginning: true })

  await consumer.run({
    echoMessages: async ({ topic, partition, message }) => {
      console.log({
        key: message.key.toString(),
        value: message.value.toString(),
        Headers: message.Headers.toString(),
        topic,
        partition
      })
    }
  })
}

startProducer().then(() => {
  startConsumer()
})
