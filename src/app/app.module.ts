import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ProductQuestionsComponent } from './product-questions/product-questions.component';
import { ProductService } from './services/product.service';
import { QuizComponent } from './quiz/quiz.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent }, // Default route set to HomeComponent
  { path: 'quiz', component: QuizComponent }, // Quiz route
  { path: 'product-questions', component: ProductQuestionsComponent }, // Product questions route
];

@NgModule({
  declarations: [
    AppComponent,
    ProductQuestionsComponent,
    QuizComponent,
    HomeComponent, // הוספת רכיב HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [ProductService],
  bootstrap: [AppComponent],
})
export class AppModule {}
