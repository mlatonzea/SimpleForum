import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { OnInit, ChangeDetectorRef } from '@angular/core';

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
    this.http.get<any[]>("https://something.loca.lt:8000/posts")
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

    this.http.post("https://something.loca.lt:8000/posts", payload)
      .subscribe(() => {
        this.loadPosts();
      });
    this.messageText = '';
  }
}