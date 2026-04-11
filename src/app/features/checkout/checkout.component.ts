import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Cart } from '../cart/models/cart.interface';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink , ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit{
    private readonly activatedRoute  = inject(ActivatedRoute);
        private readonly router  = inject(Router);
    private readonly cartService  = inject(CartService);
    private readonly fb  = inject(FormBuilder);

    cartDetilse = signal<Cart>({}as Cart);
    flag = signal<string>("cash")
    cartID = signal<string>('');


    checkOut : FormGroup = this.fb.group({
      shippingAddress :  this.fb.group({
        details:["" , [Validators.required]],
        phone :["" , [Validators.required]],
        city : ["" , [Validators.required]],
      })
    })

  ngOnInit(): void {
    this.getCartId();
  }

  getCartId():void{
    this.activatedRoute.paramMap.subscribe( (params)=>{
        console.log(params.get('id'));
              // this.cartService.cartID.set(res.data._id);
        this.cartID.set(params.get('id')!)
    })
  }

  changeFlag(el:HTMLInputElement):void{
this.flag.set(el.value);
}


    // form
submitForm(): void {
  if (this.checkOut.valid) {

    if (this.flag() === 'cash') {
      this.cartService.CreateCashOrder(this.cartID(), this.checkOut.value).subscribe({
        next: (res) => {
          console.log(res);

          if (res.status === 'success') {
            this.router.navigate(['/allorders']);
          }
        },
        error: (err) => console.log(err),
      });

    } else {
      this.cartService.CreateVisaOrder(this.cartID(), this.checkOut.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === 'success') {
            window.open(res.session.url, '_self');
          }
        },
        error: (err) => console.log(err),
      });
    }

  }
}
  getAll():void{
    this.cartService.getAllOrders().subscribe({
      next:(res)=>{
        console.log(res);
      }
    })
  }
    }




