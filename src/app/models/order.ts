export interface OrderProduct {
  productId: string;
  quantity: number;
  size: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  products: OrderProduct[];
  total: number;
  status: 'pending' | 'processed' | 'completed';
  createdAt: Date;
}
