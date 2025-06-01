import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonCheckbox,
  IonLabel, IonSpinner } from '@ionic/angular/standalone';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonSpinner, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonButton,
    IonButtons,
    IonMenuButton,
    IonCheckbox,
    IonLabel
  ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  signupForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      marketingOptIn: [false]
    });
  }

  ngOnInit(): void {}

  async signup() {
    if (this.signupForm.invalid) return;

    const { email, password } = this.signupForm.value;
    this.loading = true;

    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('✅ Signup successful');
      this.router.navigateByUrl('/home');
    } catch (error) {
      alert((error as any).message);
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/sign-in');
  }
}
