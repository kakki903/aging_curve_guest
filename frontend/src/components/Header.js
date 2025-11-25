// src/components/Header.js
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <Link href="/" style={styles.logo}>
          <Image src="/logo.png" width={45} height={45} alt="logo" />
        </Link>

        <nav style={styles.nav}>
          <Link href="/guide" style={styles.navItem}>
            Guide
          </Link>
          <Link href="/about" style={styles.navItem}>
            About
          </Link>
          <Link href="/contact" style={styles.navItem}>
            Contact
          </Link>
          <Link href="/privacy" style={styles.navItem}>
            Privacy
          </Link>
          <Link href="/terms" style={styles.navItem}>
            Terms
          </Link>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    width: "100%",
    borderBottom: "1px solid #eee",
    padding: "14px 0",
    background: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  inner: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "900",
    color: "#000",
  },
  nav: {
    display: "flex",
    gap: "22px",
  },
  navItem: {
    fontSize: "15px",
    color: "#333",
    fontWeight: "600",
  },
};
