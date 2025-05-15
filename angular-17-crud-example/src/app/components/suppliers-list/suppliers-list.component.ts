import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.css']
})
export class SuppliersListComponent implements OnInit {
  suppliers: Supplier[] = [];
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
  currentIndex = -1;
  searchTerm = '';
  loading = false;
  error = '';

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.retrieveSuppliers();
  }

  retrieveSuppliers(): void {
    this.loading = true;
    this.supplierService.getAll()
      .subscribe({
        next: (data: Supplier[]) => {
          this.suppliers = data;
          this.loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Failed to load suppliers. Please try again later.';
          this.loading = false;
        }
      });
  }

  refreshList(): void {
    this.retrieveSuppliers();
    this.currentSupplier = {
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
    this.currentIndex = -1;
  }

  setActiveSupplier(supplier: Supplier, index: number): void {
    this.currentSupplier = supplier;
    this.currentIndex = index;
  }

  searchSuppliers(): void {
    this.loading = true;
    this.currentSupplier = {
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
    this.currentIndex = -1;

    if (!this.searchTerm.trim()) {
      this.retrieveSuppliers();
      return;
    }

    this.supplierService.findByName(this.searchTerm)
      .subscribe({
        next: (data: Supplier[]) => {
          this.suppliers = data;
          this.loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Error searching suppliers.';
          this.loading = false;
        }
      });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.retrieveSuppliers();
  }

  removeSupplier(id: number | undefined): void {
    if (id === undefined) return;
    
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.delete(id)
        .subscribe({
          next: () => {
            this.refreshList();
          },
          error: (e: any) => {
            console.error(e);
            this.error = 'Failed to delete supplier.';
          }
        });
    }
  }
}
