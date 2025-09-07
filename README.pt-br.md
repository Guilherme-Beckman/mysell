
<p align="center">
  <img src="https://raw.githubusercontent.com/Guilherme-Beckman/mysell/main/frontend/mysell/src/assets/icon/favicon.png" />
  <h1 align="center">MySell</h1>
</p>

🌍 Idiomas: [English](README.md) | [Português](README.pt-br.md)


<p align="center">
  <a aria-label="Portfólio - Guilherme Beckman" href="https://github.com/Guilherme-Beckman"><img src="https://img.shields.io/badge/Portf%C3%B3lio-Guilherme%20Beckman-931ad9" /></a> 
</p>

## :bulb: Sobre o Projeto

**MySell** é um aplicativo que auxilia pequenos empreendedores a registrarem suas vendas diariamente.  
A plataforma oferece funcionalidades como login e registro com JWT, autenticação via Google e Facebook, registro de produtos e vendas, geração de relatórios em PDF, histórico de vendas e proteção contra tentativas suspeitas de acesso.

---

## :wrench: Tecnologias

### Back-end
* Java 17+  
* Spring Boot WebFlux (processamento paralelo)  
* PostgreSQL (banco de dados)  
* Redis (cache)  
* Flyway (migrations)  
* JWT (autenticação e autorização)  
* OAuth2 (Google e Facebook)  
* Tratamento de exceções usando RFC  
* Spring Security  
* MVC  
* CORS  

### Front-end
* Angular 19  
* Ionic  
* TypeScript  
* HTML / CSS  
* Figma (design)  
* Plugins de câmera e QR Code  

---

## :scroll: Funcionalidades

### Autenticação e Usuários
* [x] Registro e login com JWT  
* [x] Login via Google e Facebook  
* [x] Verificação de email ao registrar usuário  
* [x] Bloqueio de contas após muitas tentativas de login ou código incorreto  
* [x] Envio de email de boas-vindas  

### Produtos
* [x] Registro manual de produtos  
* [x] Registro via QR Code (API externa)  
* [x] Registro usando produtos pré-criados  
* [x] Edição de produtos  
* [x] Exclusão de produtos  

### Vendas
* [x] Registro de vendas  
* [x] Exclusão de vendas realizadas nas últimas 24 horas  
* [x] Busca de produtos e vendas  
* [x] Histórico de vendas  

### Relatórios
* [x] Geração de relatórios diários, semanais e mensais  
* [x] Exportação em PDF  

### Segurança e Boas Práticas
* [x] Tratamento de exceções web usando RFC  
* [x] Cache para otimização de performance  
* [x] Guards no Angular para proteger rotas com JWT  
* [x] Clean Code e MVC  
* [x] Utilização de APIs externas  
* [x] Banco de dados planejado  

---

## :book: Planejamento

### Diagramas
O design do sistema foi planejado em duas etapas principais:

* **Banco de Dados:** modelado no [DrawSQL](https://drawsql.app/) para estruturar entidades, relacionamentos e chaves.  
* **Fluxo de Telas:** planejado no Figma para mapear autenticação, registro de produtos, geração de relatórios e histórico de vendas.  

<p align="center">
  <img src="https://raw.githubusercontent.com/Guilherme-Beckman/mysell/main/drawSQL-image-export-2025-09-07.png" alt="Diagrama do Banco de Dados" width="700"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Guilherme-Beckman/mysell/main/MySell%20%E2%80%93%20Figma.png" alt="Fluxo de Telas no Figma" width="700"/>
</p>

---

## :floppy_disk: Instalação

Clone o repositório na sua máquina local:

```bash
git clone https://github.com/Guilherme-Beckman/mysell.git
````

### Back-end

Pré-requisitos:

* Java JDK 17 ou superior
* PostgreSQL 16
* Redis
* Docker e Docker Compose
* IDE com suporte a Java (VS Code, IntelliJ IDEA ou Spring Tool Suite)

### Front-end

Pré-requisitos:

* Node.js
* Angular CLI (`npm install -g @angular/cli`)
* Ionic CLI (`npm install -g @ionic/cli`)
* Editor de código com suporte a TypeScript (VS Code, WebStorm, etc.)

Instale as dependências:

```bash
cd frontend
npm install
```

Inicie o servidor de desenvolvimento:

```bash
ng serve
```
