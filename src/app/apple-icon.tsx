import { ImageResponse } from "next/og";

// Ícone da tela de início do iPhone (PNG 180×180)
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const bar = (w: number, h: number) => (
    <div style={{ width: w, height: h, background: "#fff", borderRadius: 5 }} />
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#059669",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {bar(20, 56)}
        {bar(14, 34)}
        {bar(56, 11)}
        {bar(14, 34)}
        {bar(20, 56)}
      </div>
    ),
    size,
  );
}
