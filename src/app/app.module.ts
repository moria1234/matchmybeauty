import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // חובה בשביל ngModel
import { RouterModule, Routes } from '@angular/router';
<<<<<<< HEAD
=======
import { AppComponent } from './app.component';
import { ProductQuestionsComponent } from './product-questions/product-questions.component';
import { ProductService } from './services/product.service';
import { QuizComponent } from './quiz/quiz.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AppRoutingModule } from './app-routing.module'; // Import routing module
import { ResultsComponent } from './results/results.component';
>>>>>>> 6a6ae677ef94838faa2388bdca4d7bfabefcaf25

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
<<<<<<< HEAD
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
=======
    HomeComponent, 
    ProfileComponent,
    ResultsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    AppRoutingModule,
>>>>>>> 6a6ae677ef94838faa2388bdca4d7bfabefcaf25
  ],
  providers: [ProductService],
  bootstrap: [AppComponent],
})
export class AppModule {}
