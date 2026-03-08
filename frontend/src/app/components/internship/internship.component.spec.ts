import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { InternshipComponent } from './internship.component';

describe('InternshipComponent', () => {
  let component: InternshipComponent;
  let fixture: ComponentFixture<InternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternshipComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternshipComponent);
    component = fixture.componentInstance;
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
});
