import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'client/src/app/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isLoggedIn = false; 
  isRegistering = false;

  username = '';
  password = '';

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

  constructor(private router: Router, private userService: UserService) {}

  /*login() {
    this.userService.login({ username: this.username, password: this.password }).subscribe({
      next: (response: any) => {
        alert('Login successful!');
        this.isLoggedIn = true;
        this.userProfile = {
          skinType: response.user.skinType,
          skinTone: response.user.skinTone,
          hairColor: response.user.hairColor,
          eyeColor: response.user.eyeColor,
        };
      },
      error: (err: any) => {
        alert(err.error?.error || 'Invalid username or password');
      }
    });
  } 

  register() {
    const registerData = {
      username: this.username,
      password: this.password,
      skinType: '',
      skinTone: '',
      hairColor: '',
      eyeColor: ''
    };

    this.userService.register(registerData).subscribe({
      next: () => {
        alert('Registration successful! You can now log in.');
        this.isRegistering = false;
      },
      error: (err: any) => {
        alert(err.error?.error || 'Registration failed');
      }
    });
  }*/

    login(): void {
    this.userService.login({ username: this.username, password: this.password }).subscribe({
      next: (response: any) => {
        this.userService.setLoggedInUser(response.user.username);
        this.userService.setProfile(response.user);
        alert('Login successful!');
        this.isLoggedIn = true;
        // Save username for later use
        this.userService.setLoggedInUser(response.user.username);
        this.router.navigate(['/quiz']); // move to quiz page
      },
      error: (err: any) => {
        alert(err.error?.error || 'Login failed');
      }
    });
  }
  
  register(): void {
    this.userService.register({ username: this.username, password: this.password }).subscribe({
      next: () => {
        alert('Registration successful!');
        this.isRegistering = false;
      },
      error: (err: any) => {
        alert(err.error?.error || 'Registration failed');
      }
    });
  }

  saveProfile(): void {
  const username = this.userService.getLoggedInUser();

  if (!username) {
    alert('User not logged in');
    return;
  }

  const profileData = {
    username,
    ...this.userProfile
  };

  this.userService.saveProfile(profileData).subscribe({
    next: () => {
      alert('Profile saved successfully!');
    },
    error: (err: any) => {
      alert(err.error?.error || 'Failed to save profile');
    }
  });
}


  goToQuiz(): void {
    this.router.navigate(['/quiz']);
  }
}

