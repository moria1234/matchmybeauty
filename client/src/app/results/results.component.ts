import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';

interface Product {
  name: string;
  brand?: string;
  shade?: string;
  price?: string;
  image?: string;
  link?: string;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  error: string = '';
  noData: boolean = false;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    const cachedProducts = this.productService.getProducts();

    if (cachedProducts && cachedProducts.length > 0) {
      this.products = cachedProducts;
      this.loading = false;
    } else {
      this.loading = false;
      this.noData = true;
    }
  }

  goBackToQuiz(): void {
    this.router.navigate(['/quiz']);
  }
}
