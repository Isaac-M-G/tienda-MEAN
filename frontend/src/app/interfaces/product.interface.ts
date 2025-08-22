export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: 'audifonos' | 'monitores' | 'teclados' | 'cables' | null;
}
