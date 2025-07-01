import { Component } from '@angular/core';
import { ProductService } from '../services/product.service'; // Import ProductService
import { UserService } from '../user.service';
import { OnInit } from '@angular/core';


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
  
  ngOnInit() {
    const profile = this.userService.getProfile();
    if (profile) {
      this.eyeColor = profile.eyeColor || '';
      this.skinTone = profile.skinTone || '';
      this.skinType = profile.skinType || '';
      this.hairColor = profile.hairColor || '';
    }
  }
  // Inject ProductService
  constructor(
    private productService: ProductService,
  private userService: UserService
) {}

  // Method to handle product type change
  onProductTypeChange(): void {

    console.log('Selected Product Type:', this.productType);
    this.productService.setSelectedProduct(this.productType); // Save selected product to the service
  }
  saveUserProfile(): void {
  const profileData = {
    username: this.userService.getProfile()?.username, // get current username from UserService
    eyeColor: this.eyeColor,
    skinTone: this.skinTone,
    skinType: this.skinType,
    hairColor: this.hairColor,
  };

  if (!profileData.username) {
    alert('User not logged in!');
    return;
  }

  this.userService.saveProfile(profileData).subscribe({
  next: () => alert('Profile saved successfully!'),
  error: (err: any) => alert('Failed to save profile: ' + err.message)
  });

}

}
