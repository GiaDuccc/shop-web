export interface Product {
  adImage: string;
  brand: string;
  colors: ProductColor[];
  desc: string;
  highLight?: string;
  name: string;
  navbarImage: string;
  price: number;
  slug: string;
  stock: number;
  type: string;
  _id: string;
  quantitySold: number;
  importAt: Date;
  updateAt: Date;
}

export interface ProductColor {
  color: string;
  colorHex?: string;
  imageDetail: string[];
  sizes: {
    size: string;
    quantity: number;
  }[];
}
