import { Component } from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
  productType: string = '';
  productOptions: string[] = [
    'מייקאפ', 'קונסילר', 'פודרה', 'ברונזר', 'סומק',
    'צלליות', 'מסקרה', 'מוצרי גבות', 'איילינר', 'שפתון'
  ];

  eyeColor: string = '';
  eyeColors: string[] = ['חום', 'ירוק', 'כחול', 'אפור', 'שחור'];

  skinTone: string = '';
  skinTones: string[] = ['בהיר', 'בינוני', 'כהה'];

  skinType: string = '';
  skinTypes: string[] = ['יבש', 'שמן', 'רגיל', 'מעורב'];

  hairColor: string = '';
  hairColors: string[] = ['חום', 'שחור', 'בלונד', 'אדום'];
}
