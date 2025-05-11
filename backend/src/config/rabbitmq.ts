import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

// Queue names
export const CUSTOMER_QUEUE = "customer_queue";
export const ORDER_QUEUE = "order_queue";

// Define the types but keep them flexible
let connection: any = null;
let channel: any = null;

export const connectRabbitMQ = async (): Promise<void> => {
  try {
    // Use dynamic import to avoid TypeScript errors
    const amqp = await import("amqplib");
    connection = await amqp.connect(RABBITMQ_URL);

    if (!connection) {
      throw new Error("Failed to establish RabbitMQ connection");
    }

    channel = await connection.createChannel();
    if (!channel) {
      throw new Error("Failed to create RabbitMQ channel");
    }

    // Ensure queues exist
    await channel.assertQueue(CUSTOMER_QUEUE, { durable: true });
    await channel.assertQueue(ORDER_QUEUE, { durable: true });

    console.log("RabbitMQ connected successfully");
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
    process.exit(1);
  }
};

export const publishToQueue = async (
  queueName: string,
  data: any
): Promise<boolean> => {
  if (!channel) {
    throw new Error("RabbitMQ channel not established");
  }

  return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
    persistent: true,
    contentType: "application/json",
  });
};

export const consumeFromQueue = async (
  queueName: string,
  callback: (data: any) => Promise<void>
): Promise<void> => {
  if (!channel) {
    throw new Error("RabbitMQ channel not established");
  }

  await channel.consume(queueName, async (msg: any) => {
    if (msg) {
      try {
        const data = JSON.parse(msg.content.toString());
        await callback(data);
        channel?.ack(msg);
      } catch (error) {
        console.error(`Error processing message from ${queueName}:`, error);
        // Nack the message and requeue it
        channel?.nack(msg, false, true);
      }
    }
  });
};

export const closeRabbitMQ = async (): Promise<void> => {
  try {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
    console.log("RabbitMQ connection closed");
  } catch (error) {
    console.error("Error closing RabbitMQ connection:", error);
  }
};
