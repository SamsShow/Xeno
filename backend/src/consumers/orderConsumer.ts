import { consumeFromQueue, ORDER_QUEUE } from "../config/rabbitmq";
import { processBatch, OrderInput } from "../services/orderService";

const BATCH_SIZE = 50;
let orderBatch: OrderInput[] = [];
let batchTimer: NodeJS.Timeout | null = null;
const BATCH_TIMEOUT = 5000; // 5 seconds

// Function to process the current batch
const processPendingBatch = async (): Promise<void> => {
  if (orderBatch.length === 0) return;

  const batchToProcess = [...orderBatch];
  orderBatch = [];

  if (batchTimer) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }

  try {
    await processBatch(batchToProcess);
    console.log(`Processed batch of ${batchToProcess.length} orders`);
  } catch (error) {
    console.error("Error processing order batch:", error);
    // In a production system, you would implement retry logic or dead-letter queue here
  }
};

// Start a timer to process batches if they don't reach full size
const startBatchTimer = (): void => {
  if (batchTimer) {
    clearTimeout(batchTimer);
  }

  batchTimer = setTimeout(async () => {
    await processPendingBatch();
  }, BATCH_TIMEOUT);
};

// Process a single order message
const processOrderMessage = async (data: OrderInput): Promise<void> => {
  orderBatch.push(data);

  if (orderBatch.length >= BATCH_SIZE) {
    await processPendingBatch();
  } else if (!batchTimer) {
    startBatchTimer();
  }
};

// Start consuming messages from the queue
export const startOrderConsumer = async (): Promise<void> => {
  try {
    console.log("Starting order consumer...");
    await consumeFromQueue(ORDER_QUEUE, processOrderMessage);
    console.log("Order consumer started successfully");
  } catch (error) {
    console.error("Failed to start order consumer:", error);
    throw error;
  }
};
