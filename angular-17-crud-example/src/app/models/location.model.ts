export interface Location {
  location_id?: number;
  location_name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
