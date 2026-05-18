import { useState, useMemo } from 'react';\nimport {\n  View,\n  Text,\n  TextInput,\n  FlatList,\n  TouchableOpacity,\n  ScrollView,\n  ActivityIndicator,\n} from 'react-native';\nimport { SafeAreaView } from 'react-native-safe-area-context';\nimport { useRouter } from 'expo-router';\nimport { Colors } from '../../constants/colors';\nimport { useDoctorsRealtime } from '../../hooks/useSearch';\n\nconst FILTERS = ['All', 'Available Now', 'Highest Rated', 'Lowest Fee', 'Nearest'];

function QueueChip({ count, available }: { count: number; available: boolean }) {
  if (!available) return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.offline, marginRight: 4 }} />
      <Text style={{ fontSize: 11, color: Colors.offline, fontWeight: '500' }}>Offline</Text>
    </View>
  );
  if (count === 0) return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.available, marginRight: 4 }} />
      <Text style={{ fontSize: 11, color: Colors.available, fontWeight: '600' }}>Available</Text>
    </View>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.waiting, marginRight: 4 }} />
      <Text style={{ fontSize: 11, color: Colors.waiting, fontWeight: '600' }}>{count} in queue</Text>
    </View>
  );
}

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const { doctors, loading } = useDoctorsRealtime();

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchesQuery =
        query.length === 0 ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.specialty.toLowerCase().includes(query.toLowerCase());

      const matchesFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Available Now' && d.available) ||
        (activeFilter === 'Highest Rated' && d.rating >= 4.8) ||
        (activeFilter === 'Lowest Fee' && d.fee <= 300) ||
        activeFilter === 'Nearest';

      return matchesQuery && matchesFilter;
    });
  }, [doctors, query, activeFilter]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: Colors.textMain, marginBottom: 14 }}>
          Find Doctors
        </Text>

        {/* Search input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.card,
            borderRadius: 14,
            paddingHorizontal: 16,
            height: 52,
            borderWidth: 1.5,
            borderColor: query.length > 0 ? Colors.primary : Colors.border,
          }}
        >
          <Text style={{ fontSize: 18, marginRight: 10, color: Colors.textMuted }}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Doctor name, specialty..."
            placeholderTextColor={Colors.textMuted}
            style={{ flex: 1, fontSize: 15, color: Colors.textMain }}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={{ fontSize: 18, color: Colors.textMuted }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10, gap: 8 }}
      >
        {FILTERS.map((f) => {
          const isActive = activeFilter === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: isActive ? Colors.primary : Colors.card,
                borderWidth: 1.5,
                borderColor: isActive ? Colors.primary : Colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: isActive ? '#fff' : Colors.textSub,
                }}
              >
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Results count */}
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : (
        <>
          <Text style={{ fontSize: 13, color: Colors.textMuted, paddingHorizontal: 20, marginBottom: 8 }}>
            {filtered.length} doctors found
          </Text>
          {/* Doctor list */}
          <FlatList
            data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: doctor }) => (
          <TouchableOpacity
            onPress={() => router.push(`/(patient)/doctor/${doctor.id}` as any)}
            style={{
              backgroundColor: Colors.card,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: Colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 2,
            }}
            activeOpacity={0.85}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 14,
                  backgroundColor: Colors.primaryLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 28 }}>👨‍⚕️</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.textMain }}>{doctor.name}</Text>
                <Text style={{ fontSize: 13, color: Colors.textSub, marginTop: 1 }}>{doctor.specialty}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textMain }}>
                    ⭐ {doctor.rating}
                    <Text style={{ fontSize: 11, color: Colors.textMuted }}> ({doctor.reviews})</Text>
                  </Text>
                  <Text style={{ fontSize: 12, color: Colors.textSub }}>📍 {doctor.distance}</Text>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMain }}>₹{doctor.fee}</Text>
                <Text style={{ fontSize: 11, color: Colors.textSub, marginTop: 2 }}>{doctor.experience}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 12,
                paddingTop: 10,
                borderTopWidth: 1,
                borderTopColor: Colors.divider,
              }}
            >
              <QueueChip count={doctor.queueCount} available={doctor.available} />

              <TouchableOpacity
                style={{
                  backgroundColor: doctor.available ? Colors.primary : Colors.border,
                  paddingHorizontal: 20,
                  paddingVertical: 8,
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: doctor.available ? '#fff' : Colors.textMuted }}>
                  {doctor.available ? `Book ₹${doctor.fee}` : 'Notify Me'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 40 }}>🔍</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.textMain, marginTop: 12 }}>
              No doctors found
            </Text>
            <Text style={{ fontSize: 14, color: Colors.textSub, marginTop: 6 }}>
              Try a different search or filter
            </Text>
          </View>
        }
      />
        </>
      )}
    </SafeAreaView>
  );
}