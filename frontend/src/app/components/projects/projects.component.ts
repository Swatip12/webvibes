import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ProjectDTO } from '../../models/dtos';

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

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.filteredProjects = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load projects. Please check your connection.';
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
