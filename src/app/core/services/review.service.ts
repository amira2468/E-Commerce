import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private readonly http = inject(HttpClient);

  // GET - reviews
  getProductReviews(productId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/api/v1/products/${productId}/reviews`);
  }

  // add - review
  addReview(productId: string, data: { review: string; rating: number }): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/v1/reviews`, {product: productId, ...data
    });
  }

  //Update - review
  updateReview(reviewId: string, data: { review: string; rating: number }): Observable<any> {
    return this.http.put(`${environment.baseUrl}/api/v1/reviews/${reviewId}`, data);
  }

  // DELETE - review
  deleteReview(reviewId: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/api/v1/reviews/${reviewId}`);
  }
}
