import { kafkaClient } from './client-config'

export const consumerStart = async () => {
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
