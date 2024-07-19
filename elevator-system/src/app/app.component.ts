import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ElevatorService } from './services/elevator.service';
import { Elevator } from './interfaces/elevator.interface'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { Nullish } from './types/nullish';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDp3MfqgzbcUIlPGxmDtyoLzW8F_MMuP6c",
  authDomain: "elevatorsystem-96a76.firebaseapp.com",
  projectId: "elevatorsystem-96a76",
  storageBucket: "elevatorsystem-96a76.appspot.com",
  messagingSenderId: "421167272876",
  appId: "1:421167272876:web:bc7f6fd1b81a0f947a2009",
  measurementId: "G-X6YNYKBP84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private elevatorService: ElevatorService) {}

  title = 'elevator-system';
  elevator: Nullish<Elevator> = null;

  ngOnInit() {
    this.elevator = this.elevatorService.status(1);
  }
}
