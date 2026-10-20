import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { styles } from './styles';

export function Button({ title, onPress, variant = 'primary', compact = false }) {
  return <Pressable onPress={onPress} style={[styles.button, variant === 'secondary' && styles.buttonSecondary, variant === 'danger' && styles.buttonDanger, compact && styles.buttonCompact]}><Text style={[styles.buttonText, variant !== 'primary' && styles.buttonSecondaryText]}>{title}</Text></Pressable>;
}

export function Field({ label, value, onChangeText, placeholder, keyboardType, multiline, autoCapitalize }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder || label} placeholderTextColor="#98a09b" keyboardType={keyboardType} multiline={multiline} autoCapitalize={autoCapitalize} style={[styles.input, multiline && styles.inputMultiline]} /></View>;
}

export function Header({ title, onBack, right, backLabel = 'Back' }) {
  return <View style={styles.header}>{onBack ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 10 }}><Pressable onPress={onBack}><Text style={styles.link}>‹  {backLabel}</Text></Pressable>{title ? <Text style={[styles.headerTitle, { flex: 1 }]} numberOfLines={1}>{title}</Text> : null}</View> : <View><Text style={styles.eyebrow}>BIT240029_FOODMANAGER</Text><Text style={styles.headerTitle}>{title}</Text></View>}{right || null}</View>;
}

export function Chip({ title, active, onPress }) {
  return <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{title}</Text></Pressable>;
}
