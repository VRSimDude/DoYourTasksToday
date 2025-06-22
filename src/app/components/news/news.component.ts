import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-news',
  imports: [MatToolbar],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
})
export class NewsComponent implements OnInit {
  news: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('news.txt', { responseType: 'text' }).subscribe((data) => {
      this.news = data;
    });
  }
}
