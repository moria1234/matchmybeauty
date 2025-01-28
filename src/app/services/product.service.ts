import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor() { }
  getSelectedProduct() {
    return ("Eyeliner");
  }
}
