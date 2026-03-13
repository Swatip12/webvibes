import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { JwtAuthResponse, AdminUser } from '../models/dtos';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + '/api/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should authenticate user and store token and user info', () => {
      const mockResponse: JwtAuthResponse = {
        token: 'mock.jwt.token',
        type: 'Bearer',
        username: 'admin',
        role: 'ROLE_ADMIN'
      };

      service.login('admin', 'password').subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.getToken()).toBe('mock.jwt.token');
        expect(service.getCurrentUser()).toEqual({
          username: 'admin',
          role: 'ROLE_ADMIN'
        });
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'admin', password: 'password' });
      req.flush(mockResponse);
    });

    it('should update currentUser BehaviorSubject on successful login', (done) => {
      const mockResponse: JwtAuthResponse = {
        token: 'mock.jwt.token',
        type: 'Bearer',
        username: 'admin',
        role: 'ROLE_ADMIN'
      };

      service.currentUser.subscribe(user => {
        if (user) {
          expect(user.username).toBe('admin');
          expect(user.role).toBe('ROLE_ADMIN');
          done();
        }
      });

      service.login('admin', 'password').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should clear token and user from localStorage', () => {
      localStorage.setItem('jwt_token', 'test-token');
      localStorage.setItem('current_user', JSON.stringify({ username: 'admin', role: 'ROLE_ADMIN' }));

      service.logout();

      expect(localStorage.getItem('jwt_token')).toBeNull();
      expect(localStorage.getItem('current_user')).toBeNull();
    });

    it('should set currentUser to null', (done) => {
      service.logout();
      
      service.currentUser.subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('jwt_token', 'test-token');
      expect(service.getToken()).toBe('test-token');
    });

    it('should return null if no token exists', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false if no token exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false if token is expired', () => {
      // Create an expired token (exp in the past)
      const expiredPayload = { exp: Math.floor(Date.now() / 1000) - 3600 }; // 1 hour ago
      const expiredToken = 'header.' + btoa(JSON.stringify(expiredPayload)) + '.signature';
      localStorage.setItem('jwt_token', expiredToken);

      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return true if token is valid and not expired', () => {
      // Create a valid token (exp in the future)
      const validPayload = { exp: Math.floor(Date.now() / 1000) + 3600 }; // 1 hour from now
      const validToken = 'header.' + btoa(JSON.stringify(validPayload)) + '.signature';
      localStorage.setItem('jwt_token', validToken);

      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false if token format is invalid', () => {
      localStorage.setItem('jwt_token', 'invalid-token');
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from localStorage', () => {
      const user: AdminUser = { username: 'admin', role: 'ROLE_ADMIN' };
      localStorage.setItem('current_user', JSON.stringify(user));

      expect(service.getCurrentUser()).toEqual(user);
    });

    it('should return null if no user exists', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return null if user data is invalid JSON', () => {
      localStorage.setItem('current_user', 'invalid-json');
      expect(service.getCurrentUser()).toBeNull();
    });
  });
});
