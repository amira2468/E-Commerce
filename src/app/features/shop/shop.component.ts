import { TranslateModule } from '@ngx-translate/core';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.interface';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { WishListService } from '../../core/services/wish-list.service';

@Component({
  selector: 'app-shop',
  imports: [RouterLink , TranslateModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishListService = inject(WishListService)
  private readonly toastrService = inject(ToastrService);
  private readonly activatedRoute = inject(ActivatedRoute);

    isLoading = signal<boolean>(false);
  productList = signal<Product[]>([]);
  totalProducts = signal<number>(0);
    wishList = signal<any[]>([]);



  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const subcategoryId = params['subcategory'];
      this.getProductsData(subcategoryId);
    });
  }

  getProductsData(subcategoryId?: string): void {
      this.isLoading.set(true);
    this.productsService.getAllProducts(subcategoryId).subscribe({
      next: (res) => {
        this.productList.set(res.data);
        this.totalProducts.set(res.results);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      }
    });
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push('fas fa-star');
      else if (rating >= i - 0.5) stars.push('fas fa-star-half-alt');
      else stars.push('far fa-star text-gray-300');
    }
    return stars;
  }

  addToCart(id: string): void {
    if (localStorage.getItem('freshToken')) {
      this.cartService.addProductToCart(id).subscribe({
        next: (res) => {
          this.cartService.cartCount.set(res.numOfCartItems);
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

  getDiscount(price: number, priceAfterDiscount: number): number {
    return Math.round(((price - priceAfterDiscount) / price) * 100);
  }

     // wishList
  addToWishList(productId: string): void {
  if (localStorage.getItem('freshToken')) {
    this.wishListService.AddProduct(productId).subscribe({
      next: (res) => {
        this.wishListService.wishListCount.set(res.data.length);
        this.toastrService.success(res.message, 'FreshCart', {
          progressBar: true,
          closeButton: true
        });
        console.log(res);
      },
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
