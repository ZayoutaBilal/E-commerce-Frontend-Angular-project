import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './components/contact/contact.component';
import { AppComponent } from './app.component';
import { SignComponent } from './components/sign/sign.component';
import { AboutComponent } from './components/about/about.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoadingComponent } from './components/loading/loading.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { ShopComponent } from './components/shop/shop.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
const routes: Routes = [
  

  { path: 'home', component: HomeComponent },
  { path: 'loading', component: LoadingComponent },
  { path: 'product-details/:productId', component: ProductDetailsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'about', component: AboutComponent },
  { path: 'signup', component: SignComponent },
  { path: 'signin', component: SignComponent },
  { path: "profile", component: ProfileComponent, canActivate: [authGuard] },
  { path: "cart", component: CartComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
