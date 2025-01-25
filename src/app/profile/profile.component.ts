
// יצירת רכיב פרופיל משתמש עם התחברות (profile.component.ts)
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isLoggedIn = false; // מצב התחברות

  userProfile = {
    skinType: '',
    skinTone: '',
    hairColor: '',
    eyeColor: ''
  };

  skinTypes = ['שומני', 'יבש', 'רגיל'];
  skinTones = ['בהיר', 'בינוני', 'כהה'];
  hairColors = ['בלונדיני', 'חום', 'שחור', 'אדום'];
  eyeColors = ['כחול', 'ירוק', 'חום', 'אפור'];

  login(username: string, password: string) {
    if (username === 'user' && password === 'password') { // בדיקה פשוטה
      this.isLoggedIn = true;
      alert('התחברת בהצלחה!');
    } else {
      alert('שם משתמש או סיסמה שגויים');
    }
  }

  saveProfile() {
    console.log('פרופיל נשמר:', this.userProfile);
    alert('הפרופיל נשמר בהצלחה!');
  }
}
