# Goober

**Goober** is a Uber-like web app that offers a ride-share taxi service.

This application was created as a code challenge, the application is hosted at: https://goober-beryl.vercel.app/ using [Vercel](https://vercel.com/) for server and database hosting.

## Requirements

NodeJS v19 or v20

## Setup

Clone the repository and install dependencies

> npm install

To simply run in development mode:

> npm run dev

To run a production build

> npm run build
> npm run start

To open a web db viewer

> npm run db:studio

**What about API Keys and secrets?**

They are included in the .env file, these are shared with the deployed environment, use caution.

## Assumptions and decisions

As part of this challenge, many decisions where taken along the way

### Main focus

The focus of this application was tailored to the flow of a user's trip, from creation to completion. Mainly on the API side, but some care was put into the UI with the integration of Google Maps
The behaviour of the application is detailed as follows:

#### Drivers

Drivers can set whether or not they are available, when available, trips will be assigned to them at random, once a trip is assigned, no other trips will be assigned until the current one is cancelled (by driver or rider) or completed.

Drivers can see the origin and destination of the trip, and how much they will earn (The platform does not take a cut), this rate is calculated based on the distance of the trip.

#### Riders

Riders can set up their trip origin and destination, once set, they will see how much it will cost.

Riders newly created trips will be assigned to a driver at random, if none are available, an error is shown to the user.

Riders trips status' is kept up to date through the duration of their trip, once finished (completed or cancelled) they will be able to create a new trip. 

### Out of scope

As part of the spirit of the challenge, many potential features and technical details that would be important for a fully functional application where not implemented:

- Admin panel
- Authentication
- Chat system
- Analytics
- Monitoring
- Multiple environments
- Testing
- Users trips history
- WebSockets/Server-Sent Events
- Rentable business model
- Sound driver asignation to trips based on location
- Allow trips to be created with a pending driver assignation

### Simplification

Along with removing features, some where overly simplified compared to what would be implemented in the real world, however the decisions were tailored to use the time into things that would be improved, and not removed completely

- Modern tech stack and libraries are used, like Drizzle ORM.
- The UI/UX was simplified using basic styling, integrating a component library should be straightforward. However Google Maps integration was included, since it is the stepping stone to show both riders and drivers where they are going.
- A polling system was used to refetch queries, which is straightforward to remove, but not without spending some time implementing Web Sockets or Server-Sent Events
- Since this is a single developer work, no ticketing system was used (like Jira or Trello), however a to do list was used to track progress and set goals.

### To do list

- [X] Connect DB and deployment
- [X] Setup entities
- [X] Hello user/home
- [X] Basic routing
- [X] Basic styling
- [X] Google maps integration
- [X] Driver set available
- [X] Rider Request trip
- [X] Assign trip to Driver
- [X] See driver and rider in progress trips
- [X] Allow driver and rider to change status of their trips
- [X] Polling

### Time spent

Around 12 hours in total
