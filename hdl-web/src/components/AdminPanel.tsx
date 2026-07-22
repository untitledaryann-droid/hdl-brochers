import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import fallbackData from '../../../data.json'

interface Service {
  name: string
  desc: string
  icon: string
  color: string
  bg: string
}

interface GalleryItem {
  title: string
  url: string
  wide: boolean
}

interface ConfigData {
  basicInfo: {
    companyName: string
    companyTagline: string
    companyDesc: string
  }
  links: {
    phone: string
    altPhone: string
    whatsappPhone: string
    emailHead: string
    emailExport: string
    brochure: string
    website: string
    mapUrl: string
    mapEmbed: string
    addressHead: string
    addressExport: string
  }
  stats: {
    products: string
    countries: string
    team: string
    experience: string
  }
  services: Service[]
  gallery: GalleryItem[]
  businessHours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
}

interface Inquiry {
  id: number
  name: string
  email: string
  phone: string
  message: string
  created_at: string
}

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Dashboard state
  const [config, setConfig] = useState<ConfigData>(fallbackData as ConfigData)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [activeTab, setActiveTab] = useState('basic')
  const [saveStatus, setSaveStatus] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [loadingConfig, setLoadingConfig] = useState(false)
  const [loadingInquiries, setLoadingInquiries] = useState(false)

  useEffect(() => {
    const authState = localStorage.getItem('hdl_admin_logged_in')
    if (authState === 'true') {
      setIsLoggedIn(true)
      fetchConfig()
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn && activeTab === 'inquiries') {
      fetchInquiries()
    }
  }, [isLoggedIn, activeTab])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    if (username === 'hdladmin' && password === '1230') {
      localStorage.setItem('hdl_admin_logged_in', 'true')
      setIsLoggedIn(true)
      fetchConfig()
    } else {
      setLoginError('Invalid username or password')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('hdl_admin_logged_in')
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
  }

  const fetchConfig = async () => {
    setLoadingConfig(true)
    try {
      const { data, error } = await supabase
        .from('config')
        .select('data')
        .eq('id', 1)
        .single()

      if (error) throw error
      if (data && data.data) {
        setConfig(data.data as ConfigData)
      }
    } catch (err) {
      console.error('Error fetching config from Supabase:', err)
    } finally {
      setLoadingConfig(false)
    }
  }

  const fetchInquiries = async () => {
    setLoadingInquiries(true)
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setInquiries(data || [])
    } catch (err) {
      console.error('Error fetching inquiries:', err)
    } finally {
      setLoadingInquiries(false)
    }
  }

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveStatus(false)
    setSaveError('')

    try {
      const { error } = await supabase
        .from('config')
        .update({ data: config, updated_at: new Date() })
        .eq('id', 1)

      if (error) throw error

      setSaveStatus(true)
      setTimeout(() => setSaveStatus(false), 3000)
    } catch (err) {
      console.error('Error updating config:', err)
      setSaveError('Failed to save configuration.')
    }
  }

  const handleDeleteInquiry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return

    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id)

      if (error) throw error

      setInquiries(inquiries.filter((inq) => inq.id !== id))
    } catch (err) {
      console.error('Error deleting inquiry:', err)
      alert('Failed to delete inquiry.')
    }
  }

  // Form handlers
  const updateBasicInfo = (key: string, value: string) => {
    setConfig({
      ...config,
      basicInfo: {
        ...config.basicInfo,
        [key]: value
      }
    })
  }

  const updateLink = (key: string, value: string) => {
    setConfig({
      ...config,
      links: {
        ...config.links,
        [key]: value
      }
    })
  }

  const updateStat = (key: string, value: string) => {
    setConfig({
      ...config,
      stats: {
        ...config.stats,
        [key]: value
      }
    })
  }

  const updateHours = (key: string, value: string) => {
    setConfig({
      ...config,
      businessHours: {
        ...config.businessHours,
        [key]: value
      }
    })
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-opacity-95 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="text-center">
            <i className="fa-solid fa-lock text-5xl text-green-600 mb-3 block"></i>
            <h2 className="text-3xl font-extrabold text-gray-900">Admin Login</h2>
            <p className="mt-2 text-sm text-gray-600">Enter credentials to manage Info Card</p>
          </div>
          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>

            {loginError && (
              <div className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">
                {loginError}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 text-white p-2.5 rounded-xl"><i className="fa-solid fa-leaf text-lg"></i></div>
          <h1 className="text-xl font-bold">HDL Global Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
            <i className="fa-solid fa-external-link-alt"></i> View Live Card
          </a>
          <button onClick={handleLogout} className="text-sm font-semibold text-red-600 border border-red-600 px-3.5 py-1.5 rounded-lg hover:bg-red-50 transition">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 max-w-5xl mx-auto w-full">
        {loadingConfig && (
          <div className="text-center py-12 text-[#3f5936] font-bold">
            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Loading settings...
          </div>
        )}

        {!loadingConfig && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b overflow-x-auto bg-gray-50">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  activeTab === 'basic' ? 'border-green-600 text-green-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fa-solid fa-info-circle mr-2"></i>Basic Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('links')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  activeTab === 'links' ? 'border-green-600 text-green-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fa-solid fa-link mr-2"></i>Links & Maps
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  activeTab === 'stats' ? 'border-green-600 text-green-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fa-solid fa-chart-line mr-2"></i>Stats
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hours')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  activeTab === 'hours' ? 'border-green-600 text-green-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fa-solid fa-clock mr-2"></i>Hours
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('inquiries')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  activeTab === 'inquiries' ? 'border-green-600 text-green-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fa-solid fa-envelope-open mr-2"></i>Inquiries
              </button>
            </div>

            {/* Config Edit Form */}
            <form onSubmit={handleSaveConfig} className="p-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Company Name</label>
                    <input
                      type="text"
                      value={config.basicInfo.companyName}
                      onChange={(e) => updateBasicInfo('companyName', e.target.value)}
                      required
                      className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Tagline</label>
                    <input
                      type="text"
                      value={config.basicInfo.companyTagline}
                      onChange={(e) => updateBasicInfo('companyTagline', e.target.value)}
                      required
                      className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Description</label>
                    <textarea
                      value={config.basicInfo.companyDesc}
                      onChange={(e) => updateBasicInfo('companyDesc', e.target.value)}
                      required
                      rows={4}
                      className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-200 resize-y"
                    />
                  </div>
                </div>
              )}

              {/* Links Tab */}
              {activeTab === 'links' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Phone 1 (Call Now)</label>
                      <input
                        type="text"
                        value={config.links.phone}
                        onChange={(e) => updateLink('phone', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Phone 2 (Alt)</label>
                      <input
                        type="text"
                        value={config.links.altPhone}
                        onChange={(e) => updateLink('altPhone', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">WhatsApp Phone (No +)</label>
                      <input
                        type="text"
                        value={config.links.whatsappPhone}
                        onChange={(e) => updateLink('whatsappPhone', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Brochure URL</label>
                      <input
                        type="url"
                        value={config.links.brochure}
                        onChange={(e) => updateLink('brochure', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Email (Head Office)</label>
                      <input
                        type="email"
                        value={config.links.emailHead}
                        onChange={(e) => updateLink('emailHead', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Email (Export)</label>
                      <input
                        type="email"
                        value={config.links.emailExport}
                        onChange={(e) => updateLink('emailExport', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Website URL</label>
                      <input
                        type="url"
                        value={config.links.website}
                        onChange={(e) => updateLink('website', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Google Maps Link</label>
                      <input
                        type="url"
                        value={config.links.mapUrl}
                        onChange={(e) => updateLink('mapUrl', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Head Office Address</label>
                    <textarea
                      value={config.links.addressHead}
                      onChange={(e) => updateLink('addressHead', e.target.value)}
                      rows={2}
                      className="w-full border rounded-lg p-2.5 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Export Office Address</label>
                    <textarea
                      value={config.links.addressExport}
                      onChange={(e) => updateLink('addressExport', e.target.value)}
                      rows={2}
                      className="w-full border rounded-lg p-2.5 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Google Maps Embed URL (iframe src)</label>
                    <input
                      type="text"
                      value={config.links.mapEmbed}
                      onChange={(e) => updateLink('mapEmbed', e.target.value)}
                      className="w-full border rounded-lg p-2.5 outline-none text-xs text-gray-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Products</label>
                      <input
                        type="text"
                        value={config.stats.products}
                        onChange={(e) => updateStat('products', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Countries</label>
                      <input
                        type="text"
                        value={config.stats.countries}
                        onChange={(e) => updateStat('countries', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Team</label>
                      <input
                        type="text"
                        value={config.stats.team}
                        onChange={(e) => updateStat('team', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Experience</label>
                      <input
                        type="text"
                        value={config.stats.experience}
                        onChange={(e) => updateStat('experience', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <i className="fa-solid fa-info-circle mr-1"></i> Stats are displayed on the main card as counters (e.g. 500+).
                  </p>
                </div>
              )}

              {/* Hours Tab */}
              {activeTab === 'hours' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Monday</label>
                      <input
                        type="text"
                        value={config.businessHours.monday}
                        onChange={(e) => updateHours('monday', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Tuesday</label>
                      <input
                        type="text"
                        value={config.businessHours.tuesday}
                        onChange={(e) => updateHours('tuesday', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Wednesday</label>
                      <input
                        type="text"
                        value={config.businessHours.wednesday}
                        onChange={(e) => updateHours('wednesday', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Thursday</label>
                      <input
                        type="text"
                        value={config.businessHours.thursday}
                        onChange={(e) => updateHours('thursday', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Friday</label>
                      <input
                        type="text"
                        value={config.businessHours.friday}
                        onChange={(e) => updateHours('friday', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Saturday</label>
                      <input
                        type="text"
                        value={config.businessHours.saturday}
                        onChange={(e) => updateHours('saturday', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Sunday</label>
                      <input
                        type="text"
                        value={config.businessHours.sunday}
                        onChange={(e) => updateHours('sunday', e.target.value)}
                        className="w-full border rounded-lg p-2.5 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Inquiries Tab */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800">Customer Inquiries</h3>
                  {loadingInquiries ? (
                    <div className="text-gray-500 py-6 text-center">
                      <i className="fa-solid fa-circle-notch fa-spin mr-1.5"></i> Loading inquiries...
                    </div>
                  ) : inquiries.length === 0 ? (
                    <div className="text-gray-400 py-12 text-center border-2 border-dashed border-gray-150 rounded-xl">
                      No inquiries received yet.
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {inquiries.map((inq) => (
                        <div key={inq.id} className="border rounded-xl p-4 bg-gray-50 flex justify-between items-start shadow-sm hover:shadow transition">
                          <div className="space-y-1.5 flex-grow pr-4">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-gray-800">{inq.name}</span>
                              <span className="text-xs text-gray-400">
                                {new Date(inq.created_at || inq.id).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                              {inq.email && (
                                <span>
                                  <i className="fa-solid fa-envelope mr-1.5 text-gray-400"></i>
                                  <a href={`mailto:${inq.email}`} className="hover:underline text-blue-600 font-medium">
                                    {inq.email}
                                  </a>
                                </span>
                              )}
                              {inq.phone && (
                                <span>
                                  <i className="fa-solid fa-phone mr-1.5 text-gray-400"></i>
                                  <a href={`tel:${inq.phone}`} className="hover:underline text-blue-600 font-medium">
                                    {inq.phone}
                                  </a>
                                </span>
                              )}
                            </div>
                            <div className="bg-white border rounded-lg p-3 text-sm text-gray-700 mt-2 font-mono whitespace-pre-line leading-relaxed">
                              {inq.message}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition"
                            title="Delete Inquiry"
                          >
                            <i className="fa-solid fa-trash-can text-lg"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Save Footer Container (only show for config editing tabs) */}
              {activeTab !== 'inquiries' && (
                <div className="mt-8 border-t pt-6 flex justify-between items-center">
                  {saveStatus && (
                    <span className="text-sm font-bold text-green-600 flex items-center gap-1.5">
                      <i className="fa-solid fa-check-circle"></i> Saved Successfully!
                    </span>
                  )}
                  {saveError && (
                    <span className="text-sm font-bold text-red-600 flex items-center gap-1.5">
                      <i className="fa-solid fa-circle-exclamation"></i> {saveError}
                    </span>
                  )}
                  <div className="flex-grow" />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-xl shadow transition flex items-center"
                  >
                    <i className="fa-solid fa-save mr-2"></i> Save All Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
