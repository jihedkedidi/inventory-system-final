import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent implements OnInit {
  supplier: Supplier = {
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
  
  submitted = false;
  loading = false;
  error = '';
  success = '';

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
  }

  saveSupplier(): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    const data = {
      supplier_name: this.supplier.supplier_name,
      contact_person: this.supplier.contact_person,
      contact_phone: this.supplier.contact_phone,
      contact_email: this.supplier.contact_email,
      address: this.supplier.address,
      city: this.supplier.city,
      state: this.supplier.state,
      country: this.supplier.country,
      postal_code: this.supplier.postal_code,
      is_active: this.supplier.is_active
    };

    this.supplierService.create(data)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.submitted = true;
          this.success = 'Supplier was created successfully!';
          this.loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Failed to create supplier. Please try again.';
          this.loading = false;
        }
      });
  }

  newSupplier(): void {
    this.submitted = false;
    this.error = '';
    this.success = '';
    this.supplier = {
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
  }
}
