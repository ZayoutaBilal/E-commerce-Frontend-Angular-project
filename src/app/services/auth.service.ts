import {Injectable} from '@angular/core';
import { Router} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { StorageService } from './storage.service';
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
  ) {
    this.check();
  }

  check(): void {
      const token = this.storage.getToken().subscribe(token => {
        if (token) {
          this.userService.checkToken().subscribe({
            next: (response) => {
              this.loggedIn.next(true);
              this.authorities.next(response.body ?? []);
              this.router.navigate(['/home']).then();
            },
            error: () => {
              this.loggedIn.next(false);
            }
          });
        } else
          this.loggedIn.next(false);
      });
  }

  logIn(token: string,authorities: string[]) {
    this.storage.setToken(token);
    this.loggedIn.next(true);
    this.authorities.next(authorities);
    this.router.navigateByUrl('/home').then();
  }

  logOut() {
    this.storage.removeToken();
    this.loggedIn.next(false);
    this.authorities.next([]);
    this.router.navigateByUrl('/home').then();
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  getAuthorities() {
    return this.authorities.asObservable();
  }









}
