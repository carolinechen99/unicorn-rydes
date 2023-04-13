# Unicorn Rydes

## Overview
This project uses AWS services to process real-time data streams  without managing servers. Wild Rydes introduces an innovative transportation service that offers unicorn rydes to help people to get to their destination faster and hassle-free. Each unicorn is equipped with a sensor that reports its location and vital signs. We build infrastructure to enable operations personnel at Wild Rydes to monitor the health and status of their unicorn fleet. We use AWS to build applications that process and visualize the unicorn data in real-time.


## Resources
Producer and consumer are downloaded from https://data-processing.serverlessworkshops.io/client/client.tar

### Producer
The producer generates sensor data from a unicorn taking a passenger on a Wild Ryde. Each second, it emits the location of the unicorn as a latitude and longitude point, the distance traveled in meters in the previous second, and the unicorn's current level of magic and health points.

### Consumer
The consumer reads and displays formatted JSON messages from an Amazon Kinesis stream which allow us to monitor in real-time what's being sent to the stream. Using the consumer, you can monitor the data the producer and your applications are sending.

Once we send and receive data from the stream, we can use the unicorn dashboard  to view the current position and vitals of our unicorn fleet in real-time.
https://d9ambsihrwoxf.cloudfront.net/


### AWS Resources
Access Management (IAM), Amazon Cognito, Amazon Kinesis, Amazon S3, Amazon Athena, Amazon DynamoDB, and AWS Cloud9

