import * as amqplib from "amqplib";

declare module "amqplib" {
  export interface Connection {
    createChannel(): Promise<Channel>;
    close(): Promise<void>;
    serverProperties: any;
    expectSocketClose: boolean;
    sentSinceLastCheck: boolean;
    recvSinceLastCheck: boolean;
    sendMessage: any;
  }
}
