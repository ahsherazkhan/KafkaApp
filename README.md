  # Real-time Dollar rate using Apache Kafka and Node.js

   - Application is built in Node.js using Apache kafka (kafkajs). It fetches latest rate of USD from a rest API and after converting to PKR, And a Producer in the kafka cluster boradcast the rate and Consumers who are subscribing to that specific topic recieves the updated Dollar rate.

## Prerequisites
   - A linux server with at least 4 GB of RAM and a non-root user with sudo privileges. You can set this up by following our Initial Server Setup guide if you do not have a non-root user set up. Installations with less than 4GB of RAM may cause the Kafka service to fail.
   - OpenJDK 11 installed on your server(https://www.digitalocean.com/community/tutorials/how-to-install-java-with-apt-on-ubuntu-20-04).
   Kafka is written in Java, so it requires a JVM.


Create a directoy at /home/ubuntu/
- mkdir kafka
- cd kafka

Use curl to download the Kafka binaries:
- curl "https://downloads.apache.org/kafka/2.8.2/kafka_2.13-2.8.2.tgz" -o kafka.tgz

Extract the archive you downloaded using the tar command:
- tar -xvzf kafka.tgz --strip 1

Kafka’s configuration options are specified in server.properties, Open this file with nano or your favorite editor:
- nano ~/kafka/config/server.properties

First, add a setting that will allow you to delete Kafka topics. Add the following line to the bottom of the file:
    
    delete.topic.enable = true

Second, you’ll change the directory where the Kafka logs are stored by modifying the log.dirs property. Find the log.dirs property and replace the existing route with the highlighted route:
    
    log.dirs=/home/ubuntu/logs

Save and close the file.

Go to root directory and create the unit file for zookeeper:

- sudo nano /etc/systemd/system/zookeeper.service

Enter the following unit definition into the file:
    [Unit]
    Requires=network.target remote-fs.target
    After=network.target remote-fs.target

    [Service]
    Type=simple
    User=ubuntu
    ExecStart=/home/ubuntu/kafka/bin/zookeeper-server-start.sh /home/ubuntu/kafka/config/zookeeper.properties
    ExecStop=/home/ubuntu/kafka/bin/zookeeper-server-stop.sh
    Restart=on-abnormal

    [Install]
    WantedBy=multi-user.target

Next, create the systemd service file for kafka:
- sudo nano /etc/systemd/system/kafka.service

Enter the following unit definition into the file:
    [Unit]
    Requires=zookeeper.service
    After=zookeeper.service

    [Service]
    Type=simple
    User=ubuntu
    ExecStart=/bin/sh -c '/home/ubuntu/kafka/bin/kafka-server-start.sh /home/ubuntu/kafka/config/server.properties > /home/ubuntu/kafka/kafka.log 2>&1'
    ExecStop=/home/ubuntu/kafka/bin/kafka-server-stop.sh
    Restart=on-abnormal

    [Install]
    WantedBy=multi-user.target

Now that you have defined the units, start Kafka and zookeeper with the following command:
- sudo systemctl start kafka
- sudo systemctl status kafka
- sudo systemctl start zookeeper
- sudo systemctl enable zookeeper
- sudo systemctl enable kafka

To begin, create a topic named TutorialTopic:
- ~/kafka/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic TutorialTopic

Now publish the string "Hello, World" to the TutorialTopic topic:
- echo "Hello, World" | ~/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic TutorialTopic > /dev/null

The following command consumes messages from TutorialTopic. Note the use of the --from-beginning flag,
- ~/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic TutorialTopic --from-beginning

In this new terminal, start a producer to publish a second message:
- echo "Hello World from Sammy at DigitalOcean!" | ~/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic TutorialTopic > /dev/null

Now that you have successfully setup kafka, now clone the repository with
- git clone (---RepoLink--)

open the terminal containing the folder and create a topic name "my-topic-6"
- ~/kafka/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic my-topic-6

Run group.js by within the same dir
- node group.js

Open a separate terminal Run (This is our Consumer 1)
- node reciever1.js


Open a separate terminal Run (This is our Consumer 2)
- node reciever2.js

You would see the Dollar rate into PKR at commandline

if you want to see all the messages produce by producer in the topic Run this
- ~/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic my-topic-6 --from-beginning
