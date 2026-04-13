import { Component, AfterViewInit, ElementRef, Renderer2, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-slider',
  imports: [TranslateModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SliderComponent {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {

          const cards = this.el.nativeElement.querySelectorAll('.feature-card');
          cards.forEach((card: any) => {
            this.renderer.addClass(card, 'show');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    const container = this.el.nativeElement.querySelector('.grid');
    if (container) observer.observe(container);
  }


}
