import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { InternshipComponent } from './internship.component';
import { InternshipService } from '../../services/internship.service';
import { of, throwError } from 'rxjs';

describe('InternshipComponent', () => {
  let component: InternshipComponent;
  let fixture: ComponentFixture<InternshipComponent>;
  let internshipService: jasmine.SpyObj<InternshipService>;

  beforeEach(async () => {
    const internshipServiceSpy = jasmine.createSpyObj('InternshipService', ['submitApplication']);
    
    await TestBed.configureTestingModule({
      declarations: [ InternshipComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: InternshipService, useValue: internshipServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternshipComponent);
    component = fixture.componentInstance;
    internshipService = TestBed.inject(InternshipService) as jasmine.SpyObj<InternshipService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize application form with empty values', () => {
    expect(component.applicationForm).toBeDefined();
    expect(component.applicationForm.get('studentName')?.value).toBe('');
    expect(component.applicationForm.get('email')?.value).toBe('');
    expect(component.applicationForm.get('phone')?.value).toBe('');
    expect(component.applicationForm.get('internshipType')?.value).toBe('');
    expect(component.applicationForm.get('message')?.value).toBe('');
  });

  it('should pre-fill internshipType when onApply is called', () => {
    const internshipType = 'Java Internship';
    component.onApply(internshipType);
    
    expect(component.selectedInternship).toBe(internshipType);
    expect(component.showApplicationForm).toBe(true);
    expect(component.applicationForm.get('internshipType')?.value).toBe(internshipType);
  });

  it('should show application form when onApply is called', () => {
    expect(component.showApplicationForm).toBe(false);
    
    component.onApply('Java Internship');
    
    expect(component.showApplicationForm).toBe(true);
  });

  it('should validate required fields', () => {
    const form = component.applicationForm;
    
    expect(form.valid).toBe(false);
    
    form.patchValue({
      studentName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      internshipType: 'Java Internship'
    });
    
    expect(form.valid).toBe(true);
  });

  it('should validate email format', () => {
    const emailControl = component.applicationForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);
    
    emailControl?.setValue('valid@example.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should validate phone pattern (10-15 digits)', () => {
    const phoneControl = component.applicationForm.get('phone');
    
    phoneControl?.setValue('123');
    expect(phoneControl?.hasError('pattern')).toBe(true);
    
    phoneControl?.setValue('12345678901234567890');
    expect(phoneControl?.hasError('pattern')).toBe(true);
    
    phoneControl?.setValue('1234567890');
    expect(phoneControl?.hasError('pattern')).toBe(false);
  });

  it('should validate studentName length constraints', () => {
    const nameControl = component.applicationForm.get('studentName');
    
    nameControl?.setValue('A');
    expect(nameControl?.hasError('minlength')).toBe(true);
    
    nameControl?.setValue('A'.repeat(101));
    expect(nameControl?.hasError('maxlength')).toBe(true);
    
    nameControl?.setValue('John Doe');
    expect(nameControl?.valid).toBe(true);
  });

  it('should validate message length constraint', () => {
    const messageControl = component.applicationForm.get('message');
    
    messageControl?.setValue('A'.repeat(501));
    expect(messageControl?.hasError('maxlength')).toBe(true);
    
    messageControl?.setValue('This is a valid message');
    expect(messageControl?.valid).toBe(true);
  });

  it('should reset form and hide it when onCancel is called', () => {
    component.onApply('Java Internship');
    component.applicationForm.patchValue({
      studentName: 'John Doe',
      email: 'john@example.com'
    });
    
    component.onCancel();
    
    expect(component.showApplicationForm).toBe(false);
    expect(component.applicationForm.get('studentName')?.value).toBe(null);
    expect(component.applicationForm.get('email')?.value).toBe(null);
  });

  it('should have form invalid when required fields are empty', () => {
    expect(component.applicationForm.invalid).toBe(true);
  });

  it('should have form valid when all required fields are filled correctly', () => {
    component.applicationForm.patchValue({
      studentName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      internshipType: 'Java Internship',
      message: 'I am interested in this internship'
    });
    
    expect(component.applicationForm.valid).toBe(true);
  });

  // Task 15.3: Form submission and feedback tests
  it('should call InternshipService.submitApplication on form submit', () => {
    internshipService.submitApplication.and.returnValue(of({ message: 'Success' }));
    
    component.applicationForm.patchValue({
      studentName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      internshipType: 'Java Internship',
      message: 'I am interested'
    });
    
    component.onSubmit();
    
    expect(internshipService.submitApplication).toHaveBeenCalledWith(component.applicationForm.value);
  });

  it('should display success message on successful submission', () => {
    internshipService.submitApplication.and.returnValue(of({ message: 'Success' }));
    
    component.applicationForm.patchValue({
      studentName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      internshipType: 'Java Internship'
    });
    
    component.onSubmit();
    
    expect(component.successMessage).toBe('Application submitted successfully! We will contact you soon.');
    expect(component.errorMessage).toBe('');
  });

  it('should display error message on submission failure', () => {
    const errorMessage = 'Network error occurred';
    internshipService.submitApplication.and.returnValue(
      throwError(() => ({ message: errorMessage }))
    );
    
    component.applicationForm.patchValue({
      studentName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      internshipType: 'Java Internship'
    });
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe(errorMessage);
    expect(component.successMessage).toBe('');
  });

  it('should reset form after successful submission', () => {
    internshipService.submitApplication.and.returnValue(of({ message: 'Success' }));
    
    component.applicationForm.patchValue({
      studentName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      internshipType: 'Java Internship',
      message: 'I am interested'
    });
    
    component.onSubmit();
    
    expect(component.applicationForm.get('studentName')?.value).toBe(null);
    expect(component.applicationForm.get('email')?.value).toBe(null);
    expect(component.applicationForm.get('phone')?.value).toBe(null);
  });

  it('should not submit form when form is invalid', () => {
    internshipService.submitApplication.and.returnValue(of({ message: 'Success' }));
    
    // Leave form empty (invalid)
    component.onSubmit();
    
    expect(internshipService.submitApplication).not.toHaveBeenCalled();
  });

  it('should clear messages when onApply is called', () => {
    component.successMessage = 'Previous success';
    component.errorMessage = 'Previous error';
    
    component.onApply('Java Internship');
    
    expect(component.successMessage).toBe('');
    expect(component.errorMessage).toBe('');
  });

  it('should clear messages before form submission', () => {
    internshipService.submitApplication.and.returnValue(of({ message: 'Success' }));
    
    component.successMessage = 'Old success';
    component.errorMessage = 'Old error';
    
    component.applicationForm.patchValue({
      studentName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      internshipType: 'Java Internship'
    });
    
    component.onSubmit();
    
    // Messages should be cleared before submission
    expect(component.successMessage).toBe('Application submitted successfully! We will contact you soon.');
    expect(component.errorMessage).toBe('');
  });
});
