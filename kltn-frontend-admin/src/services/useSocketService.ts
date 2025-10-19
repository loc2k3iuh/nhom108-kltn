import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  private stompClient: Client | null = null;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private BASE_URL = import.meta.env.VITE_API_BASE_URL;

  async connect(): Promise<void> {
    if (this.isConnected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      const socket = new SockJS(`${this.BASE_URL}/luther/ws`); 
      
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log('WebSocket Debug:', str);
        },
        onConnect: () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.isConnecting = false;
          resolve();
        },
        onStompError: (frame) => {
          console.error('WebSocket error:', frame);
          this.isConnected = false;
          this.isConnecting = false;
          reject(new Error('WebSocket connection failed'));
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
          this.isConnecting = false;
        },
      });

      this.stompClient.activate();
    });
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.isConnected = false;
      this.isConnecting = false;
    }
  }

  subscribe(destination: string, callback: (message: any) => void): () => void {
    if (!this.stompClient || !this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    const subscription = this.stompClient.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    return () => subscription.unsubscribe();
  }

  send(destination: string, body: any): void {
    if (!this.stompClient || !this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    this.stompClient.publish({
      destination,
      body: JSON.stringify(body),
       headers: { 'content-type': 'application/json' }
    });
  }

  isConnectedStatus(): boolean {
    return this.isConnected;
  }

  isConnectingStatus(): boolean {
    return this.isConnecting;
  }
}

export const webSocketService = new WebSocketService();