import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

const commonQuestions = {
  finish: {
    text: 'What level of finish would you like?',
    options: ['matte', 'natural', 'radiant'],
  },
};

const faceQuestions = [
  { text: 'What level of coverage would you like?', options: ['Light', 'Medium', 'Full'] },
  commonQuestions.finish,
];

const cheeksQuestions = [
  { text: 'What formula do you want to use?', options: ['Powder', 'cream', 'liquid'] },
  { text: 'What color family do you want?', options: ['Pink', 'Brown', 'Coral', 'Red'] },
  commonQuestions.finish,
];

const productQuestionsMap: Record<string, { text: string; options?: string[] }[]> = {
  foundation: faceQuestions,
  concealer: faceQuestions,
  powder: faceQuestions,
  bronzer: cheeksQuestions,
  blush: cheeksQuestions,
};

@Component({
  selector: 'app-product-questions',
  templateUrl: './product-questions.component.html',
  styleUrls: ['./product-questions.component.css'],
})
export class ProductQuestionsComponent implements OnInit {
  selectedProduct: string = '';
  questions: { text: string; options?: string[] }[] = [];
  answers: string[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.selectedProduct = this.productService.getSelectedProduct();
    if (!this.selectedProduct) {
      alert('No product selected! Please go back and choose a product.');
    } else {
      this.loadQuestions(this.selectedProduct);
    }
  }

  loadQuestions(product: string): void {
    const questions = productQuestionsMap[product.toLowerCase()];
    if (!questions) {
      alert('No questions available for this product.');
      this.questions = [];
      return;
    }
    this.questions = questions;
    this.answers = Array(this.questions.length).fill('');
  }

  submitAnswers(): void {
    if (this.answers.some((a) => !a)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    // בונים את אובייקט הבחירות
    const userChoices = {
      productType: this.selectedProduct,
      skinType: '', // כאן אפשר להביא מהפרופיל של המשתמש אם יש
      skinTone: '',
      eyeColor: '',
      hairColor: '',
      productQuestions: this.answers,
    };

    // שולחים לשרת
    this.productService.getProducts(userChoices).subscribe({
      next: (products: any[]) => {
        if (!products || products.length === 0) {
          alert('No products found for your choices.');
          return;
        }
        this.router.navigate(['/results'], { state: { products } });
      },
      error: (err) => {
        console.error('Failed to get products:', err);
        alert('Failed to load products');
      },
    });
  }
}
