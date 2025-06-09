import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // חובה בשביל ngModel
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { QuizComponent } from './quiz/quiz.component';
import { ProductQuestionsComponent } from './product-questions/product-questions.component';
import { ResultsComponent } from './results/results.component';
import { ProfileComponent } from './profile/profile.component'; // לוודא שזה פה
import { ProductService } from './services/product.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuizComponent,
    ProductQuestionsComponent,
    ResultsComponent,
    ProfileComponent, // להוסיף אותו כאן
  ],
  imports: [
    BrowserModule,
    FormsModule, // חובה
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'quiz', component: QuizComponent },
      { path: 'product-questions', component: ProductQuestionsComponent },
      { path: 'results', component: ResultsComponent },
      { path: 'profile', component: ProfileComponent },
    ]),
  ],
  providers: [ProductService],
  bootstrap: [AppComponent],
})
export class AppModule {}
