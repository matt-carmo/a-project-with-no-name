export interface Category {
    id: string;
    storeId: string;
    name: string;
    createdAt: Date;
    deletedAt?: Date | null;
    products: Product[];
}

export interface Product {
    id: string;
    storeId: string;
    categoryId: string;
    photoUrl: string | null;
    name: string;
    description: string;
    price: number;
    image: string | null;
    isAvailable: boolean;
    stock: number;
    createdAt: Date;
    deletedAt?: Date | null;
    productComplementGroups: ProductComplementGroup[];

}

export interface ProductComplementGroup {
    id: string;
    productId: string;
    groupId: string;
    // complements: Complement[];
    group: ComplementGroup;

}

export interface ComplementGroup {
    id?: string;

    name: string;
    description: string;
    //   photoUrl: string | null;
    isAvailable: boolean;
    minSelected: number;
    maxSelected: number;
    complements: Complement[];
    products: {
        product: {
            name: string;
        };
    }[];
}


export interface Complement {
    id?: string;
    groupId?: string;
    name: string;
    photoUrl?: string;
    imagePreview?: string;
    image: {
        url: string;
        id: string;
    } | null;
    description?: string;
    price: number;
    isActive?: boolean;
    stock?: number | null;
}

export interface ComplementGroupWithComplements {
    complements: Complement[];

}