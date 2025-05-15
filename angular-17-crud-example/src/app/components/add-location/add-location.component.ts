import { Component } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { Location } from '../../models/location.model';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css']
})
export class AddLocationComponent {
  location: Location = {
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
  submitted = false;
  message = '';
  error = '';

  constructor(private locationService: LocationService) { }

  saveLocation(): void {
    if (!this.validateForm()) {
      return;
    }

    const data = {
      location_name: this.location.location_name,
      address: this.location.address,
      city: this.location.city,
      state: this.location.state,
      country: this.location.country,
      postal_code: this.location.postal_code,
      contact_person: this.location.contact_person,
      contact_phone: this.location.contact_phone,
      contact_email: this.location.contact_email,
      is_active: this.location.is_active
    };

    this.locationService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
          this.message = 'Location was created successfully!';
          this.error = '';
        },
        error: (e) => {
          console.error(e);
          this.error = e.message || 'An error occurred while creating the location.';
          this.message = '';
        }
      });
  }

  validateForm(): boolean {
    if (!this.location.location_name) {
      this.error = 'Location name is required.';
      return false;
    }
    return true;
  }

  newLocation(): void {
    this.submitted = false;
    this.message = '';
    this.error = '';
    this.location = {
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
  }
} 