export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'system-ui, sans-serif',
          color: '#1a1a1a',
          background: '#fafaf8',
        }}
      >
        {children}
      </body>
    </html>
  )
}
