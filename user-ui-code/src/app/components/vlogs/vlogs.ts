import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Api } from '../../services/api';

@Component({
  selector: 'app-vlogs',
  standalone: false,
  templateUrl: './vlogs.html',
  styleUrl: './vlogs.css',
})
export class Vlogs {
vvvlogs: any[] = [];

constructor(private _api:Api, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // Temporary sample data (remove when API works)
    this.vvvlogs = [
      {
        title: 'Summer Skincare Routine 🌞',
        description: 'Learn the best skincare tips and product recommendations to keep your skin glowing all summer long.',
        youtubeLink: this.sanitizeUrl('https://www.youtube.com/embed/ScMzIvxBSi4')
      },
      {
        title: 'Hair Spa at Home 💆‍♀️',
        description: 'A step-by-step guide to doing a professional-quality hair spa treatment right in the comfort of your home.',
        youtubeLink: this.sanitizeUrl('https://www.youtube.com/embed/TX7f7P0lKqU')
      },
      {
        title: 'Natural Everyday Makeup Look 💄',
        description: 'Simple and elegant makeup tutorial for a soft, natural glow — perfect for daily wear.',
        youtubeLink: this.sanitizeUrl('https://www.youtube.com/embed/M7lc1UVf-VE')
      },
      {
        title: 'Salon Tour & Behind The Scenes ✨',
        description:'A sneak peek into our beauty salon setup, equipment, and how we create your favorite looks!',
        youtubeLink: this.sanitizeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')
      }
    ];

    // Optionally load from API:
    this.getVlogs();
  }

  getVlogs() {
    this._api.getvlogs().subscribe((res: any[]) => {
      this.vvvlogs = res.map(vlog => ({
        ...vlog,
        youtubeLink: this.sanitizeUrl(vlog.youtubeLink)
      }));
    });
  }


    sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
