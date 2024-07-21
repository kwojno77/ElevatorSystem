# ElevatorSystem

Elevator System is a web application built with Angular and Firebase,
designed to simulate and manage the operation of multiple elevators.

## Firebase hosting

The application can be accessed either locally or via the following URL:
https://elevatorsystem-96a76.web.app/

## Running Locally

### Prerequisites

Before running the application locally, ensure you have the following software installed:

- **Angular CLI**: version 18.x or later
- **Node.js**: version 20.x or later
- **npm**: version 10.x or later

### Steps
1) Go to elevator-system directory
2) Install the required packages by running `npm install`
3) Start the development server with `ng serve`.
4) Open your browser and go to `http://localhost:4200/`.

## Usage

Upon opening the web app, you will see an administration panel at the top of the page
and a table below. A table provides information about the current status of 16 elevators.
The administration panel allows you to perform four actions.

### Step

The "Step" action advances the simulation by one step.
All elevators that are currently moving up or down will change their floor by 1.

### Pickup

The "Pickup" action simulates a person calling an elevator from a specific floor.
The caller provides their current floor and a destination floor.
After action table row with called elevator's id will be highlighted.

### Update

The "Update" action allows you to change the position of an elevator
and update the list of floors where the elevator will stop.
After this action, the table row corresponding to the updated elevator's id will be highlighted.

### Status

The "Status" action highlights the row of the table corresponding to the elevator with the specified id.

## GitHub Actions

The Elevator System is configured to perform automatic deployments to Firebase Hosting via GitHub Actions.
This ensures that the latest changes are always deployed and accessible online.

Any changes pushed to the main branch will trigger the GitHub Actions workflow and deploy the latest version of the application to Firebase Hosting.
