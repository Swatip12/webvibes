import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContactService } from './contact.service';
import { ContactMessageDTO } from '../models/dtos';
import { environment } from '../../environments/environment';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService]
    });

    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request to /api/contact', () => {
    const mockContact: ContactMessageDTO = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'I would like to know more about your courses'
    };

    const mockResponse = { message: 'Message sent successfully' };

    service.submitContactForm(mockContact).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/contact`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockContact);

    req.flush(mockResponse);
  });

  it('should handle error response', () => {
    const mockContact: ContactMessageDTO = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message'
    };

    const mockError = { message: 'Validation failed' };

    service.submitContactForm(mockContact).subscribe({
      next: () => fail('should have failed with 400 error'),
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/contact`);
    req.flush(mockError, { status: 400, statusText: 'Bad Request' });
  });
});
