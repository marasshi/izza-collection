import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersCollection;

  constructor(private firestore: Firestore) {
    this.ordersCollection = collection(this.firestore, 'orders');
  }

  getOrders(): Observable<Order[]> {
    return collectionData(this.ordersCollection, { idField: 'id' }) as Observable<Order[]>;
  }

  addOrder(order: Order) {
    return addDoc(this.ordersCollection, order);
  }

  updateOrderStatus(orderId: string, status: 'pending' | 'processed' | 'completed') {
    const orderDoc = doc(this.firestore, `orders/${orderId}`);
    return updateDoc(orderDoc, { status });
  }

  deleteOrder(orderId: string) {
    const orderDoc = doc(this.firestore, `orders/${orderId}`);
    return deleteDoc(orderDoc);
  }
}
