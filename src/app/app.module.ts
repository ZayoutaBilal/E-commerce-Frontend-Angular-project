import { NgModule ,APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactComponent } from './components/contact/contact.component';
import { SignComponent } from './components/sign/sign.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule} from '@angular/material/dialog';
import { AboutComponent } from './components/about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './components/profile/profile.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CartComponent } from './components/cart/cart.component';
import { ShopComponent } from './components/shop/shop.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { HomeComponent } from './components/home/home.component';
import { CustomerServiceComponent } from './components/customer-service/customer-service.component';
import { CategoriesComponent } from './components/categories/categories.component';
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OverviewComponent} from "./components/overview/overview.component";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {HeaderCustomerServiceComponent} from "./components/header-customer-service/header-customer-service.component";
import {NewProductComponent} from "./components/products-routes/new-product/new-product.component";
import {ProductsComponent} from "./components/products-routes/products/products.component";
import {ProductDetailComponent} from "./components/products-routes/product-detail/product-detail.component";
import {NgOptimizedImage} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    CustomerServiceComponent,
    ContactComponent,
    SignComponent,
    AboutComponent,
    ProfileComponent,
    LoadingComponent,
    CartComponent,
    ShopComponent,
    ProductDetailsComponent,
    OverviewComponent,
    SidebarComponent,
    HeaderCustomerServiceComponent,
    CategoriesComponent,
    NewProductComponent,
    ProductsComponent,
    ProductDetailComponent,



  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
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
            progressBar: true,
            tapToDismiss: true,
            extendedTimeOut: 2000,
        }),
        ReactiveFormsModule,
        NgOptimizedImage,


    ],


  providers: [
    ConfirmDialogComponent,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
