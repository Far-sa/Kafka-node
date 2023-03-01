const { Kafka } = require('kafkajs')

const kafkaClient = new Kafka({
  clientId: 'transaction-method',
  brokers: ['localhost:9092']
})

const startProducer = async () => {
  const producer = kafkaClient.producer({
    idempotent: true,
    maxInFlightRequests: 1,
    transactionalId: 'some-id'
  })
  await producer.connect()

  const transaction = await producer.transaction()

  try {
    await transaction.send({
      topic: 'topic-transaction',
      messages: [
        {
          key: 'transaction-1',
          value: 'Transaction demo value'
        }
      ]
    })
    await transaction.commit()
    await producer.disconnect()
  } catch (error) {
    console.log(error)
    await transaction.abort()
    await producer.disconnect()
  }
}
const startConsumer = async () => {}

startProducer().then(() => {
  startConsumer()
})
