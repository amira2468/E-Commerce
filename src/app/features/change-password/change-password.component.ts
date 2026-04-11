import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AddressService } from '../../core/services/adresses.service';

// Custom validator - password match
function passwordMatch(control: AbstractControl) {
  const password = control.get('password')?.value;
  const rePassword = control.get('rePassword')?.value;
  return password === rePassword ? null : { mismatch: true };
}

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  private readonly addressService = inject(AddressService);
  private readonly fb = inject(FormBuilder);

  isLoading = signal<boolean>(false);
  isSuccess = signal<boolean>(false);
  errorMsg = signal<string>('');

  showCurrent = signal<boolean>(false);
  showNew = signal<boolean>(false);
  showConfirm = signal<boolean>(false);

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    password:        ['', [Validators.required, Validators.minLength(6)]],
    rePassword:      ['', Validators.required],
  }, { validators: passwordMatch });

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    this.isLoading.set(true);
    this.isSuccess.set(false);
    this.errorMsg.set('');

    this.addressService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
        this.passwordForm.reset();
        setTimeout(() => this.isSuccess.set(false), 3000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err?.error?.message || 'Something went wrong, please try again.');
      }
    });
  }
}
