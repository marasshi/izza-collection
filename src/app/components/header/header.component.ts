import { Component, OnInit, HostListener, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  private lastScrollTop = 0;
  private isMobile = false;

  constructor(private authService: AuthService, private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isMobile = window.innerWidth <= 768;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isMobile) return;
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const header = this.el.nativeElement.querySelector('.header');
    if (st > this.lastScrollTop && st > 60) {
      // Scroll down
      this.renderer.addClass(header, 'header--hidden');
    } else {
      // Scroll up
      this.renderer.removeClass(header, 'header--hidden');
    }
    this.lastScrollTop = st <= 0 ? 0 : st;
  }

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  logout(): void {
    this.authService.logout();
  }
}
