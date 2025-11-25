// src/pages/_app.js
import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: "70vh" }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default MyApp;
