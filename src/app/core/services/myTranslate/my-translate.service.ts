import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MyTranslateService {

    private readonly pLATFORM_ID = inject(PLATFORM_ID);
    private readonly translateService = inject(TranslateService)

  // logic translate
  changeDirection(): void {
    if (localStorage.getItem('lang') === 'en') {
      // dir ltr
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
    else if (localStorage.getItem('lang') === 'ar') {
      // dir rtl
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    }
  }

  
// method changeLanguage
changeLang(lang: string): void {

  if (isPlatformBrowser(this.pLATFORM_ID)) {
    localStorage.setItem('lang', lang);
  }

  this.translateService.use(lang);
  this.changeDirection();
}

}
