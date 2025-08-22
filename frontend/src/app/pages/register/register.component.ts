import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { AlertService } from '../../service/alert.service';
import { GlobalVariables } from '../../shared/global-variables';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  globalVariables = GlobalVariables;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: [null, Validators.required],
    });
  }

  submit() {
    if (!this.registerForm.valid) return;

    const { email, password, confirmPassword, role } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.alertService.show('Las contraseñas no coinciden', 'error');
      return;
    }

    this.auth.register(email, password, role).subscribe({
      next: () => {
        this.alertService.show('Usuario registrado con éxito', 'success');
        this.router.navigate([GlobalVariables.appRoutes.login]);
      },
      error: (err) => {
        console.error('Error al registrar usuario', err);
        this.alertService.show('Error al registrar usuario', 'error');
      },
    });
  }
}
