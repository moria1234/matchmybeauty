import { Component } from '@angular/core';
import { ProductService } from '../services/product.service'; // Import ProductService

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
  productType: string = '';
  productOptions: string[] = [
    'foundation', 'concealer', 'powder', 'bronzer', 'blush'
  ];

  eyeColor: string = '';
  eyeColors: string[] = ['Brown', 'Green', 'Blue', 'Gray', 'Black'];

  skinTone: string = '';
  skinTones: string[] = ['Light', 'Medium', 'Dark'];

  skinType: string = '';
  skinTypes: string[] = ['Dry', 'Oily', 'Normal', 'Combination'];

  hairColor: string = '';
  hairColors: string[] = ['Brown', 'Black', 'Blonde', 'Red'];

  // Inject ProductService
  constructor(private productService: ProductService) {}

  // Method to handle product type change
  onProductTypeChange(): void {
    console.log('Selected Product Type:', this.productType);
    this.productService.setSelectedProduct(this.productType); // Save selected product to the service
  }
}
