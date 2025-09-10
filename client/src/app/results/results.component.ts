import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';

interface Product {
  name: string;
  brand?: string;
  shade?: string;
  price?: string;
  image: string;
  link: string;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    // הבאת המוצרים שנשלחו דרך state מהעמוד הקודם
    const stateProducts = history.state.products;

    if (stateProducts && stateProducts.length > 0) {
      this.products = stateProducts;
      this.loading = false;
    } else {
      // אם אין state, ניתן לשלוח body ברירת מחדל
      const defaultBody = {
        skinType: 'normal',
        skinTone: 'medium',
        eyeColor: 'brown',
        hairColor: 'black',
        veganOnly: false,
        productType: 'foundation'
      };

      this.productService.getProducts(defaultBody).subscribe({
        next: (data: Product[]) => {
          this.products = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching products:', err);
          this.error = 'Failed to load products';
          this.loading = false;
        }
      });
    }
  }

  goBackToQuiz(): void {
    this.router.navigate(['/quiz']);
  }
}
