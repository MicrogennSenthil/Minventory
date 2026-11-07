// Dashboard placeholder: widgets arrive with Phase 9 (values come from the API, none hardcoded).
const widgets = ['Current Stock Value', "Today's Consumption", 'Open Transfers', 'Stock Alerts'];

export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>
      <div className="cards">
        {widgets.map((w) => (
          <div className="card" key={w}><h3>{w}</h3><p>–</p></div>
        ))}
      </div>
    </>
  );
}
