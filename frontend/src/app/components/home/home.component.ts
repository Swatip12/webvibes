import { Component, OnInit } from '@angular/core';

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

interface CourseCard {
  title: string;
  description: string;
  logoUrl: string;
  logoBg: string;
  duration: string;
  studentsCount: number;
  badge: {
    text: string;
    type: 'bestseller' | 'trending' | 'new';
  };
}

interface Company {
  name: string;
  domain: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  features: FeatureCard[] = [
    {
      icon: 'fa-laptop-code',
      title: 'Industry-Focused Curriculum',
      description: 'Learn technologies used by top companies worldwide'
    },
    {
      icon: 'fa-chalkboard-teacher',
      title: 'Expert Instructors',
      description: 'Learn from professionals with 10+ years experience'
    },
    {
      icon: 'fa-project-diagram',
      title: 'Hands-On Projects',
      description: 'Build real-world projects for your portfolio'
    },
    {
      icon: 'fa-trophy',
      title: 'Placement Assistance',
      description: '100% placement support with interview prep'
    }
  ];

  courses: CourseCard[] = [
    {
      title: 'Full Stack Java Development',
      description: 'Master Java, Spring Boot, and build enterprise applications',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      logoBg: '#f89820',
      duration: '3 Months',
      studentsCount: 200,
      badge: { text: 'Bestseller', type: 'bestseller' }
    },
    {
      title: 'Python & Data Science',
      description: 'Learn Python, Data Analysis, and Machine Learning',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      logoBg: '#3776ab',
      duration: '4 Months',
      studentsCount: 150,
      badge: { text: 'Trending', type: 'trending' }
    },
    {
      title: 'MERN Stack Development',
      description: 'Build modern web apps with MongoDB, Express, React, Node.js',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      logoBg: '#20232a',
      duration: '3 Months',
      studentsCount: 180,
      badge: { text: 'New', type: 'new' }
    }
  ];

  companies: Company[] = [
    { name: 'TCS', domain: 'tcs.com' },
    { name: 'Infosys', domain: 'infosys.com' },
    { name: 'Wipro', domain: 'wipro.com' },
    { name: 'Cognizant', domain: 'cognizant.com' },
    { name: 'Accenture', domain: 'accenture.com' },
    { name: 'HCL', domain: 'hcltech.com' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Component initialization
  }

  getCompanyLogo(domain: string): string {
    // Use placeholder images for company logos
    return `https://via.placeholder.com/140x60/2196F3/FFFFFF?text=${encodeURIComponent(domain.split('.')[0].toUpperCase())}`;
  }

  handleImageError(event: Event, companyName: string): void {
    const img = event.target as HTMLImageElement;
    // Fallback: display company name as text
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      parent.innerHTML = `<span class="company-name-fallback">${companyName}</span>`;
    }
  }
}
