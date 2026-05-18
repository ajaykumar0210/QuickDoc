import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';

// Simple SVG-style icons using Unicode + styled Text
function TabIcon({ focused, label, icon }: { focused: boolean; label: string; icon: string }) {
  return (
    <View className="items-center justify-center pt-1">
      <Text style={{ fontSize: 22, color: focused ? Colors.primary : Colors.tabInactive }}>
        {icon}
      </Text>
      <Text
        style={{
          fontSize: 10,
          marginTop: 2,
          fontWeight: focused ? '600' : '400',
          color: focused ? Colors.primary : Colors.tabInactive,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function PatientLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Home" icon="🏠" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Search" icon="🔍" />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Bookings" icon="📅" />
          ),
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Emergency" icon="🚨" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Profile" icon="👤" />
          ),
        }}
      />
      {/* Hidden screens — not shown in tabs */}
      <Tabs.Screen name="doctor/[id]" options={{ href: null }} />
      <Tabs.Screen name="book/[doctorId]" options={{ href: null }} />
      <Tabs.Screen name="queue/[appointmentId]" options={{ href: null }} />
    </Tabs>
  );
}
