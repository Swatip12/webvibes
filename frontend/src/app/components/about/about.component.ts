import { Component } from '@angular/core';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  // Unsplash images for institute/instructors/facilities
  instituteImage: string;
  facilitiesImage: string;
  
  // Team members with instructor images
  teamMembers = [
    {
      name: 'Rajesh Kumar',
      role: 'Senior Java Instructor',
      bio: '15+ years of experience at TCS and Infosys. Expert in Java, Spring Boot, and enterprise architecture.',
      image: ''
    },
    {
      name: 'Priya Sharma',
      role: 'Full Stack Lead',
      bio: '12+ years at Wipro and Cognizant. Specializes in Angular, React, and modern web development.',
      image: ''
    },
    {
      name: 'Amit Patel',
      role: 'Angular Specialist',
      bio: '10+ years at Accenture and HCL. Expert in TypeScript, Angular, and frontend architecture.',
      image: ''
    },
    {
      name: 'Sneha Reddy',
      role: 'Database Expert',
      bio: '13+ years at Tech Mahindra. Specializes in MySQL, PostgreSQL, and database optimization.',
      image: ''
    }
  ];

  // Statistics for achievements section
  statistics = [
    { value: '2000+', label: 'Students Trained' },
    { value: '95%', label: 'Placement Rate' },
    { value: '50+', label: 'Hiring Partners' },
    { value: '15+', label: 'Years Experience' }
  ];

  constructor(private imageService: ImageService) {
    // Get Unsplash images for institute and facilities
    this.instituteImage = this.imageService.getImage('technology institute classroom', 1200, 600);
    this.facilitiesImage = this.imageService.getImage('modern office workspace', 800, 500);
    
    // Get instructor images
    this.teamMembers[0].image = this.imageService.getImage('professional indian male instructor', 400, 400);
    this.teamMembers[1].image = this.imageService.getImage('professional indian female instructor', 400, 400);
    this.teamMembers[2].image = this.imageService.getImage('professional indian male teacher', 400, 400);
    this.teamMembers[3].image = this.imageService.getImage('professional indian female teacher', 400, 400);
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Fallback to a gradient background
    img.style.display = 'none';
  }
}
