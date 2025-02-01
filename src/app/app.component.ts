import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoading = true;
  showBackToTop = false;
  constructor(private authService: AuthService) {}


  ngOnInit() {

    setTimeout(() => {
      this.authService.isLoggedIn().subscribe({
        next: (loggedIn) => {
          this.isLoading = false;

        },
        error: (error) => {
          this.isLoading = false;
        }
      });
   }, 2000);
  }
  @HostListener('window:scroll', [])
  onScroll() {
    this.showBackToTop = window.scrollY > 200;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }


}
