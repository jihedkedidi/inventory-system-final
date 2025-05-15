import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '../../models/location.model';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.css']
})
export class LocationsListComponent implements OnInit {
  locations: Location[] = [];
  currentLocation: Location = {
    location_id: undefined,
    location_name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    is_active: true
  };
  currentIndex = -1;
  locationName = '';
  message = '';

  constructor(
    private locationService: LocationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.retrieveLocations();
  }

  retrieveLocations(): void {
    this.locationService.getAll()
      .subscribe({
        next: (data: Location[]) => {
          this.locations = data;
        },
        error: (e) => {
          console.error(e);
          this.message = 'Error retrieving locations: ' + e.message;
        }
      });
  }

  refreshList(): void {
    this.retrieveLocations();
    this.currentLocation = {
      location_id: undefined,
      location_name: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      contact_person: '',
      contact_phone: '',
      contact_email: '',
      is_active: true
    };
    this.currentIndex = -1;
  }

  setActiveLocation(location: Location, index: number): void {
    this.currentLocation = location;
    this.currentIndex = index;
  }

  addNewLocation(): void {
    this.router.navigate(['/add-location']);
  }

  searchByName(): void {
    this.currentLocation = {
      location_id: undefined,
      location_name: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      contact_person: '',
      contact_phone: '',
      contact_email: '',
      is_active: true
    };
    this.currentIndex = -1;

    // Filter locations by name if search term is provided
    if (this.locationName) {
      this.retrieveLocations();
      setTimeout(() => {
        this.locations = this.locations.filter(loc => 
          loc.location_name?.toLowerCase().includes(this.locationName.toLowerCase())
        );
      }, 100);
    } else {
      this.retrieveLocations();
    }
  }
} 