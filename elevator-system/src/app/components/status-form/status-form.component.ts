import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  elevatorIdFormControl = new FormControl(null, []);

  constructor(private snackBar: MatSnackBar) {}

  submit() {
    const elevatorId = this.elevatorIdFormControl.value;
    if (!elevatorId && elevatorId !== 0) {
      this.snackBar.open('"elevator id" field is empty', 'X');
      return;
    }
    if (elevatorId < 1 || elevatorId > 16) {
      this.snackBar.open('elevator id should be between 1 and 16', 'X');
      return;
    }
    this.elevatorIdFormControl.setValue(null);
    this.selectedElevatorId.emit(elevatorId);
  }
}
