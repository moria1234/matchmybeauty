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
  private loggedInUser: string | null = null; // login session in memory
  private profile: ProfileData | null = null; // cached profile

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
    sessionStorage.setItem('loggedInUser', username); // only lasts until browser closes
  }

  getLoggedInUser(): string | null {
    return this.loggedInUser || sessionStorage.getItem('loggedInUser');
  }

  isUserLoggedIn(): boolean {
    return !!this.getLoggedInUser();
  }

  // === PROFILE CACHE ===
  setProfile(profile: ProfileData) {
    this.profile = profile; // cached in memory only
  }

  getProfileData(): ProfileData | null {
    return this.profile; // returns cached profile or null
  }

  logout(): void {
    this.loggedInUser = null;
    sessionStorage.removeItem('loggedInUser');
    this.profile = null;
  }
}
