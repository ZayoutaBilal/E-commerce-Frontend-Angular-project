import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable ,BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean = false;
  menuOpen : boolean = false;

  constructor(private authService: AuthService) {
     
  }

  
  ngOnInit()   {
    
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
    });

    
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logOut() {
    this.authService.logOut();
    this.menuOpen = false;
    this.isLoggedIn = false;
    
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.nav-icon') && this.menuOpen) {
      this.menuOpen = false;
    }
  }
}
