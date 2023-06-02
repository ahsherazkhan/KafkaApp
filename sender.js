const axios = require('axios');
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

const fetchUSDtoPKRRate = async () => {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    const PKRRate = response.data.rates['PKR'];
    return PKRRate;
  } catch (error) {
    return 283.89;
    //console.error('Error fetching USD to PKR rate:', error);
    throw error;
  }
};

const produceMessage = async () => {
  try {
    const PKRRate = await fetchUSDtoPKRRate();

    await producer.connect();

    const message = {
      value: JSON.stringify({
             PKRRate,
            }),
    };

    await producer.send({
      topic: 'my-topic-6',
      messages: [message],
    });

    console.log('Message sent successfully');

    await producer.disconnect();
  } catch (error) {
    console.error('Error producing message:', error);
    process.exit(1);
  }
};

produceMessage();

// const { Kafka } = require('kafkajs');

// const kafka = new Kafka({
//   clientId: 'my-producer',
//   brokers: ['localhost:9092'],
// });

// const producer = kafka.producer();

// const performComputation = (data) => {
//   // Add your computation logic here
//   const result = data * 7 ;
//   return result;
// };

// const produceMessage = async () => {
//   await producer.connect();

//   const data = 10; // Example data to be processed
//   const computationResult = performComputation(data);

//   const message = {
//     value: JSON.stringify({
//       data,
//       computationResult,
//     }),
//   };

//   await producer.send({
//     topic: 'my-topic-3',
//     messages: [message],
//   });

//   console.log('Message sent successfully');

//   await producer.disconnect();
// };

// produceMessage().catch((err) => {
//   console.error('Error producing message:', err);
//   process.exit(1);
// });
