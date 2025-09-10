import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, ProfileData } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isRegistering = false;

  username = '';
  password = '';

  userProfile: ProfileData = {
    username: '',
    skinType: '',
    skinTone: '',
    hairColor: '',
    eyeColor: ''
  };

  skinTypes = ['Oily', 'Dry', 'Normal'];
  skinTones = ['Light', 'Medium', 'Dark'];
  hairColors = ['Blonde', 'Brown', 'Black', 'Red'];
  eyeColors = ['Blue', 'Green', 'Brown', 'Gray'];

  constructor(private router: Router, public userService: UserService) {}

  ngOnInit(): void {
    const username = this.userService.getLoggedInUser();

    if (username) {
      // User is already logged in → redirect to quiz
      alert('You are already logged in!');
      this.router.navigate(['/quiz']);
    }
  }

  login(): void {
    this.userService.login({ username: this.username, password: this.password }).subscribe({
      next: (response: any) => {
        this.userService.setLoggedInUser(response.user.username);
        this.userService.setProfile(response.user);
        alert('Login successful!');
        this.router.navigate(['/quiz']);
      },
      error: (err: any) => alert(err.error?.error || 'Login failed')
    });
  }

  register(): void {
    this.userService.register({ username: this.username, password: this.password }).subscribe({
      next: () => {
        alert('Registration successful!');
        this.isRegistering = false;
      },
      error: (err: any) => alert(err.error?.error || 'Registration failed')
    });
  }

  saveProfile(): void {
    const username = this.userService.getLoggedInUser();
    if (!username) {
      alert('User not logged in');
      return;
    }

    const profileData: ProfileData = { ...this.userProfile, username };

    this.userService.saveProfile(profileData).subscribe({
      next: () => {
        alert('Profile saved successfully!');
        this.userService.setProfile(profileData);
      },
      error: (err: any) => alert(err.error?.error || 'Failed to save profile')
    });
  }

  logout(): void {
    this.userService.logout();
    alert('You have been logged out!');
    this.router.navigate(['/register']);
  }

  goToQuiz(): void {
    this.router.navigate(['/quiz']);
  }
}
