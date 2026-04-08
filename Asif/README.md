# Cafe Management System (Angular 21)

A complete, production-ready Cafe Management System built with Angular 21, Angular Material, and RxJS. This system includes Role-Based Access Control (RBAC), menu management, a point-of-sale (POS) terminal, and dashboard analytics.

## Features

- **Dashboard**: Real-time business metrics (Revenue, Order volume, Bestsellers).
- **Authentication**: Role-based login (Admin/Staff).
- **Menu Management**: CRUD operations for cafe food and drink items.
- **POS Console**: Tablet-friendly order intake system with cart management.
- **Billing History**: Record of all past transactions.
- **State Persistence**: Data is persisted in LocalStorage for demo purposes.

## Prerequisites

- Node.js (v18.0.0 or higher)
- Angular CLI (v19.0.0 or higher - compatible with Angular 21)
- npm (v9.0.0 or higher)

## Installation

1. Install dependencies:
    npm install

## Running the Application

1. Start the development server:
    ng serve

2. Open your browser and navigate to:
    `http://localhost:4200`

## Default Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Permissions**: Full access including Menu Management.

### Staff Account
- **Username**: `staff`
- **Password**: `staff123`
- **Permissions**: Limited access to Dashboard, POS, and Billing only.

## Project Structure

- `src/app/core`: Singleton services, guards, and interfaces.
- `src/app/features`: Main application modules (Auth, Dashboard, Menu, POS).
- `src/app/shared`: Layout components and reusable elements.

## Troubleshooting

- **Style issues**: Ensure "indigo-pink.css" or another Material theme is imported in `angular.json`.
- **Node Version**: If you get a version mismatch, try using `nvm use 18` or higher.
