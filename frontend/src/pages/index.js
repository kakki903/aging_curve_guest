// src/pages/index.js

export const getServerSideProps = () => {
  return {
    redirect: {
      destination: "/init",
      permanent: false,
    },
  };
};

export default function Home() {
  return null;
}
