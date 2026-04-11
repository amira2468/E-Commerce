import { join } from 'node:path';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../core/auth/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule , TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router)


  registerForm: FormGroup = this.fb.group({
    name: ["", [Validators.required, Validators.minLength(3)]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
    rePassword: ["", [Validators.required]],
    phone: ["", [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
  }, { validators: this.comfirmPassword });


  comfirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    if (rePassword !== password && rePassword !== "") {
      group.get('rePassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }


SubmitForm(): void {
  if (this.registerForm.invalid) {
    console.log(this.registerForm.value);
    this.registerForm.markAllAsTouched();
    return;
  }

  this.authService.signUp(this.registerForm.value).subscribe({
    next: (res) => {
      console.log(res);
      if(res.message === 'success'){
        // logic
        this.router.navigate(['/login']);
      }
    },
  });
}
}
