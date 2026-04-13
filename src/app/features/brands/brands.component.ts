import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandsService } from '../../core/services/brands.service';
import { Brand, Cart } from '../cart/models/cart.interface';
import { ProductsService } from '../../core/services/products.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-brands',
  imports: [RouterLink,TranslateModule],
  templateUrl: './brands.component.html',
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
    private readonly productsService = inject(ProductsService);
    brands = signal<Brand[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.getBrands();
  }

  getBrands(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (res) => {
        this.brands.set(res.data);
        this.isLoading.set(false);
        console.log(res);

      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

}
