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
    it('should return a valid image URL with default dimensions', () => {
      const query = 'technology';
      const url = service.getImage(query);

      expect(url).toContain('picsum.photos');
      expect(url).toContain('800');
      expect(url).toContain('600');
    });

    it('should return a valid image URL with custom dimensions', () => {
      const query = 'students learning';
      const width = 1200;
      const height = 800;
      const url = service.getImage(query, width, height);

      expect(url).toContain('picsum.photos');
      expect(url).toContain(`${width}`);
      expect(url).toContain(`${height}`);
    });

    it('should return consistent URL for same query', () => {
      const query = 'coding & programming';
      const url1 = service.getImage(query);
      const url2 = service.getImage(query);

      expect(url1).toBe(url2);
    });
  });

  describe('buildUnsplashUrl', () => {
    it('should build correct URL format', () => {
      const query = 'classroom';
      const width = 600;
      const height = 400;
      const url = service.buildUnsplashUrl(query, width, height);

      expect(url).toContain('picsum.photos');
      expect(url).toContain(`${width}`);
      expect(url).toContain(`${height}`);
    });

    it('should handle queries with spaces', () => {
      const query = 'students learning technology';
      const url = service.buildUnsplashUrl(query, 800, 600);

      expect(url).toContain('picsum.photos');
      expect(url).toContain('800');
      expect(url).toContain('600');
    });

    it('should handle empty query', () => {
      const query = '';
      const url = service.buildUnsplashUrl(query, 800, 600);

      expect(url).toContain('picsum.photos');
      expect(url).toContain('800');
      expect(url).toContain('600');
    });
  });

  describe('getRandomImage', () => {
    it('should return URL with image dimensions', () => {
      const query = 'technology';
      const url = service.getRandomImage(query);

      expect(url).toContain('picsum.photos');
      expect(url).toContain('800');
      expect(url).toContain('600');
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

      expect(url).toContain(`${width}`);
      expect(url).toContain(`${height}`);
    });
  });

  describe('error handling', () => {
    it('should handle numeric values in query', () => {
      const query = '2024 technology trends';
      const url = service.getImage(query);

      expect(url).toContain('picsum.photos');
    });

    it('should handle special characters in query', () => {
      const query = 'web-development & design';
      const url = service.getImage(query);

      expect(url).toContain('picsum.photos');
    });
  });
});
