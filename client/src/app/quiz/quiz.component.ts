import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service'; 
import { UserService } from '../user.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
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

  constructor(
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const username = this.userService.getLoggedInUser();
    if (username) {
      this.userService.getProfile(username).subscribe(profile => {
        // שדות מה־DB (שימי לב לשמות עם underscore מה־backend)
        this.eyeColor = profile.eye_color || '';
        this.skinTone = profile.skin_tone || '';
        this.skinType = profile.skin_type || '';
        this.hairColor = profile.hair_color || '';
      });
    }
  }

  // שינוי סוג מוצר
  onProductTypeChange(): void {
    console.log('Selected Product Type:', this.productType);
    this.productService.setSelectedProduct(this.productType);
  }

  // שמירת פרופיל
  saveUserProfile(): void {
    const username = this.userService.getLoggedInUser();
    if (!username) {
      alert('User not logged in!');
      return;
    }

    const profileData = {
      username: username,
      eyeColor: this.eyeColor,
      skinTone: this.skinTone,
      skinType: this.skinType,
      hairColor: this.hairColor,
    };

    this.userService.saveProfile(profileData).subscribe({
      next: () => alert('Profile saved successfully!'),
      error: (err: any) => alert('Failed to save profile: ' + err.message)
    });
  }
}
