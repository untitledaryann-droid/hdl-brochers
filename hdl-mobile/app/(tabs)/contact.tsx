import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput, useColorScheme, Linking, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { earthPalette } from '@/constants/Colors';
import { useState } from 'react';

export default function ContactScreen() {
  const isDark = useColorScheme() === 'dark';
  const textColor = isDark ? '#fff' : earthPalette.forest;
  const cardBg = isDark ? '#2c3a25' : '#fff';

  // Appointment state
  const [apptStep, setApptStep] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleCall = () => Linking.openURL('tel:+919313886251');
  const handleAltCall = () => Linking.openURL('tel:+919426431007');
  const handleEmail = () => Linking.openURL('mailto:info@hdlglobal.co.in');
  const handleMap = () => Linking.openURL('https://www.google.com/maps/place/HDL+FOODS+(INDIA)+PRIVATE+LIMITED/@22.3800487,70.9223384,1092m');

  // Business hours definition (0=Sun, 1=Mon...6=Sat)
  const timeSlots = [
    { label: '9:00 AM', val: 9 },
    { label: '10:00 AM', val: 10 },
    { label: '11:00 AM', val: 11 },
    { label: '12:00 PM', val: 12 },
    { label: '2:00 PM', val: 14 },
    { label: '3:00 PM', val: 15 },
    { label: '4:00 PM', val: 16 },
    { label: '5:00 PM', val: 17 },
  ];

  const handleProceedDate = () => {
    if (!selectedDate) {
      setErrorMsg('Please enter a date (YYYY-MM-DD)');
      return;
    }
    const d = new Date(selectedDate + 'T00:00:00');
    if (isNaN(d.getTime())) {
      setErrorMsg('Please enter a valid date format (e.g. 2026-07-25)');
      return;
    }
    const day = d.getDay();
    if (day === 0) {
      setErrorMsg('Sunday is a holiday. Please pick another day.');
      return;
    }
    setErrorMsg('');
    setApptStep(1);
  };

  const handleProceedTime = () => {
    if (!selectedTime) {
      setErrorMsg('Please select a time slot');
      return;
    }
    setErrorMsg('');
    setApptStep(2);
  };

  const handleBookAppointment = () => {
    if (!name.trim()) { setErrorMsg('Please enter your full name'); return; }
    if (!phone.trim()) { setErrorMsg('Please enter your phone number'); return; }
    if (!email.trim() || !email.includes('@')) { setErrorMsg('Please enter a valid email address'); return; }

    setErrorMsg('');
    const subject = encodeURIComponent(`Meeting Booking Request — ${selectedDate} at ${selectedTime}`);
    const body = encodeURIComponent(
      `Meeting Booking Request\n\nDate: ${selectedDate}\nTime: ${selectedTime}\n\nClient Name: ${name}\nPhone: ${phone}\nEmail: ${email}`
    );
    Linking.openURL(`mailto:info@hdlglobal.co.in?subject=${subject}&body=${body}`);
    setApptStep(3);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#1a2416' : earthPalette.light }]}>
      
      {/* Quick Action Header */}
      <View style={styles.quickHeader}>
        <TouchableOpacity style={[styles.callBtn, { backgroundColor: earthPalette.gold }]} onPress={handleCall}>
          <FontAwesome5 name="phone-alt" size={18} color="#fff" />
          <Text style={styles.callBtnText}>Call Now (+91 93138 86251)</Text>
        </TouchableOpacity>
      </View>

      {/* Office Locations / Contacts */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Company Contacts & Locations</Text>
        
        {/* Contact 1 */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="building" size={20} color={earthPalette.forest} />
            <Text style={[styles.cardHeaderTitle, { color: textColor }]}>Head Office — Rajkot</Text>
          </View>
          <TouchableOpacity style={styles.infoRow} onPress={handleAltCall}>
            <FontAwesome5 name="phone" size={16} color={earthPalette.sage} style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: textColor }]}>+91 94264 31007</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
            <FontAwesome5 name="mobile-alt" size={16} color={earthPalette.sage} style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: textColor }]}>+91 93138 86251 (Alternate)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoRow} onPress={handleEmail}>
            <FontAwesome5 name="envelope" size={16} color={earthPalette.sage} style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: textColor }]}>info@hdlglobal.co.in</Text>
          </TouchableOpacity>
          <View style={styles.infoRow}>
            <FontAwesome5 name="map-marker-alt" size={16} color={earthPalette.terra} style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: isDark ? '#ccc' : '#555', flex: 1 }]}>
              Kevalam Industrial Park, Plot No-7,8, Kuvadva Wanker Highway 113, Village Ranpur, Taluka Rajkot, Dist. Rajkot-360023, Gujarat, India
            </Text>
          </View>
        </View>

        {/* Contact 2 */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="warehouse" size={20} color={earthPalette.forest} />
            <Text style={[styles.cardHeaderTitle, { color: textColor }]}>Export Office</Text>
          </View>
          <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
            <FontAwesome5 name="phone" size={16} color={earthPalette.sage} style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: textColor }]}>+91 93138 86251</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL('mailto:export@hdlglobal.co.in')}>
            <FontAwesome5 name="envelope" size={16} color={earthPalette.sage} style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: textColor }]}>export@hdlglobal.co.in</Text>
          </TouchableOpacity>
          <View style={styles.infoRow}>
            <FontAwesome5 name="map-marker-alt" size={16} color={earthPalette.terra} style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: isDark ? '#ccc' : '#555', flex: 1 }]}>
              HDL Foods India Pvt Ltd, Kevalam Industrial Park, Rajkot-360023, Gujarat, India
            </Text>
          </View>
        </View>
      </View>

      {/* Business Hours */}
      <View style={styles.section}>
        <View style={[styles.hoursCard, { backgroundColor: earthPalette.forest }]}>
          <FontAwesome5 name="clock" size={24} color={earthPalette.gold} style={{ marginBottom: 10 }} />
          <Text style={styles.hoursTitle}>Business Hours</Text>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Monday</Text>
            <Text style={styles.hoursTime}>8:30 AM – 7:00 PM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Tuesday</Text>
            <Text style={styles.hoursTime}>8:30 AM – 7:00 PM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Wednesday</Text>
            <Text style={styles.hoursTime}>8:30 AM – 7:00 PM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Thursday</Text>
            <Text style={styles.hoursTime}>8:30 AM – 7:00 PM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Friday</Text>
            <Text style={styles.hoursTime}>8:30 AM – 7:00 PM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Saturday</Text>
            <Text style={styles.hoursTime}>9:30 AM – 5:00 PM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Sunday</Text>
            <Text style={[styles.hoursTime, { color: earthPalette.terra }]}>Holiday</Text>
          </View>
        </View>
      </View>

      {/* Appointment Booking */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Book an Appointment</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          
          {apptStep === 0 && (
            <View>
              <Text style={[styles.stepLabel, { color: textColor }]}>Step 1: Pick a Date</Text>
              <TextInput 
                style={[styles.input, { color: textColor, borderColor: isDark ? '#3f5936' : '#ccc' }]}
                placeholder="YYYY-MM-DD (e.g. 2026-07-25)"
                placeholderTextColor={isDark ? '#888' : '#aaa'}
                value={selectedDate}
                onChangeText={setSelectedDate}
              />
              {!!errorMsg && <Text style={styles.errText}>{errorMsg}</Text>}
              <TouchableOpacity style={[styles.btn, { backgroundColor: earthPalette.forest }]} onPress={handleProceedDate}>
                <Text style={styles.btnText}>Continue to Time Slots</Text>
              </TouchableOpacity>
            </View>
          )}

          {apptStep === 1 && (
            <View>
              <Text style={[styles.stepLabel, { color: textColor }]}>Step 2: Select Time ({selectedDate})</Text>
              <View style={styles.timeGrid}>
                {timeSlots.map((slot, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.timeChip,
                      selectedTime === slot.label && { backgroundColor: earthPalette.forest, borderColor: earthPalette.forest }
                    ]}
                    onPress={() => setSelectedTime(slot.label)}
                  >
                    <Text style={[styles.timeChipText, selectedTime === slot.label && { color: '#fff' }]}>
                      {slot.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {!!errorMsg && <Text style={styles.errText}>{errorMsg}</Text>}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: '#888' }]} onPress={() => setApptStep(0)}>
                  <Text style={styles.btnText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, { flex: 2, backgroundColor: earthPalette.forest }]} onPress={handleProceedTime}>
                  <Text style={styles.btnText}>Continue to Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {apptStep === 2 && (
            <View>
              <Text style={[styles.stepLabel, { color: textColor }]}>Step 3: Your Information</Text>
              <TextInput 
                style={[styles.input, { color: textColor, borderColor: isDark ? '#3f5936' : '#ccc' }]}
                placeholder="Full Name"
                placeholderTextColor={isDark ? '#888' : '#aaa'}
                value={name} onChangeText={setName}
              />
              <TextInput 
                style={[styles.input, { color: textColor, borderColor: isDark ? '#3f5936' : '#ccc' }]}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                placeholderTextColor={isDark ? '#888' : '#aaa'}
                value={phone} onChangeText={setPhone}
              />
              <TextInput 
                style={[styles.input, { color: textColor, borderColor: isDark ? '#3f5936' : '#ccc' }]}
                placeholder="Email Address"
                keyboardType="email-address"
                placeholderTextColor={isDark ? '#888' : '#aaa'}
                value={email} onChangeText={setEmail}
              />
              {!!errorMsg && <Text style={styles.errText}>{errorMsg}</Text>}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: '#888' }]} onPress={() => setApptStep(1)}>
                  <Text style={styles.btnText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, { flex: 2, backgroundColor: earthPalette.gold }]} onPress={handleBookAppointment}>
                  <Text style={styles.btnText}>Book Meeting</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {apptStep === 3 && (
            <View style={{ alignItems: 'center', paddingVertical: 10 }}>
              <FontAwesome5 name="check-circle" size={48} color="#25D366" style={{ marginBottom: 10 }} />
              <Text style={[styles.stepLabel, { color: textColor }]}>Meeting Requested!</Text>
              <Text style={{ textAlign: 'center', color: isDark ? '#ccc' : '#666', marginBottom: 15 }}>
                Your meeting request for {selectedDate} at {selectedTime} has been submitted to HDL Global.
              </Text>
              <TouchableOpacity style={[styles.btn, { backgroundColor: earthPalette.forest, width: '100%' }]} onPress={() => setApptStep(0)}>
                <Text style={styles.btnText}>Book Another</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </View>

      {/* Map Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Location Map</Text>
        <TouchableOpacity style={[styles.mapBtn, { backgroundColor: earthPalette.forest }]} onPress={handleMap}>
          <FontAwesome5 name="map-marked-alt" size={24} color="#fff" />
          <Text style={styles.mapBtnText}>Open Location on Google Maps</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  quickHeader: { padding: 20 },
  callBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: 14, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
  },
  callBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  section: { paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  card: {
    padding: 18, borderRadius: 15, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  cardHeaderTitle: { fontSize: 16, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  infoIcon: { width: 24 },
  infoText: { fontSize: 14, fontWeight: '500' },
  hoursCard: { padding: 20, borderRadius: 15 },
  hoursTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  hoursDay: { color: '#e0e0e0', fontSize: 14 },
  hoursTime: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  stepLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 12 },
  errText: { color: earthPalette.terra, fontSize: 12, marginBottom: 10 },
  btn: { paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  timeChip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#fafafa' },
  timeChipText: { fontSize: 13, fontWeight: '600', color: '#333' },
  mapBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 14, gap: 12 },
  mapBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
