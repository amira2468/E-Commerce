import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot',
  imports: [ReactiveFormsModule, RouterLink , TranslateModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css',
})
export class ForgotComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  step = signal<number>(1);
  errorMessage = signal<string>('');

  email: FormControl = new FormControl('', [Validators.required, Validators.email]);

  code: FormControl = new FormControl('', [Validators.required]);

  password: FormControl = new FormControl('', [ Validators.required,Validators.minLength(8),]);



            // NO.1
  submitEmail(e: Event): void {
    e.preventDefault();
    this.errorMessage.set('');
    if (this.email.valid) {
      const data = { email: this.email.value };
      this.authService.forgotPassword(data)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            console.log(res);
            this.step.set(2);
          },
          error: (err) => {
            this.errorMessage.set(err?.error?.message || 'Something went wrong. Please try again.');
          },
        });
    } else {
      this.email.markAsTouched();
    }
  }




                      // NO.2
  submitCode(e: Event): void {
    e.preventDefault();
    this.errorMessage.set('');
    if (this.code.valid) {
      const data = { resetCode: this.code.value };
      this.authService.verifyCode(data)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            console.log(res);
            this.step.set(3);
          },
          error: (err) => {
            this.errorMessage.set(err?.error?.message || 'Invalid or expired code. Please try again.');
          },
        });
    } else {
      this.code.markAsTouched();
    }
  }

            // NO.3
  submitPassword(e: Event): void {
    e.preventDefault();
    this.errorMessage.set('');
    if (this.password.valid) {
      const data = {
        email: this.email.value,
        newPassword: this.password.value,
      };
      this.authService.resetPassword(data)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            console.log(res);
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.errorMessage.set(err?.error?.message || 'Failed to reset password. Please try again.');
          },
        });
    } else {
      this.password.markAsTouched();
    }
  }
}
