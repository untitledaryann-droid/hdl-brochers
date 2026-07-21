import { StyleSheet, ScrollView, View, Image, Dimensions, useColorScheme } from 'react-native';
import { Text } from '@/components/Themed';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { earthPalette } from '@/constants/Colors';

const { width } = Dimensions.get('window');

const STATS = [
  { label: 'Products', value: '500+' },
  { label: 'Countries', value: '25+' },
  { label: 'Team', value: '97+' },
  { label: 'Years Exp.', value: '15+' },
];

const TESTIMONIALS = [
  { name: 'Mayur Narkar', role: 'Distributor', text: '"Quality of spices is unmatched. Everything arrives fresh."' },
  { name: 'Siddhi Sonraj', role: 'Import Partner', text: '"Reliable delivery and transparent communication."' },
];

export default function AboutScreen() {
  const isDark = useColorScheme() === 'dark';
  const textColor = isDark ? '#fff' : earthPalette.forest;

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#1a2416' : earthPalette.light }]}>
      
      {/* Stats Section */}
      <View style={[styles.statsContainer, { backgroundColor: isDark ? earthPalette.forest : earthPalette.sage }]}>
        {STATS.map((s, i) => (
          <View key={i} style={styles.statBox}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Gallery Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Facility & Export Gallery</Text>
        <View style={styles.gallery}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80' }} style={styles.galleryImgLarge} />
          <View style={styles.galleryRow}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&q=80' }} style={styles.galleryImgSmall} />
            <Image source={{ uri: 'https://images.unsplash.com/photo-1621217036683-1b9daaf8fdf3?w=400&q=80' }} style={styles.galleryImgSmall} />
          </View>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1587049352847-4d445c79ee09?w=400&q=80' }} style={styles.galleryImgLarge} />
        </View>
      </View>

      {/* Testimonials */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Client Success</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          {TESTIMONIALS.map((t, i) => (
            <View key={i} style={[styles.testimonialCard, { backgroundColor: isDark ? '#2c3a25' : '#fff' }]}>
              <FontAwesome5 name="quote-left" size={24} color={earthPalette.gold} style={{ marginBottom: 10 }} />
              <Text style={[styles.testimonialText, { color: textColor }]}>{t.text}</Text>
              <Text style={[styles.testimonialName, { color: earthPalette.gold }]}>{t.name}</Text>
              <Text style={[styles.testimonialRole, { color: isDark ? '#ccc' : '#666' }]}>{t.role}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  statsContainer: {
    flexDirection: 'row', flexWrap: 'wrap', padding: 20,
  },
  statBox: { width: '50%', paddingVertical: 20, alignItems: 'center' },
  statValue: { fontSize: 32, fontWeight: 'bold', color: earthPalette.gold, marginBottom: 5 },
  statLabel: { color: '#fff', fontSize: 14, fontWeight: '500', textTransform: 'uppercase' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  gallery: { gap: 10 },
  galleryImgLarge: { width: '100%', height: 200, borderRadius: 15 },
  galleryRow: { flexDirection: 'row', gap: 10, height: 150 },
  galleryImgSmall: { flex: 1, height: '100%', borderRadius: 15 },
  carousel: { marginHorizontal: -20, paddingHorizontal: 20 },
  testimonialCard: {
    width: width * 0.75, padding: 20, borderRadius: 15, marginRight: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
  },
  testimonialText: { fontSize: 16, fontStyle: 'italic', marginBottom: 15, lineHeight: 24 },
  testimonialName: { fontWeight: 'bold', fontSize: 16 },
  testimonialRole: { fontSize: 14 }
});
