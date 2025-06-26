import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { StorageService } from '../../../services/storage.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
  @ViewChild('form') productForm!: NgForm;
  
  products: Product[] = [];
  isEditing = false;
  selectedFile: File | null = null;
  selectedFilePreview: string | null = null;
  
  formData: any = {
    id: null,
    name: '',
    description: '',
    price: 0,
    category: '',
    sizes: '',
    inStock: true,
    imageUrl: ''
  };

  constructor(
    private productService: ProductService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFilePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.selectedFilePreview = null;
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.productForm.valid) return;

    const productData = {
      ...this.formData,
      sizes: this.formData.sizes.split(',').map((s: string) => s.trim())
    };
    
    if (this.isEditing) {
      await this.updateProduct(productData);
    } else {
      await this.addProduct(productData);
    }
  }

  async addProduct(productData: Product): Promise<void> {
    if (!this.selectedFile) {
      alert('Please select a product image.');
      return;
    }
    try {
      const filePath = `products/${new Date().getTime()}_${this.selectedFile.name}`;
      productData.imageUrl = await this.storageService.uploadImage(this.selectedFile, filePath);
      await this.productService.addProduct(productData);
      this.resetForm();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  }

  async updateProduct(productData: Product): Promise<void> {
    try {
      if (this.selectedFile) {
        const filePath = `products/${new Date().getTime()}_${this.selectedFile.name}`;
        productData.imageUrl = await this.storageService.uploadImage(this.selectedFile, filePath);
      }
      await this.productService.updateProduct(productData.id, productData);
      this.resetForm();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.selectedFile = null;
    this.selectedFilePreview = null;
    this.formData = {
      ...product,
      sizes: product.sizes.join(',')
    };
  }

  async deleteProduct(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this product?')) {
      await this.productService.deleteProduct(id);
    }
  }

  resetForm(): void {
    this.productForm.resetForm();
    this.isEditing = false;
    this.selectedFile = null;
    this.selectedFilePreview = null;
    this.formData = {
      id: null,
      name: '',
      description: '',
      price: 0,
      category: '',
      sizes: '',
      inStock: true,
      imageUrl: ''
    };
  }
}
