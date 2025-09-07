import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

export interface RegisterData { username: string; password: string; }
export interface LoginData    { username: string; password: string; }
export interface ProfileData  {
  username: string; skinType: string; skinTone: string; hairColor: string; eyeColor: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = environment.apiUrl;
  private userProfile: any = null;
  private isLoggedIn = false;

  constructor(private http: HttpClient) {}

  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: LoginData): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  saveProfile(data: ProfileData): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile`, data);
  }

  getProfile(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/${username}`);
  }

  setLoggedInUser(username: string): void {
    localStorage.setItem('loggedInUser', username);
    this.isLoggedIn = true;
  }
  getLoggedInUser(): string | null { return localStorage.getItem('loggedInUser'); }
  logout(): void { localStorage.removeItem('loggedInUser'); this.isLoggedIn = false; this.userProfile = null; }
  setProfile(p: any): void { this.userProfile = p; }
  getStoredProfile(): any { return this.userProfile; }
  getIsLoggedIn(): boolean { return this.isLoggedIn; }
}
