import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent implements OnInit {
  heroImageUrl: string = '';

  constructor() {}

  ngOnInit(): void {
    // Specific Unsplash photo of a developer coding at a laptop
    this.heroImageUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=900&fit=crop&q=85';
  }
}
