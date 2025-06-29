import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private selectedProduct: string = '';

  constructor() {}

  setSelectedProduct(product: string): void {
    this.selectedProduct = product;
    console.log('Product saved in service:', this.selectedProduct);

  }

  getSelectedProduct(): string {
    return this.selectedProduct;
  }
}
