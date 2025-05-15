import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Variant } from '../../models/variant.model';
import { Product } from '../../models/product.model';
import { VariantService } from '../../services/variant.service';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-variant-details',
  templateUrl: './variant-details.component.html',
  styleUrls: ['./variant-details.component.css']
})
export class VariantDetailsComponent implements OnInit {
  currentVariant: Variant = {
    variant_name: '',
    variant_value: '',
    sku: '',
    price: 0,
    cost_price: 0,
    barcode: '',
    is_active: true
  };
  
  product: Product | null = null;
  loading = false;
  error = '';
  success = '';
  isEditing = false;

  constructor(
    private variantService: VariantService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getVariant(this.route.snapshot.params['id']);
  }

  getVariant(id: string): void {
    this.loading = true;
    this.error = '';
    
    this.variantService.get(id)
      .subscribe({
        next: (data: Variant) => {
          this.currentVariant = data;
          this.loading = false;
          
          // If the variant has a product_id, load the product details
          if (data.product_id) {
            this.loadProduct(data.product_id);
          }
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Failed to load variant details.';
          this.loading = false;
        }
      });
  }

  loadProduct(id: number): void {
    this.productService.get(id)
      .subscribe({
        next: (data: Product) => {
          this.product = data;
        },
        error: (e: any) => {
          console.error(e);
          // Not showing error for product loading as it's secondary information
        }
      });
  }

  updateVariant(): void {
    this.loading = true;
    this.error = '';
    this.success = '';
    
    if (this.currentVariant.variant_id === undefined) {
      this.error = 'Cannot update variant: ID is missing';
      this.loading = false;
      return;
    }

    // Create a copy of the variant data to send
    const variantToUpdate = { ...this.currentVariant };
    
    // Ensure price and cost_price are numbers
    variantToUpdate.price = Number(variantToUpdate.price);
    if (variantToUpdate.cost_price !== undefined) {
      variantToUpdate.cost_price = Number(variantToUpdate.cost_price);
    }

    console.log('Updating variant with data:', variantToUpdate);
    
    this.variantService.update(this.currentVariant.variant_id, variantToUpdate)
      .subscribe({
        next: (response) => {
          console.log('Update response:', response);
          this.success = 'Variant was updated successfully!';
          this.isEditing = false;
          this.loading = false;
          // Refresh the data
          this.getVariant(String(this.currentVariant.variant_id));
        },
        error: (error: HttpErrorResponse) => {
          console.error('Update error:', error);
          
          // Try to extract a more detailed error message
          if (error.error && error.error.message) {
            this.error = `Failed to update variant: ${error.error.message}`;
          } else if (error.status === 400) {
            this.error = 'Invalid data provided. Please check your input values.';
          } else if (error.status === 404) {
            this.error = 'Variant not found. It may have been deleted.';
          } else if (error.status === 409) {
            this.error = 'Update failed: This SKU is already in use by another variant.';
          } else if (error.status === 0) {
            this.error = 'Cannot connect to the server. Please check your network connection.';
          } else {
            this.error = `Failed to update variant. Server returned: ${error.status} ${error.statusText}`;
          }
          
          this.loading = false;
        }
      });
  }

  deleteVariant(): void {
    if (this.currentVariant.variant_id === undefined) {
      this.error = 'Cannot delete variant: ID is missing';
      return;
    }
    
    if (confirm('Are you sure you want to delete this variant?')) {
      this.loading = true;
      this.variantService.delete(this.currentVariant.variant_id)
        .subscribe({
          next: () => {
            // Navigate back to variants list, or to the product's variants if we have a product_id
            if (this.currentVariant.product_id) {
              this.router.navigate(['/variants', 'product', this.currentVariant.product_id]);
            } else {
              this.router.navigate(['/variants']);
            }
          },
          error: (e: HttpErrorResponse) => {
            console.error(e);
            if (e.status === 404) {
              this.error = 'Variant not found. It may have been already deleted.';
            } else {
              this.error = 'Failed to delete variant.';
            }
            this.loading = false;
          }
        });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.currentVariant.variant_id) {
      // Reload original data if canceling edit
      this.getVariant(String(this.currentVariant.variant_id));
    }
  }

  getProfit(): number {
    if (!this.currentVariant.price || !this.currentVariant.cost_price) {
      return 0;
    }
    return this.currentVariant.price - this.currentVariant.cost_price;
  }

  getProfitMargin(): number {
    if (!this.currentVariant.price || !this.currentVariant.cost_price || this.currentVariant.cost_price === 0) {
      return 0;
    }
    return ((this.currentVariant.price - this.currentVariant.cost_price) / this.currentVariant.price) * 100;
  }
}
