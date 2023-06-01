const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-consumer2',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'my-group-1' });

const consumeMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'my-topic-6', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { PKRRate} = JSON.parse(message.value);
        console.log(`today dollar rate: ${PKRRate}`);
    },
  });
};

consumeMessages().catch((err) => {
  console.error('Error consuming messages:', err);
  process.exit(1);
});



// const { Kafka } = require('kafkajs');

// const kafka = new Kafka({
//   clientId: 'my-consumer1',
//   brokers: ['localhost:9092'],
// });

// const consumer = kafka.consumer({ groupId: 'my-group-4' });

// const consumeMessages = async () => {
//   await consumer.connect();
//   await consumer.subscribe({ topic: 'my-topic-3', fromBeginning: true });

//   await consumer.run({
//     eachMessage: async ({ message }) => {
//       const { data, computationResult } = JSON.parse(message.value);
//       console.log(`Consumer 1: Received message - Data: ${data}, Computation Result: ${computationResult}`);
//     },
//   });
// };

// consumeMessages().catch((err) => {
//   console.error('Error consuming messages:', err);
//   process.exit(1);
// });
