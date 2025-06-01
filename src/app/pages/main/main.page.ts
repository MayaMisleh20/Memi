import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonButton } from '@ionic/angular/standalone';
import { AnimationOptions } from 'ngx-lottie';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { LottieComponent } from 'ngx-lottie';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [IonContent, IonButton,LottieComponent,CommonModule,FormsModule],
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {
  mode: 'login' | 'signup' = 'login';
  email = '';
  password = '';
  showPassword = false;

  options: AnimationOptions = {
    path: 'assets/man.json',
    loop: true,
    autoplay: true,
  };

  constructor(private router: Router, private auth: Auth) {}

  setMode(mode: 'login' | 'signup') {
    this.mode = mode;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    try {
      if (this.mode === 'login') {
        await signInWithEmailAndPassword(this.auth, this.email, this.password);
        console.log('Logged in successfully');
      } else {
        await createUserWithEmailAndPassword(this.auth, this.email, this.password);
        console.log('Signed up successfully');
      }
      this.router.navigate(['/home']); // navigate to your app's home page after success
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed: ' + (error as any).message);
    }
  }
}
