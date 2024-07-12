import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserManagementService } from 'src/app/services/user-management.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket!: WebSocket;
  private messageSubject: Subject<string> = new Subject<string>();
  protected userManagementServ = inject(UserManagementService)

  constructor() {}

  public connect() {
    this.socket = new WebSocket('ws://50.28.107.39:1122/websockets/notifications');

    this.socket.onopen = (event) => {
      // console.log('WebSocket connection opened:', event);
    };

    this.socket.onmessage = (event) => {
      // console.log('WebSocket message received:', event.data);
      this.messageSubject.next(event.data);
    };

    this.socket.onclose = (event) => {
      // console.log('WebSocket connection closed:', event);
    };

    this.socket.onerror = (event) => {
      // console.error('WebSocket error:', event);
    };
  }

  getMessages() {
    return this.messageSubject.asObservable();
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}