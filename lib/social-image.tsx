import { ImageResponse } from "next/og";

export function createSocialImage() {
  return new ImageResponse(
    (
      <div style={{ alignItems: "center", background: "#06080d", color: "white", display: "flex", height: "100%", justifyContent: "center", overflow: "hidden", position: "relative", width: "100%" }}>
        <div style={{ background: "#2563eb", borderRadius: 999, filter: "blur(110px)", height: 430, left: -130, opacity: 0.34, position: "absolute", top: -160, width: 430 }} />
        <div style={{ background: "#6c5ce7", borderRadius: 999, bottom: -210, filter: "blur(120px)", height: 480, opacity: 0.25, position: "absolute", right: -100, width: 480 }} />
        <div style={{ alignItems: "flex-start", display: "flex", flexDirection: "column", padding: "76px 86px", position: "relative", width: "100%" }}>
          <div style={{ alignItems: "center", display: "flex", gap: 18 }}>
            <div style={{ alignItems: "center", background: "#b8ff5c", borderRadius: 18, color: "#071008", display: "flex", fontSize: 34, fontWeight: 900, height: 68, justifyContent: "center", width: 68 }}>E</div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1.5 }}>EscalaHub</div>
          </div>
          <div style={{ fontSize: 82, fontWeight: 800, letterSpacing: -4.5, lineHeight: 0.96, marginTop: 72, maxWidth: 980 }}>Conhecimento que vira resultado.</div>
          <div style={{ color: "#a1a1aa", fontSize: 28, lineHeight: 1.4, marginTop: 32, maxWidth: 870 }}>Produtos digitais práticos para aprender, aplicar e crescer com método.</div>
          <div style={{ background: "#b8ff5c", borderRadius: 999, color: "#071008", display: "flex", fontSize: 18, fontWeight: 800, marginTop: 46, padding: "14px 24px" }}>Aprenda. Aplique. Escale.</div>
        </div>
      </div>
    ),
    { height: 630, width: 1200 },
  );
}
