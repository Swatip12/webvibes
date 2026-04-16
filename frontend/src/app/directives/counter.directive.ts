import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({ selector: '[appCounter]' })
export class CounterDirective implements OnInit {
  @Input('appCounter') target: number = 0;
  @Input() counterSuffix: string = '';
  @Input() counterDuration: number = 2000;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCount();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(this.el.nativeElement);
  }

  private animateCount(): void {
    const start = 0;
    const end = this.target;
    const duration = this.counterDuration;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * end);
      this.el.nativeElement.textContent = current + this.counterSuffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}
