export interface Product {
  id?: number;
  product_name: string;
  description: string;
  sku: string;
  category_id?: number;
  brand_id?: number;
  unit_of_measure: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id?: number;
  product_id: number;
  variant_name: string;
  sku: string;
  price?: number;
  created_at?: Date;
  updated_at?: Date;
}
