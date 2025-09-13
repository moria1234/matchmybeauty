import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ProductService } from '../services/product.service';

const commonQuestions = {
  finish: {
    text: 'What level of finish would you like?',
    options: ['Matte', 'Natural', 'Radiant'],
  },
};

const faceQuestions = [
  { text: 'What level of coverage would you like?', options: ['Light', 'Medium', 'Full'] },
  commonQuestions.finish,
];

const cheeksQuestions = [
  { text: 'What formula do you want to use?', options: ['Powder', 'Cream', 'Liquid'] },
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
  loading: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

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

  onGetRecommendations(): void {
    if (this.answers.some((a) => !a)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    const payload = {
      productType: this.selectedProduct,
      answers: this.answers,
    };

    this.loading = true;

    this.productService
      .getMlProducts(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (products: any[]) => {
          if (!products || products.length === 0) {
            alert('No products found for your choices.');
            return;
          }
          this.productService.setProducts(products); // נשמר ל־ResultsComponent
          this.router.navigate(['/results']);
        },
        error: (err: unknown) => {
          console.error('Failed to get products:', err);
          const msg =
            (err as any)?.error?.error ||
            (err as any)?.error?.message ||
            (err as any)?.message ||
            'Failed to load products';
          alert(msg);
        },
      });
  }
}
