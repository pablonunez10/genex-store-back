import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'ADMIN' | 'VENDEDOR';
    name: string;
  };
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateProductDTO {
  name: string;
  sku: string;
  description?: string;
  salePrice: number;
  categoryId: string;
}

export interface CreatePurchaseDTO {
  productId: string;
  quantity: number;
  costPrice: number;
  salePrice: number;
  supplier?: string;
  invoiceNumber?: string;
  purchaseDate: string;
}

export interface CreateSaleDTO {
  items: SaleItemDTO[];
}

export interface SaleItemDTO {
  productId: string;
  quantity: number;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
}
