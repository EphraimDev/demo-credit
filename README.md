# demo-credit

This is used to create users and their wallets, fund, transfer and withdraw from user wallets

## Schema Design
![alt text](https://github.com/EphraimDev/demo-credit/blob/main/dbdesign.PNG?raw=true)

## Installation Guide

- Clone the project *git clone https://github.com/EphraimDev/demo-credit.git*
- Create your .env from the .env.sample file

1. For linux run *cp .env.example .env*
2. For windows run *copy .env.example .env*

- Install dependencies * npm i*
- Fill your database config in your .env. Please make use of mysql or postgres

## Migrations

- Run migrations using *npm run migration*

## Seeding

- Run seeder using *npm run seed*

## Build project

- Run *npm run build*

## Start project

- Run *npm start*

## Documentation

- https://documenter.getpostman.com/view/4011331/2s83ziQPwU

## Stack used
- Nodejs
- Typescript
- Mysql
- KnexJS ORM
