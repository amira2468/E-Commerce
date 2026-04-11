import { join } from 'node:path';
import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../core/auth/services/auth.service';
import { platformBrowser } from '@angular/platform-browser';
import { CartService } from '../../core/services/cart.service';
import { WishListService } from '../../core/services/wish-list.service';
import { CategoriesService } from '../../core/services/categories.service';
import { MyTranslateService } from '../../core/services/myTranslate/my-translate.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive  , TranslateModule ,],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {

  private readonly authService  = inject(AuthService);
  private readonly cartService = inject(CartService)
  private readonly wishListService = inject(WishListService)
  private readonly categoriesService = inject(CategoriesService);
  private readonly myTranslateService = inject(MyTranslateService);
  private readonly translate = inject(TranslateService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

    logged = computed(()=> this.authService.isLogged());
    countCart = computed(()=>this.cartService.cartCount());
    countWishList = computed(()=>this.wishListService.wishListCount());
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}
    userName: string = '';
    categories = signal<any[]>([]);


  ngOnInit(): void {

              // Save singOut
    if(isPlatformBrowser(this.pLATFORM_ID)){
      this.getCartCount();
          this.getWishLlstCount();
      if(localStorage.getItem('freshToken')){
        this.authService.isLogged.set(true);
      }
    }
              // flowbite
    if (isPlatformBrowser(this.platformId)) {
      import('flowbite').then((flowbite) => {
        flowbite.initFlowbite();
      });
    }
      const userData = localStorage.getItem('UserData');
  if (userData) {
    this.userName = JSON.parse(userData).name;
  }
  this.getCategories();
  }

  logOut():void{
    this.authService.singOut();
  }
      // G.Categories
  getCategories(): void {
  this.categoriesService.getAllCategories().subscribe({
    next: (res) => this.categories.set(res.data),
    error: (err) => console.log(err)
  });
}

      // Num of item
  getCartCount():void{
    this.cartService.getLoggedUserCart().subscribe({
      next:(res)=>{
        console.log(res.numOfCartItems);
      this.cartService.cartCount.set(res.numOfCartItems);
      }
    })
  }
      // Num of item WishList
  getWishLlstCount():void{
    this.wishListService.getLoggedUser().subscribe({
      next:(res)=>{
        console.log(res.count);
      this.wishListService.wishListCount.set(res.data.length);
    }
    })
  }

// Translate
changeLan(lang:any):void{
this.myTranslateService.changeLang(lang)
}

  isDrawerOpen = false;
  openDrawer()  { this.isDrawerOpen = true;  }
  closeDrawer() { this.isDrawerOpen = false; }
}
