import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Message {
  type: 'text' | 'audio';
  content: string | Blob;
  timestamp: Date;
}

@Component({
  selector: 'app-mic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <form (ngSubmit)="onSubmit()">
        <input type="text" [(ngModel)]="message" name="message" placeholder="Enter your message">
        <button 
          type="button" 
          class="mic-button" 
          (mousedown)="startRecording()" 
          (mouseup)="stopRecording()"
          (mouseleave)="stopRecording()"
          [class.recording]="isRecording">
          🎤
        </button>
        <button type="submit">Submit</button>
      </form>

      <div class="messages">
        <div *ngFor="let msg of messages" class="message">
          <ng-container [ngSwitch]="msg.type">
            <span *ngSwitchCase="'text'">{{ msg.content }}</span>
            <audio *ngSwitchCase="'audio'" controls [src]="msg.content"></audio>
          </ng-container>
          <small class="timestamp">{{ msg.timestamp | date:'short' }}</small>
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

    .mic-button {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .mic-button.recording {
      background-color: #ff4444;
      color: white;
      transform: scale(1.1);
    }
    
    .message {
      padding: 10px;
      margin: 5px 0;
      background-color: #f5f5f5;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .timestamp {
      color: #666;
      font-size: 0.8em;
    }

    audio {
      width: 100%;
    }
  `]
})
export class MicComponent {
  message: string = '';
  messages: Message[] = [];
  mediaRecorder: MediaRecorder | null = null;
  isRecording = false;
  audioChunks: Blob[] = [];

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.messages.unshift({
          type: 'audio',
          content: audioUrl,
          timestamp: new Date()
        });
        this.audioChunks = [];
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please ensure you have granted permission.');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  onSubmit() {
    if (this.message.trim()) {
      this.messages.unshift({
        type: 'text',
        content: this.message,
        timestamp: new Date()
      });
      this.message = '';
    }
  }
} 