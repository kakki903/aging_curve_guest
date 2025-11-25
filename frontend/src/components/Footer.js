// src/components/Footer.js
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.left}>
          🔮 빨랑 사주
          <p style={styles.copy}>
            © {new Date().getFullYear()} Bbalrang. All rights reserved.
          </p>
        </div>

        <nav style={styles.nav}>
          <Link href="/privacy" style={styles.navItem}>
            Privacy
          </Link>
          <Link href="/terms" style={styles.navItem}>
            Terms
          </Link>
          <Link href="/contact" style={styles.navItem}>
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    borderTop: "1px solid #eee",
    padding: "30px 0",
    marginTop: "60px",
    background: "#fafafa",
  },
  inner: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
  },
  left: { fontSize: "16px", fontWeight: "700" },
  copy: { fontSize: "13px", color: "#777", marginTop: "5px" },
  nav: { display: "flex", gap: "18px", alignItems: "center" },
  navItem: { color: "#333", fontSize: "14px", fontWeight: "600" },
};
