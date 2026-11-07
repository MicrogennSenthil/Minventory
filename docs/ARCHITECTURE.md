# M-Inventory — Architecture (draft v0.2, awaiting review)

## Stack (chosen)
NestJS (Node.js, TypeScript) + PostgreSQL. Next.js responsive PWA for admin/ops. Flutter mobile/tablet app for physical count (offline). Event bus: Kafka or AWS SNS/SQS (decide in Phase 7). Docker, cloud-native.

## Device support (mobile, tablet, desktop)
- Next.js PWA, mobile-first responsive layouts for phone, tablet and desktop; touch-friendly targets; installable.
- Flutter app for stores: barcode/QR scan, offline count, sync on reconnect.
- Same API serves all clients (API first).

## Tenancy model
Hierarchy: Tenant → Company → Property → Warehouse/Store → Location → Rack → Bin.
- Every table carries `tenant_id`; PostgreSQL Row-Level Security enforces isolation.
- Tenant resolved from JWT claim in middleware; never from request body.

## Mandatory movement stamp
Table `stock_movement` (append-only ledger). NOT NULL columns: tenant_id, company_id, property_id, store_id, department_id, cost_center_id, outlet_id, reference_module (+ reference_id). DB constraints and service validation both reject movements missing any field. Stock balance is derived from the ledger, never edited directly.

## No hardcoded values
All types and reasons (Stock Type, Issue Type, Transfer Type, Waste Type, Adjustment Reason, Consumption Reason), approval rules, AI thresholds and store hierarchy levels live in master/settings tables with full CRUD. Behaviour is switched by master flags, not code constants.

## Modules
masters, stock-ledger, transactions (receipt/issue/transfer/adjust/consume/return/waste), reservation, consumption, physical-count, approval-engine, reports, analytics, dashboard, ai (forecast, auto-purchase, assistant), integration (events + external clients).

## Approval engine
Rule table: document type × (amount range, store, department, property) → approver chain. Configurable per tenant. Documents move draft → pending → approved/rejected → posted; ledger posts only on final approval.

## AI layer
1. **Prediction:** per item/store demand forecast from consumption history, banquet/event bookings, M-POS and M-BAR sales, and seasonality. Outputs predicted stock-out date and suggested reorder qty.
2. **Auto purchase request:** when projected stock falls below reorder level or safety stock, AI drafts a Purchase Request in Draft state (preferred vendor, purchase UOM, department, cost center). It never submits itself; a person approves via the approval engine. A per-tenant setting can allow low-value auto-submit up to a configured limit.
3. **Hand-off:** on approval publish `PurchaseRequestRaised` to M-PURCHASE; receive `PurchaseOrderApproved` and `GRNCompleted` to close the loop.
4. **Explainability:** every suggestion carries its reason (e.g. avg daily use, days left, booked events).
5. **Other AI features:** natural-language stock questions, anomaly alerts for waste/shrinkage, count by barcode/photo/voice, suggested item categories, purchase invoice scan.
6. **Controls:** thresholds, forecast window and auto-submit limit are master settings. AI actions are audit logged. AI never posts stock without user confirmation.

## Events
Outbox pattern for reliable publish. Publish: StockReceived, StockIssued, StockTransferred, StockAdjusted, StockConsumed, WasteRecorded, StockLow, StockNegative, StockExpired, PhysicalCountCompleted, PurchaseRequestRaised. Subscribe (idempotent consumers): PurchaseOrderApproved, GRNCompleted, RecipeGenerated, BanquetConfirmed, POSSaleCompleted, BarSaleCompleted.

## Integrations
- **M-POS / M-BAR:** POSSaleCompleted and BarSaleCompleted trigger recipe-based stock deduction, stamped with the sale's outlet, department and cost center.
- **M-F&B Costing:** subscribe to RecipeGenerated; publish consumption and valuation back for food cost.
- **M-HMS:** shared sign-in; Vendor, Department, Cost Center and Outlet master APIs (local cache + sync).
- **M-PURCHASE:** purchase request/order/GRN loop above. **Finance systems and third-party PMS:** via the same event contracts and API.

## Costing
Valuation method (FIFO / weighted average) is a master-level setting per item or store.

## Open decisions
1. Event bus: Kafka vs SNS/SQS.
2. Valuation default method.
3. Auth: own IdP vs shared with M-HMS.
4. Hosting target (AWS) and cost budget.
5. AI model/provider and forecast method (statistical baseline first, ML later).
