import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  submit() {
    if (!this.registerForm.valid) return;

    const { email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.auth.register(email, password).subscribe({
      next: () => {
        alert('Usuario registrado con éxito');
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('Error al registrar usuario', err),
    });
  }
}
