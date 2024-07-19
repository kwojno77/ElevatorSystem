import { ElevatorDirection } from '../types/elevator-direction';

export interface Elevator {
  id: number;
  currentFloor: number;
  destinationFloors: Array<number>;
  direction: ElevatorDirection;
}
