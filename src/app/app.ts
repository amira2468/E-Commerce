import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { SubFooterComponent } from "./layouts/sub-footer/sub-footer.component";
import { NgxSpinnerComponent } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { MyTranslateService } from './core/services/myTranslate/my-translate.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, SubFooterComponent ,NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit  {
  protected readonly title = signal('E-Commerce');

  // private translate = inject(TranslateService);
  // private readonly myTranslateService = inject(MyTranslateService)
  //   constructor() {
  //       this.translate.addLangs(['de', 'en']);
  //       if(localStorage.getItem('lang')){
  //     this.translate.use(localStorage.getItem('lang')!);
  //     this.myTranslateService.changeDirection();
  //       }
  //   }


  //  or

 private readonly pLATFORM_ID = inject(PLATFORM_ID);
 private readonly translateService = inject(TranslateService);
 private readonly myTranslateService = inject(MyTranslateService)
  ngOnInit(): void {
    if(isPlatformBrowser(this.pLATFORM_ID)){
        // Set Defult Lan
    this.translateService.setFallbackLang('en');

        // Get saved Lan From LocalStorage
    let savedLang = localStorage.getItem('lang');

        // Use saved Lang
    if(savedLang){
    this.translateService.use(savedLang)
    }
    // change Directon
    this.myTranslateService.changeDirection();
    }
  }


}
