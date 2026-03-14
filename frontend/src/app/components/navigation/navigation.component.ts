import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  isMenuCollapsed = true;
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 0;
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    // Lock/unlock body scroll when menu opens/closes on mobile
    if (!this.isMenuCollapsed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu(): void {
    this.isMenuCollapsed = true;
    // Unlock body scroll when menu closes
    document.body.style.overflow = '';
  }
}
