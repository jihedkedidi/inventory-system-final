import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.css']
})
export class SupplierDetailsComponent implements OnInit {
  currentSupplier: Supplier = {
    supplier_name: '',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    is_active: true
  };
  
  message = '';
  loading = false;
  error = '';
  success = '';
  isEditing = false;

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getSupplier(this.route.snapshot.params['id']);
  }

  getSupplier(id: string): void {
    this.loading = true;
    this.error = '';
    
    this.supplierService.get(id)
      .subscribe({
        next: (data: Supplier) => {
          this.currentSupplier = data;
          this.loading = false;
          console.log(data);
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Failed to load supplier details.';
          this.loading = false;
        }
      });
  }

  updateSupplier(): void {
    this.loading = true;
    this.error = '';
    this.success = '';
    
    if (this.currentSupplier.supplier_id === undefined) {
      this.error = 'Cannot update supplier: ID is missing';
      this.loading = false;
      return;
    }
    
    this.supplierService.update(this.currentSupplier.supplier_id, this.currentSupplier)
      .subscribe({
        next: () => {
          this.success = 'Supplier was updated successfully!';
          this.isEditing = false;
          this.loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Failed to update supplier.';
          this.loading = false;
        }
      });
  }

  deleteSupplier(): void {
    if (this.currentSupplier.supplier_id === undefined) {
      this.error = 'Cannot delete supplier: ID is missing';
      return;
    }
    
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.loading = true;
      this.supplierService.delete(this.currentSupplier.supplier_id)
        .subscribe({
          next: () => {
            this.router.navigate(['/suppliers']);
          },
          error: (e: any) => {
            console.error(e);
            this.error = 'Failed to delete supplier.';
            this.loading = false;
          }
        });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.currentSupplier.supplier_id) {
      // Reload original data if canceling edit
      this.getSupplier(String(this.currentSupplier.supplier_id));
    }
  }
}
