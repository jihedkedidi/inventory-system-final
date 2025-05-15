import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  product: Product = {
    product_name: '',
    description: '',
    sku: '',
    unit_of_measure: 'piece',
    is_active: true
  };
  
  submitted = false;
  loading = false;
  error = '';
  success = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  saveProduct(): void {
    this.loading = true;
    this.error = '';
    this.success = '';
    
    // Ensure required fields are present
    if (!this.product.product_name || !this.product.description || !this.product.sku) {
      this.error = 'Please fill in all required fields';
      this.loading = false;
      return;
    }
    
    // Validate SKU format
    const skuPattern = /^[a-zA-Z0-9_-]+$/;
    if (!skuPattern.test(this.product.sku)) {
      this.error = 'SKU can only contain letters, numbers, hyphens and underscores';
      this.loading = false;
      return;
    }
    
    // Ensure unit_of_measure has a value
    if (!this.product.unit_of_measure) {
      this.product.unit_of_measure = 'piece';
    }
    
    // Create a new object to match the DTO structure
    const productData: any = {
      product_name: this.product.product_name,
      description: this.product.description,
      sku: this.product.sku,
      unit_of_measure: this.product.unit_of_measure,
      is_active: this.product.is_active
    };
    
    console.log('Creating product with data:', productData);
    
    this.productService.create(productData)
      .subscribe({
        next: (res: any) => {
          console.log('Product created successfully:', res);
          this.submitted = true;
          this.success = 'Product was created successfully!';
          this.loading = false;
        },
        error: (e: any) => {
          console.error('Product creation failed:', e);
          this.error = 'Failed to create product: ' + (e.message || 'Unknown error');
          
          // Check for specific error types
          if (e.status === 400) {
            if (e.error && e.error.message && e.error.message.includes('duplicate')) {
              this.error = 'A product with this SKU already exists';
            }
          }
          
          this.loading = false;
        }
      });
  }

  newProduct(): void {
    this.submitted = false;
    this.error = '';
    this.success = '';
    this.product = {
      product_name: '',
      description: '',
      sku: '',
      unit_of_measure: 'piece',
      is_active: true
    };
  }
} 