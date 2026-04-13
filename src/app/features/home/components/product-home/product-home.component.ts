import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from '../../../../core/models/product.interface';
import { RouterLink } from "@angular/router";
import { CartService } from '../../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishListService } from '../../../../core/services/wish-list.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-home',
  imports: [RouterLink , TranslateModule],
  templateUrl: './product-home.component.html',
  styleUrl: './product-home.component.css',
})
export class ProductHomeComponent implements OnInit {

  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishListService  = inject(WishListService)
  private readonly toastrService = inject(ToastrService);

    isLoading = signal<boolean>(false);
    productList = signal<Product[]>([])
      wishList = signal<any[]>([]);
  ngOnInit(): void {
      this.getProductsData();
  }

  getProductsData():void{
    this.isLoading.set(true);
    this.productsService.getAllProducts().subscribe({
      next:(res)=>{
        console.log(res);
        this.productList.set(res.data);
        this.isLoading.set(false);
      },
      error:(err)=>{
        console.log(err);
        this.isLoading.set(false);
      }
    })
  }
                // for product card
  getStars(rating: number): string[] {
  const stars: string[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push('fas fa-star');
    else if (rating >= i - 0.5) stars.push('fas fa-star-half-alt');
    else stars.push('far fa-star text-gray-300');
  }
  return stars;
}

                 //addProductCart
addToCart(id: string): void {
  if (localStorage.getItem('freshToken')) {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartService.cartCount.set(res.numOfCartItems);
        this.toastrService.success(res.message , 'FreshCart', {
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
  getDiscount(price: number, priceAfterDiscount: number): number {
    return Math.round(((price - priceAfterDiscount) / price) * 100);
  }

addToWishList(productId: string): void {
  if (localStorage.getItem('freshToken')) {
    this.wishListService.AddProduct(productId).subscribe({
      next: (res) => {
        this.toastrService.success(res.message, 'FreshCart', {
          progressBar: true,
          closeButton: true
        });
        console.log(res);
    this.wishListService.wishListCount.set(res.data.length);},
      error: (err) => {
        console.error(err);
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



