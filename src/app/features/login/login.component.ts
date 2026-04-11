import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule , TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
  });

  showPassword: boolean = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  SubmitForm(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.singIn(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.message === 'success') {
          // save token
          localStorage.setItem('freshToken', res.token);
          // localStorage.setItem('freshUser', JSON.stringify(res.data.user));
          // save user
          localStorage.setItem('freshUser' , JSON.stringify(res.user) );

          // singOut
          this.authService.isLogged.set(true);
          console.log(this.authService.isLogged());


          // home
          this.router.navigate(['/']);

          // decodeUserToken
          this.authService.decodeUserToken();
          console.log(this.authService);


        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
