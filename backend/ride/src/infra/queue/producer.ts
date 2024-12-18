import amqp from 'amqplib';
import crypto from 'crypto';

async function main() {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertExchange("rideCompleted", "direct", { durable: true });

    await channel.assertQueue("rideCompleted.processPayment", { durable: true, });
    await channel.assertQueue("rideCompleted.sendReceipt", { durable: true, });
    await channel.assertQueue("rideCompleted.generateInvoice", { durable: true, });
    
    await channel.bindQueue("rideCompleted.processPayment", "rideCompleted", "");
    await channel.bindQueue("rideCompleted.sendReceipt", "rideCompleted", "");
    await channel.bindQueue("rideCompleted.generateInvoice", "rideCompleted", "");
    
    channel.publish("rideCompleted", "", Buffer.from(JSON.stringify({
        rideId: crypto.randomUUID()
    })));
}

main();