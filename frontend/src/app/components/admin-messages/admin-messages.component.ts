import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ContactMessageDTO } from '../../models/dtos';

@Component({
  selector: 'app-admin-messages',
  templateUrl: './admin-messages.component.html',
  styleUrls: ['./admin-messages.component.css']
})
export class AdminMessagesComponent implements OnInit {
  messages: ContactMessageDTO[] = [];
  loading = false;
  errorMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.adminService.getMessages().subscribe({
      next: (data) => { this.messages = data; this.loading = false; },
      error: () => { this.errorMessage = 'Failed to load messages'; this.loading = false; }
    });
  }
}
