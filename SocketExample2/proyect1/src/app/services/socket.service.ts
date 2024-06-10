import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  private socket: WebSocket | undefined;
  private listener: EventEmitter<any> = new EventEmitter();

  constructor(private authService: AuthService) {
    if (this.isBrowser()) {
      this.initWebSocket();
    } else {
      console.error('WebSocket is not supported in this environment.');
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof WebSocket !== 'undefined';
  }

  private initWebSocket(): void {
    const username = this.authService.getUsername();
    console.log('Retrieved username:', username);
    if (!username) {
      console.error('User is not logged in.');
      return;
    }

    // Cambia la URL del WebSocket para que apunte a la dirección pública del DevTunnel
    this.socket = new WebSocket(`wss://8fxkm11s-1234.use2.devtunnels.ms/ws?username=${username}`);

    this.socket.onopen = event => {
      console.log('WebSocket connection opened:', event);
      this.listener.emit({ type: 'open', data: event });
    };
    this.socket.onclose = event => {
      console.log('WebSocket connection closed:', event);
      this.listener.emit({ type: 'close', data: event });
    };
    this.socket.onmessage = event => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);
      this.listener.emit({ type: 'message', data: data });
    };
    this.socket.onerror = event => {
      console.error('WebSocket error:', event);
      this.listener.emit({ type: 'error', data: event });
    };
  }

  public send(data: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(data);
    } else {
      console.error('WebSocket is not open. Ready state: ', this.socket?.readyState);
    }
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
    } else {
      console.error('WebSocket is not initialized.');
    }
  }

  public getEventListener() {
    return this.listener;
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
