import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { ContactMessageDTO } from '../../models/dtos';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  // WhatsApp and Email contact info
  whatsappNumber: string = '+1234567890'; // Replace with actual number
  companyEmail: string = 'info@webvibes.com'; // Replace with actual email

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      message: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]]
    });
  }

  // Getter methods for form controls
  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get message() {
    return this.contactForm.get('message');
  }

  onSubmit(): void {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.successMessage = '';
      this.errorMessage = '';

      const contactData: ContactMessageDTO = this.contactForm.value;

      this.contactService.submitContactForm(contactData).subscribe({
        next: (response) => {
          this.successMessage = 'Message sent successfully! We will get back to you soon.';
          this.errorMessage = '';
          this.contactForm.reset();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to send message. Please try again.';
          this.successMessage = '';
          this.isSubmitting = false;
        }
      });
    }
  }

  getWhatsAppLink(): string {
    return `https://wa.me/${this.whatsappNumber.replace(/[^0-9]/g, '')}`;
  }

  getMailtoLink(): string {
    return `mailto:${this.companyEmail}`;
  }
}
