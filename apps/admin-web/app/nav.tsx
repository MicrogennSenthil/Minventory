'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Single nav definition: sidebar on tablet/desktop, bottom bar on phones.
const items = [
  { href: '/', label: 'Dashboard' },
  { href: '/masters/item-categories', label: 'Item Categories' },
];

export function SideNav() {
  const path = usePathname();
  return (
    <nav className="side">
      <strong style={{ padding: '10px 12px' }}>M-Inventory</strong>
      {items.map((i) => (
        <Link key={i.href} href={i.href} className={path === i.href ? 'on' : ''}>{i.label}</Link>
      ))}
    </nav>
  );
}

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="bottom">
      {items.map((i) => (
        <Link key={i.href} href={i.href} className={path === i.href ? 'on' : ''}>{i.label}</Link>
      ))}
    </nav>
  );
}
