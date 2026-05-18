import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { Colors } from '../constants/colors';

interface FilterOption {
  id: string;
  label: string;
  icon?: string;
}

interface Props {
  options: FilterOption[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function FilterPanel({ options, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
    >
      {options.map((opt) => {
        const isActive = selected === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 9,
              borderRadius: 22,
              backgroundColor: isActive ? Colors.primary : Colors.card,
              borderWidth: 1,
              borderColor: isActive ? Colors.primary : Colors.border,
            }}
          >
            {opt.icon && (
              <Text style={{ fontSize: 14, marginRight: 6 }}>{opt.icon}</Text>
            )}
            <Text
              style={{
                fontSize: 13,
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#fff' : Colors.textMain,
              }}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}