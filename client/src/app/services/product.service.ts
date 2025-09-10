import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private selectedProduct: string = '';

  constructor(private http: HttpClient) {}

  setSelectedProduct(product: string): void {
    this.selectedProduct = product;
    console.log('Product saved in service:', this.selectedProduct);
  }

  getSelectedProduct(): string {
    return this.selectedProduct;
  }

  // שולח את בחירות המשתמש לשרת ומקבל את רשימת המוצרים
  getProducts(userChoices: any) {
  return this.http.post<any[]>('http://localhost:5000/api/ml-products', userChoices);
}
}
