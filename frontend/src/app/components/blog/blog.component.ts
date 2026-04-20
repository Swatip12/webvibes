import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  searchQuery = '';
  selectedCategory = 'all';

  categories = [
    { value: 'all', label: 'All', icon: 'fas fa-th' },
    { value: 'Interview Questions', label: 'Interview Questions', icon: 'fas fa-question-circle' },
    { value: 'Tutorials', label: 'Tutorials', icon: 'fas fa-book-open' },
    { value: 'Career Guidance', label: 'Career Guidance', icon: 'fas fa-compass' },
    { value: 'Project Ideas', label: 'Project Ideas', icon: 'fas fa-lightbulb' }
  ];

  posts: BlogPost[] = [
    // Interview Questions
    {
      id: 1,
      title: 'Top 50 Java Interview Questions for Freshers (2024)',
      excerpt: 'Comprehensive list of Java interview questions covering OOP, collections, multithreading, and Spring Boot — with answers to help you crack your first IT job.',
      category: 'Interview Questions',
      date: 'Apr 15, 2026',
      readTime: '12 min read',
      tags: ['Java', 'OOP', 'Spring Boot', 'Freshers'],
      featured: true
    },
    {
      id: 2,
      title: 'SQL Interview Questions Every Developer Must Know',
      excerpt: 'From basic SELECT queries to complex JOINs, subqueries, and stored procedures — master these SQL questions before your next technical interview.',
      category: 'Interview Questions',
      date: 'Apr 10, 2026',
      readTime: '10 min read',
      tags: ['SQL', 'MySQL', 'Database', 'Interview']
    },
    {
      id: 3,
      title: 'Angular Interview Questions: Components, Services & RxJS',
      excerpt: 'Prepare for Angular interviews with questions on components, directives, services, dependency injection, and reactive programming with RxJS.',
      category: 'Interview Questions',
      date: 'Apr 5, 2026',
      readTime: '9 min read',
      tags: ['Angular', 'TypeScript', 'RxJS', 'Frontend']
    },
    {
      id: 4,
      title: 'Software Testing Interview Questions for QA Engineers',
      excerpt: 'Manual testing, automation testing with Selenium, test case writing, bug lifecycle — everything a QA fresher needs to prepare for interviews.',
      category: 'Interview Questions',
      date: 'Mar 28, 2026',
      readTime: '8 min read',
      tags: ['Testing', 'Selenium', 'QA', 'Manual Testing']
    },
    // Tutorials
    {
      id: 5,
      title: 'Build a REST API with Spring Boot and MySQL — Step by Step',
      excerpt: 'Learn to build a production-ready REST API from scratch using Spring Boot, JPA, and MySQL. Covers CRUD operations, validation, and error handling.',
      category: 'Tutorials',
      date: 'Apr 18, 2026',
      readTime: '15 min read',
      tags: ['Spring Boot', 'REST API', 'MySQL', 'Java']
    },
    {
      id: 6,
      title: 'Getting Started with Angular 15: Components & Routing',
      excerpt: 'A beginner-friendly guide to Angular — setting up your project, creating components, using Angular Router, and making HTTP calls with HttpClient.',
      category: 'Tutorials',
      date: 'Apr 12, 2026',
      readTime: '11 min read',
      tags: ['Angular', 'TypeScript', 'Routing', 'Beginner']
    },
    {
      id: 7,
      title: 'Python for Beginners: Variables, Loops & Functions',
      excerpt: 'Start your Python journey with this hands-on tutorial covering data types, control flow, functions, and file handling with practical examples.',
      category: 'Tutorials',
      date: 'Apr 8, 2026',
      readTime: '10 min read',
      tags: ['Python', 'Beginner', 'Programming', 'Basics']
    },
    {
      id: 8,
      title: 'Git & GitHub for Developers: Complete Beginner Guide',
      excerpt: 'Learn version control with Git — init, commit, branch, merge, pull requests, and how to collaborate on GitHub like a professional developer.',
      category: 'Tutorials',
      date: 'Mar 30, 2026',
      readTime: '8 min read',
      tags: ['Git', 'GitHub', 'Version Control', 'DevOps']
    },
    // Career Guidance
    {
      id: 9,
      title: 'How to Get Your First IT Job as a Fresher in Pune',
      excerpt: 'A practical roadmap for BCA, MCA, and BE graduates — from building your resume and portfolio to cracking technical interviews and landing your first offer.',
      category: 'Career Guidance',
      date: 'Apr 17, 2026',
      readTime: '7 min read',
      tags: ['Career', 'Fresher', 'Job Search', 'Pune']
    },
    {
      id: 10,
      title: 'Full Stack vs Backend vs Frontend: Which Path to Choose?',
      excerpt: 'Confused about which development track to pursue? We break down the skills, salaries, and career growth for Full Stack, Backend, and Frontend roles.',
      category: 'Career Guidance',
      date: 'Apr 11, 2026',
      readTime: '6 min read',
      tags: ['Career', 'Full Stack', 'Backend', 'Frontend']
    },
    {
      id: 11,
      title: 'Why Internship Experience Matters More Than Your Degree',
      excerpt: 'Recruiters reveal what they actually look for in freshers. Spoiler: it\'s not your CGPA. Here\'s how real project experience changes everything.',
      category: 'Career Guidance',
      date: 'Apr 3, 2026',
      readTime: '5 min read',
      tags: ['Internship', 'Career', 'Resume', 'Placement']
    },
    {
      id: 12,
      title: 'How to Build a Developer Portfolio That Gets You Hired',
      excerpt: 'Step-by-step guide to creating a portfolio that showcases your projects, skills, and GitHub activity — with templates and real examples.',
      category: 'Career Guidance',
      date: 'Mar 25, 2026',
      readTime: '8 min read',
      tags: ['Portfolio', 'GitHub', 'Career', 'Projects']
    },
    // Project Ideas
    {
      id: 13,
      title: '10 Java Spring Boot Project Ideas for Your Resume',
      excerpt: 'From student management systems to e-commerce platforms — 10 real-world Spring Boot project ideas with tech stack suggestions and GitHub tips.',
      category: 'Project Ideas',
      date: 'Apr 16, 2026',
      readTime: '6 min read',
      tags: ['Java', 'Spring Boot', 'Projects', 'Resume']
    },
    {
      id: 14,
      title: 'Angular Project Ideas for Beginners to Intermediate Developers',
      excerpt: 'Build a task manager, weather app, quiz platform, or e-commerce UI — 8 Angular project ideas that will strengthen your frontend skills.',
      category: 'Project Ideas',
      date: 'Apr 9, 2026',
      readTime: '5 min read',
      tags: ['Angular', 'Frontend', 'Projects', 'Portfolio']
    },
    {
      id: 15,
      title: 'Python Project Ideas: From Beginner to Advanced',
      excerpt: 'Calculator, web scraper, chatbot, data dashboard — 12 Python project ideas categorized by difficulty to help you build a strong portfolio.',
      category: 'Project Ideas',
      date: 'Apr 2, 2026',
      readTime: '7 min read',
      tags: ['Python', 'Projects', 'Data Science', 'Automation']
    },
    {
      id: 16,
      title: 'Full Stack Project: Build a Student Management System',
      excerpt: 'A complete walkthrough of building a full-stack student management system using Spring Boot (backend), Angular (frontend), and MySQL (database).',
      category: 'Project Ideas',
      date: 'Mar 22, 2026',
      readTime: '14 min read',
      tags: ['Full Stack', 'Spring Boot', 'Angular', 'MySQL']
    }
  ];

  filteredPosts: BlogPost[] = [];
  featuredPost: BlogPost | undefined;

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setPage({
      title: 'IT Training Blog | Interview Questions, Tutorials & Career Guidance — WebVibes Technology',
      description: 'Free IT training resources from WebVibes Technology. Java interview questions, Spring Boot tutorials, career guidance for freshers, and project ideas to build your portfolio.',
      keywords: 'IT training blog, Java interview questions, Spring Boot tutorial, Angular tutorial, career guidance for freshers, IT project ideas, software testing interview questions, Python tutorial Pune',
      canonical: 'https://www.webvibestechnology.in/blog'
    });
    this.featuredPost = this.posts.find(p => p.featured);
    this.applyFilters();
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.posts];
    if (this.selectedCategory !== 'all') {
      result = result.filter(p => p.category === this.selectedCategory);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    this.filteredPosts = result;
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.applyFilters();
  }

  getCatColor(category: string): string {
    const map: Record<string, string> = {
      'Interview Questions': '#ede9fe',
      'Tutorials': '#dbeafe',
      'Career Guidance': '#d1fae5',
      'Project Ideas': '#fef3c7'
    };
    return map[category] || '#f3f4f6';
  }

  getCatGradient(category: string): string {
    const map: Record<string, string> = {
      'Interview Questions': 'linear-gradient(135deg, #7c3aed, #6366f1)',
      'Tutorials': 'linear-gradient(135deg, #2563eb, #0ea5e9)',
      'Career Guidance': 'linear-gradient(135deg, #059669, #10b981)',
      'Project Ideas': 'linear-gradient(135deg, #d97706, #f59e0b)'
    };
    return map[category] || 'linear-gradient(135deg, #6366f1, #8b5cf6)';
  }

  getCatIcon(category: string): string {
    const map: Record<string, string> = {
      'Interview Questions': 'fas fa-question-circle',
      'Tutorials': 'fas fa-book-open',
      'Career Guidance': 'fas fa-compass',
      'Project Ideas': 'fas fa-lightbulb'
    };
    return map[category] || 'fas fa-file-alt';
  }
}
