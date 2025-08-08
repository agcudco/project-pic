# Project Title

## Description
This project is a frontend application that manages roles using React and PrimeReact. It provides a user-friendly interface for creating, editing, and deleting roles, with a focus on CRUD functionality.

## Project Structure
```
project-front
├── src
│   ├── components
│   │   └── rol
│   │       ├── RolComponent.tsx
│   │       ├── RolDataTable.tsx
│   │       └── RolForm.tsx
│   ├── services
│   │   └── servicesRol.ts
│   └── types
│       └── rol.ts
└── README.md
```

## Components
- **RolComponent.tsx**: Manages the state of roles, displays a list of roles, and handles the creation and editing of roles through a form.
- **RolDataTable.tsx**: Renders a data table of roles and provides action buttons for editing and deleting roles.
- **RolForm.tsx**: Displays a dialog form for creating or editing a role.

## Services
- **servicesRol.ts**: Contains functions for managing roles, including adding, retrieving, updating, and deleting roles.

## Types
- **rol.ts**: Defines the structure of a role object.

## Setup Instructions
1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Start the development server with `npm start`.

## Usage
- Navigate to the roles management section to view, create, edit, or delete roles.
- Use the provided forms and tables for interaction.

## License
This project is licensed under the MIT License.