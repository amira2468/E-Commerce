import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { AddressService } from '../../core/services/adresses.service';
import { ChangePasswordComponent } from "../change-password/change-password.component";

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, ChangePasswordComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  private readonly addressService = inject(AddressService);
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);

  isLoading = signal<boolean>(false);
  isSuccess = signal<boolean>(false);
  userData = signal<any>(null);

  profileForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('freshUser');
      if (stored) {
        const user = JSON.parse(stored);
        this.userData.set(user);
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
        });
      }
    }
  }

  saveChanges(): void {
    if (this.profileForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    this.isLoading.set(true);
    this.isSuccess.set(false);

    const userId = this.userData()?._id;
    const formData = this.profileForm.value;

    this.addressService.saveChanges(formData).subscribe({
      next: (res: any) => {
        console.log('Update success:', res);
        this.userData.set(res.data);

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('freshUser', JSON.stringify(res.data));
        }

        this.isLoading.set(false);
        this.isSuccess.set(true);
        setTimeout(() => this.isSuccess.set(false), 3000);
      },
      error: (err) => {
        console.error('Update error:', err);
        if (err.status === 400) {
          console.log('Bad request details:', err.error);
                  this.userData.set(err.data);
        }
        this.isLoading.set(false);
      }
    });
  }
}
