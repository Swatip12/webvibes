import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appReveal]'
})
export class ScrollRevealDirective implements OnInit, OnDestroy {

  @Input('appReveal') direction: 'up' | 'left' | 'right' | 'scale' | '' = '';
  @Input() revealDelay: string = '';

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const el = this.el.nativeElement;

    // Set initial hidden state based on direction
    el.style.opacity = '0';
    el.style.transition = `opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)`;
    el.style.willChange = 'opacity, transform';

    const dir = this.direction || 'up';
    switch (dir) {
      case 'up':    el.style.transform = 'translateY(36px)'; break;
      case 'left':  el.style.transform = 'translateX(-44px)'; break;
      case 'right': el.style.transform = 'translateX(44px)'; break;
      case 'scale': el.style.transform = 'scale(0.88) translateY(20px)'; break;
    }

    // Apply delay if provided
    if (this.revealDelay) {
      el.style.transitionDelay = `${this.revealDelay}ms`;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Trigger animation
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'none';
            this.observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
