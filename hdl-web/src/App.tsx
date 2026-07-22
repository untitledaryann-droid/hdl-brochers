export default function App() {
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'system-ui, sans-serif', 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #3f5936 0%, #728c69 100%)',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>HDL Global</h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6' }}>
        Welcome to the HDL Global Web portal. The website is successfully built and running on Cloudflare Workers!
      </p>
    </div>
  )
}
