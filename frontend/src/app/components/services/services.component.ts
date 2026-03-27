import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  constructor(private router: Router, private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Services — Web Development, Mobile Apps, IT Training & SEO',
      description: 'WebVibes Technology offers web development, custom websites, mobile app development, IT internships, industrial training, job-oriented courses, and SEO optimization services in India.',
      keywords: 'web development services India, custom website development, mobile app development India, IT industrial training, SEO services India, job oriented IT courses, internship programs, software development company India',
      canonical: 'https://webvibestechnology.vercel.app/services'
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
