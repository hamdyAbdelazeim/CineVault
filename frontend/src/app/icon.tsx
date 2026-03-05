import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Next.js App Router auto-serves this as /favicon.ico + apple-touch-icon
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: '#e50914',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          fontWeight: 900,
          fontSize: 16,
          color: 'white',
          letterSpacing: '-1px',
        }}
      >
        CV
      </div>
    ),
    { ...size },
  );
}
