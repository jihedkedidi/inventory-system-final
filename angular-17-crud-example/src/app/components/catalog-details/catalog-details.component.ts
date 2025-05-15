import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalog } from '../../models/catalog.model';
import { Product } from '../../models/product.model';
import { CatalogService } from '../../services/catalog.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-catalog-details',
  templateUrl: './catalog-details.component.html',
  styleUrls: ['./catalog-details.component.css']
})
export class CatalogDetailsComponent implements OnInit {
  currentCatalog: Catalog = {
    catalog_name: '',
    description: '',
    is_active: true,
    products: []
  };
  
  allProducts: Product[] = [];
  availableProducts: Product[] = [];
  selectedProductIds: number[] = [];
  
  message = '';
  loading = false;
  productLoading = false;
  error = '';
  success = '';
  isEditing = false;

  constructor(
    private catalogService: CatalogService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCatalog(this.route.snapshot.params['id']);
  }

  getCatalog(id: string): void {
    this.loading = true;
    this.error = '';
    
    this.catalogService.get(id)
      .subscribe({
        next: (data: Catalog) => {
          this.currentCatalog = data;
          this.loading = false;
          this.loadAvailableProducts();
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Failed to load catalog details.';
          this.loading = false;
        }
      });
  }

  loadAvailableProducts(): void {
    this.productLoading = true;
    
    this.productService.getAll()
      .subscribe({
        next: (data: Product[]) => {
          this.allProducts = data;
          
          // Filter out products that are already in the catalog
          this.updateAvailableProducts();
          
          this.productLoading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.productLoading = false;
        }
      });
  }

  updateAvailableProducts(): void {
    const catalogProductIds = this.currentCatalog.products?.map(p => p.id) || [];
    this.availableProducts = this.allProducts.filter(product => 
      !catalogProductIds.includes(product.id)
    );
  }

  updateCatalog(): void {
    this.loading = true;
    this.error = '';
    this.success = '';
    
    if (this.currentCatalog.catalog_id === undefined) {
      this.error = 'Cannot update catalog: ID is missing';
      this.loading = false;
      return;
    }
    
    const data = {
      name: this.currentCatalog.catalog_name,
      description: this.currentCatalog.description,
      is_active: this.currentCatalog.is_active
    };
    
    this.catalogService.update(this.currentCatalog.catalog_id, data)
      .subscribe({
        next: () => {
          this.success = 'Catalog was updated successfully!';
          this.isEditing = false;
          this.loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Failed to update catalog.';
          this.loading = false;
        }
      });
  }

  deleteCatalog(): void {
    if (this.currentCatalog.catalog_id === undefined) {
      this.error = 'Cannot delete catalog: ID is missing';
      return;
    }
    
    if (confirm('Are you sure you want to delete this catalog?')) {
      this.loading = true;
      this.catalogService.delete(this.currentCatalog.catalog_id)
        .subscribe({
          next: () => {
            this.router.navigate(['/catalogs']);
          },
          error: (e: any) => {
            console.error(e);
            this.error = 'Failed to delete catalog.';
            this.loading = false;
          }
        });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.currentCatalog.catalog_id) {
      // Reload original data if canceling edit
      this.getCatalog(String(this.currentCatalog.catalog_id));
    }
  }

  addProductsToCatalog(): void {
    if (this.selectedProductIds.length === 0 || this.currentCatalog.catalog_id === undefined) {
      return;
    }
    
    this.productLoading = true;
    this.error = '';
    
    this.catalogService.addProducts(this.currentCatalog.catalog_id, this.selectedProductIds)
      .subscribe({
        next: (updatedCatalog: Catalog) => {
          this.currentCatalog = updatedCatalog;
          this.selectedProductIds = [];
          this.updateAvailableProducts();
          this.success = 'Products added to catalog successfully!';
          this.productLoading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Failed to add products to catalog.';
          this.productLoading = false;
        }
      });
  }

  removeProductFromCatalog(productId: number | undefined): void {
    if (!productId || this.currentCatalog.catalog_id === undefined) {
      return;
    }
    
    this.productLoading = true;
    this.error = '';
    
    this.catalogService.removeProducts(this.currentCatalog.catalog_id, [productId])
      .subscribe({
        next: (updatedCatalog: Catalog) => {
          this.currentCatalog = updatedCatalog;
          this.updateAvailableProducts();
          this.success = 'Product removed from catalog successfully!';
          this.productLoading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Failed to remove product from catalog.';
          this.productLoading = false;
        }
      });
  }

  toggleProductSelection(productId: number | undefined): void {
    if (productId === undefined) return;
    
    const index = this.selectedProductIds.indexOf(productId);
    if (index > -1) {
      this.selectedProductIds.splice(index, 1);
    } else {
      this.selectedProductIds.push(productId);
    }
  }

  isProductSelected(productId: number | undefined): boolean {
    if (productId === undefined) return false;
    return this.selectedProductIds.includes(productId);
  }
}
