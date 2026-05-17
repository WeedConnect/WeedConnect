import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "WeedConnect";
  const description =
    searchParams.get("description") ?? "Hub de la comunidad cannábica";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #022c22 0%, #064e3b 60%, #065f46 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Círculo decorativo */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.08)",
          }}
        />

        {/* Contenido principal */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          {/* Título de la página */}
          <div
            style={{
              fontSize: title.length > 30 ? "52px" : "64px",
              fontWeight: "800",
              color: "white",
              letterSpacing: "-1px",
              lineHeight: "1.1",
              marginBottom: "24px",
              maxWidth: "900px",
            }}
          >
            {title}
          </div>

          {/* Descripción */}
          <div
            style={{
              fontSize: "26px",
              color: "#6ee7b7",
              lineHeight: "1.5",
              maxWidth: "800px",
            }}
          >
            {description.length > 120 ? description.slice(0, 120) + "…" : description}
          </div>
        </div>

        {/* Footer: logo WeedConnect */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              background: "#10b981",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "14px",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 5.5-8 5.5"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: "28px", fontWeight: "700", color: "#a7f3d0" }}>
            WeedConnect
          </span>
        </div>
      </div>
    ),
    { ...SIZE },
  );
}
