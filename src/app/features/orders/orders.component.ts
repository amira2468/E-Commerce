import { Component, inject, OnInit, signal, PLATFORM_ID, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe, SlicePipe, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { Orders } from './orders.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-orders',
  imports: [RouterLink, DatePipe, DecimalPipe, SlicePipe , TranslateModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  orders = signal<Orders[]>([]);
  userId: WritableSignal<string | null> = signal<string | null>('');

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      const token = localStorage.getItem('freshToken');
      if (token) {
        const id = JSON.parse(localStorage.getItem('UserData')!).id;
        this.userId.set(id);
        this.getUserOrders();
      }
    }
  }

  getUserOrders(): void {
    this.cartService.getUserOrders(this.userId()).subscribe({
      next: (res) => {
        console.log(res);
        this.orders.set(res.map((order: any) => ({ ...order, _expanded: false })));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
