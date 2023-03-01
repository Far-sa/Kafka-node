const { Kafka } = require('kafkajs')

const kafkaClient = new Kafka({
  clientId: 'simple-nodejs-kafka',
  brokers: ['localhost:9092']
})

const producerStart = async () => {
  const producer = kafkaClient.producer()

  await producer.connect()
  await producer.send({
    topic: 'simple-topic',
    acks: -1, // 0 , 1 , -1
    messages: [
      {
        key: 'key1',
        value: 'First message from producer ONE',
        headers: {
          'correlation-id': 'uuid'
        }
      },
      {
        key: 'key2',
        value: 'Second message from producer ONE'
      }
    ]
  })
  await producer.send({
    topic: 'simple-topic',
    messages: [
      {
        value: 'First message from producer TWO'
      }
    ]
  })
  producer.disconnect()
}

const consumerStart = async () => {
  const consumer = kafkaClient.consumer({ groupId: 'simple-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'simple-topic', fromBeginning: true })

  await consumer.run({
    echoMessage: async ({ topic, partition, message }) => {
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
producerStart().then(() => {
  consumerStart()
})
