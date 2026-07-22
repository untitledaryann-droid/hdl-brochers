import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'

export default function App() {
  const [companyName, setCompanyName] = useState<string>('Loading...')

  useEffect(() => {
    async function getConfig() {
      // Fetch the site configuration from the config table we created
      const { data, error } = await supabase
        .from('config')
        .select('data')
        .eq('id', 1)
        .single()

      if (error) {
        console.error('Error fetching config:', error)
        setCompanyName('Error connecting to Supabase')
      } else if (data && data.data && data.data.basicInfo) {
        setCompanyName(data.data.basicInfo.companyName)
      }
    }

    getConfig()
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>{companyName}</h1>
      <p>Supabase connection is successfully configured and working!</p>
    </div>
  )
}
