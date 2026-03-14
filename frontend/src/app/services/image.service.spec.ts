import { TestBed } from '@angular/core/testing';
import { ImageService } from './image.service';

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getImage', () => {
    it('should return a valid Unsplash URL with default dimensions', () => {
      const query = 'technology';
      const url = service.getImage(query);
      
      expect(url).toContain('source.unsplash.com');
      expect(url).toContain('800x600');
      expect(url).toContain(encodeURIComponent(query));
    });

    it('should return a valid Unsplash URL with custom dimensions', () => {
      const query = 'students learning';
      const width = 1200;
      const height = 800;
      const url = service.getImage(query, width, height);
      
      expect(url).toContain('source.unsplash.com');
      expect(url).toContain(`${width}x${height}`);
      expect(url).toContain(encodeURIComponent(query));
    });

    it('should encode special characters in query', () => {
      const query = 'coding & programming';
      const url = service.getImage(query);
      
      expect(url).toContain(encodeURIComponent(query));
      expect(url).not.toContain('&'); // Should be encoded
    });
  });

  describe('buildUnsplashUrl', () => {
    it('should build correct URL format', () => {
      const query = 'classroom';
      const width = 600;
      const height = 400;
      const url = service.buildUnsplashUrl(query, width, height);
      
      expect(url).toBe(`https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(query)}`);
    });

    it('should handle queries with spaces', () => {
      const query = 'students learning technology';
      const url = service.buildUnsplashUrl(query, 800, 600);
      
      expect(url).toContain(encodeURIComponent(query));
      expect(url).toContain('source.unsplash.com/800x600');
    });

    it('should handle empty query', () => {
      const query = '';
      const url = service.buildUnsplashUrl(query, 800, 600);
      
      expect(url).toBe('https://source.unsplash.com/800x600/?');
    });
  });

  describe('getRandomImage', () => {
    it('should return URL with timestamp parameter', () => {
      const query = 'technology';
      const url = service.getRandomImage(query);
      
      expect(url).toContain('source.unsplash.com');
      expect(url).toContain('sig=');
      expect(url).toContain(encodeURIComponent(query));
    });

    it('should generate different URLs on subsequent calls', (done) => {
      const query = 'coding';
      const url1 = service.getRandomImage(query);
      
      // Wait a tiny bit to ensure different timestamp
      setTimeout(() => {
        const url2 = service.getRandomImage(query);
        
        // URLs should be different due to timestamp
        expect(url1).not.toBe(url2);
        done();
      }, 10);
    });

    it('should use custom dimensions', () => {
      const query = 'programming';
      const width = 1920;
      const height = 1080;
      const url = service.getRandomImage(query, width, height);
      
      expect(url).toContain(`${width}x${height}`);
    });
  });

  describe('error handling', () => {
    it('should handle numeric values in query', () => {
      const query = '2024 technology trends';
      const url = service.getImage(query);
      
      expect(url).toContain(encodeURIComponent(query));
    });

    it('should handle special characters in query', () => {
      const query = 'web-development & design';
      const url = service.getImage(query);
      
      expect(url).toContain(encodeURIComponent(query));
    });
  });
});
