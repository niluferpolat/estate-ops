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

<img width="1064" height="645" alt="image" src="https://github.com/user-attachments/assets/80f5e01d-d284-4cff-9b2b-26a634f22f9e" />


##### Agencies and Agents
- An agency can be registered by providing a unique name.
- Agencies act as the parent organization for transactions and agents.
- /my-agents/:id ---->I wrote this endpoint, and I imagined a selectbox where agencies can see the agents that belong to them and assign active agents and their roles while creating a transaction.

###### Transactions  
- Transactions have only one agencyId and their assigned agents. They have one clientIdNumber and one propertyIdNumber. Their stage always starts with agreement.
- Those fields of Transactions can be updated: 
    1. clientIdNumber, propertyIdNumber, totalCommission, assignedAgents and agencyId
    2. The transaction info can be changed unless its stage is *completed*
    3. with /transactions/:agentId we can see the transactions assigned to a specific agent
- Transactions' stage only can be changed with /transactions/moveToNextStage:
   1. I defined the transaction stages in an enum. So if we add or remove a stage, updating the enum will be enough. I assumed that users would change the stage with a selectbox containing these stage options.
   2.  <img width="539" height="96" alt="image" src="https://github.com/user-attachments/assets/ce8ad163-e533-42e7-89ca-caef12cfff93" /> I get the stage order with this  code.
   3.  <img width="815" height="124" alt="image" src="https://github.com/user-attachments/assets/89ae00cd-a8be-421a-a0d0-86ed5c231645" /> If the difference is not equal to 1 it throws an Exception as shown in this image.
   4.  As users move the transaction to the next stage, they save transaction into the TransactionHistory table.

###### Transaction History
- As the user creates a transaction it triggers creating a history
- Transaction History have one transactionId, fromStage, toStage and note fields.
- I designed this module separately from the transaction table because keeping the history inside the main transaction document would make it unnecessarily complex. I imagined that there would be an 👁️ icon to view the history, using an endpoint like /:id/history. Alternatively, instead of an icon, clicking on a "See Details" section could navigate the user to a separate page to display the transaction history.
I structured it this way to keep the system easy to maintain and flexible for future changes.

###### Financial Breakdown
- i didn't store this breakdown in a table
- If our transaction status is completed i assumed that there would be dialog and when we click on the transaction's see details. we would see the breakdown as an object.
- As shown in the image we can assign the relevant roles and map the weighted agents relying on those roles.
  
 <img width="857" height="243" alt="image" src="https://github.com/user-attachments/assets/20289e6c-b9b3-42e1-bafe-e0c441939213" />
 
 - Here is the calculation of the agent commission per weight:
If an agent has two roles, their weight becomes 2, and their commission is calculated as: commission = weight * agentCommissionPerWeight
   
   <img width="378" height="147" alt="image" src="https://github.com/user-attachments/assets/d5b96376-860d-4c2e-aa30-bd54f9604f27" />

- The commission rules are defined in a separate configuration, so if we ever need to change them, we can do it easily.
  
   <img width="1052" height="364" alt="image" src="https://github.com/user-attachments/assets/0f4e1aea-8445-4eb4-8afa-e7e827801467" />


### 1.3 Why This Structure Was Chosen
This structure was chosen to keep the system maintainable, scalable, and aligned with typical real-world workflow requirements in real estate operations. Each module and collection was intentionally separated based on responsibility and data-change frequency.

- Agencies rarely change and represent long live organizational data
- Agents belong to a single agency and primarily used as assignable employees inside transactions
- Keeping those concerns seprarate prevents unnecessary duplication of data and ensures clean ownership boundaries.

- Transactions change frequently, so the model is kept lightweight. Agents are embedded to preserve a snapshot of their role at the moment of the transaction.
- TransactionHistory is stored in a separate collection to avoid making the main transaction document grow indefinitely and to provide a clean audit trail.
- Workflow stages are managed with an enum, which makes transitions easy to validate and allows adding/removing stages without refactoring.
- The financial breakdown is computed dynamically so that changes in commission rules do not cause inconsistencies.
- Commission rules are kept in a separate config to make future adjustments simple.
  Overall, this structure keeps the core model small and allows easy updated to business rules and accurate history tracking
  

### 1.4 Rejected Alternatives & Reasons
- Storing transaction history inside the transaction document
  Because the document would grow indefinetly and become hard to query
- Storing agents in a seperate collection and referencing them in transactions
  Rejected because embedding agents inside each transaction preserves a snapshot of their role and avoid inconsistent financial calculations.
- Storing financial break down in the database
  Rejected. Because commission rule may change later and storing results could lead to outdated and inconsistent data.
- Allowing     
  
  


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
