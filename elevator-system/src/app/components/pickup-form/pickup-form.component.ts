import { Component, EventEmitter, Output } from '@angular/core';
import { PickupEvent } from '../../interfaces/pickup-event.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isNullOrUndef } from '../../helpers/helpers';

@Component({
  selector: 'app-pickup-form',
  standalone: true,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './pickup-form.component.html',
  styleUrl: './pickup-form.component.css'
})
export class PickupFormComponent {
  @Output() pickupEvent = new EventEmitter<PickupEvent>();

  currentFloorFormControl = new FormControl(null, []);
  destinationFloorFormControl = new FormControl(null, []);

  constructor(private snackBar: MatSnackBar) {}

  submit() {
    const currentFloor = this.currentFloorFormControl.value;
    const destinationFloor = this.destinationFloorFormControl.value;

    if (isNullOrUndef(currentFloor)) {
      this.snackBar.open('"current floor" field is empty', 'X');
      return;
    }
    if (isNullOrUndef(destinationFloor)) {
      this.snackBar.open('"destinationFloor floor" field is empty', 'X');
      return;
    }
    if (currentFloor === destinationFloor) {
      this.snackBar.open('current floor and destination floor are equal', 'X');
      return;
    }

    this.currentFloorFormControl.setValue(null);
    this.destinationFloorFormControl.setValue(null);
    this.pickupEvent.emit({ currentFloor, destinationFloor });
  }
}
