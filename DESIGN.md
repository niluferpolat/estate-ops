## DESIGN - System Architecture 

## 1. Architecture & Data Model

### 1.1 NestJS Module & Layer Structure
I structured the NestJS application using a layered architecture, which keeps the codebase modular, testable, and easy to maintain.
Since this project is not very large, splitting the logic into clear modules (Agencies, Transactions, Transaction History) provides clean separation of concerns without introducing unnecessary complexity.

Each module encapsulates its own DTOs, schemas, controllers, and services, following NestJS best practices.
This structure makes the system scalable while keeping business logic isolated and maintainable.


````Estate-OPS/
└── src/
    ├── agencies/
    │   ├── dtos/
    │   ├── schemas/
    │   ├── agencies.controller.ts
    │   ├── agencies.module.ts
    │   ├── agencies.service.spec.ts   
    │   └── agencies.service.ts
    │
    ├── transaction-history/
    │   ├── schemas/
    │   ├── transaction-history.module.ts
    │   ├── transaction-history.service.spec.ts 
    │   └── transaction-history.service.ts
    │
    ├── transactions/
    │   ├── dtos/
    │   ├── schemas/
    │   ├── enums/
    │   ├── transactions.controller.ts
    │   ├── transactions.service.ts
    │   ├── transactions.service.spec.ts
    │   └── transactions.module.ts
    │
    ├── app.module.ts
    └── main.ts
````

### 1.2 MongoDB Document & Collection Design
The system is modeled using three main collections: Agencies, Transactions, and TransactionHistory.
- Agency can be registered by writing their names. I assumed that name is unique.
- Agents can be created and 
<img width="1064" height="645" alt="image" src="https://github.com/user-attachments/assets/80f5e01d-d284-4cff-9b2b-26a634f22f9e" />


### 1.3 Why This Structure Was Chosen
...

### 1.4 Rejected Alternatives & Reasons
...


## 2. Most Challenging / Riskiest Part

### 2.1 Risky Design Decision
...

### 2.2 How the Risk Was Mitigated
...


## 3. Real-Life Implementation — What’s Next?

### 3.1 Recommended Future Enhancements
...

### 3.2 Why These Features Matter
...
