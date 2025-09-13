import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProfileData {
  username: string;
  skinType: string;
  skinTone: string;
  hairColor: string;
  eyeColor: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private loggedInUser: string | null = sessionStorage.getItem('loggedInUser');
  private profile: ProfileData | null = this.loadProfileFromStorage();

  constructor(private http: HttpClient) {}

  // === AUTH ===
  register(userData: { username: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, userData);
  }

  login(userData: { username: string; password: string }): Observable<{ message: string; user: { id: number; username: string } }> {
    return this.http.post<{ message: string; user: { id: number; username: string } }>(
      `${environment.apiUrl}/login`,
      userData
    ).pipe(
      tap(res => {
        if (res?.user?.username) this.setLoggedInUser(res.user.username);
      })
    );
  }

  // === PROFILE API ===
  /** שמירת פרופיל בשרת והחזרת האובייקט השמור (ProfileData) */
  saveProfile(profileData: ProfileData): Observable<ProfileData> {
    return this.http.post<ProfileData>(`${environment.apiUrl}/profile`, profileData)
      .pipe(tap(p => this.setProfile(p)));
  }

  /** שליפת פרופיל מהשרת (לפי שם משתמש) */
  getProfile(username: string): Observable<ProfileData> {
    return this.http.get<ProfileData>(`${environment.apiUrl}/profile/${encodeURIComponent(username)}`);
  }

  /** נוח: שליפה מהשרת + עדכון cache מקומי */
  fetchProfile(username: string): Observable<ProfileData> {
    return this.getProfile(username).pipe(tap(p => this.setProfile(p)));
  }

  // === LOGIN STATE ===
  setLoggedInUser(username: string): void {
    this.loggedInUser = username;
    sessionStorage.setItem('loggedInUser', username);
  }

  getLoggedInUser(): string | null {
    return this.loggedInUser || sessionStorage.getItem('loggedInUser');
  }

  isUserLoggedIn(): boolean {
    return !!this.getLoggedInUser();
  }

  logout(): void {
    this.loggedInUser = null;
    sessionStorage.removeItem('loggedInUser');
    this.profile = null;
    localStorage.removeItem('profile');
  }

  // === PROFILE CACHE ===
  private loadProfileFromStorage(): ProfileData | null {
    try {
      const raw = localStorage.getItem('profile');
      return raw ? JSON.parse(raw) as ProfileData : null;
    } catch {
      return null;
    }
  }

  private persistProfile(profile: ProfileData | null): void {
    if (profile) localStorage.setItem('profile', JSON.stringify(profile));
    else localStorage.removeItem('profile');
  }

  setProfile(profile: ProfileData): void {
    this.profile = profile;
    this.persistProfile(profile);
  }

  getProfileData(): ProfileData | null {
    return this.profile;
  }
}
