import { AddressService } from './../../core/services/adresses.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-addresses',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, TranslateModule],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css',
})
export class AddressesComponent implements OnInit {
  private readonly addressService = inject(AddressService);
  private readonly fb = inject(FormBuilder);

  addresses = signal<any[]>([]);
  isModalOpen = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  editingId = signal<string>('');
  isLoading = signal<boolean>(false);

  addressForm: FormGroup = this.fb.group({
    name:    ['', Validators.required],
    details: ['', Validators.required],
    phone:   ['', Validators.required],
    city:    ['', Validators.required],
  });

  ngOnInit(): void {
    this.getAddresses();
  }

  getAddresses(): void {
    this.isLoading.set(true);
    this.addressService.getAddresses().subscribe({
      next: (res) => {
        this.addresses.set(res.data);
        console.log(res);
        this.isLoading.set(false);
      },
    error: (err) => {
      console.log(err);
      this.isLoading.set(false);
    }
    });
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.addressForm.reset();
    this.isModalOpen.set(true);
  }

  openEditModal(address: any): void {
    this.isEditMode.set(true);
    this.editingId.set(address._id);
    this.addressForm.patchValue({
      name:    address.name,
      details: address.details,
      phone:   address.phone,
      city:    address.city,
    });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.addressForm.reset();
  }

  submitForm(): void {
    if (this.addressForm.invalid) return;
    this.isLoading.set(true);

    if (this.isEditMode()) {
      this.addressService.updateAddress(this.editingId(), this.addressForm.value).subscribe({
        next: (res) => {
          this.addresses.set(res.data);
          console.log(res);
          this.closeModal();
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(false);
        }
      });
    } else {
      this.addressService.addAddress(this.addressForm.value).subscribe({
        next: (res) => {
          this.addresses.set(res.data);
          console.log(res);
          this.closeModal();
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(false);
        }
      });
    }

}

  removeAddress(id: string): void {
    this.addressService.removeAddress(id).subscribe({
      next: (res) => {
        this.addresses.set(res.data);
        console.log(res);

      },
      error: (err) => console.log(err)
    });
  }
}
