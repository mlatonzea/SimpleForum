import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from './environment';

const headers = new HttpHeaders({
  'x-api-key': environment.apiKey
});

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {

  username: string = '';
  messageText: string = '';
  messages: any[] = [];
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem("username") || "";
    this.loadPosts();
  }

  loadPosts() {
    this.http.get<any[]>("https://yellow-numbers-attend.loca.lt/posts",
      { headers }
    )
      .subscribe(data => {
        this.messages = data;
        this.cdr.detectChanges();
      });
  }

  postMessage(text: string) {

    if (!text.trim()) {
      return;
    }

    const payload = {
      username: this.username || "Anonymous",
      content: text
    }

    this.http.post("https://yellow-numbers-attend.loca.lt/posts", payload,
      { headers }
    )
      .subscribe(() => {
        this.loadPosts();
      });
    this.messageText = '';
  }
}