import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private userService: UserService
  ) {
    this.init();
  }

  init(): void {
    
      const token = this.cookieService.get('token');
      if (token) {
        this.userService.checkToken(token).subscribe({
          next: () => {
            this.loggedIn.next(true);
            this.router.navigate(['/']);
            
          },
          error: () => {
            this.loggedIn.next(false);
            
          }
        });
      } else {
        this.loggedIn.next(false);
        
      }
    
  }

  logIn(token: string) {
    this.cookieService.set('token', token, {
      secure: true,
      sameSite: 'Strict'
    });
    this.loggedIn.next(true);
    this.router.navigate(['/']);
  }

  logOut() {
    this.cookieService.deleteAll();
    this.loggedIn.next(false);
    this.router.navigate(['/']);
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
    
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  
}
