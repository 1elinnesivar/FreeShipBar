export default function Themes() {
  const themes = [
    { 
      name: 'Dark Theme', 
      bg: '#111827', 
      fg: '#ffffff', 
      bar: '#10b981',
      label: 'Great for dark headers and modern stores',
    },
    { 
      name: 'Light Theme', 
      bg: '#ffffff', 
      fg: '#111827', 
      bar: '#3b82f6',
      label: 'Clean look that fits most shops',
    },
    { 
      name: 'Brand Theme', 
      bg: '#1e40af', 
      fg: '#ffffff', 
      bar: '#fbbf24',
      label: 'Use your own brand colors with Pro',
    },
  ]

  return (
    <section className="themes">
      <div className="container">
        <h2>Themes</h2>
        <p className="themes-intro">
          Pro unlocks multiple themes you can switch between with a single option in your code.
        </p>
        <div className="themes-grid">
          {themes.map((theme, index) => (
            <div key={index} className="theme-card">
              <div
                className="theme-preview"
                style={{
                  backgroundColor: theme.bg,
                  color: theme.fg,
                  padding: '20px',
                  borderRadius: '8px',
                  position: 'relative',
                }}
              >
                <div style={{ marginBottom: '12px', fontSize: '14px' }}>
                  Free shipping in $250 remaining
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '45%',
                      height: '100%',
                      backgroundColor: theme.bar,
                      borderRadius: '2px',
                    }}
                  />
                </div>
              </div>
              <p className="theme-name">{theme.name}</p>
              <p className="theme-label">{theme.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
