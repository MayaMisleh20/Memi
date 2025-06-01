import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonButton, IonButtons, IonMenuButton, IonCardContent, IonCard, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { sendPasswordResetEmail } from '@angular/fire/auth';

import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonButton,
    IonButtons,
    IonMenuButton
  ],
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async login() {
    const { email, password } = this.loginForm.value;

    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log('✅ Login successful');
      this.router.navigateByUrl('/home');
    } catch (error) {
      console.error('❌ Login failed:', error);
      alert((error as any).message); // Optional: Show alert
    }
  }

  async resetPassword() {
    const email = this.loginForm.get('email')?.value;
  
    if (!email) {
      alert('Please enter your email to reset your password.');
      return;
    }
  
    try {
      await sendPasswordResetEmail(this.auth, email);
      alert('📧 A password reset link has been sent to your email.');
    } catch (error) {
      console.error('❌ Password reset failed:', error);
      alert((error as any).message);
    }
  }
  
  ngOnInit(): void {}
}
