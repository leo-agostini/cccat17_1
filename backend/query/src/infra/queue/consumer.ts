import amqp from 'amqplib';

async function main() {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertExchange("rideCompleted", "direct", { durable: true });
    await channel.assertQueue("rideCompleted", { durable: true, });
    await channel.bindQueue("rideCompleted", "rideCompleted", "");
    channel.consume("rideCompleted", (message) => {
        console.log(message);
    });
}

main();