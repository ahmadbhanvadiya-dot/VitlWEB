import React from "react";

export default function QRInstructionScreen() {
  return (
    <div style={styles.container}>
      <div style={styles.glowTop}></div>
      <div style={styles.glowBottom}></div>

      <div style={styles.card}>
        <h1 style={styles.brand}>Vitl</h1>

        <h2 style={styles.title}>Scan the QR code to continue</h2>

        <p style={styles.subtitle}>
          Secure your health profile in seconds. <br />
          Your journey to smarter care starts here.
        </p>

        <div style={styles.divider}></div>

        <p style={styles.footer}>⚕️ Powered by Vitl Health System</p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF7EE",
    position: "relative",
    fontFamily: "Arial, sans-serif",
    overflow: "hidden",
  },

  glowTop: {
    position: "absolute",
    top: "-80px",
    right: "-60px",
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    backgroundColor: "#B7E4C7",
    opacity: 0.4,
    filter: "blur(20px)",
  },

  glowBottom: {
    position: "absolute",
    bottom: "-80px",
    left: "-60px",
    width: "260px",
    height: "260px",
    borderRadius: "50%",
    backgroundColor: "#95D5B2",
    opacity: 0.3,
    filter: "blur(25px)",
  },

  card: {
    width: "360px",
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "30px 25px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    zIndex: 1,
  },

  brand: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#2D6A4F",
    marginBottom: "10px",
  },

  title: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1B4332",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "14px",
    color: "#40916C",
    lineHeight: "20px",
  },

  divider: {
    width: "60%",
    height: "1px",
    backgroundColor: "#D8F3DC",
    margin: "20px auto",
  },

  footer: {
    fontSize: "12px",
    color: "#74C69D",
  },
};