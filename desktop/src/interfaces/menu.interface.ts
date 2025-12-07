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
    isRequired: boolean;
    minSelected: number;
    maxSelected: number;
    complements: Complement[];
}


export interface Complement {
    id?: string;
    groupId?: string;
    name: string;
    photoUrl?: string;
    imagePreview?: string;
    image: undefined;
    description?: string;
    price: number;
    isActive?: boolean;
    stock?: number | null;
}

export interface ComplementGroupWithComplements {
    complements: Complement[];

}