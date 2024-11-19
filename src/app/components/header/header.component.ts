import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable ,BehaviorSubject } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { response } from 'express';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean = false;
  menuOpen : boolean = false;
  cartItemsLength = 0;

  constructor(private authService: AuthService,
    private cartService : CartService,
    private storage : StorageService
  ) {
     
  }

  
  ngOnInit()   {
    
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
    });
    
    this.storage.cartLength$.subscribe(length => {
      this.cartItemsLength = length;
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
