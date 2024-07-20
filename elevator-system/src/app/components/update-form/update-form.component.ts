import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ElevatorDirection } from '../../types/elevator-direction';
import { Elevator } from '../../interfaces/elevator.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-form',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './update-form.component.html',
  styleUrl: './update-form.component.css'
})
export class UpdateFormComponent {
  @Output() updatedElevator = new EventEmitter<Elevator>();

  elevatorIdFormControl = new FormControl(null, []);
  currentFloorFormControl = new FormControl(null, []);
  destinationFloorsFormControl = new FormControl(null, []);

  constructor(private snackBar: MatSnackBar) {}

  submit() {
    const currentFloor = parseControlToNumber(this.currentFloorFormControl);
    let destinationFloors = parseControlToArrayOfNumbers(this.destinationFloorsFormControl);
    const id = this.elevatorIdFormControl.value;

    if (!currentFloor && currentFloor !== 0) {
      this.snackBar.open('"current floor" field is empty', 'X');
      return;
    }
    if (!id) {
      this.snackBar.open('"elevator id" field is empty', 'X');
      return;
    }

    let direction: ElevatorDirection;
    if (destinationFloors.length === 0) {
      direction = null;
    } else if (destinationFloors[0] > currentFloor) {
      direction = 'up';
      if (destinationFloors.some((destFloor) => destFloor < currentFloor)) {
        this.snackBar.open('One of the destination floors is below the elevator', 'X');
        return;
      }
    } else {
      direction = 'down';
      if (destinationFloors.some((destFloor) => destFloor > currentFloor)) {
        this.snackBar.open('One of the destination floors is above the elevator', 'X');
        return;
      }
    }

    destinationFloors = destinationFloors.filter((destFloor) => destFloor !== currentFloor);

    this.currentFloorFormControl.setValue(null);
    this.destinationFloorsFormControl.setValue(null);
    this.elevatorIdFormControl.setValue(null);

    this.updatedElevator.emit({ id, currentFloor, destinationFloors, direction });
  }
}

function parseControlToNumber(formControl: FormControl): number | null {
  if (!formControl.value) {
    return null;
  }
  return Number(formControl.value);
}

function parseControlToArrayOfNumbers(formControl: FormControl): Array<number> {
  if (!formControl.value) {
    return [];
  }

  return formControl.value.split(',').map((v: string) => Number(v)).filter((v: number) => !isNaN(v));
}
