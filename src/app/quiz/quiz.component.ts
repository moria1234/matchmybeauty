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
}
