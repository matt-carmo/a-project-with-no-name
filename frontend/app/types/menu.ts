type Category = {
  id: string;
  name: string;
  products: Product[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  photoUrl: string | null;
  isAvailable: boolean;
  productComplementGroups: any[];
};

export type MenuProps = Category[];
