import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private selectedProduct: string = localStorage.getItem('selectedProduct') || '';
  private lastAnswers: any | null = ProductService.safeParse(localStorage.getItem('lastAnswers'));
  private lastProducts: any[] = ProductService.safeParse(localStorage.getItem('lastProducts')) || [];

  constructor(private http: HttpClient) {}

  setSelectedProduct(product: string): void {
    this.selectedProduct = product || '';
    localStorage.setItem('selectedProduct', this.selectedProduct);
  }

  getSelectedProduct(): string {
    if (!this.selectedProduct) {
      this.selectedProduct = localStorage.getItem('selectedProduct') || '';
    }
    return this.selectedProduct;
  }

  setAnswers(a: any): void {
    this.lastAnswers = a ?? null;
    if (this.lastAnswers !== null) {
      localStorage.setItem('lastAnswers', JSON.stringify(this.lastAnswers));
    } else {
      localStorage.removeItem('lastAnswers');
    }
  }

  getAnswers(): any | null {
    if (this.lastAnswers == null) {
      this.lastAnswers = ProductService.safeParse(localStorage.getItem('lastAnswers'));
    }
    return this.lastAnswers;
  }

  setProducts(list: any[] | null | undefined): void {
    this.lastProducts = Array.isArray(list) ? list : [];
    localStorage.setItem('lastProducts', JSON.stringify(this.lastProducts));
  }

  getProducts(): any[] {
    if (!this.lastProducts?.length) {
      this.lastProducts = ProductService.safeParse(localStorage.getItem('lastProducts')) || [];
    }
    return this.lastProducts;
  }
  getMlProducts(payload: any): Observable<any[]> {
    const url = `${environment.apiUrl}/ml-products`;
    return this.http.post<any[]>(url, payload).pipe(
      map((arr) => (Array.isArray(arr) ? arr : []))
    );
  }

  private static safeParse(raw: string | null): any | null {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}