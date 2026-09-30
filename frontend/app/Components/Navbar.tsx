"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HamburgerMenu from "./HamburgerMenu";
import styles from "./Navbar.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/Wordle", label: "Wordle" },
  { href: "/WordSearch", label: "Word Search" },
  { href: "/About", label: "About" },
  { href: "/Settings", label: "Settings" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`${styles.link} ${pathname === href ? styles.active : ""}`}
        >
          {label}
        </Link>
      ))}
      <div className={styles.hamburger}>
        <HamburgerMenu />
      </div>
    </nav>
  );
}
