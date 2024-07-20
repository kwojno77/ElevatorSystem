import { Component, EventEmitter, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElevatorDirection } from '../../types/elevator-direction';
import { Elevator } from '../../interfaces/elevator.interface';

@Component({
  selector: 'app-update-form',
  standalone: true,
  imports: [
    MatButton,
    MatInput,
    ReactiveFormsModule
  ],
  templateUrl: './update-form.component.html',
  styleUrl: './update-form.component.css'
})
export class UpdateFormComponent {
  @Output() updatedElevator = new EventEmitter<Elevator>();

  elevatorIdFormControl = new FormControl(null, [Validators.required]);
  currentFloorFormControl = new FormControl(null, [Validators.required]);
  destinationFloorsFormControl = new FormControl(null, [Validators.required]);

  submit() {
    const currentFloor = this.currentFloorFormControl.value;
    const destinationFloors: Array<number> = (this.destinationFloorsFormControl.value ?? '').trim().split(',').map(v => Number(v.trim()));
    const id = this.elevatorIdFormControl.value;

    if (!currentFloor && currentFloor !== 0) {
      return;
    }
    if (!id) {
      return;
    }

    let direction: ElevatorDirection;
    if (destinationFloors.length === 0) {
      direction = null;
    } else if (destinationFloors[0] > currentFloor) {
      direction = 'up';
      if (destinationFloors.some((destFloor) => destFloor <= currentFloor)) {
        return;
      }
    } else {
      direction = 'down';
      if (destinationFloors.some((destFloor) => destFloor >= currentFloor)) {
        return;
      }
    }

    this.updatedElevator.emit({ id, currentFloor, destinationFloors, direction });
  }
}
