import { kafkaClient } from './client-config'

export const producerStart = async () => {
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
