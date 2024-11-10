import { Injectable , Inject, PLATFORM_ID} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
 
  

  constructor(
    private router: Router,
    private userService: UserService,
    private storage : StorageService    
  ) {
    
    this.check();
  }

  check(): void {
    
      const token = this.storage.getItem('token');
      if (token !== null && token !== '') {
        this.userService.checkToken(token as string).subscribe({
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
    this.storage.setItem('token',token);
    this.loggedIn.next(true);
    window.location.reload();
  }

  logOut() {
    
    this.storage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigateByUrl('/');
    
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
    
  }
  

 

  

  
}
