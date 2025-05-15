import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VariantsListComponent } from './components/variants-list/variants-list.component';
import { VariantDetailsComponent } from './components/variant-details/variant-details.component';
import { AddVariantComponent } from './components/add-variant/add-variant.component';
import { LocationsListComponent } from './components/locations-list/locations-list.component';
import { LocationDetailsComponent } from './components/location-details/location-details.component';
import { AddLocationComponent } from './components/add-location/add-location.component';
import { CatalogsListComponent } from './components/catalogs-list/catalogs-list.component';
import { CatalogDetailsComponent } from './components/catalog-details/catalog-details.component';
import { AddCatalogComponent } from './components/add-catalog/add-catalog.component';
import { SuppliersListComponent } from './components/suppliers-list/suppliers-list.component';
import { SupplierDetailsComponent } from './components/supplier-details/supplier-details.component';
import { AddSupplierComponent } from './components/add-supplier/add-supplier.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsListComponent,
    ProductDetailsComponent,
    AddProductComponent,
    DashboardComponent,
    VariantsListComponent,
    VariantDetailsComponent,
    AddVariantComponent,
    LocationsListComponent,
    LocationDetailsComponent,
    AddLocationComponent,
    CatalogsListComponent,
    CatalogDetailsComponent,
    AddCatalogComponent,
    SuppliersListComponent,
    SupplierDetailsComponent,
    AddSupplierComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
