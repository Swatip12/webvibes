import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LazyImageComponent } from './lazy-image.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('LazyImageComponent', () => {
  let component: LazyImageComponent;
  let fixture: ComponentFixture<LazyImageComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LazyImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LazyImageComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should have default loading strategy as lazy', () => {
      expect(component.loading).toBe('lazy');
    });

    it('should initialize with isLoaded as false', () => {
      expect(component.isLoaded).toBe(false);
    });

    it('should initialize with hasError as false', () => {
      expect(component.hasError).toBe(false);
    });

    it('should have showFallbackText as true by default', () => {
      expect(component.showFallbackText).toBe(true);
    });
  });

  describe('image rendering', () => {
    it('should render img element with correct src', () => {
      component.src = 'https://example.com/image.jpg';
      component.alt = 'Test image';
      fixture.detectChanges();

      const img = compiled.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe('https://example.com/image.jpg');
    });

    it('should render img element with correct alt text', () => {
      component.src = 'https://example.com/image.jpg';
      component.alt = 'Test image description';
      fixture.detectChanges();

      const img = compiled.querySelector('img');
      expect(img?.getAttribute('alt')).toBe('Test image description');
    });

    it('should apply lazy loading attribute by default', () => {
      component.src = 'https://example.com/image.jpg';
      fixture.detectChanges();

      const img = compiled.querySelector('img');
      expect(img?.getAttribute('loading')).toBe('lazy');
    });

    it('should apply eager loading when specified', () => {
      component.src = 'https://example.com/image.jpg';
      component.loading = 'eager';
      fixture.detectChanges();

      const img = compiled.querySelector('img');
      expect(img?.getAttribute('loading')).toBe('eager');
    });

    it('should apply custom image class', () => {
      component.src = 'https://example.com/image.jpg';
      component.imageClass = 'custom-class';
      fixture.detectChanges();

      const img = compiled.querySelector('img');
      expect(img?.classList.contains('custom-class')).toBe(true);
    });
  });

  describe('loading state', () => {
    it('should show loading placeholder initially', () => {
      component.src = 'https://example.com/image.jpg';
      fixture.detectChanges();

      const placeholder = compiled.querySelector('.image-placeholder');
      expect(placeholder).toBeTruthy();
    });

    it('should show spinner in loading state', () => {
      component.src = 'https://example.com/image.jpg';
      fixture.detectChanges();

      const spinner = compiled.querySelector('.spinner');
      expect(spinner).toBeTruthy();
    });

    it('should have loading display state initially', () => {
      expect(component.displayState).toBe('loading');
    });

    it('should show screen reader text for loading', () => {
      component.src = 'https://example.com/image.jpg';
      fixture.detectChanges();

      const srText = compiled.querySelector('.sr-only');
      expect(srText?.textContent).toContain('Loading image');
    });
  });

  describe('loaded state', () => {
    it('should set isLoaded to true on load', () => {
      component.onLoad();
      expect(component.isLoaded).toBe(true);
    });

    it('should set hasError to false on load', () => {
      component.hasError = true;
      component.onLoad();
      expect(component.hasError).toBe(false);
    });

    it('should hide loading placeholder when loaded', () => {
      component.src = 'https://example.com/image.jpg';
      fixture.detectChanges();

      component.onLoad();
      fixture.detectChanges();

      const placeholder = compiled.querySelector('.image-placeholder');
      expect(placeholder).toBeFalsy();
    });

    it('should apply loaded class to image', () => {
      component.src = 'https://example.com/image.jpg';
      fixture.detectChanges();

      component.onLoad();
      fixture.detectChanges();

      const img = compiled.querySelector('img');
      expect(img?.classList.contains('loaded')).toBe(true);
    });

    it('should have loaded display state after loading', () => {
      component.onLoad();
      expect(component.displayState).toBe('loaded');
    });
  });

  describe('error state', () => {
    it('should set hasError to true on error without fallback', () => {
      const mockEvent = { target: { src: 'https://example.com/image.jpg' } } as any;
      component.handleError(mockEvent);
      
      expect(component.hasError).toBe(true);
    });

    it('should set isLoaded to false on error', () => {
      component.isLoaded = true;
      const mockEvent = { target: { src: 'https://example.com/image.jpg' } } as any;
      component.handleError(mockEvent);
      
      expect(component.isLoaded).toBe(false);
    });

    it('should try fallback image on first error', () => {
      component.src = 'https://example.com/image.jpg';
      component.fallbackSrc = 'https://example.com/fallback.jpg';
      
      const mockImg = { src: 'https://example.com/image.jpg' };
      const mockEvent = { target: mockImg } as any;
      
      component.handleError(mockEvent);
      
      expect(mockImg.src).toBe('https://example.com/fallback.jpg');
      expect(component.hasError).toBe(false);
    });

    it('should show error state if fallback also fails', () => {
      component.fallbackSrc = 'https://example.com/fallback.jpg';
      
      const mockImg = { src: 'https://example.com/fallback.jpg' };
      const mockEvent = { target: mockImg } as any;
      
      component.handleError(mockEvent);
      
      expect(component.hasError).toBe(true);
    });

    it('should show error placeholder when image fails', () => {
      component.src = 'https://example.com/image.jpg';
      fixture.detectChanges();

      const mockEvent = { target: { src: 'https://example.com/image.jpg' } } as any;
      component.handleError(mockEvent);
      fixture.detectChanges();

      const errorDiv = compiled.querySelector('.image-error');
      expect(errorDiv).toBeTruthy();
    });

    it('should hide image element on error', () => {
      component.src = 'https://example.com/image.jpg';
      fixture.detectChanges();

      const mockEvent = { target: { src: 'https://example.com/image.jpg' } } as any;
      component.handleError(mockEvent);
      fixture.detectChanges();

      const img = compiled.querySelector('img');
      expect(img).toBeFalsy();
    });

    it('should show error icon', () => {
      component.src = 'https://example.com/image.jpg';
      fixture.detectChanges();

      const mockEvent = { target: { src: 'https://example.com/image.jpg' } } as any;
      component.handleError(mockEvent);
      fixture.detectChanges();

      const icon = compiled.querySelector('.image-error i');
      expect(icon).toBeTruthy();
      expect(icon?.classList.contains('fa-image')).toBe(true);
    });

    it('should show fallback text when enabled', () => {
      component.src = 'https://example.com/image.jpg';
      component.showFallbackText = true;
      fixture.detectChanges();

      const mockEvent = { target: { src: 'https://example.com/image.jpg' } } as any;
      component.handleError(mockEvent);
      fixture.detectChanges();

      const errorText = compiled.querySelector('.image-error span:not(.sr-only)');
      expect(errorText?.textContent).toContain('Image unavailable');
    });

    it('should hide fallback text when disabled', () => {
      component.src = 'https://example.com/image.jpg';
      component.showFallbackText = false;
      fixture.detectChanges();

      const mockEvent = { target: { src: 'https://example.com/image.jpg' } } as any;
      component.handleError(mockEvent);
      fixture.detectChanges();

      const errorText = compiled.querySelector('.image-error span:not(.sr-only)');
      expect(errorText).toBeFalsy();
    });

    it('should have error display state on error', () => {
      const mockEvent = { target: { src: 'https://example.com/image.jpg' } } as any;
      component.handleError(mockEvent);
      
      expect(component.displayState).toBe('error');
    });

    it('should log error to console', () => {
      spyOn(console, 'warn');
      component.src = 'https://example.com/image.jpg';
      
      const mockEvent = { target: { src: 'https://example.com/image.jpg' } } as any;
      component.handleError(mockEvent);
      
      expect(console.warn).toHaveBeenCalledWith('Image failed to load:', 'https://example.com/image.jpg');
    });
  });

  describe('accessibility', () => {
    it('should have alt attribute on image', () => {
      component.src = 'https://example.com/image.jpg';
      component.alt = 'Accessible description';
      fixture.detectChanges();

      const img = compiled.querySelector('img');
      expect(img?.hasAttribute('alt')).toBe(true);
    });

    it('should have aria-hidden on decorative icon', () => {
      component.src = 'https://example.com/image.jpg';
      fixture.detectChanges();

      const mockEvent = { target: { src: 'https://example.com/image.jpg' } } as any;
      component.handleError(mockEvent);
      fixture.detectChanges();

      const icon = compiled.querySelector('.image-error i');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should provide screen reader text for error state', () => {
      component.src = 'https://example.com/image.jpg';
      component.alt = 'Test image';
      fixture.detectChanges();

      const mockEvent = { target: { src: 'https://example.com/image.jpg' } } as any;
      component.handleError(mockEvent);
      fixture.detectChanges();

      const srText = compiled.querySelector('.image-error .sr-only');
      expect(srText?.textContent).toContain('Failed to load image');
    });
  });

  describe('data-state attribute', () => {
    it('should set data-state to loading initially', () => {
      component.src = 'https://example.com/image.jpg';
      fixture.detectChanges();

      const container = compiled.querySelector('.lazy-image-container');
      expect(container?.getAttribute('data-state')).toBe('loading');
    });

    it('should set data-state to loaded after loading', () => {
      component.src = 'https://example.com/image.jpg';
      fixture.detectChanges();

      component.onLoad();
      fixture.detectChanges();

      const container = compiled.querySelector('.lazy-image-container');
      expect(container?.getAttribute('data-state')).toBe('loaded');
    });

    it('should set data-state to error on error', () => {
      component.src = 'https://example.com/image.jpg';
      fixture.detectChanges();

      const mockEvent = { target: { src: 'https://example.com/image.jpg' } } as any;
      component.handleError(mockEvent);
      fixture.detectChanges();

      const container = compiled.querySelector('.lazy-image-container');
      expect(container?.getAttribute('data-state')).toBe('error');
    });
  });
});
