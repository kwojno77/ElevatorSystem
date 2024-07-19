import { Injectable } from '@angular/core';
import { Elevator } from '../interfaces/elevator.interface';
import { Nullish } from '../types/nullish';
import { ElevatorDirection } from '../types/elevator-direction';

@Injectable({
  providedIn: 'root'
})
export class ElevatorService {
  elevators: Array<Elevator> = [
    { id: 1, currentFloor: 0, destinationFloors: [5], direction: 'down'},
    { id: 2, currentFloor: 5, destinationFloors: [], direction: null},
    { id: 3, currentFloor: 4, destinationFloors: [], direction: null},
    { id: 4, currentFloor: 21, destinationFloors: [24, 26, 28, 30], direction: 'up'},
    { id: 5, currentFloor: 17, destinationFloors: [20], direction: 'up'},
    { id: 6, currentFloor: 3, destinationFloors: [1], direction: 'down'},
  ];

  waitingCallers: Array<{callerCurrentFloor: number, callerDestinationFloor: number}> = [];

  constructor() {}

  status(id: number): Nullish<Elevator> {
    const elevator = this.elevators.find((e: Elevator) => e.id === id);

    return elevator ?? null;
  }

  getElevators(): Array<Elevator> {
    return this.elevators;
  }

  step() {
    this.elevators = [...this.elevators].map(elevator => {
      const updatedCurrentFloor = elevator.direction === 'up'
        ? elevator.currentFloor + 1
        : elevator.direction === 'down'
          ? elevator.currentFloor - 1
          : elevator.currentFloor;

      const updatedDestinationFloors = elevator.destinationFloors.filter((destFloor) => destFloor !== updatedCurrentFloor);

      const updatedDirection = updatedDestinationFloors.length === 0 ? null : elevator.direction;

      const updatedElevator = {
        ...elevator,
        currentFloor: updatedCurrentFloor,
        direction: updatedDirection,
        destinationFloors: updatedDestinationFloors
      }
      // TODO update waiting list
      return updatedElevator;
    });
  }

  pickup(callerCurrentFloor: number, callerDestinationFloor: number) {
    if (callerCurrentFloor === callerDestinationFloor) { return }

    const callerDirection: ElevatorDirection = callerCurrentFloor > callerDestinationFloor ? 'down' : 'up';

    const matchingElevators = this.elevators.filter((elevator) => [callerDirection, null].includes(elevator.direction)
      && ((callerDirection === 'up' && elevator.currentFloor < callerCurrentFloor)
        || (callerDirection === 'down' && elevator.currentFloor > callerCurrentFloor)));

    const nearestElevator = matchingElevators.reduce((previousValue: Nullish<Elevator>, currentValue: Elevator) => {
        if (!previousValue) {
          return currentValue;
        }

        const previousDiff = Math.abs(previousValue.currentFloor - callerCurrentFloor);
        const currentDiff = Math.abs(currentValue.currentFloor - callerCurrentFloor);

        return previousDiff < currentDiff ? previousValue : currentValue;
      }, null);

    if (nearestElevator) {
      nearestElevator.destinationFloors.push(callerCurrentFloor, callerDestinationFloor);
      this.update(nearestElevator);
    } else {
      this.waitingCallers.push({callerCurrentFloor, callerDestinationFloor});
    }
  }

  update(updatedElevator: Elevator) {
    this.elevators = [...this.elevators].map(elevator => elevator.id === updatedElevator.id ? updatedElevator : elevator);
  }
}
