import { View, Text } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  currentServing: number;
  myPosition: number;
  totalInQueue: number;
  estimatedWait: number; // minutes
  isActive: boolean;
}

export default function QueueTracker({ currentServing, myPosition, totalInQueue, estimatedWait, isActive }: Props) {
  const ahead = Math.max(0, myPosition - currentServing - 1);

  return (
    <View
      style={{
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.border,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.textMain }}>Queue Status</Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isActive ? '#F0FDF4' : '#F1F5F9',
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 4,
        }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: isActive ? Colors.available : Colors.offline, marginRight: 6 }} />
          <Text style={{ fontSize: 12, fontWeight: '600', color: isActive ? Colors.available : Colors.offline }}>
            {isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 32, fontWeight: '800', color: Colors.primary }}>{currentServing}</Text>
          <Text style={{ fontSize: 12, color: Colors.textSub, marginTop: 2 }}>Now Serving</Text>
        </View>
        <View style={{ width: 1, backgroundColor: Colors.border }} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 32, fontWeight: '800', color: Colors.textMain }}>{myPosition}</Text>
          <Text style={{ fontSize: 12, color: Colors.textSub, marginTop: 2 }}>Your Number</Text>
        </View>
        <View style={{ width: 1, backgroundColor: Colors.border }} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 32, fontWeight: '800', color: Colors.waiting }}>{ahead}</Text>
          <Text style={{ fontSize: 12, color: Colors.textSub, marginTop: 2 }}>Ahead of You</Text>
        </View>
      </View>

      <View style={{
        marginTop: 16,
        backgroundColor: Colors.primaryLight,
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
      }}>
        <Text style={{ fontSize: 13, color: Colors.primary, fontWeight: '600' }}>
          ⏱ Est. wait: {ahead === 0 ? "You're next!" : `~${ahead * estimatedWait} min`}
        </Text>
      </View>
    </View>
  );
}