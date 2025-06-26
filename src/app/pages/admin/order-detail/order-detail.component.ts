import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../../models/order';
import { Product } from '../../../models/product';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { EmailService } from '../../../services/email.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: Order | undefined;
  products: Product[] = [];
  accepted = false;
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
    this.orderService.getOrders().subscribe(orders => {
      this.order = orders.find(o => o.id === orderId);
    });
  }

  getProductById(productId: string): Product | undefined {
    return this.products.find(p => p.id === productId);
  }

  goBack(): void {
    this.router.navigate(['/admin/orders']);
  }

  async acceptOrder() {
    if (!this.order) return;
    try {
      await this.orderService.updateOrderStatus(this.order.id, 'processed');
      this.order.status = 'processed';
      this.accepted = true;
      this.successMessage = 'Order accepted!';
      setTimeout(() => this.successMessage = '', 2500);
    } catch (error) {
      alert('Failed to accept order.');
    }
  }

  async deleteOrder() {
    if (!this.order) return;
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await this.orderService.deleteOrder(this.order.id);
      alert('Order deleted.');
      this.goBack();
    } catch (error) {
      alert('Failed to delete order.');
    }
  }
}
