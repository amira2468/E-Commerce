import { environment } from './../../../../environments/environment';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-brand-prod',
  imports: [CommonModule, RouterLink],
  templateUrl: './brand-prod.component.html',
})
export class BrandprodComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly cartService = inject(CartService)
  private readonly http = inject(HttpClient);

  products = signal<any[]>([]);
  brandName = signal<string>('');
  brandId = signal<string>('');
  loading = signal<boolean>(true);
  brandImage = signal<string>('');
  toastrService: any;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      const slug = params['slug'];

      if (id) {
        this.brandId.set(id);
        this.brandName.set(slug.replace(/-/g, ' '));
        this.getBrandName(id);
        this.getProductsByBrand(id);
      }
    });
  }

  getBrandName(id: string): void {
    this.http
      .get(`${environment.baseUrl}/api/v1/brands/${id}`)
      .subscribe({
        next: (res: any) => {
          this.brandName.set(res.data.name);
          this.brandImage.set(res.data.image);
        },
        error: (err) => {
          console.error('Error fetching brand:', err);
        },
      });
  }

  getProductsByBrand(brandId: string): void {
    this.loading.set(true);
    this.http
      .get(`${environment.baseUrl}/api/v1/products?brand=${brandId}`)
      .subscribe({
        next: (res: any) => {
          this.products.set(res.data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error fetching products:', err);
          this.loading.set(false);
        },
      });
  }


  getDiscount(price: number, priceAfterDiscount: number): number {
    return Math.round(((price - priceAfterDiscount) / price) * 100);
  }

  addToCart(id: string): void {
  if (localStorage.getItem('freshToken')) {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.success(res.message , 'FreshCart', {
          progressBar: true,
          closeButton: true
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
