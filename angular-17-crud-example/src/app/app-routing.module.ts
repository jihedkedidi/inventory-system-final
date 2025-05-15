import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'add-product', component: AddProductComponent },
  
  // Variant routes
  { path: 'variants', component: VariantsListComponent },
  { path: 'variants/product/:productId', component: VariantsListComponent },
  { path: 'variants/:id', component: VariantDetailsComponent },
  { path: 'add-variant', component: AddVariantComponent },
  { path: 'products/:productId/add-variant', component: AddVariantComponent },
  
  // Location routes
  { path: 'locations', component: LocationsListComponent },
  { path: 'locations/:id', component: LocationDetailsComponent },
  { path: 'add-location', component: AddLocationComponent },
  
  // Catalog routes
  { path: 'catalogs', component: CatalogsListComponent },
  { path: 'catalogs/:id', component: CatalogDetailsComponent },
  { path: 'add-catalog', component: AddCatalogComponent },
  
  // Supplier routes
  { path: 'suppliers', component: SuppliersListComponent },
  { path: 'suppliers/:id', component: SupplierDetailsComponent },
  { path: 'add-supplier', component: AddSupplierComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
