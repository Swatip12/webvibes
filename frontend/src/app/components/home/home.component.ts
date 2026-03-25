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

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
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

  testimonials: Testimonial[] = [
    {
      name: 'Priya S.',
      role: 'Full Stack Developer',
      text: 'After completing the Full Stack Java course at WebVibes, I landed my first job within 2 months. The real project experience made all the difference in interviews.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=b6e3f4'
    },
    {
      name: 'Rahul M.',
      role: 'Internship Graduate',
      text: 'The internship program was exactly what I needed. I worked on live client projects, got a certificate and a letter of recommendation. Highly recommend!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul&backgroundColor=ffd5dc'
    },
    {
      name: 'Sneha K.',
      role: 'Angular Developer',
      text: 'WebVibes gave me hands-on Angular training that no college course could. The mentors are industry professionals who know exactly what companies look for.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha&backgroundColor=c0aede'
    },
    {
      name: 'Amit B.',
      role: 'Industrial Training',
      text: 'I came from a non-technical background and wanted to switch to IT. The industrial training program at WebVibes made that transition smooth and practical.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit&backgroundColor=d1f4e0'
    },
    {
      name: 'Mohini G.',
      role: 'Android Developer',
      text: 'The mobile app development course was brilliant. I built 3 real Android apps during training and deployed one to the Play Store. Amazing experience!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohini&backgroundColor=ffdfbf'
    },
    {
      name: 'Shalini P.',
      role: 'Spring Boot Developer',
      text: 'WebVibes Technology helped me crack interviews at top MNCs. The placement assistance and mock interviews were incredibly helpful. Got placed in 45 days!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shalini&backgroundColor=b6e3f4'
    },
    {
      name: 'Vikram T.',
      role: 'SEO & Web Client',
      text: 'We hired WebVibes for our company website and SEO. Within 3 months our Google ranking improved significantly. Professional team, great results.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram&backgroundColor=ffd5dc'
    },
    {
      name: 'Neha R.',
      role: 'Custom Website Client',
      text: 'They built our business website from scratch — responsive, fast, and exactly what we envisioned. Delivered on time and within budget. Very satisfied!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha&backgroundColor=c0aede'
    }
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

  handleAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4';
  }
}
