import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './components/contact/contact.component';
import { SignComponent } from './components/sign/sign.component';
import { AboutComponent } from './components/about/about.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoadingComponent } from './components/loading/loading.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { ShopComponent } from './components/shop/shop.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CustomerServiceComponent } from './components/customer-service/customer-service.component';
import { CategoriesComponent } from './components/customer-service/categories/categories.component';
import {NewProductComponent} from "./components/products-routes/new-product/new-product.component";
import {ProductsComponent} from "./components/products-routes/products/products.component";
import {AdminComponent} from "./components/admin/admin.component";
import {authoritiesGuard} from "./guards/authorities.guard";
import {DiscountsComponent} from "./components/customer-service/discounts/discounts.component";
import {CommentsComponent} from "./components/customer-service/comments/comments.component";


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'loading', component: LoadingComponent },
  { path: 'product-details/:productId', component: ProductDetailsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'about', component: AboutComponent },
  { path: 'sign/:option', component: SignComponent },

  { path: "profile", component: ProfileComponent, canActivate: [authGuard] },
  { path: "cart", component: CartComponent, canActivate: [authGuard] },

  { path: 'customer-service', component: CustomerServiceComponent,canActivate: [authoritiesGuard], data: { authority: ['ROLE_CUSTOMER_SERVICE'] } },
  { path: 'customer-service/categories', component: CategoriesComponent,canActivate: [authoritiesGuard], data: { authority: ['ROLE_CUSTOMER_SERVICE'] } },
  { path: 'customer-service/products', component: ProductsComponent,canActivate: [authoritiesGuard], data: { authority: ['ROLE_CUSTOMER_SERVICE'] } },
  { path: 'customer-service/products/new', component: NewProductComponent,canActivate: [authoritiesGuard] , data: { authority: ['ROLE_CUSTOMER_SERVICE'] }},
  { path: 'customer-service/discounts', component: DiscountsComponent ,canActivate: [authoritiesGuard], data: { authority: ['ROLE_CUSTOMER_SERVICE'] }},
  { path: 'customer-service/comments', component: CommentsComponent ,canActivate: [authoritiesGuard], data: { authority: ['ROLE_CUSTOMER_SERVICE'] }},

  { path: "admin", component: AdminComponent, canActivate: [authoritiesGuard], data: { authority: ['ROLE_ADMIN'] } },

  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
