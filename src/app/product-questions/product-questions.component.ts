import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';


const commonQuestions  = {
  finish:{
    text: 'What level of finish would you like?',
    options: ['matte', 'natural', 'radiant'],
  },
};
  
const faceQuestions = [
  {
    text: 'What level of coverage would you like?',
    options: ['Light', 'Medium', 'Full'],
  },
  commonQuestions.finish,
]

const cheeksQuestions= [
{
  text:'What formula do you want to use?',
  options:['Powder','cream','liquid'],
},
{
  text:'What color family do you want?',
  options:['Pink','Brown','Coral','Red'],
},
commonQuestions.finish,
]

const eyeshadowQuestions= [
  {
    text:'What formula do you want to use?',
    options:['Powder','cream'],
  },
  {
    text:'What level of finish would you like?',
      options:['matte','natural','shimmer'],
  },
  {
    text:'What color family do you want?',
    options:['Warm tones','Cool tones','colorful'],
  },
]

const lipQuestions= [
  {
    text:'What formula do you want to use?',
    options:['Liquid','Lipstick'],
  },
  {
    text:'What color family do you want?',
    options:['Red','Pink','Brown','Nude','Orange','Purpule','Transparent'],
  },
  {
    text:'What level of finish would you like?',
      options:['matte','natural','glossy'],
  },

]

@Component({
  selector: 'app-product-questions',
  templateUrl: './product-questions.component.html',
  styleUrls: ['./product-questions.component.css'],
})

export class ProductQuestionsComponent {
  
  constructor(private productService: ProductService) {
    this.selectedProduct = this.productService.getSelectedProduct();
    this.loadQuestions(this.selectedProduct);
  }
  // Mapping products to questions
  productQuestions: Record<string, { text: string; options?: string[] }[]> = {

    'BB&CC cream': faceQuestions,
    'Makeup': faceQuestions,
    'Concealer':faceQuestions,
    'Primer':faceQuestions,
    'Powder':faceQuestions,
    
    'Bronzer':cheeksQuestions,
    'Blush':cheeksQuestions,
    
    'Eyeshadow':eyeshadowQuestions,
    'Eye Palettes':eyeshadowQuestions,

    'Lip Gloss':lipQuestions,
    'Lipstick':lipQuestions,
    'Liquid Lipstick':lipQuestions,

    'Eyebrows':[
      {
        text:'What formula do you want to use?',
        options:['Powder','Pencil','Gel'],
      },
    ],

    'Eyeliner':[
      {
        text: 'What color do you want to use?',
        options:['Black','Brown','colored'],
      },
      {
        text:'What formula do you want to use?',
        options:['Marker','Pencil','Gel','Liquid'],
      },
    ],

    'Mascara':[
      {
        text: 'Do you want the mascara to be waterproof?',
        options:['yes','no'],
      },
      {
        text: 'What color do you want to use?',
        options:['Black','Brown'],
      },
      {
        text:'What actions are you looking for in your mascara?',
        options:['Lengthning','Volumizing','Curling']
      }
    ],

    
  };

  selectedProduct: string = '';

  setSelectedProduct(product: string) {
    this.selectedProduct = product;
  }

  getSelectedProduct(): string {
    return this.selectedProduct;
  }
  questions: { text: string; options?: string[] }[] = [];
  answers: string[] = [];

  // Load questions based on the selected product
  loadQuestions(product: string) {
    if (!this.productQuestions[product]) {
      console.warn(`No questions found for product: ${product}`);
      this.questions = [];
      return;
    }
    this.questions = this.productQuestions[product];
    this.answers = Array(this.questions.length).fill('');
  }

  // Handle form submission
  submitAnswers() {
    if (this.answers.some(answer => !answer)) {
      alert('Please answer all questions before submitting.');
      return;
    }
    console.log('Answers:', this.answers);
    alert('Your answers have been submitted successfully!');
    this.answers = Array(this.questions.length).fill(''); // Reset answers
  }
}