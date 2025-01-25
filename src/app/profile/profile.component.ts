import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isLoggedIn = false; // מצב התחברות
  isRegistering = false; // מצב הרשמה

  users: { username: string; password: string }[] = [];

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
    const user = this.users.find(user => user.username === username && user.password === password);
    if (user) {
      this.isLoggedIn = true;
      alert('התחברת בהצלחה!');
    } else {
      alert('שם משתמש או סיסמה שגויים');
    }
  }

  register(username: string, password: string) {
    const userExists = this.users.some(user => user.username === username);
    if (userExists) {
      alert('שם המשתמש כבר קיים.');
    } else {
      this.users.push({ username, password });
      alert('ההרשמה הושלמה בהצלחה! עכשיו תוכל להתחבר.');
      this.isRegistering = false;
    }
  }

  saveProfile() {
    console.log('פרופיל נשמר:', this.userProfile);
    alert('הפרופיל נשמר בהצלחה!');
  }
}
