import { Component } from '@angular/core';

interface Product {
  image: string;
  name: string;
  price: string;
  link: string;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  products: Product[] = [
    {
      image: "https://via.placeholder.com/100",
      name: "Radiant Glow Foundation",
      price: "$29.99",
      link: "https://www.example.com/foundation"
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Luscious Lipstick",
      price: "$19.99",
      link: "https://www.example.com/lipstick"
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Velvet Eyeshadow Palette",
      price: "$39.99",
      link: "https://www.example.com/eyeshadow"
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Hydrating Face Mist",
      price: "$14.99",
      link: "https://www.example.com/facemist"
    },
    {
      image: "https://via.placeholder.com/100",
      name: "Ultra-Defining Mascara",
      price: "$24.99",
      link: "https://www.example.com/mascara"
    }
  ];
}