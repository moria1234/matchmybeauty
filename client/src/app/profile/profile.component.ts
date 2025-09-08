import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, ProfileData } from '../services/user.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isLoggedIn = false; 
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

  constructor(private router: Router, private userService: UserService) {}

 ngOnInit(): void {
  const username = this.userService.getLoggedInUser();

  if (!username) {
    // User is not logged in → redirect to login/register page
    this.router.navigate(['/register']); // replace '/register' with your actual route
    return; // stop further execution
  }

  this.isLoggedIn = true;

  // Load profile if user is logged in
  this.userService.getProfile(username).subscribe({
    next: (profile: any) => {
      this.userProfile = {
        username: profile.username || username,
        skinType: profile.skinType || '',
        skinTone: profile.skinTone || '',
        hairColor: profile.hairColor || '',
        eyeColor: profile.eyeColor || ''
      };
      this.userService.setProfile(this.userProfile);
    },
    error: (err) => console.error('Failed to load profile:', err)
  });
}


  login(): void {
    this.userService.login({ username: this.username, password: this.password }).subscribe({
      next: (response: any) => {
        this.userService.setLoggedInUser(response.user.username);
        this.userService.setProfile(response.user);
        alert('Login successful!');
        this.isLoggedIn = true;
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

  goToQuiz(): void {
    this.router.navigate(['/quiz']);
  }
}
