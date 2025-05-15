import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { Location } from '../../models/location.model';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {
  currentLocation: Location = {
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
  message = '';
  error = '';

  constructor(
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.message = '';
    this.error = '';
    this.getLocation(this.route.snapshot.params['id']);
  }

  getLocation(id: string): void {
    this.locationService.get(id)
      .subscribe({
        next: (data) => {
          this.currentLocation = data;
          console.log(data);
        },
        error: (e) => {
          console.error(e);
          this.error = e.message || 'An error occurred while retrieving the location.';
        }
      });
  }

  updateLocation(): void {
    if (!this.validateForm()) {
      return;
    }

    this.message = '';
    this.error = '';

    this.locationService.update(this.currentLocation.location_id, this.currentLocation)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = 'Location was updated successfully!';
        },
        error: (e) => {
          console.error(e);
          this.error = e.message || 'An error occurred while updating the location.';
        }
      });
  }

  deleteLocation(): void {
    if (!confirm('Are you sure you want to delete this location?')) {
      return;
    }

    this.locationService.delete(this.currentLocation.location_id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/locations']);
        },
        error: (e) => {
          console.error(e);
          this.error = e.message || 'An error occurred while deleting the location.';
        }
      });
  }

  validateForm(): boolean {
    if (!this.currentLocation.location_name) {
      this.error = 'Location name is required.';
      return false;
    }
    return true;
  }
} 