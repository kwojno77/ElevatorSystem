import { Injectable } from '@angular/core';
import { Elevator } from '../interfaces/elevator.interface';
import { Nullish } from '../types/nullish';
import { ElevatorDirection } from '../types/elevator-direction';
import { Caller } from '../interfaces/caller.interface';
import { isNullOrUndef } from '../helpers/helpers';

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

  waitingCallers: Array<Caller> = [];

  constructor() {}

  getElevators(): Array<Elevator> {
    return [...this.elevators];
  }

  getCallers(): Array<Caller> {
    return [...this.waitingCallers];
  }

  step() {
    this.elevators = this.getElevators().map(elevator => {
      const updatedCurrentFloor = elevator.direction === 'up'
        ? elevator.currentFloor + 1
        : elevator.direction === 'down'
          ? elevator.currentFloor - 1
          : elevator.currentFloor;

      const updatedPriorityFloor = updatedCurrentFloor === elevator.priorityFloor ? null : elevator.priorityFloor;

      const updatedDestinationFloors = elevator.destinationFloors.filter((destFloor) => destFloor !== updatedCurrentFloor || updatedPriorityFloor);

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
      return updatedElevator;
    });

    this.waitingCallers = this.getCallers().filter((caller) => !this.pickup(caller.currentFloor, caller.destinationFloor));
  }

  pickup(callerCurrentFloor: number, callerDestinationFloor: number, alreadyWaiting?: boolean): Nullish<Elevator> {
    if (callerCurrentFloor === callerDestinationFloor) { return null }

    const callerDirection: ElevatorDirection = callerCurrentFloor > callerDestinationFloor ? 'down' : 'up';

    const nearestElevator = this.findNearestElevator({ currentFloor: callerCurrentFloor, destinationFloor: callerDestinationFloor });

    if (!nearestElevator) {
      if (!alreadyWaiting) {
        this.waitingCallers.push({
          currentFloor: callerCurrentFloor,
          destinationFloor: callerDestinationFloor
        });
      }
      return null;
    }

    const isNearestOnCurrentFloor = nearestElevator.currentFloor === callerCurrentFloor;

    if (!nearestElevator.destinationFloors.includes(callerDestinationFloor)) {
      nearestElevator.destinationFloors.push(callerDestinationFloor);
    }

    if (!isNearestOnCurrentFloor) {
      if (nearestElevator.direction === null) {
        nearestElevator.priorityFloor = callerCurrentFloor;
      }
      if (!nearestElevator.destinationFloors.includes(callerCurrentFloor)) {
        nearestElevator.destinationFloors.push(callerCurrentFloor);
      }
    }

    if (nearestElevator.currentFloor === callerCurrentFloor) {
      nearestElevator.direction = callerDirection;
    } else {
      nearestElevator.direction = nearestElevator.currentFloor > callerCurrentFloor
          ? 'down'
          : 'up';
    }

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

  private findNearestElevator(caller: Caller): Nullish<Elevator> {
    const callerDirection: ElevatorDirection = caller.currentFloor > caller.destinationFloor ? 'down' : 'up';

    const matchingElevators = this.getElevators().filter((elevator) => elevator.direction === null
      || (callerDirection === elevator.direction
        && ((callerDirection === 'up' && elevator.currentFloor <= caller.currentFloor)
          || (callerDirection === 'down' && elevator.currentFloor >= caller.currentFloor)))
        && isNullOrUndef(elevator.priorityFloor));

    return matchingElevators.reduce((previousValue: Nullish<Elevator>, currentValue: Elevator) => {
      if (!previousValue) {
        return currentValue;
      }

      const previousDiff = Math.abs(previousValue.currentFloor - caller.currentFloor);
      const currentDiff = Math.abs(currentValue.currentFloor - caller.currentFloor);

      return previousDiff < currentDiff ? previousValue : currentValue;
    }, null);
  }
}
