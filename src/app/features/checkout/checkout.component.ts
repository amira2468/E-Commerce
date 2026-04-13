import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AddressService } from '../../core/services/adresses.service';
import { Cart } from '../cart/models/cart.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, ReactiveFormsModule , TranslateModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly addressService = inject(AddressService);
  private readonly fb = inject(FormBuilder);

  cartDetails = signal<Cart>({} as Cart);
  savedAddresses = signal<any[]>([]);
  selectedAddressId = signal<string | null>(null);
  showNewAddressForm = signal<boolean>(false);
  flag = signal<string>('cash');
  cartID = signal<string>('');

  checkOut: FormGroup = this.fb.group({
    shippingAddress: this.fb.group({
      details: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      city: ['', [Validators.required]],
    })
  });

  ngOnInit(): void {
    this.getCartId();
    this.getCartDetails();
    this.getSavedAddresses();
  }

  getCartId(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.cartID.set(params.get('id')!);
    });
  }

  getCartDetails(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => this.cartDetails.set(res.data),
      error: (err) => console.log(err)
    });
  }

  getSavedAddresses(): void {
    this.addressService.getAddresses().subscribe({
      next: (res) => {
        this.savedAddresses.set(res.data);
        // auto select first address
        if (res.data?.length > 0) {
          this.selectAddress(res.data[0]);
        } else {
          this.showNewAddressForm.set(true);
        }
      },
      error: () => this.showNewAddressForm.set(true)
    });
  }

  selectAddress(address: any): void {
    this.selectedAddressId.set(address._id);
    this.showNewAddressForm.set(false);
    this.checkOut.get('shippingAddress')?.patchValue({
      city: address.city,
      details: address.details,
      phone: address.phone,
    });
  }

  useNewAddress(): void {
    this.selectedAddressId.set(null);
    this.showNewAddressForm.set(true);
    this.checkOut.get('shippingAddress')?.reset();
  }

  changeFlag(el: HTMLInputElement): void {
    this.flag.set(el.value);
  }

  get totalCartPrice(): number {
    return this.cartDetails()?.totalCartPrice ?? 0;
  }

  get cartProducts() {
    return this.cartDetails()?.products ?? [];
  }

  submitForm(): void {
    if (this.checkOut.valid) {
      if (this.flag() === 'cash') {
        this.cartService.CreateCashOrder(this.cartID(), this.checkOut.value).subscribe({
          next: (res) => {
            if (res.status === 'success') this.router.navigate(['/allorders']);
          },
          error: (err) => console.log(err),
        });
      } else {
        this.cartService.CreateVisaOrder(this.cartID(), this.checkOut.value).subscribe({
          next: (res) => {
            if (res.status === 'success') window.open(res.session.url, '_self');
          },
          error: (err) => console.log(err),
        });
      }
    }
  }
}
