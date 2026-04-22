import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';

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
  initials: string;
  color: string;
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
      description: '100% practical project-based training & internship'
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
      initials: 'PS',
      color: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      text: 'After completing the Full Stack Java course at WebVibes, I landed my first job within 2 months. The real project experience made all the difference in interviews.'
    },
    {
      name: 'Rahul M.',
      role: 'Internship Graduate',
      initials: 'RM',
      color: 'linear-gradient(135deg, #e63946, #c1121f)',
      text: 'The internship program was exactly what I needed. I worked on live client projects, got a certificate and a letter of recommendation. Highly recommend!'
    },
    {
      name: 'Sneha K.',
      role: 'Angular Developer',
      initials: 'SK',
      color: 'linear-gradient(135deg, #0ea5e9, #0891b2)',
      text: 'WebVibes gave me hands-on Angular training that no college course could. The mentors are industry professionals who know exactly what companies look for.'
    },
    {
      name: 'Amit B.',
      role: 'Industrial Training',
      initials: 'AB',
      color: 'linear-gradient(135deg, #10b981, #059669)',
      text: 'I came from a non-technical background and wanted to switch to IT. The industrial training program at WebVibes made that transition smooth and practical.'
    },
    {
      name: 'Mohini G.',
      role: 'Android Developer',
      initials: 'MG',
      color: 'linear-gradient(135deg, #f59e0b, #d97706)',
      text: 'The mobile app development course was brilliant. I built 3 real Android apps during training and deployed one to the Play Store. Amazing experience!'
    },
    {
      name: 'Shalini P.',
      role: 'Spring Boot Developer',
      initials: 'SP',
      color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      text: 'WebVibes Technology helped me crack interviews at top MNCs. The placement assistance and mock interviews were incredibly helpful. Got placed in 45 days!'
    },
    {
      name: 'Vikram T.',
      role: 'SEO & Web Client',
      initials: 'VT',
      color: 'linear-gradient(135deg, #e63946, #6366f1)',
      text: 'We hired WebVibes for our company website and SEO. Within 3 months our Google ranking improved significantly. Professional team, great results.'
    },
    {
      name: 'Neha R.',
      role: 'Custom Website Client',
      initials: 'NR',
      color: 'linear-gradient(135deg, #0891b2, #0ea5e9)',
      text: 'They built our business website from scratch — responsive, fast, and exactly what we envisioned. Delivered on time and within budget. Very satisfied!'
    }
  ];

  constructor(private seo: SeoService) { }

  ngOnInit(): void {
    this.seo.setPage({
      title: 'WebVibes Technology | All IT Courses, Internship & Live Project Training in Pune',
      description: 'WebVibes Technology — Best IT training institute in Pune. All IT courses (Java, Python, Full Stack, Testing, SQL), internship with live projects, website development. Job-oriented training for BCA, MCA, BE, BSc IT students. 500+ placed, 95% placement rate. webvibestechnology.in',
      keywords: 'WebVibes Technology, webvibestechnology, webvibes technology, webvibestechnology.in, IT courses in Pune, IT training institute Pune, IT internship Pune, software training institute Pune, Java course Pune, Python course Pune, full stack development Pune, web development company Pune, internship with live projects Pune, industrial training Pune, BCA MCA training Pune, job oriented IT courses Pune, software testing course Pune, website development Pune',
      canonical: 'https://www.webvibestechnology.in/'
    });
  }

  getCompanyLogo(domain: string): string {
    // Use placeholder images for company logos
    return `https://via.placeholder.com/140x60/2196F3/FFFFFF?text=${encodeURIComponent(domain.split('.')[0].toUpperCase())}`;
  }

  getFeatureImage(index: number): string {
    const imgs = [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=80'
    ];
    return imgs[index % imgs.length];
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
