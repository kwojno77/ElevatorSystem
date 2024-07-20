import { Injectable } from '@angular/core';
import { Elevator } from '../interfaces/elevator.interface';
import { Nullish } from '../types/nullish';
import { ElevatorDirection } from '../types/elevator-direction';

@Injectable({
  providedIn: 'root'
})
export class ElevatorService {
  elevators: Array<Elevator> = [
    { id: 1, currentFloor: 0, destinationFloors: [5], priorityFloor: 5, direction: 'up'},
    { id: 2, currentFloor: 5, destinationFloors: [], direction: null},
    { id: 3, currentFloor: 4, destinationFloors: [], direction: null},
    { id: 4, currentFloor: 21, destinationFloors: [24, 26, 28, 30], direction: 'up'},
    { id: 5, currentFloor: 17, destinationFloors: [20], direction: 'up'},
    { id: 6, currentFloor: 3, destinationFloors: [1], direction: 'down'},
    { id: 7, currentFloor: 0, destinationFloors: [5], direction: 'up'},
    { id: 8, currentFloor: 5, destinationFloors: [], direction: null},
    { id: 9, currentFloor: 4, destinationFloors: [], direction: null},
    { id: 10, currentFloor: 21, destinationFloors: [24, 26, 28, 30], direction: 'up'},
    { id: 11, currentFloor: 17, destinationFloors: [20], direction: 'up'},
    { id: 12, currentFloor: 3, destinationFloors: [1], direction: 'down'},
    { id: 13, currentFloor: 4, destinationFloors: [], direction: null},
    { id: 14, currentFloor: 21, destinationFloors: [24, 26, 28, 30], direction: 'up'},
    { id: 15, currentFloor: 17, destinationFloors: [20], direction: 'up'},
    { id: 16, currentFloor: 3, destinationFloors: [1], direction: 'down'},
  ];

  waitingCallers: Array<{callerCurrentFloor: number, callerDestinationFloor: number}> = [];

  constructor() {}

  getElevators(): Array<Elevator> {
    return [...this.elevators];
  }

  step(): Elevator[] {
    this.elevators = this.getElevators().map(elevator => {
      const updatedCurrentFloor = elevator.direction === 'up'
        ? elevator.currentFloor + 1
        : elevator.direction === 'down'
          ? elevator.currentFloor - 1
          : elevator.currentFloor;

      const updatedDestinationFloors = elevator.destinationFloors.filter((destFloor) => destFloor !== updatedCurrentFloor);

      const updatedPriorityFloor = updatedCurrentFloor === elevator.priorityFloor ? null : elevator.priorityFloor;

      const updatedDirection = updatedDestinationFloors.length === 0
          ? null
          : elevator.direction;

      const updatedElevator = {
        ...elevator,
        currentFloor: updatedCurrentFloor,
        direction: updatedDirection,
        destinationFloors: updatedDestinationFloors,
        priorityFloor: updatedPriorityFloor
      }

      if (updatedPriorityFloor != elevator.priorityFloor) {
        this.updateDirection(updatedElevator);
      }
      // TODO update waiting list
      return updatedElevator;
    });
    return this.elevators;
  }

  pickup(callerCurrentFloor: number, callerDestinationFloor: number): Nullish<Elevator> {
    if (callerCurrentFloor === callerDestinationFloor) { return null }

    const callerDirection: ElevatorDirection = callerCurrentFloor > callerDestinationFloor ? 'down' : 'up';

    console.debug('callerDirection', callerDirection);
    const matchingElevators = this.getElevators().filter((elevator) => elevator.direction === null
        || (callerDirection === elevator.direction
          && ((callerDirection === 'up' && elevator.currentFloor <= callerCurrentFloor)
            || (callerDirection === 'down' && elevator.currentFloor >= callerCurrentFloor))));

    console.debug('matching', matchingElevators);

    const nearestElevator = matchingElevators.reduce((previousValue: Nullish<Elevator>, currentValue: Elevator) => {
        if (!previousValue) {
          return currentValue;
        }

        const previousDiff = Math.abs(previousValue.currentFloor - callerCurrentFloor);
        const currentDiff = Math.abs(currentValue.currentFloor - callerCurrentFloor);

        return previousDiff < currentDiff ? previousValue : currentValue;
      }, null);

    console.debug('nearest', nearestElevator);

    if (!nearestElevator) {
      this.waitingCallers.push({callerCurrentFloor, callerDestinationFloor});
      return null;
    }

    const isNearestOnCurrentFloor = nearestElevator.currentFloor === callerCurrentFloor;

    if (isNearestOnCurrentFloor) {
      nearestElevator.destinationFloors.push(callerDestinationFloor);
    } else {
      if (nearestElevator.direction === null) {
        nearestElevator.priorityFloor = callerCurrentFloor;
      }
      nearestElevator.destinationFloors.push(callerCurrentFloor, callerDestinationFloor);
    }

    nearestElevator.direction = nearestElevator.currentFloor > callerCurrentFloor ? 'down' : 'up';

    this.update(nearestElevator);

    return nearestElevator;
  }

  update(updatedElevator: Elevator) {
    this.elevators = this.getElevators().map(elevator => elevator.id === updatedElevator.id ? updatedElevator : elevator);
  }

  private updateDirection(elevator: Elevator) {
    let direction: ElevatorDirection;
    if (elevator.destinationFloors.length === 0) {
      direction = null;
    } else if (elevator.destinationFloors[0] > elevator.currentFloor) {
      direction = 'up';
    } else {
      direction = 'down';
    }
    elevator.direction = direction;
  }
}
