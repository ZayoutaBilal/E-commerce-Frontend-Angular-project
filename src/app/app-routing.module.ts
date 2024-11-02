import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { AppComponent } from './app.component';
import { SignComponent } from './sign/sign.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  
  { path: 'contact', component: ContactComponent },
  { path: 'signin', component: SignComponent },
  { path: 'about', component: AboutComponent },
  { path: 'signup', component: SignComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
