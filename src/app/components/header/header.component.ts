import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable ,BehaviorSubject } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { StorageService } from '../../services/storage.service';
import { SharedService } from 'src/app/services/shared.service';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean = false;
  menuOpen : boolean = false;
  cartItemsLength = 0;
  searchCategory = '';
  authorities : string[] = [];


  constructor(private authService: AuthService,
    private cartService : CartService,
    private storage : StorageService,
    private sharedService : SharedService,
    private router: Router
  ) {

  }


  ngOnInit()   {

    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.authService.getAuthorities().subscribe((authorities) => {
      this.authorities = authorities;
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


  onSearch(): void {
    if(this.searchCategory){
      if (this.router.url !== '/shop') {
        this.router.navigateByUrl('/shop');
      }
      this.sharedService.updateSearchQuery(this.searchCategory);
    }
  }





}


