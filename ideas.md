An **Inventory Management & Demand Forecasting System** fits the MIS curriculum (BIT353) directly, hitting core themes from **Unit 5 (Business Intelligence)**, **Unit 6 (Supply Chain Management & Enterprise Systems)**, and **Unit 7 (Decision Support Systems)**.

Instead of building a simple CRUD app (Add/Edit/Delete products), structure it around **three managerial levels** to demonstrate how an MIS processes data into actionable decisions.

---

### System Architecture by Management Tier

#### 1. Operational Level (Warehouse & Floor Staff)

* **Real-time Stock Tracking:** SKU-level inventory counts, batch numbers, expiration dates, and warehouse location bin tags.
* **Stock In / Stock Out Workflows:** Log purchase receipts from suppliers and sales dispatches to customers.
* **Automated Low-Stock Alerts:** Flag items approaching calculated safety thresholds.

#### 2. Tactical Level (Inventory & Purchase Managers)

* **Automated Reorder Point (ROP) Calculator:** Dynamically compute when to reorder using:

$$\text{ROP} = (\text{Average Daily Sales} \times \text{Lead Time in Days}) + \text{Safety Stock}$$


* **ABC Inventory Analysis Engine:** Categorize inventory automatically based on monetary value and turnover:
* **Class A:** Top 20% of items accounting for 80% of total consumption value (tight control).
* **Class B:** Middle 30% of items accounting for 15% of value.
* **Class C:** Remaining 50% of items accounting for 5% of value (simple controls).


* **Supplier Performance Scoring:** Track supplier lead-time accuracy, defect rates, and order fulfillment completeness.

#### 3. Strategic Level (Executive / Management Decision Support)

* **Inventory Valuation & Turnover Metrics:** Real-time metrics for Inventory Turnover Ratio (ITR), Days Sales of Inventory (DSI), carrying costs, and dead stock accumulation.
* **Demand Forecasting Model:** Use basic moving average or exponential smoothing on historical sales data to predict next-month stock requirements.
* **What-If Scenario Simulator:** Simulate potential supply chain disruptions (e.g., "What happens to stockouts if supplier lead time increases by 10 days?").

---

### System Data Flow Diagram (DFD - Level 1)

```
[ Supplier ] ──(Invoices/Shipments)──> [ 1.0 Stock Entry ] ──> [(D1) Inventory DB]
                                              │
[ Customer ] <──(Dispatches/Sales)──── [ 2.0 Order Process] ──> [(D2) Sales DB]
                                              │
                                              ▼
                                    [ 3.0 Analytics & ROP Engine ]
                                              │
                                     (Aggregated Data)
                                              ▼
                                  [ 4.0 Management DSS Dashboard ]
                                              │
                                  ┌───────────┴───────────┐
                                  ▼                       ▼
                       [ Tactical Reports ]     [ Strategic Forecasts ]
                       (Reorder Alerts)         (ABC Analysis & Trends)

```

---

### Implementation Options

| Feature Area | Basic Implementation | Advanced / Impressive Addition |
| --- | --- | --- |
| **Database Design** | Relational schema (Products, Categories, Warehouses, Stock Movements, Orders, Suppliers). | Audit logs for historical inventory snapshots and data quality validation. |
| **Analytics Engine** | SQL queries for stock totals and turnover formulas. | Time-series forecasting (Exponential Smoothing or ARIMA) for future demand prediction. |
| **Interface & Access** | Role-Based Access Control (RBAC) separating Warehouse Staff, Store Managers, and Executives. | Visual charts (stock burn-down curves, ABC distribution pie charts, supplier scorecard radars). |

---

### Key Technical Concepts to Highlight in Your MIS Lab Defense

* **Data to Intelligence Conversion:** Show how raw transaction logs (Stock In/Out) are transformed into strategic metrics (ITR, DSI, demand forecasts).
* **Supply Chain Value:** Frame the project around reducing carrying costs and preventing stockout revenue loss.
* **Sociotechnical Balance:** Explain how role-based interfaces streamline human workflows while improving data accuracy across departments.