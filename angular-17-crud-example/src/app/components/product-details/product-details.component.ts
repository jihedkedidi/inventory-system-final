import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  currentProduct: Product = {
    product_name: '',
    description: '',
    sku: '',
    unit_of_measure: 'piece',
    is_active: false
  };
  
  originalProduct: Product = {
    product_name: '',
    description: '',
    sku: '',
    unit_of_measure: 'piece',
    is_active: false
  };
  
  message = '';
  loading = false;
  error = '';
  success = '';
  isEditing = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getProduct(this.route.snapshot.params['id']);
  }

  getProduct(id: string): void {
    this.loading = true;
    this.error = '';
    
    this.productService.get(id)
      .subscribe({
        next: (data: Product) => {
          this.currentProduct = { ...data };
          this.originalProduct = { ...data };
          this.loading = false;
          console.log('Product loaded:', data);
        },
        error: (e: any) => {
          console.error('Error loading product:', e);
          this.error = 'Failed to load product details: ' + (e.message || 'Unknown error');
          this.loading = false;
        }
      });
  }

  updateProduct(): void {
    this.loading = true;
    this.error = '';
    this.success = '';
    
    if (this.currentProduct.id === undefined) {
      this.error = 'Cannot update product: ID is missing';
      this.loading = false;
      return;
    }
    
    // Validate required fields
    if (!this.currentProduct.product_name || !this.currentProduct.sku || !this.currentProduct.description) {
      this.error = 'Please fill in all required fields';
      this.loading = false;
      return;
    }
    
    // Ensure unit_of_measure is included and has a valid value
    if (!this.currentProduct.unit_of_measure) {
      this.currentProduct.unit_of_measure = 'piece';
    }
    
    // Create a clean update object with only changed properties
    const updateData = this.getChangedProperties();
    
    console.log('Sending update with data:', updateData);
    
    this.productService.update(this.currentProduct.id, updateData)
      .subscribe({
        next: (response) => {
          this.success = 'Product was updated successfully!';
          this.isEditing = false;
          this.loading = false;
          
          // Update the original product with the new values
          this.originalProduct = { ...this.currentProduct };
          console.log('Update successful:', response);
        },
        error: (e: any) => {
          console.error('Update failed:', e);
          this.error = 'Failed to update product: ' + (e.message || 'Unknown error');
          this.loading = false;
        }
      });
  }
  
  // Helper to get only the properties that have changed
  getChangedProperties(): any {
    const changedProps: any = {};
    
    // Only include properties that exist in the DTO
    const keys = [
      'product_name', 'description', 'sku', 
      'unit_of_measure', 'is_active'
    ] as const;
    
    keys.forEach(key => {
      // Include the property if it has changed or is required
      if (
        this.currentProduct[key] !== this.originalProduct[key] ||
        key === 'product_name' || 
        key === 'description' || 
        key === 'sku' ||
        key === 'unit_of_measure'
      ) {
        changedProps[key] = this.currentProduct[key];
      }
    });
    
    return changedProps;
  }

  deleteProduct(): void {
    if (this.currentProduct.id === undefined) {
      this.error = 'Cannot delete product: ID is missing';
      return;
    }
    
    if (confirm('Are you sure you want to delete this product?')) {
      this.loading = true;
      this.error = '';
      
      console.log(`Attempting to delete product with ID: ${this.currentProduct.id}`);
      
      this.productService.delete(this.currentProduct.id)
        .subscribe({
          next: (response) => {
            console.log('Product deleted successfully:', response);
            this.success = 'Product deleted successfully';
            
            // Navigate after a short delay to show the success message
            setTimeout(() => {
              this.router.navigate(['/products']);
            }, 1000);
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
              // Navigate after a short delay
              setTimeout(() => {
                this.router.navigate(['/products']);
              }, 3000);
            } else {
              this.error = 'Failed to delete product: ' + (e.message || 'Unknown error');
            }
            
            this.loading = false;
          }
        });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset to original values if canceling edit
      this.currentProduct = { ...this.originalProduct };
    }
    // Clear messages when toggling edit mode
    this.error = '';
    this.success = '';
  }
} 