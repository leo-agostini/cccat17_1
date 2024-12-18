import amqp from "amqplib";

export default interface Queue {
  connect(): Promise<void>;
  setup(exchange: string, queue: string): Promise<void>;
  consume(queue: string, callback: Function): Promise<void>;
  publish(exchange: string, data: any): Promise<void>;
  disconnect(): Promise<void>;
}

export class RabbitMQAdapter implements Queue {
  private connection!: amqp.Connection;

  constructor() {}

  async connect(): Promise<void> {
    this.connection = await amqp.connect("amqp://localhost");
  }

  async setup(exchange: string, queue: string): Promise<void> {
    const channel = await this.connection.createChannel();
		if (!exchange) await channel.assertExchange(exchange, "direct", { durable: true });
		if (!queue) await channel.assertQueue(queue, { durable: true });
		if (!queue) await channel.bindQueue(queue, exchange, "");
  }

  async consume(queue: string, callback: Function): Promise<void> {
    const channel = await this.connection?.createChannel();
    channel?.consume(queue, async (message: any) => {
      const input = JSON.parse(message.content.toString());
      try {
        await callback(input);
        channel.ack(message);
      } catch (error) {
        console.log(error)
        console.log("Could not process message, keeping in the queue");
      }
    });
  }

  async publish(exchange: string, data: any): Promise<void> {
    const channel = await this.connection?.createChannel();
    channel!.publish(exchange, "", Buffer.from(JSON.stringify(data)));
  }

  async disconnect(): Promise<void> {
    this.connection?.close();
  }
}
