import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  // Images — direct Unsplash URLs with relevant IT/coding content
  heroImage       = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&h=600&fit=crop&q=80';
  // Why section — developer typing code (option C)
  whyImage        = 'https://images.unsplash.com/photo-1555066931-bf19f8fd1085?w=700&h=500&fit=crop&q=80';
  founderImage    = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80';
  facilitiesImage = 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=1200&h=400&fit=crop&q=80';

  whyPoints = [
    {
      icon: 'fas fa-user-graduate',
      title: 'Freshers Struggle to Get Hired',
      desc: 'Most freshers have theoretical knowledge but zero hands-on project experience — exactly what companies look for on day one.'
    },
    {
      icon: 'fas fa-code',
      title: 'Industry-Ready Skill Gap',
      desc: 'College curricula lag behind industry needs. We teach the exact tools, frameworks, and practices companies use right now.'
    },
    {
      icon: 'fas fa-project-diagram',
      title: 'No Real Project Experience',
      desc: 'Every student at WebVibes builds real projects they can showcase in interviews — not just assignments, but portfolio-worthy work.'
    },
    {
      icon: 'fas fa-briefcase',
      title: 'Resume & Interview Coaching',
      desc: 'We prepare students for the full hiring process — resume building, mock interviews, aptitude tests, and HR rounds.'
    },
    {
      icon: 'fas fa-network-wired',
      title: 'Direct Hiring Network',
      desc: 'Our 50+ hiring partner network means students get direct referrals and placement drives, not just job board links.'
    },
    {
      icon: 'fas fa-hands-helping',
      title: 'Mentorship Beyond Training',
      desc: 'Our mentors stay connected even after course completion — guiding students through their first job and beyond.'
    }
  ];

  facilities = [
    {
      icon: 'fas fa-desktop',
      title: 'Modern Computer Labs',
      desc: 'Latest hardware and software setups so students always work with current industry tools.'
    },
    {
      icon: 'fas fa-wifi',
      title: 'High-Speed Internet',
      desc: 'Uninterrupted high-speed connectivity for seamless coding, cloud access, and live sessions.'
    },
    {
      icon: 'fas fa-clock',
      title: '24/7 Lab Access',
      desc: 'Students can practice anytime — no restrictions on lab hours so learning never stops.'
    },
    {
      icon: 'fas fa-chalkboard-teacher',
      title: 'Smart Classrooms',
      desc: 'Interactive boards, projectors, and live coding environments for engaging sessions.'
    },
    {
      icon: 'fas fa-book',
      title: 'Technical Library',
      desc: 'Curated collection of books, e-resources, and course materials available to all students.'
    },
    {
      icon: 'fas fa-comments',
      title: 'Doubt Clearing Sessions',
      desc: 'Dedicated one-on-one and group doubt sessions so no student is ever left behind.'
    }
  ];


  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  handleFounderImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Replace with initials fallback
    img.style.display = 'none';
    const wrap = img.parentElement;
    if (wrap) {
      const fallback = document.createElement('div');
      fallback.className = 'ab-founder-initials';
      fallback.textContent = 'WV';
      wrap.appendChild(fallback);
    }
  }
}
