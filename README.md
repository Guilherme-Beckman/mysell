<p align="center">
  <img src="https://raw.githubusercontent.com/Guilherme-Beckman/mysell/main/frontend/mysell/src/assets/icon/favicon.png" />
  <h1 align="center">MySell</h1>
</p>

🌍 Languages: [English](README.md) | [Português](README.pt-br.md)


<p align="center">
  <a aria-label="Portfolio - Guilherme Beckman" href="https://github.com/Guilherme-Beckman"><img src="https://img.shields.io/badge/Portfolio-Guilherme%20Beckman-931ad9" /></a> 
</p>

## :bulb: About the Project

**MySell** is an application that helps small entrepreneurs record their daily sales.  
The platform provides features such as login and registration with JWT, Google and Facebook authentication, product and sales registration, PDF report generation, sales history, and protection against suspicious access attempts.

---

## :wrench: Technologies

### Back-end
* Java 17+
* Spring Boot WebFlux (parallel processing)
* PostgreSQL (database)
* Redis (cache)
* Flyway (migrations)
* JWT (authentication and authorization)
* OAuth2 (Google and Facebook)
* Exception handling with RFC
* Spring Security
* MVC
* CORS

### Front-end
* Angular 19
* Ionic
* TypeScript
* HTML / CSS
* Figma (design)
* Camera and QR Code plugins

---

## :scroll: Features

### Authentication & Users
* [x] Registration and login with JWT  
* [x] Login with Google and Facebook  
* [x] Email verification upon user registration  
* [x] Account lockout after multiple failed login or validation attempts  
* [x] Welcome email sending  

### Products
* [x] Manual product registration  
* [x] Product registration via QR Code (external API)  
* [x] Product registration using pre-created products  
* [x] Product editing  
* [x] Product deletion  

### Sales
* [x] Sales registration  
* [x] Deletion of sales made within the last 24 hours  
* [x] Product and sales search  
* [x] Sales history  

### Reports
* [x] Generation of daily, weekly, and monthly reports  
* [x] Export reports in PDF  

### Security & Best Practices
* [x] Web exception handling with RFC  
* [x] Cache for performance optimization  
* [x] Angular Guards to protect routes with JWT token  
* [x] Clean Code and MVC  
* [x] Use of external APIs  
* [x] Planned database design  

---

## :book: Planning

### Diagrams
The system design was planned in two main stages:

* **Database:** modeled in [DrawSQL](https://drawsql.app/) to structure entities, relationships, and keys.  
* **Screen Flow:** designed in Figma to map authentication, product registration, report generation, and sales history.  

<p align="center">
  <img src="https://raw.githubusercontent.com/Guilherme-Beckman/mysell/main/drawSQL-image-export-2025-09-07.png" alt="Database Diagram" width="700"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Guilherme-Beckman/mysell/main/MySell%20%E2%80%93%20Figma.png" alt="Screen Flow in Figma" width="700"/>
</p>

---

## :floppy_disk: Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/Guilherme-Beckman/mysell.git
````

### Back-end

Requirements:

* Java JDK 17 or higher
* PostgreSQL 16
* Redis
* Docker & Docker Compose
* IDE with Java support (VS Code, IntelliJ IDEA, or Spring Tool Suite)

### Front-end

Requirements:

* Node.js
* Angular CLI (`npm install -g @angular/cli`)
* Ionic CLI (`npm install -g @ionic/cli`)
* Code editor with TypeScript support (VS Code, WebStorm, etc.)

Install dependencies:

```bash
cd frontend
npm install
```

Start the development server:

```bash
ng serve
```
