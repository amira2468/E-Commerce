import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-slider',
  imports: [TranslateModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SliderComponent {

}
