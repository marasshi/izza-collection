import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  selectedSize: string = '';
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.productService.getProductById(productId).subscribe(product => {
        this.product = product;
        if (product && product.sizes.length > 0) {
          this.selectedSize = product.sizes[0];
        }
      });
    });
  }

  addToOrder(): void {
    if (!this.product) return;
    if (!this.selectedSize) {
      alert('Please select a size.');
      return;
    }

    const productToAdd = {
      productId: this.product.id,
      quantity: this.quantity,
      size: this.selectedSize
    };

    this.router.navigate(['/order'], { state: { product: productToAdd } });
  }
}
