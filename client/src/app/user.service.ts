import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userProfile: any = null; // שמירת נתוני הפרופיל
  private isLoggedIn: boolean = false; // בדיקה אם המשתמש מחובר

  constructor() {}

  // קבלת פרופיל המשתמש
  getProfile(): any {
    return this.userProfile;
  }

  // שמירת פרופיל המשתמש
  setProfile(profile: any): void {
    this.userProfile = profile;
  }

  // סטטוס חיבור משתמש
  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  // עדכון סטטוס חיבור
  setIsLoggedIn(status: boolean): void {
    this.isLoggedIn = status;
  }
}
