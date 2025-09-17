import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { UserService, ProfileData } from '../services/user.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  
  productType: string = '';
  productOptions: string[] = ['foundation', 'concealer', 'powder', 'bronzer', 'blush','mascara', 'eyeshadow', 'lips', 'eyebrow', 'primer', 'eyeliner'];

  eyeColor: string = '';
  eyeColors: string[] = ['Brown', 'Green', 'Blue', 'Gray', 'Black'];

  skinTone: string = '';
  skinTones: string[] = ['Light', 'Medium', 'Dark'];

  skinType: string = '';
  skinTypes: string[] = ['Dry', 'Oily', 'Normal', 'Combination'];

  hairColor: string = '';
  hairColors: string[] = ['Brown', 'Black', 'Blonde', 'Red'];

  isLoggedIn: boolean = false;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const username = this.userService.getLoggedInUser();
    if (!username) {
    
      alert('You are not logged in. Your profile changes will not be saved.');
      this.isLoggedIn = false;
      return;
    }

    this.isLoggedIn = true;

    const cached: ProfileData | null = this.userService.getProfileData();
    if (cached) {
      this.applyProfile(cached);
    } else {
      this.userService.fetchProfile(username).subscribe({
        next: (profile: ProfileData) => {
          this.applyProfile(profile);
        },
        error: (err: unknown) => {
          console.error('Failed to fetch profile:', err);
        },
      });
    }
  }

  private applyProfile(p: ProfileData): void {
    this.eyeColor = p.eyeColor || '';
    this.skinTone = p.skinTone || '';
    this.skinType = p.skinType || '';
    this.hairColor = p.hairColor || '';
  }

  onProductTypeChange(): void {
    this.productService.setSelectedProduct(this.productType);
  }

  saveUserProfile(): void {
    const username = this.userService.getLoggedInUser();
    if (!username) {
      alert('User not logged in!');
      return;
    }

    const profileData: ProfileData = {
      username,
      eyeColor: this.eyeColor,
      skinTone: this.skinTone,
      skinType: this.skinType,
      hairColor: this.hairColor,
    };

    this.userService.saveProfile(profileData).subscribe({
      next: (saved: ProfileData) => {
        alert('Profile saved successfully!');
        this.userService.setProfile(saved ?? profileData);
      },
      error: (err: unknown) => {
        console.error(err);
        const anyErr = err as any;
        const msg =
          anyErr?.error?.error ||
          anyErr?.error?.message ||
          anyErr?.message ||
          'Failed to save profile';
        alert(msg);
      },
    });
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/register']);
  }

  isQuizComplete(): boolean {
    return !!(
      this.productType &&
      this.eyeColor &&
      this.skinTone &&
      this.skinType &&
      this.hairColor
    );
  }

  goNext(): void {
    if (!this.isQuizComplete()) {
      alert('Please answer all questions before continuing.');
      return;
    }
    this.router.navigate(['/product-questions'], {
      queryParams: {
        product: this.productType,
        skinType: this.skinType,
         eyeColor: this.eyeColor,     
    hairColor: this.hairColor,
      }
    });
  }
}