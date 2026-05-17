import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "WeedConnect — Hub de la comunidad cannábica";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #022c22 0%, #064e3b 60%, #065f46 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Círculo decorativo fondo */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.06)",
          }}
        />

        {/* Icono + Wordmark */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "#10b981",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "28px",
              boxShadow: "0 0 40px rgba(16, 185, 129, 0.4)",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <path
                d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 5.5-8 5.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: "72px", fontWeight: "800", color: "white", letterSpacing: "-2px" }}>
            WeedConnect
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "30px",
            color: "#6ee7b7",
            textAlign: "center",
            maxWidth: "700px",
            marginBottom: "48px",
            lineHeight: "1.4",
          }}
        >
          Hub de la comunidad cannábica
        </div>

        {/* Pills */}
        <div style={{ display: "flex", gap: "16px" }}>
          {["Foro", "Strains", "Mapa de clubes", "Grow tracker", "IA"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                borderRadius: "100px",
                padding: "10px 24px",
                color: "#a7f3d0",
                fontSize: "20px",
                fontWeight: "500",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Disclaimer +18 */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            right: "48px",
            color: "rgba(167, 243, 208, 0.5)",
            fontSize: "16px",
          }}
        >
          Solo mayores de 18 años
        </div>
      </div>
    ),
    { ...size },
  );
}
