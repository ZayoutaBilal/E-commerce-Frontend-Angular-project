import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { AppComponent } from './app.component';
import { SignComponent } from './sign/sign.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoadingComponent } from './components/loading/loading.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
const routes: Routes = [
  

  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'signup', component: SignComponent },
  { path: 'signin', component: SignComponent },
  { path: 'loading', component: LoadingComponent },
  { path: "profile", component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
