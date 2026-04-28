import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'

export default function PrivacyPolicyScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.updated}>Last updated: April 2026</Text>

        <Text style={styles.body}>
          Road Trip Hits is a music trivia game. This policy explains what data we collect and how we use it.
        </Text>

        <Text style={styles.heading}>Data We Collect</Text>
        <Text style={styles.body}>
          Road Trip Hits does not collect, store, or transmit any personal information directly. The app does not require you to create an account or log in.
        </Text>
        <Text style={styles.body}>
          Player names, scores, and game history are stored only on your device using local storage. This data is never sent to any server we control.
        </Text>

        <Text style={styles.heading}>In-App Purchases</Text>
        <Text style={styles.body}>
          Road Trip Hits offers a one-time in-app purchase ("Road Trip Hits Pro") to unlock additional features. Purchase processing is handled entirely by Apple through the App Store. We do not receive or store your payment information, credit card details, or Apple ID.
        </Text>
        <Text style={styles.body}>
          We use RevenueCat to manage in-app purchase state. RevenueCat receives an anonymous identifier (no name, email, or account information) and the fact that a purchase was completed.
        </Text>

        <Text style={styles.heading}>Music Previews</Text>
        <Text style={styles.body}>
          Song previews are streamed from the Deezer API. When you play a preview, your device makes a request to Deezer's servers. Deezer's own privacy policy applies to those requests. We do not store or have access to any data from those requests.
        </Text>

        <Text style={styles.heading}>Third-Party Services</Text>
        <Text style={styles.body}>
          Tapping "Full song ↗" may open Apple Music or Spotify. Those apps are subject to their own privacy policies. Road Trip Hits does not share any data with those services.
        </Text>

        <Text style={styles.heading}>Children's Privacy</Text>
        <Text style={styles.body}>
          Road Trip Hits does not knowingly collect any information from children under 13. Since we collect no personal data directly, the app is safe for all ages. The app contains no third-party advertising and no social or chat features.
        </Text>

        <Text style={styles.heading}>Changes to This Policy</Text>
        <Text style={styles.body}>
          We may update this privacy policy from time to time. Any changes will be reflected in the "Last updated" date above.
        </Text>

        <Text style={styles.heading}>Contact</Text>
        <Text style={styles.body}>
          If you have any questions about this privacy policy, please contact us at:
        </Text>
        <Text style={styles.email}>briones05ethan@gmail.com</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  backBtn: { width: 60 },
  backText: { fontSize: 16, color: '#2563eb' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#f1f5f9' },
  scroll: { padding: 24 },
  updated: { fontSize: 12, color: '#475569', marginBottom: 16 },
  heading: { fontSize: 16, fontWeight: '700', color: '#f1f5f9', marginTop: 24, marginBottom: 8 },
  body: { fontSize: 14, color: '#94a3b8', lineHeight: 22, marginBottom: 8 },
  email: { fontSize: 14, color: '#2563eb', fontWeight: '600', marginTop: 4 },
})