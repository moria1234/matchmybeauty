import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

interface RegisterData {
  username: string;
  password: string;
  skinType: string;
  skinTone: string;
  hairColor: string;
  eyeColor: string;
}

interface LoginData {
  username: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userProfile: any = null;
  private isLoggedIn = false;

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

 // Call backend register API
 /* register(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, userData);
  }*/

    register(userData: { username: string, password: string }): Observable<any> {
  return this.http.post(`${environment.apiUrl}/register`, {
    username: userData.username,
    password: userData.password
  });
}
  // Call backend login API
  login(credentials: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login`, credentials);
  }
  
  setLoggedInUser(username: string): void {
    localStorage.setItem('loggedInUser', username);
  }

  getLoggedInUser(): string | null {
    return localStorage.getItem('loggedInUser');
  }

  // Get user profile
  getProfile(): any {
    return this.userProfile;
  }

  // Set user profile
  setProfile(profile: any): void {
    this.userProfile = profile;
  }

  // Get login status
  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  // Set login status
  setIsLoggedIn(status: boolean): void {
    this.isLoggedIn = status;
  }
  
  saveProfile(profileData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/profile`, profileData);
}

  
}
