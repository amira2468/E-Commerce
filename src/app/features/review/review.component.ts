import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ReviewsService } from '../../core/services/review.service';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-review',
  imports: [DatePipe, FormsModule , TranslateModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ProductReviewsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly reviewsService = inject(ReviewsService);
  private readonly toastr = inject(ToastrService);
  private readonly platformId = inject(PLATFORM_ID);

  reviews = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  productId = signal<string>('');
  currentUserId = signal<string>('');

  // Stats
  avgRating = signal<number>(0);
  totalReviews = signal<number>(0);
  starCounts = signal<number[]>([0, 0, 0, 0, 0]);

  // Add Review Form
  showAddForm = signal<boolean>(false);
  newRating = signal<number>(0);
  newComment = signal<string>('');
  hoveredStar = signal<number>(0);

  // Edit Review
  editingReviewId = signal<string | null>(null);
  editRating = signal<number>(0);
  editComment = signal<string>('');
  editHoveredStar = signal<number>(0);

  // Check if user already reviewed
  userReview = computed(() =>
    this.reviews().find(r => r.user?._id === this.currentUserId())
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.productId.set(id);
    this.loadReviews(id);

    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('UserData');
      if (userData) {
        const parsed = JSON.parse(userData);
this.currentUserId.set(parsed._id ?? parsed.id ?? '');   }
    }
  }

  loadReviews(productId: string): void {
    this.isLoading.set(true);
    this.reviewsService.getProductReviews(productId).subscribe({
      next: (res) => {
        const data = res.data ?? [];
        this.reviews.set(data);
        this.totalReviews.set(data.length);
        this.calcStats(data);
        this.isLoading.set(false);
        console.log(res);

      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  calcStats(reviews: any[]): void {
    if (!reviews.length) {
      this.avgRating.set(0);
      return;
    }
    const counts = [0, 0, 0, 0, 0];
    let total = 0;
    reviews.forEach(r => {
    const star = Math.round(r.rating);
      if (star >= 1 && star <= 5) counts[star - 1]++;
    total += r.rating;
    });
    this.starCounts.set(counts);
    this.avgRating.set(Math.round((total / reviews.length) * 10) / 10);
  }

  // ADD
  submitReview(): void {
    if (!this.newRating() || !this.newComment().trim()) {
      this.toastr.warning('Please add a rating and comment', 'FreshCart');
      return;
    }
    this.isSubmitting.set(true);
    this.reviewsService.addReview(this.productId(), {
      review: this.newComment(),
      rating: this.newRating()
    }).subscribe({
      next: () => {
        this.toastr.success('Review added!', 'FreshCart', { progressBar: true });
        this.newComment.set('');
        this.newRating.set(0);
        this.showAddForm.set(false);
        this.isSubmitting.set(false);
        this.loadReviews(this.productId());
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'Failed to add review', 'FreshCart');
        this.isSubmitting.set(false);
      }
    });
  }

  // EDIT - open
  openEdit(review: any): void {
    this.editingReviewId.set(review._id);
    this.editRating.set(review.ratings);
    this.editComment.set(review.review ?? review.comment ?? '');
  }

  // EDIT - cancel
  cancelEdit(): void {
    this.editingReviewId.set(null);
  }

  // EDIT - save
  saveEdit(): void {
    const id = this.editingReviewId();
    if (!id || !this.editRating() || !this.editComment().trim()) return;
    this.isSubmitting.set(true);
    this.reviewsService.updateReview(id, {
      review: this.editComment(),
      rating: this.editRating()
    }).subscribe({
      next: () => {
        this.toastr.success('Review updated!', 'FreshCart', { progressBar: true });
        this.editingReviewId.set(null);
        this.isSubmitting.set(false);
        this.loadReviews(this.productId());
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'Failed to update', 'FreshCart');
        this.isSubmitting.set(false);
      }
    });
  }

  // DELETE
  deleteReview(reviewId: string): void {
    if (!confirm('Delete this review?')) return;
    this.reviewsService.deleteReview(reviewId).subscribe({
      next: () => {
        this.toastr.success('Review deleted', 'FreshCart', { progressBar: true });
        this.loadReviews(this.productId());
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'Failed to delete', 'FreshCart');
      }
    });
  }

  // Helpers
  getStarPercent(starIndex: number): number {
    const total = this.totalReviews();
    if (!total) return 0;
    return Math.round((this.starCounts()[starIndex] / total) * 100);
  }

  getStars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => {
      if (rating >= i + 1) return 'fas fa-star';
      if (rating >= i + 0.5) return 'fas fa-star-half-alt';
      return 'far fa-star';
    });
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('freshToken');
    }
    return false;
  }

  starsArray = [1, 2, 3, 4, 5];
}
