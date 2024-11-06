import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserInfosModule } from '../../models/user-infos/user-infos.module';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private userInfoOrigin!: UserInfosModule;
  userInfo = new UserInfosModule();
  initialized = new Boolean (false);
  selectedTab: string = 'account-general';
  
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.userService.getUserInfo().subscribe({
      next:(data) => {
        this.userInfoOrigin = data;
        this.userInfo = data;
        this.initialized=true;
      },
      error(error){
        console.error('Error fetching user info', error);
      }
  });
  }

  setSelectedTab(tab: string) {
    this.selectedTab = tab;
  }

  saveChanges() {
    
    console.log('Changes saved:', this.userInfo);
    
  }

  cancelChanges() {
    
    console.log('Changes cancelled');
  }
}
