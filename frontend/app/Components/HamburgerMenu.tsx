"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./HamburgerMenu.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/Wordle", label: "Wordle" },
  { href: "/WordSearch", label: "Word Search" },
  { href: "/About", label: "About" },
  { href: "/Settings", label: "Settings" },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span className={styles.line} />
        <span className={styles.line} />
        <span className={styles.line} />
      </button>

      {open && (
        <div className={styles.dropdown} role="menu">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`${styles.link} ${pathname === href ? styles.active : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
