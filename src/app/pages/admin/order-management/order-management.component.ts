import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Order } from '../../../models/order';
import { Product } from '../../../models/product';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class OrderManagementComponent implements OnInit {
  orders$!: Observable<Order[]>;
  private products: Product[] = [];

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(prods => {
      this.products = prods;
    });
    this.orders$ = this.orderService.getOrders().pipe(
      tap(orders => console.log('Fetched orders:', orders)),
      map(orders => orders.sort((a, b) => {
        const getTime = (d: any) =>
          d instanceof Date ? d.getTime() :
          (typeof d.toDate === 'function' ? d.toDate().getTime() : 0);
        return getTime(b.createdAt) - getTime(a.createdAt);
      }))
    );
  }

  getProductById(productId: string): Product | undefined {
    return this.products.find(p => p.id === productId);
  }

  viewOrder(orderId: string): void {
    this.router.navigate(['/admin/orders', orderId]);
  }
}
