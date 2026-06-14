// Ionicons removed (not used in redesigned header)
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Card import is not used by the new Home layout
import { AppHeader } from '../components/AppHeader';
import { BottomDecor } from '../components/BottomDecor';
import { LargeCard } from '../components/LargeCard';

export default function HomeScreen() {
  const router = useRouter();

  // layout is responsive via flex and sensible card sizes

  return (
    <LinearGradient
      colors={['#FFF5F5', '#E0F7FA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <AppHeader title={"Hi Kiddo 👋"} subtitle={"Let's Learn & Play"} stars={18} />

        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: 20 }]} showsVerticalScrollIndicator={false}>
          <View style={styles.heroContainer}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroTitle}>{"Let's Learn & Play!"}</Text>
              <Text style={styles.heroSub}>Pick an activity to start your adventure 🌟</Text>
            </View>
            <View style={styles.heroRight}>
              <Image source={require('../../assets/images/logo.png')} style={{ width: 72, height: 72 }} contentFit="contain" />
            </View>
          </View>

          <View style={styles.gridOuter}>
            <View style={styles.gridRow}>
              <LargeCard
                title="ABC Learning"
                subtitle="Learn the letters A to Z"
                emoji="🔤"
                gradient={["#7C3AED", "#FB7185"]}
                onPress={() => router.push('/alphabet')}
              />
            </View>
            <View style={styles.gridRow}>
              <LargeCard
                title="Alphabet Tracing"
                subtitle="Trace letters with your finger"
                emoji="✏️"
                gradient={["#38BDF8", "#22C55E"]}
                onPress={() => router.push('/tracing')}
              />
            </View>
            <View style={styles.gridRow}>
              <LargeCard
                title="Quiz Time"
                subtitle="Play & Win Stars"
                emoji="🏆"
                gradient={["#FFD1FF", "#FAD0C4"]}
                onPress={() => router.push('/quiz')}
              />
            </View>
            <View style={styles.gridRowPair}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <LargeCard
                  title="Animals"
                  subtitle="Meet cute friends"
                  emoji="🦁"
                  gradient={["#FFF0D4", "#FFD29D"]}
                  onPress={() => router.push('/animals')}
                />
              </View>
              <View style={{ flex: 1, paddingLeft: 8 }}>
                <LargeCard
                  title="Numbers"
                  subtitle="Count 1 to 10"
                  emoji="🔢"
                  gradient={["#D4FC79", "#96E6A1"]}
                  onPress={() => router.push('/numbers')}
                />
              </View>
            </View>
          </View>

          <BottomDecor />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerSpacer: {
    width: 48,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ff6b6b',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Cooper Black' : 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  settingsBtn: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoContainer: {
    width: '100%',
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  logo: {
    width: '80%',
    height: '100%',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginHorizontal: 30,
    marginBottom: 25,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1e293b',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Cooper Black' : 'System',
  },
  welcomeSub: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
  },
  gridContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  gridItem: {
    width: '50%',
    padding: 8,
  },
  categoryCard: {
    height: 170,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 15,
  },
  cardHeader: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardEmoji: {
    fontSize: 34,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  cardSub: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  bannerContainer: {
    width: '100%',
    height: 140,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    width: '95%',
    height: '100%',
  },
  heroContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginBottom: 8,
  },
  heroLeft: {
    flex: 1,
  },
  heroRight: {
    width: 84,
    alignItems: 'flex-end',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  heroSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
    fontWeight: '700',
  },
  gridOuter: {
    width: '100%',
    marginTop: 6,
  },
  gridRow: {
    marginBottom: 12,
  },
  gridRowPair: {
    flexDirection: 'row',
    marginBottom: 12,
    width: '100%',
  },
});
