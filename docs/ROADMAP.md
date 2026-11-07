# M-Inventory — Roadmap (draft v0.2)

| Phase | Scope | Exit check |
|---|---|---|
| 0 | Repo, CI, Docker, Postgres, tenant middleware + RLS, auth, base CRUD pattern (Item Category), responsive PWA shell | Tenant isolation test passes; shell works on phone, tablet, desktop |
| 1 | All inventory masters (hierarchy, item, store/warehouse/location/rack/bin, batch, serial, UOM, conversion, type/reason masters) | CRUD + validation on every master |
| 2 | Stock ledger with mandatory 8-field stamp; receipt, issue, return, opening stock | Movement without stamp is rejected |
| 3 | Transfer (store/property/warehouse) with requested/approved/issued/received/variance; approval engine | Multi-step approval posts correctly |
| 4 | Adjustment, waste, damage, breakage, sample, consumption engine with mandatory allocation | Consumption by dept/cost center/outlet/event |
| 5 | Reservation engine (banquet, wedding, events) with auto expiry | Reserved qty blocks availability, releases on expiry |
| 6 | Physical count + cycle count + reconciliation; Flutter offline app (phone/tablet) | Variance → approval → auto adjustment |
| 7 | Event publish/subscribe (outbox), external master clients; M-HMS, M-POS, M-BAR, M-F&B Costing, M-PURCHASE integration incl. PurchaseRequestRaised | Events round-trip with M-PURCHASE GRN; POS/Bar sale deducts stock via recipe |
| 8 | Reports (ledgers, consumption, ABC/FSN/VED, aging, valuation, reorder planning) | Reports reconcile to ledger |
| 9 | Analytics, dashboard, daily consumption screen; AI layer: demand forecast, AI-drafted purchase requests, explanations, natural-language queries, anomaly alerts | Draft requests generated with reasons; nothing posts without approval |
| 10 | Hardening: load test, audit trail review, security, cost review, deploy | Production checklist signed off |

Production deploy only on explicit "go production".

## Status
Phase 0 complete: NestJS skeleton, tenant RLS migration, JWT tenant guard, Item Category CRUD, isolation test (3 passing against Postgres 16), API smoke test, responsive PWA shell (apps/admin-web builds). Remaining: login screen, CI.
