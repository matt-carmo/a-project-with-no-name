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
  productComplementGroups: {
    group: {
      id: string;
      name: string;
      minSelected: number;
      maxSelected: number;
      complements: {
        id: string;
        name: string;
        price: number;
      }[];
    };
  }[];
};

export type ComplementSelection = {
  [groupId: string]: {
    [complementId: string]: number;
  };
};

export type MenuProps = Category[];
