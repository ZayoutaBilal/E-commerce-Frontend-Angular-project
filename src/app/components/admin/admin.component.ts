import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{

  selectedItem: string = '';
  public sidebarisOpen: boolean = true;
  public currentPath: string | undefined;

  public links: any = [
    {
      items: [
        { name: 'messages', icon: 'fa-solid fa-message' },
        { name: 'customers', icon: 'fa-solid fa-users-gear' },
        { name: 'customer-services', icon: 'fa-solid fa-user-tie' }
      ],
    },
  ];

  constructor(private router: Router,
              private sharedService: SharedService,) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = event.url.slice(1);
        console.log("Path",this.currentPath);
        this.selectedItem = this.currentPath;
      }
    });
  }

  public navigateTo(item: string) {
    this.selectedItem = item;
    this.sharedService.updateSelectedItem(this.selectedItem);
  }

  public toggleSideBar() {
    this.sidebarisOpen = !this.sidebarisOpen;
    console.log(this.sidebarisOpen);
  }

  ngOnInit(): void {
    this.sharedService.selectedItem$.subscribe(selectedItem => {
      this.selectedItem = selectedItem;
    })
  }
}
