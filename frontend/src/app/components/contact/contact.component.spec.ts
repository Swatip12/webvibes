import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ContactComponent } from './contact.component';
import { ContactService } from '../../services/contact.service';
import { ContactMessageDTO } from '../../models/dtos';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let contactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    const contactServiceSpy = jasmine.createSpyObj('ContactService', ['submitContactForm']);

    await TestBed.configureTestingModule({
      declarations: [ ContactComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: ContactService, useValue: contactServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    contactService = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.contactForm).toBeDefined();
    expect(component.contactForm.get('name')?.value).toBe('');
    expect(component.contactForm.get('email')?.value).toBe('');
    expect(component.contactForm.get('message')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.contactForm;
    expect(form.valid).toBeFalsy();

    form.get('name')?.setValue('John Doe');
    form.get('email')?.setValue('john@example.com');
    form.get('message')?.setValue('This is a test message');

    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.contactForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@example.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate name minimum length', () => {
    const nameControl = component.contactForm.get('name');
    
    nameControl?.setValue('A');
    expect(nameControl?.hasError('minlength')).toBeTruthy();

    nameControl?.setValue('John');
    expect(nameControl?.hasError('minlength')).toBeFalsy();
  });

  it('should validate message minimum length', () => {
    const messageControl = component.contactForm.get('message');
    
    messageControl?.setValue('Short');
    expect(messageControl?.hasError('minlength')).toBeTruthy();

    messageControl?.setValue('This is a longer message that meets the minimum requirement');
    expect(messageControl?.hasError('minlength')).toBeFalsy();
  });

  it('should call ContactService.submitContactForm on form submit', () => {
    const mockResponse = { message: 'Success' };
    contactService.submitContactForm.and.returnValue(of(mockResponse));

    component.contactForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message'
    });

    component.onSubmit();

    expect(contactService.submitContactForm).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message'
    });
  });

  it('should display success message on successful submission', (done) => {
    const mockResponse = { message: 'Success' };
    contactService.submitContactForm.and.returnValue(of(mockResponse));

    component.contactForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message'
    });

    component.onSubmit();

    setTimeout(() => {
      expect(component.successMessage).toBe('Message sent successfully! We will get back to you soon.');
      expect(component.errorMessage).toBe('');
      done();
    }, 100);
  });

  it('should display error message on submission failure', (done) => {
    const mockError = new Error('Network error');
    contactService.submitContactForm.and.returnValue(throwError(() => mockError));

    component.contactForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message'
    });

    component.onSubmit();

    setTimeout(() => {
      expect(component.errorMessage).toBe('Network error');
      expect(component.successMessage).toBe('');
      done();
    }, 100);
  });

  it('should reset form after successful submission', (done) => {
    const mockResponse = { message: 'Success' };
    contactService.submitContactForm.and.returnValue(of(mockResponse));

    component.contactForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message'
    });

    component.onSubmit();

    setTimeout(() => {
      expect(component.contactForm.get('name')?.value).toBeNull();
      expect(component.contactForm.get('email')?.value).toBeNull();
      expect(component.contactForm.get('message')?.value).toBeNull();
      done();
    }, 100);
  });

  it('should not submit if form is invalid', () => {
    component.contactForm.setValue({
      name: '',
      email: 'invalid-email',
      message: 'Short'
    });

    component.onSubmit();

    expect(contactService.submitContactForm).not.toHaveBeenCalled();
  });

  it('should prevent multiple submissions', () => {
    const mockResponse = { message: 'Success' };
    contactService.submitContactForm.and.returnValue(of(mockResponse));

    component.contactForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message'
    });

    component.isSubmitting = true;
    component.onSubmit();

    expect(contactService.submitContactForm).not.toHaveBeenCalled();
  });

  it('should generate correct WhatsApp link', () => {
    component.whatsappNumber = '+1234567890';
    const link = component.getWhatsAppLink();
    expect(link).toBe('https://wa.me/1234567890');
  });

  it('should generate correct mailto link', () => {
    component.companyEmail = 'info@webvibes.com';
    const link = component.getMailtoLink();
    expect(link).toBe('mailto:info@webvibes.com');
  });
});
