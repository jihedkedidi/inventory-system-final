export class Supplier {
  supplier_id?: number;
  supplier_name: string = '';
  contact_person: string = '';
  contact_phone: string = '';
  contact_email: string = '';
  address: string = '';
  city: string = '';
  state: string = '';
  country: string = '';
  postal_code: string = '';
  is_active: boolean = true;
  created_at?: Date;
  updated_at?: Date;
} 