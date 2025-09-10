import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'Welcome to MatchMyBeauty';
  isLoggedIn = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const username = this.userService.getLoggedInUser();
    this.isLoggedIn = !!username;
  }

  logout(): void {
    this.userService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/register']); // Redirect to login/register after logout
  }
}
