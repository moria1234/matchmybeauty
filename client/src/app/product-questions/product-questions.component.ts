import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ProductService } from '../services/product.service';

interface QuestionSpec {
  text: string;
  options?: string[];
}

// שאלות משותפות
const commonQuestions = {
  finish: {
    text: 'What level of finish would you like?',
    options: ['Matte', 'Natural', 'Radiant'],
  },
};

// קבוצות שאלות מוכנות
const faceQuestions: QuestionSpec[] = [
  { text: 'What level of coverage would you like?', options: ['Light', 'Medium', 'Full'] },
  commonQuestions.finish,
];

const cheeksQuestions: QuestionSpec[] = [
  { text: 'What formula do you want to use?', options: ['Powder', 'Cream', 'Liquid'] },
  { text: 'What color family do you want?', options: ['Pink', 'Brown', 'Coral', 'Red'] },
  commonQuestions.finish,
];

// מפה מאוחדת של כל המוצרים והשאלות
// ❗ הוסר Eye Color מ-eyeshadow, והוסר Hair Color מ-eyebrow
const productQuestionsMap: Record<string, QuestionSpec[]> = {
  // פנים
  foundation: faceQuestions,
  concealer: faceQuestions,
  powder: faceQuestions,

  // לחיים
  bronzer: cheeksQuestions,
  blush: cheeksQuestions,

  // עיניים / שפתיים / גבות
  mascara: [
    { text: 'Is it waterproof?', options: ['Yes', 'No'] },
    { text: 'Color', options: ['Black', 'Brown', 'Blue'] },
    { text: 'Longevity', options: ['Low', 'Medium', 'High'] },
    { text: 'Purpose', options: ['Volume', 'Length', 'Curl'] },
  ],
  eyeshadow: [
    { text: 'Longevity', options: ['Low', 'Medium', 'High'] },
    // { text: 'Eye Color', ... }  <-- הוסר: נשתמש במה שמגיע מה-Quiz
    { text: 'Preferred Palette', options: ['Neutrals', 'Warm', 'Cool', 'Smokey', 'Colorful'] },
  ],
  lips: [
    { text: 'Longwear?', options: ['Yes', 'No'] },
    { text: 'Finish', options: ['Matte', 'Gloss'] },
    { text: 'Format', options: ['Lipstick', 'Lip Gloss'] },
    { text: 'Preferred Palette', options: ['Nudes', 'Pinks', 'Reds', 'Corals', 'Berries'] },
  ],
  eyebrow: [
    { text: 'Product Type', options: ['Pencil', 'Marker', 'Gel', 'Brow Mascara', 'Soap', 'Wax'] },
    // { text: 'Hair Color', ... } <-- הוסר: נשתמש במה שמגיע מה-Quiz
  ],
  eyeliner: [
    { text: 'Formula Type', options: ['Liquid', 'Pen (Felt-tip)', 'Gel'] },
  ],
  primer: [
    // אין שאלות – מבוסס על skinType שהגיע מה־Quiz
  ],
};

@Component({
  selector: 'app-product-questions',
  templateUrl: './product-questions.component.html',
  styleUrls: ['./product-questions.component.css'],
})
export class ProductQuestionsComponent implements OnInit {
  selectedProduct: string = '';
  questions: QuestionSpec[] = [];
  answers: string[] = [];
  loading: boolean = false;

  // ערכים שמגיעים מה-Quiz
  skinTypeFromQuiz: string | null = null;
  eyeColorFromQuiz: string | null = null;
  hairColorFromQuiz: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // קבלת product + skinType + eyeColor + hairColor מה־query params
    this.route.queryParamMap.subscribe((params) => {
      this.selectedProduct = (params.get('product') || '').toLowerCase();
      this.skinTypeFromQuiz = params.get('skinType');
      this.eyeColorFromQuiz = params.get('eyeColor');
      this.hairColorFromQuiz = params.get('hairColor');

      if (!this.selectedProduct) {
        alert('No product selected! Please go back and choose a product.');
      } else {
        this.loadQuestions(this.selectedProduct);
      }
    });
  }

  loadQuestions(product: string): void {
    const questions = productQuestionsMap[product];
    if (!questions) {
      alert('No questions available for this product.');
      this.questions = [];
      return;
    }
    this.questions = questions;
    this.answers = Array(this.questions.length).fill('');
  }

  onGetRecommendations(): void {
    // בדיקות השלמה לשאלות המוצגות
    if (this.selectedProduct !== 'primer' && this.answers.some((a) => !a)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    // בדיקת נתונים שמגיעים מה-Quiz עבור מוצרים מסוימים
    if (this.selectedProduct === 'eyeshadow' && !this.eyeColorFromQuiz) {
      alert('Missing eye color from Quiz. Please go back and fill it.');
      return;
    }
    if (this.selectedProduct === 'eyebrow' && !this.hairColorFromQuiz) {
      alert('Missing hair color from Quiz. Please go back and fill it.');
      return;
    }

    // בניית payload
    const payload: any = {
      productType: this.selectedProduct,
      answers:
        this.selectedProduct === 'primer'
          ? { skinType: this.skinTypeFromQuiz }
          : this.answers,
      // extra: ערכים שמגיעים מה-Quiz ולא נשאלים כאן שוב
      extra: {} as Record<string, any>,
    };

    if (this.selectedProduct === 'eyeshadow') {
      payload.extra.eyeColor = this.eyeColorFromQuiz;
      // אופציונלי: אם תרצי גם skinTone להשפעה על פלטה:
      // payload.extra.skinTone = this.skinTypeFromQuiz;
    }
    if (this.selectedProduct === 'eyebrow') {
      payload.extra.hairColor = this.hairColorFromQuiz;
    }
    if (this.selectedProduct === 'primer') {
      // כבר הוספנו ב-answers אובייקט עם skinType
    }

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
          this.productService.setProducts(products); // לשימוש ב-ResultsComponent
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
