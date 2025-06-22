import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { NewsComponent } from './components/news/news.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, HeaderComponent, NewsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'DYTT';

  constructor(private authService: AuthService) {
    if (location.protocol === 'https:') {
      document.location.href = 'http://marcfriedrich.com/sites/dev/todo';
    }
  }

  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
