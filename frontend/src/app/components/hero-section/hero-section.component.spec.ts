import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeroSectionComponent } from './hero-section.component';
import { LazyImageComponent } from '../lazy-image/lazy-image.component';
import { ImageService } from '../../services/image.service';

describe('HeroSectionComponent', () => {
  let component: HeroSectionComponent;
  let fixture: ComponentFixture<HeroSectionComponent>;
  let imageService: ImageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroSectionComponent, LazyImageComponent ],
      imports: [ RouterTestingModule ],
      providers: [ ImageService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroSectionComponent);
    component = fixture.componentInstance;
    imageService = TestBed.inject(ImageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize hero image URL from ImageService', () => {
    expect(component.heroImageUrl).toBeTruthy();
    expect(component.heroImageUrl).toContain('unsplash');
  });

  it('should have two-column grid layout', () => {
    const compiled = fixture.nativeElement;
    const container = compiled.querySelector('.container');
    const styles = window.getComputedStyle(container);
    
    // Check grid layout is applied
    expect(styles.display).toBe('grid');
  });

  it('should contain badge with primary-50 background and primary-700 text', () => {
    const compiled = fixture.nativeElement;
    const badge = compiled.querySelector('.hero-badge');
    expect(badge).toBeTruthy();
    expect(badge.classList.contains('badge-primary')).toBe(true);
  });

  it('should contain headline with font-size-5xl and font-weight-extrabold', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('.hero-title');
    expect(title).toBeTruthy();
    
    const styles = window.getComputedStyle(title);
    expect(styles.fontWeight).toBe('800'); // extrabold
  });

  it('should highlight words in primary-600', () => {
    const compiled = fixture.nativeElement;
    const highlights = compiled.querySelectorAll('.highlight-primary');
    expect(highlights.length).toBeGreaterThan(0);
  });

  it('should contain subtitle with max-width 540px', () => {
    const compiled = fixture.nativeElement;
    const subtitle = compiled.querySelector('.hero-subtitle');
    expect(subtitle).toBeTruthy();
    
    const styles = window.getComputedStyle(subtitle);
    expect(styles.maxWidth).toBe('540px');
  });

  it('should contain primary and secondary CTA buttons', () => {
    const compiled = fixture.nativeElement;
    const ctaSection = compiled.querySelector('.hero-cta');
    expect(ctaSection).toBeTruthy();
    
    const buttons = ctaSection.querySelectorAll('.btn');
    expect(buttons.length).toBe(2);
    expect(buttons[0].classList.contains('btn-primary')).toBe(true);
    expect(buttons[1].classList.contains('btn-secondary')).toBe(true);
  });

  it('should contain statistics bar with three columns', () => {
    const compiled = fixture.nativeElement;
    const stats = compiled.querySelector('.hero-stats');
    expect(stats).toBeTruthy();
    
    const statItems = stats.querySelectorAll('.stat-item');
    expect(statItems.length).toBe(3);
    
    const dividers = stats.querySelectorAll('.stat-divider');
    expect(dividers.length).toBe(2);
  });

  it('should use LazyImageComponent for hero image', () => {
    const compiled = fixture.nativeElement;
    const lazyImage = compiled.querySelector('app-lazy-image');
    expect(lazyImage).toBeTruthy();
  });

  it('should have floating feature cards', () => {
    const compiled = fixture.nativeElement;
    const floatingCards = compiled.querySelectorAll('.floating-card');
    expect(floatingCards.length).toBe(3);
  });

  it('should apply border-radius-2xl and shadow-xl to image wrapper', () => {
    const compiled = fixture.nativeElement;
    const imageWrapper = compiled.querySelector('.image-wrapper');
    expect(imageWrapper).toBeTruthy();
    
    const styles = window.getComputedStyle(imageWrapper);
    expect(styles.borderRadius).toBeTruthy();
    expect(styles.boxShadow).toBeTruthy();
  });
});
