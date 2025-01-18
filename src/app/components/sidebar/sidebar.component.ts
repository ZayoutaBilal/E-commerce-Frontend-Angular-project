import {Component, OnInit} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {SharedService} from "../../services/shared.service";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  selectedItem: string = ''; // Track the selected item

  public links: any = [
    {
      title: 'Dashboard',
      items: [
        { name: 'overview', icon: 'fa-solid fa-house' },
        { name: 'billboards', icon: 'fa-brands fa-bandcamp' },
      ],
    },
    {
      title: 'Pages',
      items: [
        { name: 'products', icon: 'fa-solid fa-book' },
        { name: 'orders', icon: 'fa-solid fa-bag-shopping' },
        { name: 'categories', icon: 'fa-solid fa-dumpster-fire' },
        { name: 'comments', icon: 'fa-solid fa-comment' },
        { name: 'customers', icon: 'fa-solid fa-users' },
        { name: 'tags', icon: 'fa-solid fa-tag' },
      ],
    },
  ];

  constructor(private router: Router,
              private sharedService: SharedService,) {
    // Subscribe to router events to set the current path
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = event.url.slice(1);
        console.log("Path",this.currentPath);// Update current path
        this.selectedItem = this.currentPath; // Ensure the selectedItem matches the route
      }
    });
  }

  // Method to format date
  public formatReadableDate(dateString: any) {
    const options: any = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  }

  // Method to format price
  public formatPrice(price: any) {
    if (typeof price === 'string') {
      if (price.includes('$')) {
        return price.replace('$', '') + '$';
      } else {
        return price + '$';
      }
    } else if (typeof price === 'number') {
      return price.toString() + '$';
    } else {
      return 'N/A';
    }
  }

  // Current path for active link highlighting
  public currentPath: string | undefined;

  // Method to navigate to the selected item
  public navigateTo(item: string) {
    this.selectedItem = item;
    this.sharedService.updateSelectedItem(this.selectedItem);
  }



  // Sidebar open/close toggle (if needed)
  public sidebarisOpen: boolean = true;

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
