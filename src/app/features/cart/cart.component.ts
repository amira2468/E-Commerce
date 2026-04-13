import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Cart } from './models/cart.interface';
import { RouterLink } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  imports: [RouterLink,TranslateModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
private readonly cartService = inject(CartService);
private readonly pLATFORM_ID = inject(PLATFORM_ID)

// cartDetilse = signal<Cart>({}as Cart);
cartDetilse = signal<Cart>({ products: [], totalCartPrice: 0, _id: '' } as unknown as Cart);

  ngOnInit(): void {
    if(isPlatformBrowser(this.pLATFORM_ID)){
        this.getCartData();
    }
  }

  getCartData():void{
    this.cartService.getLoggedUserCart().subscribe({
      next: (res)=>{
        console.log(res.data);
        this.cartDetilse.set(res.data);
      },
      error: (err)=>{
        console.log(err);

      }
    })
  }

  removeItem(id:string): void {
  this.cartService.removeProductItem(id).subscribe({
    next: (res) => {
      console.log(res);
      this.cartDetilse.set(res.data);
      this.cartService.cartCount.set(res.numOfCartItems);
    },
    error: (err) => {
      console.log(err);
    }
  });
}


update(id : string , count:number):void{
  this.cartService.updateCartCount(id , count).subscribe({
    next:(res)=>{
      console.log(res);
      this.cartDetilse.set(res.data);
      this.cartService.cartCount.set(res.numOfCartItems);
    },
    error:(err)=>{
      console.log(err);

    }
  })
}

clearUserData():void{
  this.cartService.clearAllData().subscribe({
    next:(res)=>{
      console.log(res);
      this.cartDetilse.set(res.data);
      this.cartService.cartCount.set(res.numOfCartItems);
    },
    error:(err)=>{
      console.log(err);
    }
  })
}

}
