import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isLoggedIn = false; // Login status
isRegistering = false; // Registration status

  users: { username: string; password: string }[] = [];

  userProfile = {
    skinType: '',
    skinTone: '',
    hairColor: '',
    eyeColor: ''
  };

  skinTypes = ['Oily', 'Dry', 'Normal'];
skinTones = ['Light', 'Medium', 'Dark'];
hairColors = ['Blonde', 'Brown', 'Black', 'Red'];
eyeColors = ['Blue', 'Green', 'Brown', 'Gray'];

  login(username: string, password: string) {
    const user = this.users.find(user => user.username === username && user.password === password);
    if (user) {
      this.isLoggedIn = true;
      alert('Login successful!');
    } else {
      alert('Invalid username or password');
    }
  }

  register(username: string, password: string) {
    const userExists = this.users.some(user => user.username === username);
    if (userExists) {
      alert('Username already exists');
    } else {
      this.users.push({ username, password });
      alert('Registration successful! You can now log in.');
      this.isRegistering = false;
    }
  }

  saveProfile() {
    console.log('Profile saved:', this.userProfile);
    alert('Profile saved successfully!');
  }

  constructor(private router: Router) {}

  

  goToQuiz(): void {
    this.router.navigate(['/quiz']);  // Navigate to quiz page directly if needed
  }
}
