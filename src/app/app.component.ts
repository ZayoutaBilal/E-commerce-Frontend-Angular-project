import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoading = true;
  constructor(private authService: AuthService) {}
  

  

  ngOnInit() {
    
    setTimeout(() => {
      this.authService.isLoggedIn().subscribe({
        next: (loggedIn) => {
          console.log(loggedIn);
          this.isLoading = false;
         
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error.error);
        }
      });
   }, 2000);
  }
}
