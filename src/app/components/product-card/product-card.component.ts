import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  imports: [CommonModule],
  standalone: true
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private router: Router) {}

  viewDetails(): void {
    this.router.navigate(['/products', this.product.id]);
  }
}
