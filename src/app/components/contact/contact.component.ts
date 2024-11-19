import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  constructor(
    private userService : UserService,
    private notificationService : NotificationService,

  ){}

  private emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/

  theName! : string ;
  email! : string ;
  message! : string ;


  sendMessage() : void {
    if(!this.email || !this.message){
      this.notificationService.showInfo("Contact","You must fill email and message !");
      return ;
    }

    if(!this.email.match(this.emailRegex)){
      this.notificationService.showWarning("Contact","Email is not valid");
        return ;
    }

    this.userService.sendMessage(this.message,this.email,this.theName).subscribe({
      next : (response) => {
        this.notificationService.showSuccess("Contact",response.body ?? undefined);
      },error : (error) => {
        this.notificationService.handleSaveError(error);
      }
    })
  }

}
