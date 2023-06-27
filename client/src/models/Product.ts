export interface Product extends NewProduct {
  id: string;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
}

export interface NewProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}
