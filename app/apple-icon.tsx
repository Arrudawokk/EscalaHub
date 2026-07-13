import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ alignItems: "center", background: "#b8ff5c", color: "#071008", display: "flex", fontSize: 104, fontWeight: 900, height: "100%", justifyContent: "center", width: "100%" }}>
        E
      </div>
    ),
    size,
  );
}
