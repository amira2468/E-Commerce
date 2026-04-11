import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { WishListService } from '../../core/services/wish-list.service';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { WishList } from './models/wish-list.interface';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly wishListService = inject(WishListService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID)

  wishList = signal<WishList[]>([]);

  ngOnInit(): void {
        if(isPlatformBrowser(this.pLATFORM_ID)){
        this.getWishList();}
  }

getWishList(): void {
  this.wishListService.getLoggedUser().subscribe({
    next: (res) => {
      console.log(res);
      this.wishList.set(res.data);
      // this.wishListService.wishListCount.set(res.count);
      this.wishListService.wishListCount.set(res.data.length);

    },
    error: (err) => console.log(err),
  });
}

  removeFromWishlist(Id: string): void {
    this.wishListService.removeProduct(Id).subscribe({
      next: (res) => {
        console.log(res);
      this.wishListService.wishListCount.set(res.data.length);
        this.toastrService.success('Removed from wishlist', 'FreshCart', { progressBar: true });
        this.getWishList();
      },
      error: (err) => console.log(err),
    });
  }

  addToWishList(productId: string): void {
    this.cartService.addProductToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => console.log(err),
    });
  }


    addToCart(id: string): void {
    if (localStorage.getItem('freshToken')) {
      this.cartService.addProductToCart(id).subscribe({
        next: (res) => {
          this.toastrService.success(res.message, 'FreshCart', {
            progressBar: true,
            closeButton: true,
          });
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.toastrService.warning("Login First", 'FreshCart', {
        progressBar: true,
        closeButton: true
      });
    }
  }
}
