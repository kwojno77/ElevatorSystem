import { Component, EventEmitter, Output } from '@angular/core';
import { PickupEvent } from '../../interfaces/pickup-event.interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-pickup-form',
  standalone: true,
  imports: [
    MatButton,
    MatInput,
    ReactiveFormsModule
  ],
  templateUrl: './pickup-form.component.html',
  styleUrl: './pickup-form.component.css'
})
export class PickupFormComponent {
  @Output() pickupEvent = new EventEmitter<PickupEvent>();

  currentFloorFormControl = new FormControl(null, [Validators.required]);
  destinationFloorFormControl = new FormControl(null, [Validators.required]);

  submit() {
    const currentFloor = this.currentFloorFormControl.value;
    const destinationFloor = this.destinationFloorFormControl.value;

    if (!currentFloor && currentFloor !== 0) {
      return;
    }
    if (!destinationFloor && destinationFloor !== 0) {
      return;
    }
    if (currentFloor === destinationFloor) {
      return;
    }
    this.pickupEvent.emit({ currentFloor, destinationFloor });
  }
}
