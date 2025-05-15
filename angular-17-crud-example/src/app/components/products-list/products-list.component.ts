import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  activeFilter = 'all'; // 'all', 'active', 'inactive'

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.retrieveProducts();
  }

  retrieveProducts(): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getAll()
      .subscribe({
        next: (data: Product[]) => {
          this.products = data;
          this.filteredProducts = [...data];
          this.applyFilters();
          this.loading = false;
          console.log('Products loaded successfully:', data.length);
        },
        error: (e: any) => {
          console.error('Error loading products:', e);
          this.error = 'Failed to load products: ' + (e.message || 'Unknown error');
          this.loading = false;
        }
      });
  }

  searchProducts(): void {
    if (!this.searchTerm.trim()) {
      // Reset to all products if search term is empty
      this.filteredProducts = [...this.products];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredProducts = this.products.filter(product => 
        product.product_name.toLowerCase().includes(term) || 
        product.sku.toLowerCase().includes(term)
      );
      
      console.log(`Search found ${this.filteredProducts.length} products matching "${term}"`);
    }
    this.applyActiveFilter();
  }

  filterByActive(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    // First apply search filter
    if (this.searchTerm) {
      this.searchProducts();
    } else {
      this.filteredProducts = [...this.products];
      this.applyActiveFilter();
    }
  }

  applyActiveFilter(): void {
    if (this.activeFilter === 'active') {
      this.products = this.filteredProducts.filter(product => product.is_active);
    } else if (this.activeFilter === 'inactive') {
      this.products = this.filteredProducts.filter(product => !product.is_active);
    } else {
      this.products = [...this.filteredProducts];
    }
    
    console.log(`Applied "${this.activeFilter}" filter. Products showing: ${this.products.length}`);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredProducts = [...this.products];
    this.applyActiveFilter();
    console.log('Search cleared');
  }

  removeProduct(id: number | undefined): void {
    if (id === undefined) {
      console.error('Cannot delete product: ID is undefined');
      this.error = 'Cannot delete product: ID is missing';
      return;
    }
    
    if (confirm('Are you sure you want to delete this product?')) {
      this.loading = true;
      this.error = '';
      
      console.log(`Attempting to delete product with ID: ${id}`);
      
      this.productService.delete(id)
        .subscribe({
          next: (response) => {
            console.log('Product deleted successfully:', response);
            // Refresh the product list
            this.retrieveProducts();
          },
          error: (e: any) => {
            console.error('Delete failed:', e);
            
            // Determine if there's a specific error message to display
            if (e.message && e.message.includes('variants')) {
              this.error = 'Cannot delete this product because it has variants associated with it. Please remove the variants first.';
            } else if (e.message && e.message.includes('catalogs')) {
              this.error = 'Cannot delete this product because it is used in one or more catalogs. Please remove it from all catalogs first.';
            } else if (e.status === 0) {
              this.error = 'Network error. Please check your connection and try again.';
            } else if (e.status === 404) {
              this.error = 'Product not found. It may have been already deleted.';
              // Refresh the list since the product might be gone
              this.retrieveProducts();
            } else {
              this.error = 'Failed to delete product: ' + (e.message || 'Unknown error');
            }
            
            this.loading = false;
          }
        });
    }
  }
} 