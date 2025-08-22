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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
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
    if (!this.loginForm.valid) return;

    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).subscribe({
      next: () => {
        this.alertService.show('Login exitoso', 'success');
        this.router.navigate([GlobalVariables.appRoutes.home]);
      },
      error: (err) => {
        console.error('Login fallido', err);
        this.alertService.show('Login fallido', 'error');
      },
    });
  }
}
