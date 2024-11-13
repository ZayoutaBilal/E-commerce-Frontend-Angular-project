import { NgModule ,APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './contact/contact.component';
import { SignComponent } from './sign/sign.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule} from '@angular/material/dialog';
import { AboutComponent } from './about/about.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './components/profile/profile.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CartComponent } from './components/cart/cart.component';
import { ShopComponent } from './components/shop/shop.component';


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
    CartComponent,
    ShopComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule ,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
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
    ConfirmDialogComponent,
    ProfileComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
