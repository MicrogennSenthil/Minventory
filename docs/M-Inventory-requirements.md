# M-Inventory — Requirements (source spec)

Enterprise Multi-Tenant Hospitality Inventory Management Platform. Runs standalone as SaaS and integrates with: M-HMS, M-POS, M-BAR, M-BANQUET, M-PURCHASE, M-F&B COSTING, Finance Systems, Third-party PMS.

## Architecture
- Multi Tenant, Company, Property, Warehouse, Store, Cost Center, Department, Outlet
- API First, Event Driven, Cloud Native
- No hardcoded values. Everything master driven. All masters support CRUD.

## Core principle (mandatory, no exceptions)
Every inventory movement captures: Tenant, Company, Property, Store, Department, Cost Center, Outlet, Reference Module.

## Masters
Item Category, Item Sub Category, Item Group, Item Sub Group, Item, Store, Warehouse, Location, Rack, Bin, Batch, Serial Number, UOM, Conversion, Stock Type, Issue Type, Transfer Type, Waste Type, Adjustment Reason, Consumption Reason. External master APIs: Vendor, Department, Cost Center, Outlet.

## Store hierarchy
Corporate Warehouse → Property Warehouse → Central Store → Kitchen Store → Bar Store → Banquet Store → Engineering Store → HK Store → Outlet Store → Consumption

## Item master fields
Item Code, Name, Description, Category, Group, Brand, Manufacturer, HSN Code, GST, Purchase/Inventory/Issue UOM, Conversion Formula, Shelf Life, Expiry/Batch/Serial Tracking, Barcode, QR Code, Min/Max/Reorder Level, Safety Stock, Preferred/Alternate Vendor, Storage Conditions, Image Support, Attachments.

## Transactions
Stock Receipt, Issue, Transfer, Adjustment, Consumption, Return, Waste, Damage, Breakage, Sample Consumption, Physical Verification, Cycle Count, Stock Reconciliation, Opening Stock, Closing Stock.

## Multi-store transfer
Store→Store, Property→Property, Warehouse→Warehouse. Approval workflow required. Track Requested / Approved / Issued / Received Qty and Variance.

## Reservation engine
Reserve for Banquet, Kitchen, Bar, Restaurant, Conference, Wedding, Corporate Event. Inventory Reserved, Released, Auto Expiry.

## Consumption engine
Track against Department, Cost Center, Outlet, Event, Recipe, Kitchen, Bar, Banquet, Housekeeping, Engineering, Front Office, Administration, HR, Sales. Mandatory allocation.

## Daily consumption screen
Periods: Today, Yesterday, This Month, Custom. View by Property, Outlet, Department, Cost Center, Store, Event, Category, Item.

## Waste management
Food Waste, Production Waste, Expired Stock, Breakage, Spillage, Damage. Track Qty, Cost, Reason, Department, Cost Center, Approval.

## Physical stock verification
Mobile based, Barcode/QR scan, Offline count, Variance detection, Auto stock adjustment, Approval workflow, Audit trail.

## Approval engine
Stock Issue, Transfer, Waste, Adjustment, Physical Count. Amount / Store / Department / Property based. Configurable.

## Reports
Stock Ledger, Item Ledger, Store Ledger, Consumption Summary/Detailed, Cost Center, Department, Banquet, Kitchen, Food Cost Consumption, Slow/Fast Moving, Dead Stock, Near Expiry, Negative Stock, Inventory Valuation, Stock Aging, ABC, FSN, VED Analysis, Reorder Planning.

## Analytics
Inventory Turnover, Stock Holding Days, Dead Stock Value, Waste %, Shrinkage %, Consumption Trend, Property / Outlet / Store Comparison.

## API contracts
PUBLISH: StockReceived, StockIssued, StockTransferred, StockAdjusted, StockConsumed, WasteRecorded, StockLow, StockNegative, StockExpired, PhysicalCountCompleted.
SUBSCRIBE: PurchaseOrderApproved, GRNCompleted, RecipeGenerated, BanquetConfirmed, POSSaleCompleted, BarSaleCompleted.

## Dashboard
Current Stock Value, Inventory Ageing, Today's Consumption, Open Transfers, Open Adjustments, Waste Value, Stock Alerts, Reorder Alerts, Dead Stock Alerts, Top Consumed Items, Top Cost Centers.
