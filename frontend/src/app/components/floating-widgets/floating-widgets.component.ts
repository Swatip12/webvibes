import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-floating-widgets',
  templateUrl: './floating-widgets.component.html',
  styleUrls: ['./floating-widgets.component.css']
})
export class FloatingWidgetsComponent {

  showPopup = false;
  submitted = false;
  submitting = false;
  errorMsg = '';

  form = {
    name: '',
    email: '',
    mobile: '',
    course: '',
    qualification: '',
    message: ''
  };

  readonly waNumber = '917447839781';
  readonly waLink = `https://wa.me/917447839781?text=Hi%20WebVibes%20Technology%2C%20I%20am%20interested%20in%20the%20internship%20program.%20Please%20share%20details.`;

  constructor(private http: HttpClient) {}

  openPopup(): void  { this.showPopup = true; }
  closePopup(): void { this.showPopup = false; this.submitted = false; this.errorMsg = ''; }

  submitForm(): void {
    if (!this.form.name || !this.form.email || !this.form.mobile || !this.form.course) return;
    this.submitting = true;
    this.errorMsg = '';

    // Send via WhatsApp message as fallback (no backend needed)
    const msg = encodeURIComponent(
      `*Internship Application*\n` +
      `Name: ${this.form.name}\n` +
      `Email: ${this.form.email}\n` +
      `Mobile: ${this.form.mobile}\n` +
      `Course: ${this.form.course}\n` +
      `Qualification: ${this.form.qualification}\n` +
      `Message: ${this.form.message}`
    );
    window.open(`https://wa.me/${this.waNumber}?text=${msg}`, '_blank');
    this.submitting = false;
    this.submitted = true;
  }
}
