import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/authStore';
import { signOut } from '../../../firebase/auth';
import { Colors } from '../../../constants/colors';

const MENU_ITEMS = [
  { id: '1', icon: '👤', label: 'My Profile', sub: 'Edit personal details' },
  { id: '2', icon: '👨‍👩‍👧‍👦', label: 'Family Members', sub: 'Manage family profiles' },
  { id: '3', icon: '📅', label: 'My Appointments', sub: 'View all bookings' },
  { id: '4', icon: '📋', label: 'Medical Records', sub: 'Prescriptions & reports' },
  { id: '5', icon: '🔔', label: 'Notifications', sub: 'Queue & booking alerts' },
  { id: '6', icon: '❓', label: 'Help & Support', sub: 'FAQs, chat with us' },
  { id: '7', icon: '⭐', label: 'Rate QuickDoc', sub: 'Share your feedback' },
  { id: '8', icon: '📜', label: 'Terms & Privacy', sub: 'Legal info' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, clearUser } = useAuthStore();

  async function handleSignOut() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            clearUser();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: Colors.textMain }}>Profile</Text>
        </View>

        {/* User card */}
        <View
          style={{
            margin: 16,
            padding: 20,
            backgroundColor: Colors.card,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: Colors.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
              borderWidth: 2,
              borderColor: Colors.primary,
            }}
          >
            <Text style={{ fontSize: 30 }}>👤</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.textMain }}>
              {user?.displayName ?? 'QuickDoc User'}
            </Text>
            <Text style={{ fontSize: 14, color: Colors.textSub, marginTop: 2 }}>
              {user?.phoneNumber ?? 'Phone not set'}
            </Text>
            <TouchableOpacity style={{ marginTop: 6 }}>
              <Text style={{ fontSize: 13, color: Colors.primary, fontWeight: '600' }}>
                Edit Profile →
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu items */}
        <View
          style={{
            marginHorizontal: 16,
            backgroundColor: Colors.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: Colors.border,
            overflow: 'hidden',
          }}
        >
          {MENU_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: idx < MENU_ITEMS.length - 1 ? 1 : 0,
                borderBottomColor: Colors.divider,
              }}
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: Colors.muted,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}
              >
                <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.textMain }}>
                  {item.label}
                </Text>
                <Text style={{ fontSize: 12, color: Colors.textSub, marginTop: 1 }}>
                  {item.sub}
                </Text>
              </View>
              <Text style={{ fontSize: 18, color: Colors.border }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign out */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            height: 52,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: Colors.emergency,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FEF2F2',
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.emergency }}>
            🚪 Sign Out
          </Text>
        </TouchableOpacity>

        {/* App version */}
        <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.textMuted, marginTop: 20 }}>
          QuickDoc v1.0.0 · Made with ❤️ for India
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}