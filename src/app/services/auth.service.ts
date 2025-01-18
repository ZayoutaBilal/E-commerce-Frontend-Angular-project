import { Injectable , Inject, PLATFORM_ID} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private authorities = new BehaviorSubject<string[]>([]);
 
  

  constructor(
    private router: Router,
    private userService: UserService,
    private storage : StorageService,
    private notificationService : NotificationService,
  ) {
    
    this.check();
  }

  check(): void {
    
      const token = this.storage.getItem('token');
      if (token !== null && token !== '') {
        this.userService.checkToken().subscribe({
          next: (response) => {
            this.loggedIn.next(true);
            this.authorities.next(response.body ?? []);
            this.router.navigate(['/']);
            setTimeout( () => {this.notificationService.show(`Welcome back`);},2000);
          },
          error: () => {
            this.loggedIn.next(false);
          }
        });
      } else {
        this.loggedIn.next(false);
       
        
      }
    
  }

  logIn(token: string,authorities: string[]) {
    console.log("authorities",authorities);
    this.storage.setItem('token',token);
    this.loggedIn.next(true);
    this.authorities.next(authorities);
    window.location.reload();
  }

  logOut() {
    
    this.storage.removeItem('token');
    this.loggedIn.next(false);
    this.authorities.next([]);
    this.router.navigateByUrl('/');
    
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  getAuthorities() {
    return this.authorities.asObservable();
  }
  

 

  

  
}
