import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { ContactMessageDTO } from '../../models/dtos';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  whatsappNumber = '+91 74478 39781';
  companyEmail = 'webvibestechnology@gmail.com';

  constructor(private fb: FormBuilder, private contactService: ContactService, private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Contact Us — Enquire About Courses, Internships & Services',
      description: 'Contact WebVibes Technology for IT course enrollment, internship applications, web development projects, or SEO services. WhatsApp: +91 74478 39781. Email: webvibestechnology@gmail.com',
      keywords: 'contact WebVibes Technology, IT training enquiry, course enrollment, internship application, web development enquiry, SEO services contact, software training contact India',
      canonical: 'https://www.webvibestechnology.in/contact'
    });
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get message() { return this.contactForm.get('message'); }

  onSubmit(): void {
    if (this.contactForm.invalid || this.isSubmitting) return;
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const contactData: ContactMessageDTO = this.contactForm.value;
    this.contactService.submitContactForm(contactData).subscribe({
      next: () => {
        this.successMessage = 'Message sent successfully! We will get back to you soon.';
        this.contactForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to send message. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  getWhatsAppLink(): string {
    return `https://wa.me/${this.whatsappNumber.replace(/[^0-9]/g, '')}`;
  }

  getMailtoLink(): string {
    return `mailto:${this.companyEmail}`;
  }
}
