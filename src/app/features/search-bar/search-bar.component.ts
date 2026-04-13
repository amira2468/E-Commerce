import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ProductsService } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { CartService } from '../../core/services/cart.service';
import { WishListService } from '../../core/services/wish-list.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [RouterLink, FormsModule, DecimalPipe],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly cartService = inject(CartService);
  private readonly wishListService = inject(WishListService);
  private readonly toastrService = inject(ToastrService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private searchSubject = new Subject<string>();
  isFilterOpen = false;


  // State
  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  viewMode = signal<'grid' | 'list'>('grid');

  // Filters
  searchKeyword = signal<string>('');
  selectedCategories = signal<string[]>([]);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  sortBy = signal<string>('');

  // Active filters for display
  get activeFilters(): { label: string; categoryId: string }[] {
    return this.selectedCategories().map(id => ({
      label: this.categories().find(c => c._id === id)?.name || id,
      categoryId: id
    }));
  }

  ngOnInit(): void {
    this.loadCategories();

    // debounce search input
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.search();
    });

    // read query params
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['q']) this.searchKeyword.set(params['q']);
      if (params['category']) {
        const cats = Array.isArray(params['category']) ? params['category'] : [params['category']];
        this.selectedCategories.set(cats);
      }
      this.search();
    });
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) =>{
        console.log(res);
        this.categories.set(res.data)},
      error: (err) => console.log(err)
    });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchKeyword());
  }

  search(): void {
    this.isLoading.set(true);
    this.updateQueryParams();

    this.productsService.searchProducts({
      title: this.searchKeyword() || undefined,
      categories: this.selectedCategories().length ? this.selectedCategories() : undefined,
      minPrice: this.minPrice() ?? undefined,
      maxPrice: this.maxPrice() ?? undefined,
      sort: this.sortBy() || undefined,
    }).subscribe({
      next: (res) => {
        console.log(res);
        this.products.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      }
    });
  }

  updateQueryParams(): void {
    this.router.navigate([], {
      queryParams: {
        q: this.searchKeyword() || null,
        category: this.selectedCategories().length ? this.selectedCategories() : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  toggleCategory(categoryId: string): void {
    const current = this.selectedCategories();
    if (current.includes(categoryId)) {
      this.selectedCategories.set(current.filter(id => id !== categoryId));
    } else {
      this.selectedCategories.set([...current, categoryId]);
    }
    this.search();
  }

  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategories().includes(categoryId);
  }

  removeCategory(categoryId: string): void {
    this.selectedCategories.set(this.selectedCategories().filter(id => id !== categoryId));
    this.search();
  }

  setPriceRange(min: number, max?: number): void {
    this.minPrice.set(min);
    this.maxPrice.set(max ?? null);
    this.search();
  }

  clearAllFilters(): void {
    this.selectedCategories.set([]);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.sortBy.set('');
    this.search();
  }

  onSortChange(): void {
    this.search();
  }

  getDiscount(price: number, priceAfterDiscount: number): number {
    return Math.round(((price - priceAfterDiscount) / price) * 100);
  }

  getStars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => {
      if (rating >= i + 1) return 'fas fa-star';
      if (rating >= i + 0.5) return 'fas fa-star-half-alt';
      return 'far fa-star text-gray-300';
    });
  }

  addToCart(id: string): void {
    if (localStorage.getItem('freshToken')) {
      this.cartService.addProductToCart(id).subscribe({
        next: (res) => {
          this.toastrService.success(res.message, 'FreshCart', { progressBar: true, closeButton: true });
        },
        error: (err) => console.log(err)
      });
    } else {
      this.toastrService.warning('Login First', 'FreshCart', { progressBar: true, closeButton: true });
    }
  }

  addToWishList(productId: string): void {
    if (localStorage.getItem('freshToken')) {
      this.wishListService.AddProduct(productId).subscribe({
        next: (res) => {
          this.toastrService.success(res.message, 'FreshCart', { progressBar: true, closeButton: true });
        },
        error: (err) => console.log(err)
      });
    } else {
      this.toastrService.warning('Login First', 'FreshCart', { progressBar: true, closeButton: true });
    }
  }
}
