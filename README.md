# KafkaApp
Application is built in Node.js using Apache kafka (kafkajs). It fetches latest rate of USD from a rest API and after converting to PKR, And a Producer in the kafka cluster boradcast the rate and Consumers who are subscribing to that specific topic recieves the updated Dollar rate.
