import { TestBed } from '@angular/core/testing';
import { LogoService } from './logo.service';

describe('LogoService', () => {
  let service: LogoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCompanyLogo', () => {
    it('should return correct Clearbit URL for simple domain', () => {
      const domain = 'google.com';
      const url = service.getCompanyLogo(domain);
      
      expect(url).toBe('https://logo.clearbit.com/google.com');
    });

    it('should return URL with size parameter when provided', () => {
      const domain = 'microsoft.com';
      const size = 128;
      const url = service.getCompanyLogo(domain, size);
      
      expect(url).toBe('https://logo.clearbit.com/microsoft.com?size=128');
    });

    it('should clean domain with http protocol', () => {
      const domain = 'http://amazon.com';
      const url = service.getCompanyLogo(domain);
      
      expect(url).toBe('https://logo.clearbit.com/amazon.com');
    });

    it('should clean domain with https protocol', () => {
      const domain = 'https://apple.com';
      const url = service.getCompanyLogo(domain);
      
      expect(url).toBe('https://logo.clearbit.com/apple.com');
    });

    it('should clean domain with www prefix', () => {
      const domain = 'www.facebook.com';
      const url = service.getCompanyLogo(domain);
      
      expect(url).toBe('https://logo.clearbit.com/facebook.com');
    });

    it('should clean domain with protocol and www', () => {
      const domain = 'https://www.netflix.com';
      const url = service.getCompanyLogo(domain);
      
      expect(url).toBe('https://logo.clearbit.com/netflix.com');
    });

    it('should remove trailing slashes', () => {
      const domain = 'twitter.com/';
      const url = service.getCompanyLogo(domain);
      
      expect(url).toBe('https://logo.clearbit.com/twitter.com');
    });

    it('should remove paths from domain', () => {
      const domain = 'linkedin.com/company/example';
      const url = service.getCompanyLogo(domain);
      
      expect(url).toBe('https://logo.clearbit.com/linkedin.com');
    });

    it('should remove query parameters', () => {
      const domain = 'github.com?ref=example';
      const url = service.getCompanyLogo(domain);
      
      expect(url).toBe('https://logo.clearbit.com/github.com');
    });

    it('should handle uppercase domains', () => {
      const domain = 'ORACLE.COM';
      const url = service.getCompanyLogo(domain);
      
      expect(url).toBe('https://logo.clearbit.com/oracle.com');
    });

    it('should handle domains with extra whitespace', () => {
      const domain = '  salesforce.com  ';
      const url = service.getCompanyLogo(domain);
      
      expect(url).toBe('https://logo.clearbit.com/salesforce.com');
    });

    it('should throw error for empty domain', () => {
      expect(() => service.getCompanyLogo('')).toThrowError('Domain parameter is required');
    });

    it('should throw error for whitespace-only domain', () => {
      expect(() => service.getCompanyLogo('   ')).toThrowError('Domain parameter is required');
    });

    it('should ignore size parameter if zero', () => {
      const domain = 'ibm.com';
      const url = service.getCompanyLogo(domain, 0);
      
      expect(url).toBe('https://logo.clearbit.com/ibm.com');
      expect(url).not.toContain('size=');
    });

    it('should ignore size parameter if negative', () => {
      const domain = 'adobe.com';
      const url = service.getCompanyLogo(domain, -10);
      
      expect(url).toBe('https://logo.clearbit.com/adobe.com');
      expect(url).not.toContain('size=');
    });
  });

  describe('getCompanyLogoWithFallback', () => {
    it('should return object with logoUrl and fallbackText', () => {
      const domain = 'google.com';
      const companyName = 'Google';
      const result = service.getCompanyLogoWithFallback(domain, companyName);
      
      expect(result).toEqual({
        logoUrl: 'https://logo.clearbit.com/google.com',
        fallbackText: 'Google'
      });
    });

    it('should use domain as fallback if company name is empty', () => {
      const domain = 'microsoft.com';
      const result = service.getCompanyLogoWithFallback(domain, '');
      
      expect(result.fallbackText).toBe('microsoft.com');
    });

    it('should clean domain in logoUrl', () => {
      const domain = 'https://www.amazon.com/';
      const companyName = 'Amazon';
      const result = service.getCompanyLogoWithFallback(domain, companyName);
      
      expect(result.logoUrl).toBe('https://logo.clearbit.com/amazon.com');
      expect(result.fallbackText).toBe('Amazon');
    });

    it('should handle special characters in company name', () => {
      const domain = 'att.com';
      const companyName = 'AT&T';
      const result = service.getCompanyLogoWithFallback(domain, companyName);
      
      expect(result.fallbackText).toBe('AT&T');
    });
  });

  describe('isValidDomain', () => {
    it('should return true for valid simple domain', () => {
      expect(service.isValidDomain('google.com')).toBe(true);
    });

    it('should return true for valid subdomain', () => {
      expect(service.isValidDomain('mail.google.com')).toBe(true);
    });

    it('should return true for domain with hyphen', () => {
      expect(service.isValidDomain('my-company.com')).toBe(true);
    });

    it('should return true for domain with numbers', () => {
      expect(service.isValidDomain('company123.com')).toBe(true);
    });

    it('should return true for domain with country code', () => {
      expect(service.isValidDomain('example.co.uk')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(service.isValidDomain('')).toBe(false);
    });

    it('should return false for whitespace only', () => {
      expect(service.isValidDomain('   ')).toBe(false);
    });

    it('should return false for domain without TLD', () => {
      expect(service.isValidDomain('localhost')).toBe(false);
    });

    it('should return false for invalid characters', () => {
      expect(service.isValidDomain('invalid_domain.com')).toBe(false);
    });

    it('should handle domain with protocol', () => {
      expect(service.isValidDomain('https://example.com')).toBe(true);
    });

    it('should handle domain with www', () => {
      expect(service.isValidDomain('www.example.com')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle international domains', () => {
      const domain = 'example.co.jp';
      const url = service.getCompanyLogo(domain);
      
      expect(url).toBe('https://logo.clearbit.com/example.co.jp');
    });

    it('should handle very long TLDs', () => {
      const domain = 'example.technology';
      const url = service.getCompanyLogo(domain);
      
      expect(url).toBe('https://logo.clearbit.com/example.technology');
    });

    it('should handle multiple subdomains', () => {
      const domain = 'api.dev.example.com';
      const url = service.getCompanyLogo(domain);
      
      expect(url).toBe('https://logo.clearbit.com/api.dev.example.com');
    });
  });
});
