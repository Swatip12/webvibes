import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ProjectDTO } from '../../models/dtos';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: ProjectDTO[] = [];
  filteredProjects: ProjectDTO[] = [];
  loading = true;
  error: string | null = null;

  searchQuery = '';
  selectedCategory = 'All';

  categories = ['All', 'Web', 'Mobile', 'Data Science', 'AI/ML', 'Backend'];

  private accentColors = [
    '#7c3aed', '#2563eb', '#059669', '#dc2626', '#d97706', '#0891b2'
  ];

  private placeholderImages = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=80',
  ];

  constructor(private projectService: ProjectService, private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Student Projects — Real-World Web, Mobile & Data Science Projects',
      description: 'Explore real-world projects built by WebVibes Technology students — e-commerce platforms, student management systems, chat apps, Android apps, and ML projects using Java, Angular, Python, and more.',
      keywords: 'student projects portfolio, Java Spring Boot projects, Angular projects, Android app projects, Python machine learning projects, full stack projects, web development portfolio India',
      canonical: 'https://www.webvibestechnology.in/projects'
    });
    this.loadProjects();
  }

  private hardcodedProjects: ProjectDTO[] = [
    {
      id: undefined,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce application built with Spring Boot, Angular, and MySQL. Features product catalog, cart, order management, and payment integration.',
      githubLink: 'https://github.com/webvibestechnology',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80'
    },
    {
      id: undefined,
      title: 'Student Management System',
      description: 'Java Spring Boot REST API with Angular frontend for managing student records, attendance, grades, and course enrollment with role-based access control.',
      githubLink: 'https://github.com/webvibestechnology',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80'
    },
    {
      id: undefined,
      title: 'Real-Time Chat App',
      description: 'WebSocket-based real-time chat application using Spring Boot and Angular. Supports multiple rooms, private messaging, and file sharing.',
      githubLink: 'https://github.com/webvibestechnology',
      imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80'
    },
    {
      id: undefined,
      title: 'Task Management Dashboard',
      description: 'Kanban-style project management tool built with Angular and Node.js. Features drag-and-drop, team collaboration, deadlines, and progress tracking.',
      githubLink: 'https://github.com/webvibestechnology',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80'
    },
    {
      id: undefined,
      title: 'Android Expense Tracker',
      description: 'Mobile app built with Kotlin and Firebase for tracking personal expenses. Includes charts, budget alerts, category management, and cloud sync.',
      githubLink: 'https://github.com/webvibestechnology',
      imageUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80'
    },
    {
      id: undefined,
      title: 'ML Price Predictor',
      description: 'Python machine learning project using scikit-learn and pandas to predict house prices. Includes data preprocessing, model training, and a Flask REST API.',
      githubLink: 'https://github.com/webvibestechnology',
      imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=80'
    }
  ];

  loadProjects(): void {
    this.loading = true;
    this.error = null;
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          // Merge: DB projects first, then hardcoded ones not already in DB
          const dbTitles = new Set(data.map((p: ProjectDTO) => p.title.toLowerCase()));
          const uniqueHardcoded = this.hardcodedProjects.filter(p => !dbTitles.has(p.title.toLowerCase()));
          this.projects = [...data, ...uniqueHardcoded];
        } else {
          this.projects = [...this.hardcodedProjects];
        }
        this.filteredProjects = [...this.projects];
        this.loading = false;
      },
      error: () => {
        // API failed — show hardcoded data
        this.projects = [...this.hardcodedProjects];
        this.filteredProjects = [...this.projects];
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.projects];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    this.filteredProjects = result;
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.filteredProjects = [...this.projects];
  }

  getAccentColor(index: number): string {
    return this.accentColors[index % this.accentColors.length];
  }

  getPlaceholderImage(index: number): string {
    return this.placeholderImages[index % this.placeholderImages.length];
  }

  onImageError(event: Event, index: number): void {
    const img = event.target as HTMLImageElement;
    img.src = this.getPlaceholderImage(index);
  }

  getTags(project: ProjectDTO): string[] {
    // Extract tech keywords from description
    const keywords = ['Angular', 'React', 'Vue', 'Spring Boot', 'Node.js', 'Python',
      'Java', 'TypeScript', 'JavaScript', 'MongoDB', 'MySQL', 'PostgreSQL',
      'Docker', 'AWS', 'Firebase', 'Flutter', 'Django', 'FastAPI'];
    return keywords.filter(k =>
      project.description.toLowerCase().includes(k.toLowerCase()) ||
      project.title.toLowerCase().includes(k.toLowerCase())
    ).slice(0, 3);
  }
}
