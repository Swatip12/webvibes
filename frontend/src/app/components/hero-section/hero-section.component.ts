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
    this.heroImageUrl = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80';
  }
}
