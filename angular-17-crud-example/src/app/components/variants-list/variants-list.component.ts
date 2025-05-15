import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Variant } from '../../models/variant.model';
import { VariantService } from '../../services/variant.service';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-variants-list',
  templateUrl: './variants-list.component.html',
  styleUrls: ['./variants-list.component.css']
})
export class VariantsListComponent implements OnInit {
  variants: Variant[] = [];
  currentVariant: Variant = {
    variant_name: '',
    variant_value: '',
    sku: '',
    price: 0,
    cost_price: 0,
    barcode: '',
    is_active: true
  };
  currentIndex = -1;
  searchSku = '';
  loading = false;
  error = '';
  productId?: number;
  product?: Product;

  constructor(
    private variantService: VariantService,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['productId'];
    this.retrieveVariants();
    
    if (this.productId) {
      this.retrieveProduct(this.productId);
    }
  }

  retrieveProduct(id: number): void {
    this.loading = true;
    
    this.productService.get(id)
      .subscribe({
        next: (data: Product) => {
          this.product = data;
          this.loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Error retrieving product';
          this.loading = false;
        }
      });
  }

  retrieveVariants(): void {
    this.loading = true;
    
    const getVariants = this.productId 
      ? this.variantService.getByProduct(this.productId)
      : this.variantService.getAll();

    getVariants.subscribe({
      next: (data: Variant[]) => {
        this.variants = data;
        this.loading = false;
      },
      error: (e: any) => {
        console.error(e);
        this.error = 'Error retrieving variants';
        this.loading = false;
      }
    });
  }

  refreshList(): void {
    this.retrieveVariants();
    this.currentVariant = {
      variant_name: '',
      variant_value: '',
      sku: '',
      price: 0,
      cost_price: 0,
      barcode: '',
      is_active: true
    };
    this.currentIndex = -1;
  }

  setActiveVariant(variant: Variant, index: number): void {
    this.currentVariant = variant;
    this.currentIndex = index;
  }

  searchBySku(): void {
    this.currentVariant = {
      variant_name: '',
      variant_value: '',
      sku: '',
      price: 0,
      cost_price: 0,
      barcode: '',
      is_active: true
    };
    this.currentIndex = -1;
    
    if (!this.searchSku.trim()) {
      this.refreshList();
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    this.variantService.findBySku(this.searchSku)
      .subscribe({
        next: (data: Variant[]) => {
          this.variants = data;
          this.loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Error searching variants.';
          this.loading = false;
        }
      });
  }

  clearSearch(): void {
    this.searchSku = '';
    this.refreshList();
  }

  deleteVariant(id: number | undefined): void {
    if (id === undefined) return;
    
    if (confirm('Are you sure you want to delete this variant?')) {
      this.variantService.delete(id)
        .subscribe({
          next: () => {
            this.refreshList();
          },
          error: (e: any) => {
            console.error(e);
            if (e.status === 404) {
              this.error = 'Variant not found. It may have been already deleted.';
            } else {
              this.error = 'Failed to delete variant.';
            }
          }
        });
    }
  }

  getProfit(variant: Variant): number {
    if (!variant.price || !variant.cost_price) {
      return 0;
    }
    return variant.price - variant.cost_price;
  }

  getProfitMargin(variant: Variant): number {
    if (!variant.price || !variant.cost_price || variant.cost_price === 0 || variant.price === 0) {
      return 0;
    }
    return ((variant.price - variant.cost_price) / variant.price) * 100;
  }
}
