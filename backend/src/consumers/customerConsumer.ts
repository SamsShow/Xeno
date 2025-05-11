import { consumeFromQueue, CUSTOMER_QUEUE } from '../config/rabbitmq';
import { processBatch, CustomerInput } from '../services/customerService';

const BATCH_SIZE = 100;
let customerBatch: CustomerInput[] = [];
let batchTimer: NodeJS.Timeout | null = null;
const BATCH_TIMEOUT = 10000; // 10 seconds

// Function to process the current batch
const processPendingBatch = async (): Promise<void> => {
  if (customerBatch.length === 0) return;
  
  const batchToProcess = [...customerBatch];
  customerBatch = [];
  
  if (batchTimer) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }
  
  try {
    await processBatch(batchToProcess);
    console.log(`Processed batch of ${batchToProcess.length} customers`);
  } catch (error) {
    console.error('Error processing customer batch:', error);
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

// Process a single customer message
const processCustomerMessage = async (data: CustomerInput): Promise<void> => {
  customerBatch.push(data);
  
  if (customerBatch.length >= BATCH_SIZE) {
    await processPendingBatch();
  } else if (!batchTimer) {
    startBatchTimer();
  }
};

// Start consuming messages from the queue
export const startCustomerConsumer = async (): Promise<void> => {
  try {
    console.log('Starting customer consumer...');
    await consumeFromQueue(CUSTOMER_QUEUE, processCustomerMessage);
    console.log('Customer consumer started successfully');
  } catch (error) {
    console.error('Failed to start customer consumer:', error);
    throw error;
  }
}; 