import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ProductQuestionsComponent } from './product-questions/product-questions.component';
import { ProductService } from './services/product.service';

const appRoutes: Routes = [
  { path: '', component: ProductQuestionsComponent }, // Default route
  // Add other routes as needed
];
@NgModule({
  declarations: [AppComponent, ProductQuestionsComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(appRoutes),],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule {}