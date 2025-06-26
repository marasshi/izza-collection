import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Product } from '../../models/product';
import { Order, OrderProduct } from '../../models/order';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  imports: [FormsModule, CommonModule, DecimalPipe],
  standalone: true
})
export class OrderFormComponent implements OnInit {
  products: Product[] = [];
  selectedProducts: OrderProduct[] = [];
  customerInfo = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };
  orderSubmitted = false;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    const productToAdd = navigation?.extras?.state?.['product'];
    if (productToAdd) {
      // Ensure this runs after products are loaded
      this.selectedProducts.push(productToAdd);
    }
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      
      // If a product was passed through state but already exists in the list by ID, update its details
      // This handles the case where a user navigates back and forth
      const productFromState = this.selectedProducts[0];
      if (productFromState) {
        const existingProductIndex = this.selectedProducts.findIndex(p => p.productId === productFromState.productId);
        if (existingProductIndex > -1) {
          // You might want to update quantity or size here if needed
        } else if (!this.products.find(p => p.id === productFromState.productId)) {
           // If the product isn't in the main list for some reason, remove it
           this.selectedProducts = [];
        }
      }
    });
  }

  removeProductFromOrder(productId: string): void {
    this.selectedProducts = this.selectedProducts.filter(p => p.productId !== productId);
  }

  updateProductQuantity(productId: string, quantity: number): void {
    const product = this.selectedProducts.find(p => p.productId === productId);
    if (product) {
      if (quantity <= 0) {
        this.removeProductFromOrder(productId);
      } else {
        product.quantity = quantity;
      }
    }
  }

  updateProductSize(productId: string, size: string): void {
    const product = this.selectedProducts.find(p => p.productId === productId);
    if (product) {
      product.size = size;
    }
  }

  onSizeChange(productId: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.updateProductSize(productId, target.value);
  }

  onQuantityChange(productId: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.updateProductQuantity(productId, +target.value);
  }

  getProductById(productId: string): Product | undefined {
    return this.products.find(p => p.id === productId);
  }

  calculateTotal(): number {
    return this.selectedProducts.reduce((total, item) => {
      const product = this.getProductById(item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  submitOrder(): void {
    if (this.selectedProducts.length === 0) {
      alert('Please add products to your order.');
      return;
    }

    if (!this.customerInfo.name || !this.customerInfo.email || !this.customerInfo.phone) {
      alert('Please fill in all customer information.');
      return;
    }

    const order: Order = {
      id: '',
      customerName: this.customerInfo.name,
      customerEmail: this.customerInfo.email,
      customerPhone: this.customerInfo.phone,
      address: this.customerInfo.address,
      products: this.selectedProducts,
      total: this.calculateTotal(),
      status: 'pending',
      createdAt: new Date()
    };

    this.orderService.addOrder(order).then(() => {
      this.orderSubmitted = true;
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }).catch(error => {
      console.error("Error submitting order: ", error);
      alert("There was an issue submitting your order. Please try again.");
    });
  }
}
