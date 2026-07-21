import { StyleSheet, Image, ScrollView, TouchableOpacity, View, Linking, useColorScheme } from 'react-native';
import { Text } from '@/components/Themed';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { earthPalette } from '@/constants/Colors';

const PRODUCTS = [
  { id: '1', name: 'Blended Spices', desc: 'Authentic Indian spice mixes meticulously blended for rich aroma, purity, and flavor.', img: 'https://hdlglobal.co.in/wp-content/uploads/2026/03/Blended-Spices.jpg' },
  { id: '2', name: 'Premium Pulses', desc: 'High-protein lentils, chickpeas, and legumes meeting strict international export standards.', img: 'https://hdlglobal.co.in/wp-content/uploads/2026/03/Pulses.jpg' },
  { id: '3', name: 'Dry Fruits', desc: 'Premium almonds, cashews, pistachios, and raisins sourced for maximum freshness.', img: 'https://hdlglobal.co.in/wp-content/uploads/2026/03/Dry-fruits.jpg' },
  { id: '4', name: 'Agricultural Fertilizer', desc: 'High-quality agricultural fertilizers promoting robust crop yields and soil health.', img: 'https://hdlglobal.co.in/wp-content/uploads/2026/03/fertilizer-main.jpg' },
  { id: '5', name: 'Other Products', desc: 'Over 500+ grocery and food items sourced directly from trusted Indian farms.', img: 'https://hdlglobal.co.in/wp-content/uploads/2026/03/Other-Products.jpg' }
];

export default function ProductsScreen() {
  const isDark = useColorScheme() === 'dark';
  const textColor = isDark ? '#fff' : earthPalette.forest;
  
  const handleInquire = (productName: string) => {
    const text = encodeURIComponent(`I'm interested in ${productName}`);
    Linking.openURL(`https://api.whatsapp.com/send?phone=919426431007&text=${text}`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#1a2416' : earthPalette.light }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Premium Export Products</Text>
        <Text style={[styles.headerSubtitle, { color: isDark ? '#ccc' : '#666' }]}>Browse our catalog of 500+ agricultural commodities exported worldwide.</Text>
      </View>

      <View style={styles.list}>
        {PRODUCTS.map((prod) => (
          <View key={prod.id} style={[styles.card, { backgroundColor: isDark ? '#2c3a25' : '#fff' }]}>
            <Image source={{ uri: prod.img }} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardBody}>
              <Text style={[styles.cardTitle, { color: textColor }]}>{prod.name}</Text>
              <Text style={[styles.cardDesc, { color: isDark ? '#ccc' : '#666' }]}>{prod.desc}</Text>
              <TouchableOpacity style={styles.inquireBtn} onPress={() => handleInquire(prod.name)}>
                <FontAwesome5 name="whatsapp" size={18} color="#fff" />
                <Text style={styles.inquireText}>Inquire via WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 25, paddingBottom: 10 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 5 },
  headerSubtitle: { fontSize: 14, lineHeight: 20 },
  list: { padding: 15 },
  card: {
    borderRadius: 15, overflow: 'hidden', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4
  },
  cardImage: { width: '100%', height: 200 },
  cardBody: { padding: 18 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  cardDesc: { fontSize: 13, marginBottom: 15, lineHeight: 19 },
  inquireBtn: {
    backgroundColor: earthPalette.whatsapp, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 10, gap: 8,
  },
  inquireText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});
