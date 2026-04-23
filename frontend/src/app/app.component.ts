import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'WebVibes Technology';

  private observer!: IntersectionObserver;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Re-run scroll animations on every route change
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      // Small delay to let Angular render the new page
      setTimeout(() => this.initScrollAnimations(), 120);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initScrollAnimations(), 100);
  }

  private initScrollAnimations(): void {
    // Disconnect previous observer
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sa-visible');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    // Select all animatable elements across all pages
    const selectors = [
      // Cards
      '.cp-card', '.cp-cat-card', '.cp-benefit-card',
      '.ip-card', '.ip-domain-card', '.ip-feature-card', '.ip-benefit-item',
      '.sv-card', '.sv-why-card',
      '.blog-card', '.pp-card',
      '.ab-mv-card', '.ab-why-point', '.ab-cert-card', '.ab-facility-card',
      '.ct-info-card', '.ct-faq-item',
      '.irp-plan', '.irp-benefit-card', '.irp-tl-step',
      // Sections
      '.cp-intro-section', '.cp-categories-section', '.cp-benefits-section', '.cp-cta-section',
      '.ip-intro-section', '.ip-domains-section', '.ip-features-section', '.ip-benefits-section', '.ip-cta-section',
      '.ip-seo-sections > *',
      '.irp-header', '.irp-img-strip', '.irp-plans', '.irp-timeline-wrap', '.irp-benefits-wrap', '.irp-cta-banner',
      '.sv-section', '.sv-why-section', '.sv-cta',
      '.ab-section', '.ab-founder-card', '.ab-cta',
      '.ct-main', '.ct-faq',
      '.blog-featured', '.blog-cta',
      '.bp-article', '.bp-sidebar-card',
      // Home sections
      '.offer-section', '.features-section', '.courses-section',
      '.about-section', '.internship-home-section', '.services-home-section',
      '.feature-card', '.course-card', '.tm-card',
      '.internship-feat', '.service-card',
      // About image sections
      '.ab-why-img-wrap', '.ab-founder-card',
    ].join(',');

    const elements = document.querySelectorAll(selectors);
    elements.forEach((el, i) => {
      // Skip if already visible or already has the class
      if (el.classList.contains('sa-visible')) return;

      // Add base animation class
      el.classList.add('sa-animate');

      // Assign stagger delay based on siblings
      const parent = el.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(c => c.classList.contains('sa-animate'));
        const idx = siblings.indexOf(el);
        if (idx > 0) {
          (el as HTMLElement).style.animationDelay = `${Math.min(idx * 0.08, 0.5)}s`;
          (el as HTMLElement).style.transitionDelay = `${Math.min(idx * 0.08, 0.5)}s`;
        }
      }

      this.observer.observe(el);
    });
  }
}
