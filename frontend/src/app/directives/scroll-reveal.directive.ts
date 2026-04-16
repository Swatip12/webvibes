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

    // Set data-reveal attribute for CSS
    el.setAttribute('data-reveal', this.direction || 'up');
    if (this.revealDelay) {
      el.setAttribute('data-reveal-delay', this.revealDelay);
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
