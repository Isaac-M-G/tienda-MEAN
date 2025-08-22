import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { GlobalVariables } from '../../shared/global-variables';
import { AlertService } from '../../service/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  routes = GlobalVariables.appRoutes;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit() {
    this.loginForm.markAllAsTouched();

    if (!this.loginForm.valid) return;

    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).subscribe({
      next: () => {
        this.alertService.show('Login exitoso', 'success');
        this.router.navigate([GlobalVariables.appRoutes.home]);
      },
      error: (err) => {
        console.error('Login fallido', err);

        // Dependiendo de tu backend, el mensaje puede estar en err.error.message
        const errorMessage =
          err?.error?.message || 'Usuario o contraseña incorrectos';
        this.alertService.show(errorMessage, 'error');
      },
    });
  }
}
