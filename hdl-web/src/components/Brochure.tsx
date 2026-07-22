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

export default function Brochure() {
  const [config, setConfig] = useState<ConfigData>(fallbackData as ConfigData)
  const [loading, setLoading] = useState(true)
  
  // Inquiry Form State
  const [inqName, setInqName] = useState('')
  const [inqEmail, setInqEmail] = useState('')
  const [inqPhone, setInqPhone] = useState('')
  const [inqMessage, setInqMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    async function fetchConfig() {
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
        console.warn('Failed to fetch from Supabase. Falling back to local data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchConfig()
  }, [])

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitSuccess(false)
    setSubmitError('')

    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([
          {
            name: inqName,
            email: inqEmail || '',
            phone: inqPhone || '',
            message: inqMessage
          }
        ])

      if (error) throw error

      setSubmitSuccess(true)
      setInqName('')
      setInqEmail('')
      setInqPhone('')
      setInqMessage('')
    } catch (err: any) {
      console.error('Error submitting inquiry:', err)
      setSubmitError('Failed to submit inquiry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const bgStyle = {
    background: "linear-gradient(rgba(26, 26, 15, 0.85), rgba(26, 26, 15, 0.85)), url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2070&auto=format&fit=crop') center/cover fixed"
  }

  return (
    <div style={bgStyle} className="min-h-screen text-[#2d2d2d] font-sans py-6 px-4 flex justify-center items-center">
      {loading && (
        <div className="fixed inset-0 bg-white flex justify-center items-center z-50 text-2xl text-[#3f5936] font-semibold">
          <i className="fa-solid fa-circle-notch fa-spin mr-3"></i> Loading Brochure...
        </div>
      )}

      <div className="w-full max-w-[480px] bg-[rgba(251,249,246,0.92)] backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-[rgba(255,255,255,0.55)]">
        {/* Banner */}
        <div className="h-[130px] bg-gradient-to-br from-[#3f5936] via-[#728c69] to-[#cba135]" />

        {/* Logo and Headings */}
        <div className="px-6 pb-6 pt-0 border-b border-[rgba(63,89,54,0.1)] relative">
          <div className="flex justify-center -mt-[52px] mb-4">
            <div className="w-[104px] height-[104px] bg-white rounded-full p-1.5 shadow-lg border-[3px] border-white overflow-hidden aspect-square">
              <img src="/logo-clean.png" alt="Logo" className="w-full h-full rounded-full object-contain" />
            </div>
          </div>
          
          <h1 className="font-serif text-[26px] font-bold text-[#3f5936] text-center leading-tight">
            {config.basicInfo.companyName}
          </h1>
          <p className="text-[11px] font-semibold tracking-[1.8px] uppercase text-[#cba135] text-center mt-1 mb-2.5">
            {config.basicInfo.companyTagline}
          </p>
          <p className="text-[13px] leading-[1.65] text-[#555] text-center px-2">
            {config.basicInfo.companyDesc}
          </p>

          {/* Social Icons */}
          <div className="flex justify-center gap-3.5 mt-5">
            <a href={`tel:${config.links.phone}`} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#3f5936] hover:text-[#cba135] shadow-md transition text-lg">
              <i className="fa-solid fa-phone"></i>
            </a>
            <a href={`mailto:${config.links.emailHead}`} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#3f5936] hover:text-[#cba135] shadow-md transition text-lg">
              <i className="fa-solid fa-envelope"></i>
            </a>
            <a href={config.links.website} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#3f5936] hover:text-[#cba135] shadow-md transition text-lg">
              <i className="fa-solid fa-globe"></i>
            </a>
            <a href={config.links.mapUrl} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#3f5936] hover:text-[#cba135] shadow-md transition text-lg">
              <i className="fa-solid fa-location-dot"></i>
            </a>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="p-6 border-b border-[rgba(63,89,54,0.1)] space-y-2.5">
          <a href={`https://api.whatsapp.com/send?phone=${config.links.whatsappPhone}`} className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#25D366] text-white rounded-xl text-base font-semibold hover:opacity-90 transition shadow-sm">
            <i className="fa-brands fa-whatsapp text-xl"></i> Chat on WhatsApp
          </a>
          <a href={`tel:${config.links.phone}`} className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#cba135] text-white rounded-xl text-base font-semibold hover:opacity-90 transition shadow-sm">
            <i className="fa-solid fa-phone"></i> Call Us Now
          </a>
          <a href={config.links.brochure} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#3f5936] text-white rounded-xl text-base font-semibold hover:opacity-90 transition shadow-sm">
            <i className="fa-solid fa-file-pdf"></i> Download Brochure
          </a>
          <a href={config.links.website} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-white text-[#3f5936] border border-[rgba(63,89,54,0.25)] rounded-xl text-base font-semibold hover:bg-gray-50 transition shadow-sm">
            <i className="fa-solid fa-globe"></i> Visit Website
          </a>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-[rgba(63,89,54,0.1)]">
          <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#728c69] mb-4 flex items-center gap-2">
            Our Growth <span className="flex-grow h-[1px] bg-[rgba(63,89,54,0.15)]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="font-serif text-2xl font-bold text-[#3f5936]">{config.stats.products}</div>
              <div className="text-[11px] text-[#777] font-semibold mt-1">Food Products</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="font-serif text-2xl font-bold text-[#3f5936]">{config.stats.countries}</div>
              <div className="text-[11px] text-[#777] font-semibold mt-1">Export Countries</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="font-serif text-2xl font-bold text-[#3f5936]">{config.stats.team}</div>
              <div className="text-[11px] text-[#777] font-semibold mt-1">Team Members</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="font-serif text-2xl font-bold text-[#3f5936]">{config.stats.experience}</div>
              <div className="text-[11px] text-[#777] font-semibold mt-1">Years Experience</div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="p-6 border-b border-[rgba(63,89,54,0.1)]">
          <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#728c69] mb-4 flex items-center gap-2">
            What We Provide <span className="flex-grow h-[1px] bg-[rgba(63,89,54,0.15)]" />
          </div>
          <div className="space-y-2.5">
            {config.services && config.services.map((srv, idx) => (
              <a key={idx} href={`https://api.whatsapp.com/send?phone=${config.links.whatsappPhone}&text=I'm interested in ${srv.name}`} className="flex items-start gap-3.5 p-3.5 bg-white rounded-xl shadow-sm hover:shadow transition">
                <div style={{ background: srv.bg, color: srv.color }} className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                  <i className={`fa-solid fa-${srv.icon}`}></i>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800 leading-tight mb-0.5">{srv.name}</div>
                  <div className="text-[12px] text-[#777] leading-normal">{srv.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div className="p-6 border-b border-[rgba(63,89,54,0.1)]">
          <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#728c69] mb-4 flex items-center gap-2">
            Gallery <span className="flex-grow h-[1px] bg-[rgba(63,89,54,0.15)]" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {config.gallery && config.gallery.map((img, idx) => (
              <div key={idx} className={`rounded-xl overflow-hidden relative shadow-sm aspect-[4/3] ${img.wide ? 'col-span-2 aspect-[16/7]' : ''}`}>
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent flex items-end p-2.5">
                  <span className="text-white text-[11px] font-semibold">{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Details */}
        <div className="p-6 border-b border-[rgba(63,89,54,0.1)] space-y-3">
          <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#728c69] mb-4 flex items-center gap-2">
            Contact Details <span className="flex-grow h-[1px] bg-[rgba(63,89,54,0.15)]" />
          </div>
          
          <div className="bg-white rounded-xl p-4.5 shadow-sm space-y-3">
            <div className="text-[13px] font-bold text-[#3f5936] border-b pb-2 border-gray-100 flex items-center gap-2">
              <i className="fa-solid fa-building"></i> Head Office
            </div>
            <div className="flex gap-3 text-xs leading-normal">
              <div className="w-8 h-8 rounded-lg bg-[rgba(63,89,54,0.1)] flex items-center justify-center text-[#3f5936] flex-shrink-0">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <strong className="block text-[10px] font-semibold text-[#728c69] uppercase">Phone</strong>
                <a href={`tel:${config.links.altPhone}`} className="text-blue-600 hover:underline">{config.links.altPhone}</a>
              </div>
            </div>
            <div className="flex gap-3 text-xs leading-normal">
              <div className="w-8 h-8 rounded-lg bg-[rgba(63,89,54,0.1)] flex items-center justify-center text-[#3f5936] flex-shrink-0">
                <i className="fa-solid fa-mobile-screen"></i>
              </div>
              <div>
                <strong className="block text-[10px] font-semibold text-[#728c69] uppercase">Alternate</strong>
                <a href={`tel:${config.links.phone}`} className="text-blue-600 hover:underline">{config.links.phone}</a>
              </div>
            </div>
            <div className="flex gap-3 text-xs leading-normal">
              <div className="w-8 h-8 rounded-lg bg-[rgba(63,89,54,0.1)] flex items-center justify-center text-[#3f5936] flex-shrink-0">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <strong className="block text-[10px] font-semibold text-[#728c69] uppercase">Email</strong>
                <a href={`mailto:${config.links.emailHead}`} className="text-blue-600 hover:underline">{config.links.emailHead}</a>
              </div>
            </div>
            <div className="flex gap-3 text-xs leading-normal">
              <div className="w-8 h-8 rounded-lg bg-[rgba(63,89,54,0.1)] flex items-center justify-center text-[#3f5936] flex-shrink-0">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <strong className="block text-[10px] font-semibold text-[#728c69] uppercase">Address</strong>
                <span className="text-gray-600">{config.links.addressHead}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4.5 shadow-sm space-y-3">
            <div className="text-[13px] font-bold text-[#3f5936] border-b pb-2 border-gray-100 flex items-center gap-2">
              <i className="fa-solid fa-warehouse"></i> Export Office
            </div>
            <div className="flex gap-3 text-xs leading-normal">
              <div className="w-8 h-8 rounded-lg bg-[rgba(63,89,54,0.1)] flex items-center justify-center text-[#3f5936] flex-shrink-0">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <strong className="block text-[10px] font-semibold text-[#728c69] uppercase">Phone</strong>
                <a href={`tel:${config.links.phone}`} className="text-blue-600 hover:underline">{config.links.phone}</a>
              </div>
            </div>
            <div className="flex gap-3 text-xs leading-normal">
              <div className="w-8 h-8 rounded-lg bg-[rgba(63,89,54,0.1)] flex items-center justify-center text-[#3f5936] flex-shrink-0">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <strong className="block text-[10px] font-semibold text-[#728c69] uppercase">Email</strong>
                <a href={`mailto:${config.links.emailExport}`} className="text-blue-600 hover:underline">{config.links.emailExport}</a>
              </div>
            </div>
            <div className="flex gap-3 text-xs leading-normal">
              <div className="w-8 h-8 rounded-lg bg-[rgba(63,89,54,0.1)] flex items-center justify-center text-[#3f5936] flex-shrink-0">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <strong className="block text-[10px] font-semibold text-[#728c69] uppercase">Address</strong>
                <span className="text-gray-600">{config.links.addressExport}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="p-6 border-b border-[rgba(63,89,54,0.1)]">
          <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#728c69] mb-4 flex items-center gap-2">
            Business Hours <span className="flex-grow h-[1px] bg-[rgba(63,89,54,0.15)]" />
          </div>
          <ul className="text-xs divide-y divide-[rgba(63,89,54,0.07)]">
            <li className="flex justify-between py-2.5">
              <span className="font-semibold text-gray-700">Monday</span>
              <span className="font-bold text-[#3f5936]">{config.businessHours.monday}</span>
            </li>
            <li className="flex justify-between py-2.5">
              <span className="font-semibold text-gray-700">Tuesday</span>
              <span className="font-bold text-[#3f5936]">{config.businessHours.tuesday}</span>
            </li>
            <li className="flex justify-between py-2.5">
              <span className="font-semibold text-gray-700">Wednesday</span>
              <span className="font-bold text-[#3f5936]">{config.businessHours.wednesday}</span>
            </li>
            <li className="flex justify-between py-2.5">
              <span className="font-semibold text-gray-700">Thursday</span>
              <span className="font-bold text-[#3f5936]">{config.businessHours.thursday}</span>
            </li>
            <li className="flex justify-between py-2.5">
              <span className="font-semibold text-gray-700">Friday</span>
              <span className="font-bold text-[#3f5936]">{config.businessHours.friday}</span>
            </li>
            <li className="flex justify-between py-2.5">
              <span className="font-semibold text-gray-700">Saturday</span>
              <span className="font-bold text-[#3f5936]">{config.businessHours.saturday}</span>
            </li>
            <li className="flex justify-between py-2.5">
              <span className="font-semibold text-gray-700">Sunday</span>
              <span className="font-bold text-[#cc6633]">{config.businessHours.sunday}</span>
            </li>
          </ul>
        </div>

        {/* Send Inquiry */}
        <div className="p-6 border-b border-[rgba(63,89,54,0.1)]">
          <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#728c69] mb-4 flex items-center gap-2">
            Send Inquiry <span className="flex-grow h-[1px] bg-[rgba(63,89,54,0.15)]" />
          </div>

          {submitSuccess && (
            <div className="mb-4 bg-[#eaf3e8] border border-[rgba(63,89,54,0.15)] text-[#3f5936] text-xs font-semibold p-3.5 rounded-lg text-center">
              <i className="fa-solid fa-check-circle mr-1.5"></i> Thank you! Your inquiry has been sent.
            </div>
          )}

          {submitError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold p-3.5 rounded-lg text-center">
              <i className="fa-solid fa-circle-exclamation mr-1.5"></i> {submitError}
            </div>
          )}

          {!submitSuccess && (
            <form onSubmit={handleSubmitInquiry} className="space-y-3">
              <input 
                type="text" 
                placeholder="Your Name" 
                value={inqName}
                onChange={(e) => setInqName(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-[rgba(63,89,54,0.15)] focus:border-[#3f5936] text-xs outline-none bg-white transition"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={inqEmail}
                onChange={(e) => setInqEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-[rgba(63,89,54,0.15)] focus:border-[#3f5936] text-xs outline-none bg-white transition"
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={inqPhone}
                onChange={(e) => setInqPhone(e.target.value)}
                className="w-full p-3 rounded-lg border border-[rgba(63,89,54,0.15)] focus:border-[#3f5936] text-xs outline-none bg-white transition"
              />
              <textarea 
                placeholder="Describe your requirement..." 
                value={inqMessage}
                onChange={(e) => setInqMessage(e.target.value)}
                required
                rows={3}
                className="w-full p-3 rounded-lg border border-[rgba(63,89,54,0.15)] focus:border-[#3f5936] text-xs outline-none bg-white resize-none transition"
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#3f5936] hover:bg-[#2d3e26] disabled:bg-gray-400 text-white rounded-xl font-semibold text-xs transition flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i> Submitting...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i> Submit Inquiry
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Map */}
        <div className="p-6">
          <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#728c69] mb-4 flex items-center gap-2">
            Find Us <span className="flex-grow h-[1px] bg-[rgba(63,89,54,0.15)]" />
          </div>
          <div className="rounded-xl overflow-hidden shadow-sm">
            <iframe 
              src={config.links.mapEmbed}
              width="100%" 
              height="220" 
              style={{ border: 0 }} 
              allowFullScreen={true}
              loading="lazy"
              title="Company Location Map"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
