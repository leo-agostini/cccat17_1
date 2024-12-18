import amqp from "amqplib";

export default interface Queue {
  connect(): Promise<void>;
  setup(exchange: string, queue: string): Promise<void>;
  consume(queue: string, callback: Function): Promise<void>;
  publish(exchange: string, data: any): Promise<void>;
}

export class RabbitMQAdapter implements Queue {
  private connection: amqp.Connection | undefined;

  constructor() {}

  async connect(): Promise<void> {
    this.connection = await amqp.connect("amqp://localhost");
  }

  async setup(exchange: string, queue: string): Promise<void> {
    const channel = await this.connection?.createChannel();
    await channel?.assertExchange(exchange, "direct", { durable: true });
    await channel?.assertQueue(queue, { durable: true });
    await channel?.bindQueue(queue, exchange, "");
  }

  async consume(queue: string, callback: Function): Promise<void> {
    const channel = await this.connection?.createChannel();
    channel?.consume(queue, async (message: any) => {
        console.log("Consuming message", message.content.toString());
        const input = JSON.parse(message.content.toString());
        await callback(input)
        channel.ack(message);
    })
  }

  async publish(exchange: string, data: any): Promise<void> {
    const channel = await this.connection?.createChannel();
    console.log("publishing message", data);
    channel?.publish(exchange, "", Buffer.from(JSON.stringify(data)));
  }
}
