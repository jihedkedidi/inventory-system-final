import { Component, OnInit } from '@angular/core';
import { Catalog } from '../../models/catalog.model';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-add-catalog',
  templateUrl: './add-catalog.component.html',
  styleUrls: ['./add-catalog.component.css']
})
export class AddCatalogComponent implements OnInit {
  catalog: Catalog = {
    catalog_name: '',
    description: '',
    is_active: true
  };
  
  submitted = false;
  loading = false;
  error = '';
  success = '';

  constructor(private catalogService: CatalogService) { }

  ngOnInit(): void {
  }

  saveCatalog(): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    const data = {
      name: this.catalog.catalog_name,
      description: this.catalog.description,
      is_active: this.catalog.is_active
    };

    this.catalogService.create(data)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.submitted = true;
          this.success = 'Catalog was created successfully!';
          this.loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Failed to create catalog. Please try again.';
          this.loading = false;
        }
      });
  }

  newCatalog(): void {
    this.submitted = false;
    this.error = '';
    this.success = '';
    this.catalog = {
      catalog_name: '',
      description: '',
      is_active: true
    };
  }
}
