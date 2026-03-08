import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContactMessageDTO } from '../models/dtos';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  submitContactForm(contact: ContactMessageDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/contact`, contact);
  }
}
