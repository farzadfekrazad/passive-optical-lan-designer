import React from 'react'

const App: React.FC = () => {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Passive Optical LAN Designer</h1>
      <p>Starter app scaffold. Frontend talks to backend via /api.</p>
      <p>Backend health: <a href="/api/health" target="_blank" rel="noreferrer">/api/health</a></p>
    </div>
  )
}

export default App