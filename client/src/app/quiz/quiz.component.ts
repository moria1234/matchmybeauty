import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service'; 
import { UserService, ProfileData } from '../services/user.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  productType: string = '';
  productOptions: string[] = ['foundation', 'concealer', 'powder', 'bronzer', 'blush'];

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
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const username = this.userService.getLoggedInUser();
    if (!username) {
      alert('You are not logged in. Your profile changes will not be saved.');
      return;
    }

    this.isLoggedIn = true;

    this.userService.getProfile(username).subscribe(
      (profile: ProfileData) => {
        this.eyeColor = profile.eyeColor || '';
        this.skinTone = profile.skinTone || '';
        this.skinType = profile.skinType || '';
        this.hairColor = profile.hairColor || '';
        this.userService.setProfile(profile);
      },
      (err: any) => console.error('Failed to fetch profile:', err)
    );
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
      next: () => {
        alert('Profile saved successfully!');
        this.userService.setProfile(profileData);
      },
      error: (err: any) => alert('Failed to save profile: ' + err.message)
    });
  }

  logout(): void {
    this.userService.logout();
    // Redirect to login/register
    window.location.href = '/register';
  }
}
