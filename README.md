<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## About WorkFlowHub

WorkFlowHub is a comprehensive employee and project management system built on the Nest.js framework. It's designed to streamline and simplify the way companies manage their teams and projects. With a focus on enhancing collaboration, productivity, and accountability, WorkFlowHub offers a robust solution for organizations of all sizes.

### Key Features

- **Company Management**: Register your company, manage employees, and oversee projects effortlessly.

- **Employee Dashboard**: Empower your team with personalized dashboards, allowing them to manage their profiles, tasks, and project assignments with ease.

- **Password Reset**: Employees can reset their passwords securely via email OTP, ensuring data security and accessibility.

- **Effortless Project Management**: Create, edit, and track projects, assign tasks, and set deadlines for efficient project monitoring.

- **Scheduled Notifications**: WorkFlowHub's scheduled cron jobs provide timely updates and reminders.
  - **12 AM Daily Cron Job**: Generates project status tables for a quick overview of ongoing projects.
  - **7 PM Daily Cron Job**: Checks employee project updates and sends reminders via Firebase Cloud Messaging (FCM).

- **Firebase Cloud Messaging (FCM)**: Real-time notifications keep everyone informed and projects on track.

- ### Database Schema
  ![Task Unity (2)](https://github.com/Harshsharma836/TaskUnity-ManageEmployees/assets/70514943/3d045265-e816-4f00-b3ab-00a613fee3e1)






## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
