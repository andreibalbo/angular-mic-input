import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <form (ngSubmit)="onSubmit()">
        <input type="text" [(ngModel)]="message" name="message" placeholder="Enter your message">
        <button type="submit">Submit</button>
      </form>

      <div class="messages">
        <div *ngFor="let msg of messages" class="message">
          {{ msg }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 0 20px;
    }
    
    form {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    input {
      flex: 1;
      padding: 8px;
    }
    
    button {
      padding: 8px 16px;
    }
    
    .message {
      padding: 10px;
      margin: 5px 0;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
  `]
})
export class MicComponent {
  message: string = '';
  messages: string[] = [];

  onSubmit() {
    if (this.message.trim()) {
      this.messages.unshift(this.message);
      this.message = '';
    }
  }
} 