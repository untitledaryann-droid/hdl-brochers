import { StyleSheet, Image, ScrollView, TouchableOpacity, View, Linking, useColorScheme } from 'react-native';
import { Text } from '@/components/Themed';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { earthPalette } from '@/constants/Colors';

export default function HomeScreen() {
  const isDark = useColorScheme() === 'dark';
  const textColor = isDark ? '#fff' : earthPalette.forest;
  const cardBg = isDark ? '#2c3a25' : '#fff';

  const handleCall = () => Linking.openURL('tel:+919313886251');
  const handleWhatsApp = () => Linking.openURL('https://api.whatsapp.com/send?phone=919426431007');
  const handleBrochure = () => Linking.openURL('https://go.fliplink.me/view/AAD14BF1-F68A-43CE-8DD5-309BB3CAA2B1');
  const handleWebsite = () => Linking.openURL('https://hdlglobal.co.in/');

  const services = [
    { name: 'Blended Spices', icon: 'pepper-hot', color: '#cba135', bg: '#fff4e0', desc: 'Premium hand-blended spice mixes processed hygienically.' },
    { name: 'Premium Pulses', icon: 'seedling', color: '#3f5936', bg: '#eaf3e8', desc: 'Carefully sourced lentils, dals & legumes for global export.' },
    { name: 'Dry Fruits', icon: 'apple-alt', color: '#cc6633', bg: '#fdeee6', desc: 'Almonds, cashews, raisins naturally dried & packed.' },
    { name: 'Agricultural Fertilizer', icon: 'leaf', color: '#2e7a7a', bg: '#e8f3f3', desc: 'High-grade organic & inorganic fertilizers.' },
    { name: 'Other Products', icon: 'boxes', color: '#7c5cbf', bg: '#f0edfb', desc: '500+ grocery products sourced directly from Indian farms.' },
  ];

  const galleryImages = [
    { uri: 'https://hdlglobal.co.in/wp-content/uploads/2026/03/Blended-Spices.jpg', title: 'Blended Spices' },
    { uri: 'https://hdlglobal.co.in/wp-content/uploads/2026/03/Pulses.jpg', title: 'Pulses' },
    { uri: 'https://hdlglobal.co.in/wp-content/uploads/2026/03/Dry-fruits.jpg', title: 'Dry Fruits' },
    { uri: 'https://hdlglobal.co.in/wp-content/uploads/2026/03/fertilizer-main.jpg', title: 'Fertilizer' },
    { uri: 'https://hdlglobal.co.in/wp-content/uploads/2026/03/Other-Products.jpg', title: 'Other Products' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#1a2416' : earthPalette.light }]}>
      
      {/* Hero Header */}
      <View style={styles.heroBanner}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2070&auto=format&fit=crop' }} 
          style={styles.heroImage} 
        />
        <View style={styles.heroOverlay}>
          <View style={styles.logoRing}>
            <Image 
              source={{ uri: 'https://hdlglobal.co.in/wp-content/uploads/2026/03/cropped-logo.png' }} 
              style={styles.logoImg}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.heroTitle}>HDL Global</Text>
          <Text style={styles.heroTagline}>HDL FOODS INDIA PVT LTD</Text>
          <Text style={styles.heroDesc}>
            Leading Indian exporter of premium food products — Pulses, Blended Spices, Dry Fruits & Fertilizers exported to 25+ countries worldwide.
          </Text>
        </View>
      </View>

      {/* Primary Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#25D366' }]} onPress={handleWhatsApp}>
          <FontAwesome5 name="whatsapp" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>Chat on WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: earthPalette.gold }]} onPress={handleCall}>
          <FontAwesome5 name="phone-alt" size={18} color="#fff" />
          <Text style={styles.actionBtnText}>Call Us (+91 93138 86251)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: earthPalette.forest }]} onPress={handleBrochure}>
          <FontAwesome5 name="file-pdf" size={18} color="#fff" />
          <Text style={styles.actionBtnText}>Download Brochure</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#fff', borderWidth: 1.5, borderColor: earthPalette.forest }]} onPress={handleWebsite}>
          <FontAwesome5 name="globe" size={18} color={earthPalette.forest} />
          <Text style={[styles.actionBtnText, { color: earthPalette.forest }]}>Visit Website (hdlglobal.co.in)</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Our Growth in Numbers</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.statNum, { color: earthPalette.forest }]}>500+</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>Food Products</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.statNum, { color: earthPalette.forest }]}>25+</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>Export Countries</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.statNum, { color: earthPalette.forest }]}>97+</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>Team Members</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.statNum, { color: earthPalette.forest }]}>15+</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>Years Experience</Text>
          </View>
        </View>
      </View>

      {/* Services Provided */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Range of Services</Text>
        {services.map((s, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.serviceCard, { backgroundColor: cardBg }]}
            onPress={() => Linking.openURL(`https://api.whatsapp.com/send?phone=919426431007&text=I'm%20interested%20in%20${encodeURIComponent(s.name)}`)}
          >
            <View style={[styles.serviceIconWrap, { backgroundColor: s.bg }]}>
              <FontAwesome5 name={s.icon} size={20} color={s.color} />
            </View>
            <View style={styles.serviceContent}>
              <Text style={[styles.serviceTitle, { color: textColor }]}>{s.name}</Text>
              <Text style={[styles.serviceDesc, { color: isDark ? '#aaa' : '#666' }]}>{s.desc}</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={14} color="#aaa" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Gallery Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Gallery</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
          {galleryImages.map((img, idx) => (
            <View key={idx} style={styles.galleryCard}>
              <Image source={{ uri: img.uri }} style={styles.galleryImg} />
              <View style={styles.galleryBadge}>
                <Text style={styles.galleryBadgeText}>{img.title}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroBanner: { height: 320, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(25, 40, 20, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoRing: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#fff',
    padding: 8, marginBottom: 12, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4
  },
  logoImg: { width: '100%', height: '100%' },
  heroTitle: { fontSize: 30, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  heroTagline: { fontSize: 12, fontWeight: 'bold', color: earthPalette.gold, letterSpacing: 1.5, marginBottom: 10 },
  heroDesc: { fontSize: 13, color: '#e0e0e0', textAlign: 'center', lineHeight: 18, paddingHorizontal: 10 },
  actionsContainer: { padding: 20, gap: 10 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
  },
  actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  section: { paddingHorizontal: 20, marginTop: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  statCard: {
    width: '48%', padding: 16, borderRadius: 14, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1
  },
  statNum: { fontSize: 26, fontWeight: 'bold' },
  statLabel: { fontSize: 12, marginTop: 4, fontWeight: '500' },
  serviceCard: {
    flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1
  },
  serviceIconWrap: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  serviceContent: { flex: 1 },
  serviceTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  serviceDesc: { fontSize: 12, lineHeight: 16 },
  galleryScroll: { flexDirection: 'row' },
  galleryCard: { width: 220, height: 150, borderRadius: 14, overflow: 'hidden', marginRight: 12, position: 'relative' },
  galleryImg: { width: '100%', height: '100%' },
  galleryBadge: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.55)', padding: 8 },
  galleryBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
});
