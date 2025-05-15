export class Catalog {
  catalog_id?: number;
  catalog_name: string = '';
  description: string = '';
  is_active: boolean = true;
  created_at?: Date;
  updated_at?: Date;
  products?: any[];
} 