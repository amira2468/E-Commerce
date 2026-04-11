import { register } from 'swiper/element/bundle';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.interface';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishListService } from '../../core/services/wish-list.service';
import { ProductReviewsComponent } from '../review/review.component';

@Component({
  selector: 'app-details',
  imports: [CommonModule, RouterLink , ProductReviewsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishListService = inject(WishListService);

  productDitals = signal<Product>({} as Product);
  relatedProducts = signal<Product[]>([]);
  quantity = signal<number>(1);
  selectedImage = signal<string>('');
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.getProductDetails(params.get('id')!);
    });
      register();
  }

  getProductDetails(id: string): void {
    this.isLoading.set(true);
    this.productsService.getSpecificProduct(id).subscribe({
      next: (res) => {
        console.log(res);
        this.productDitals.set(res.data);
        this.selectedImage.set(res.data.imageCover);
        this.getRelatedProducts(res.data.category._id);
        this.isLoading.set(false);
      },
        error: (err) => {
      console.log(err);
      this.isLoading.set(false);
    }
    });
  }

  getRelatedProducts(categoryId: string): void {
    this.productsService.getProductsByCategory(categoryId).subscribe({
      next: (res) => this.relatedProducts.set(res.data),
      error: (err) => console.log(err)
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

  getDiscount(price: number, priceAfterDiscount: number): number {
    return Math.round(((price - priceAfterDiscount) / price) * 100);
  }

  addToCart(id: string): void {
    if (localStorage.getItem('freshToken')) {
      this.cartService.addProductToCart(id).subscribe({
        next: (res) => {
          this.cartService.cartCount.set(res.numOfCartItems);
          this.toastrService.success(res.message, 'FreshCart', {
            progressBar: true,
            closeButton: true
          });
        },
        error: (err) => console.log(err)
      });
    } else {
      this.toastrService.warning('Login First', 'FreshCart', {
        progressBar: true,
        closeButton: true
      });
    }
  }

  increment(): void {
    if (this.quantity() < this.productDitals().quantity) {
      this.quantity.set(this.quantity() + 1);
    }
  }

  decrement(): void {
    if (this.quantity() > 1) {
      this.quantity.set(this.quantity() - 1);
    }
  }

  get totalPrice(): number {
    return this.productDitals().price * this.quantity();
  }

  selectImage(img: string): void {
    this.selectedImage.set(img);
  }

  addToWishList(productId: string): void {
    if (localStorage.getItem('freshToken')) {
      this.wishListService.AddProduct(productId).subscribe({
        next: (res) => {
          this.wishListService.wishListCount.set(res.data.length);
          this.toastrService.success(res.message, 'FreshCart', {
            progressBar: true,
            closeButton: true
          });
        },
        error: (err) => console.error(err)
      });
    } else {
      this.toastrService.warning('Login First', 'FreshCart', {
        progressBar: true,
        closeButton: true
      });
    }
  }
}
