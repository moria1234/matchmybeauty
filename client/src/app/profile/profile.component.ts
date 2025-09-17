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
      const cachedProfile = this.userService.getProfileData();
      if (cachedProfile) {
        this.userProfile = { ...cachedProfile };
      } else {
        this.userService.fetchProfile(username).subscribe({
          next: (profile) => this.userProfile = { ...profile },
          error: () => this.userProfile.username = username
        });
      }
    }
  }
  
  
  login(): void {
    this.userService.login({ username: this.username, password: this.password }).subscribe({
      next: (response: any) => {
        const username = response.user.username;
        this.userService.setLoggedInUser(username);
  
        this.userService.fetchProfile(username).subscribe({
          next: (profile) => {
            this.userProfile = { ...profile };
            alert('Login successful!');
          },
          error: () => {
            this.userProfile = { username, skinType: '', skinTone: '', hairColor: '', eyeColor: '' };
            alert('Login successful!');
          }
        });
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
