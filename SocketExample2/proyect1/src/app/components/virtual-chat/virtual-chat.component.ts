import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface Message {
  content: string;
  sender: string;
}

@Component({
  selector: 'app-virtual-chat',
  templateUrl: './virtual-chat.component.html',
  styleUrls: ['./virtual-chat.component.css']
})
export class VirtualChatComponent implements OnInit, OnDestroy {
  public messages: Message[] = [];
  public chatBox: string = "";

  constructor(private socket: SocketService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.socket.getEventListener().subscribe((event: { type: string; data: any; }) => {
      if (event.type === 'message') {
        const data = event.data;
        this.messages.push({ content: data.content, sender: data.sender });
      } else if (event.type === 'open') {
        this.messages.push({ content: "The socket connection has been established", sender: "System" });
      } else if (event.type === 'close') {
        this.messages.push({ content: "The socket connection has been closed", sender: "System" });
      } else if (event.type === 'error') {
        this.messages.push({ content: "An error occurred with the WebSocket connection", sender: "System" });
      }
    });
  }

  ngOnDestroy() {
    this.socket.close();
  }

  public send(event: Event) {
    event.preventDefault();
    if (this.chatBox.trim()) {
      const message = {
        content: this.chatBox,
        sender: this.authService.getUsername()
      };
      this.socket.send(JSON.stringify(message));
      this.chatBox = "";
    }
  }
}
