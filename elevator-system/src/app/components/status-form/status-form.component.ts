import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-status-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './status-form.component.html',
  styleUrl: './status-form.component.css'
})
export class StatusFormComponent {
  @Output() selectedElevatorId = new EventEmitter<number>();

  elevatorIdFormControl = new FormControl(null, [Validators.required]);

  submit() {
    if (!this.elevatorIdFormControl.value) {
      return;
    }
    this.selectedElevatorId.emit(this.elevatorIdFormControl.value);
  }
}
