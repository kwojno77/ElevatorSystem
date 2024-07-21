import { Component, ViewChild } from '@angular/core';
import { ElevatorService } from './services/elevator.service';
import { Elevator } from './interfaces/elevator.interface'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { StatusFormComponent } from './components/status-form/status-form.component';
import { PickupFormComponent } from './components/pickup-form/pickup-form.component';
import { PickupEvent } from './interfaces/pickup-event.interface';
import { UpdateFormComponent } from './components/update-form/update-form.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { firebaseConfig } from '../../firebase-config';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, MatInputModule, StatusFormComponent, PickupFormComponent, UpdateFormComponent, MatSortModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private elevatorService: ElevatorService) {}

  displayedColumns: string[] = ['id', 'currentFloor', 'destinationFloors', 'priorityFloor', 'direction'];

  title = 'elevator-system';
  dataSource = new MatTableDataSource<Elevator>();

  selectedId?: number;

  @ViewChild(MatSort) sort = new MatSort();

  ngOnInit() {
    this.dataSource.data = this.elevatorService.getElevators();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  performStep() {
    this.elevatorService.step();
    this.dataSource.data = this.elevatorService.getElevators();
  }

  showStatus(id: number) {
    this.selectedId = id;
  }

  pickupElevator(pickupEvent: PickupEvent) {
    const updatedElevator = this.elevatorService.pickup(pickupEvent.currentFloor, pickupEvent.destinationFloor);

    if (updatedElevator) {
      this.selectedId = updatedElevator.id;
      this.dataSource.data = this.elevatorService.getElevators();
    }
  }

  updateElevator(updatedElevator: Elevator) {
    this.elevatorService.update(updatedElevator);
    this.selectedId = updatedElevator.id;
    this.dataSource.data = this.elevatorService.getElevators();
  }
}
