import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonical?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly siteName = 'WebVibes Technology';
  private readonly baseUrl = 'https://webvibestechnology.vercel.app';

  constructor(private titleService: Title, private metaService: Meta) {}

  setPage(config: SeoConfig): void {
    const fullTitle = `${config.title} | ${this.siteName}`;
    this.titleService.setTitle(fullTitle);

    this.metaService.updateTag({ name: 'description', content: config.description });
    if (config.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: config.keywords });
    }

    this.metaService.updateTag({ property: 'og:title', content: config.ogTitle || fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: config.ogDescription || config.description });
    this.metaService.updateTag({ property: 'og:url', content: config.canonical || this.baseUrl });

    this.metaService.updateTag({ name: 'twitter:title', content: config.ogTitle || fullTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: config.ogDescription || config.description });
  }
}
