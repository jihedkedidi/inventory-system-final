import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Variant } from '../../models/variant.model';
import { Product } from '../../models/product.model';
import { VariantService } from '../../services/variant.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-variant',
  templateUrl: './add-variant.component.html',
  styleUrls: ['./add-variant.component.css']
})
export class AddVariantComponent implements OnInit {
  variant: Variant = {
    variant_name: '',
    variant_value: '',
    sku: '',
    price: 0,
    cost_price: 0,
    barcode: '',
    is_active: true
  };
  
  product: Product | null = null;
  productId: number | null = null;
  products: Product[] = [];
  submitted = false;
  loading = false;
  error = '';
  success = '';

  constructor(
    private variantService: VariantService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check if we're coming from a specific product page
    const productIdParam = this.route.snapshot.paramMap.get('productId');
    if (productIdParam) {
      this.productId = +productIdParam;
      this.variant.product_id = this.productId;
      this.loadProduct(this.productId);
    } else {
      // Load all products for the dropdown
      this.loadProducts();
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.get(id)
      .subscribe({
        next: (data: Product) => {
          this.product = data;
          this.loading = false;
          // Auto-generate SKU prefix from product SKU
          if (data.sku) {
            this.variant.sku = data.sku + '-';
          }
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Failed to load product details.';
          this.loading = false;
        }
      });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll()
      .subscribe({
        next: (data: Product[]) => {
          this.products = data;
          this.loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Failed to load products.';
          this.loading = false;
        }
      });
  }

  onProductChange(productId: number): void {
    this.productId = productId;
    this.variant.product_id = productId;
    this.loadProduct(productId);
  }

  saveVariant(): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.variantService.create(this.variant)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.submitted = true;
          this.success = 'Variant was created successfully!';
          this.loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Failed to create variant. Please try again.';
          this.loading = false;
        }
      });
  }

  newVariant(): void {
    this.submitted = false;
    this.error = '';
    this.success = '';
    this.variant = {
      variant_name: '',
      variant_value: '',
      sku: '',
      price: 0,
      cost_price: 0,
      barcode: '',
      is_active: true,
      product_id: this.productId || undefined
    };
    
    // If we have a product, pre-fill the SKU prefix
    if (this.product && this.product.sku) {
      this.variant.sku = this.product.sku + '-';
    }
  }
}
