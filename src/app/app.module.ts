import { NgModule ,APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './contact/contact.component';
import { SignComponent } from './sign/sign.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastsContainer } from './alert-dialog/toasts-container';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatToolbarModule } from '@angular/material/toolbar'; // Import MatToolbarModule
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule if using buttons
import { MatDialogActions,MatDialogContent,MatDialogTitle ,MatDialogClose, MatDialogModule} from '@angular/material/dialog';
import { AboutComponent } from './about/about.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
//import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './components/profile/profile.component';
import { LoadingComponent } from './components/loading/loading.component';
import { AuthService } from './services/auth.service';
import { ToastrModule } from 'ngx-toastr';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    SignComponent,
    AboutComponent,
    ProfileComponent,
    LoadingComponent,
    
    
   
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule ,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    ToastsContainer ,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-center',
      preventDuplicates: false,
      maxOpened: 5, 
      autoDismiss: false,
      closeButton: true,
      progressBar: true ,
      tapToDismiss : true,
      extendedTimeOut : 2000,
    }),
    
    
  ],
 

  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
