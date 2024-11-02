import { NgModule } from '@angular/core';
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
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    SignComponent,
    AboutComponent
    //DialogContentComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule ,
    BrowserAnimationsModule,
    MatToolbarModule,        // Add the Material Toolbar module
    MatButtonModule,          // Add the Material Button module if using buttons
    MatDialogModule,
    ToastsContainer ,
    AlertDialogComponent
    // NgbToastModule
    // MatDialogActions,
    // MatDialogContent,
    // MatDialogTitle
  ],
  providers: [AlertDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
