import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProfileData {
  username: string;
  skinType: string;
  skinTone: string;
  hairColor: string;
  eyeColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedInUser: string | null = null;
  private profile: ProfileData | null = null;

  constructor(private http: HttpClient) {}

  // === AUTH ===
  register(userData: any) {
    return this.http.post(`${environment.apiUrl}/register`, userData);
  }

  login(userData: any) {
    return this.http.post(`${environment.apiUrl}/login`, userData);
  }

  // === PROFILE ===
  saveProfile(profileData: ProfileData) {
    return this.http.post(`${environment.apiUrl}/profile`, profileData);
  }

  getProfile(username: string): Observable<ProfileData> {
    return this.http.get<ProfileData>(`${environment.apiUrl}/profile/${username}`);
  }

  // === LOGIN STATE ===
  setLoggedInUser(username: string) {
    this.loggedInUser = username;
    localStorage.setItem('loggedInUser', username);
  }

  getLoggedInUser(): string | null {
    return this.loggedInUser || localStorage.getItem('loggedInUser');
  }

  isUserLoggedIn(): boolean {
    return !!this.getLoggedInUser();
  }

  // === PROFILE CACHE ===
  setProfile(profile: ProfileData) {
    this.profile = profile;
    localStorage.setItem('profile', JSON.stringify(profile));
  }

  getProfileData(): ProfileData | null {
    if (this.profile) return this.profile;
    const stored = localStorage.getItem('profile');
    return stored ? JSON.parse(stored) : null;
  }
}
