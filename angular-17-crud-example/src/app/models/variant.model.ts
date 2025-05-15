export interface Variant {
  variant_id?: number;
  product_id?: number;
  product?: any;
  variant_name: string;
  variant_value?: string;
  sku: string;
  price: number;
  cost_price?: number;
  barcode?: string;
  color?: string;
  size?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
} 