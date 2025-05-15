import { Component, OnInit } from '@angular/core';
import { Catalog } from '../../models/catalog.model';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-catalogs-list',
  templateUrl: './catalogs-list.component.html',
  styleUrls: ['./catalogs-list.component.css']
})
export class CatalogsListComponent implements OnInit {
  catalogs: Catalog[] = [];
  currentCatalog: Catalog = {
    catalog_name: '',
    description: '',
    is_active: true
  };
  currentIndex = -1;
  searchTerm = '';
  loading = false;
  error = '';

  constructor(private catalogService: CatalogService) { }

  ngOnInit(): void {
    this.retrieveCatalogs();
  }

  retrieveCatalogs(): void {
    this.loading = true;
    this.catalogService.getAll()
      .subscribe({
        next: (data: Catalog[]) => {
          this.catalogs = data;
          this.loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Failed to load catalogs. Please try again later.';
          this.loading = false;
        }
      });
  }

  refreshList(): void {
    this.retrieveCatalogs();
    this.currentCatalog = {
      catalog_name: '',
      description: '',
      is_active: true
    };
    this.currentIndex = -1;
  }

  setActiveCatalog(catalog: Catalog, index: number): void {
    this.currentCatalog = catalog;
    this.currentIndex = index;
  }

  searchCatalogs(): void {
    // Reset the current catalog selection
    this.currentCatalog = {
      catalog_name: '',
      description: '',
      is_active: true
    };
    this.currentIndex = -1;

    // If search term is empty, get all catalogs
    if (!this.searchTerm.trim()) {
      this.retrieveCatalogs();
      return;
    }

    // Filter catalogs on the client side as backend doesn't have specific search endpoint
    this.loading = true;
    this.catalogService.getAll()
      .subscribe({
        next: (data: Catalog[]) => {
          this.catalogs = data.filter(catalog => 
            catalog.catalog_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            catalog.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          this.loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error = 'Error searching catalogs.';
          this.loading = false;
        }
      });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.retrieveCatalogs();
  }

  removeCatalog(id: number | undefined): void {
    if (id === undefined) return;
    
    if (confirm('Are you sure you want to delete this catalog?')) {
      this.catalogService.delete(id)
        .subscribe({
          next: () => {
            this.refreshList();
          },
          error: (e: any) => {
            console.error(e);
            this.error = 'Failed to delete catalog.';
          }
        });
    }
  }
}
