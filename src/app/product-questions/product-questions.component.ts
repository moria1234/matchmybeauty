import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router'; // Import Router

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

// Ensure all keys in the map are in English
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
    // Get the selected product from the service
    this.selectedProduct = this.productService.getSelectedProduct();

    // Ensure selectedProduct has a valid value
    if (!this.selectedProduct) {
      alert('No product selected! Please go back and choose a product.');
    } else {
      console.log('Selected Product:', this.selectedProduct);
      this.loadQuestions(this.selectedProduct);
    }
  }

  loadQuestions(product: string): void {
    // Fetch the questions from the map
    const questions = productQuestionsMap[product.toLowerCase()]; // Use lowercase for case-insensitive match
    if (!questions) {
      alert('No questions available for this product.');
      this.questions = [];
      return;
    }

    // Update questions and initialize answers
    this.questions = questions;
    this.answers = Array(this.questions.length).fill('');
  }

  submitAnswers(): void {
    // Ensure all questions are answered
    if (this.answers.some((answer) => !answer)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    // Log and reset answers
    console.log('Answers:', this.answers);
    alert('Your answers have been submitted successfully!');
    this.router.navigate(['/results']);
  }
}
