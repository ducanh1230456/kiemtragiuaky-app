import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Button, Field, Header } from '../components/ui';
import { styles } from '../components/styles';
import { isValidEndpoint } from '../data/sync';

export default function SettingsScreen({ data, t, syncStatus, onBack, onSave, onSync, onLanguage }) {
  const [dishEndpoint, setDishEndpoint] = useState(data.dishEndpoint || '');
  const [categoryEndpoint, setCategoryEndpoint] = useState(data.categoryEndpoint || '');
  useEffect(() => { setDishEndpoint(data.dishEndpoint || ''); setCategoryEndpoint(data.categoryEndpoint || ''); }, [data.dishEndpoint, data.categoryEndpoint]);
  const save = () => {
    const dishUrl = dishEndpoint.trim(); const categoryUrl = categoryEndpoint.trim();
    if ((dishUrl && !isValidEndpoint(dishUrl)) || (categoryUrl && !isValidEndpoint(categoryUrl))) { Alert.alert(t.invalidUrl); return; }
    onSave({ dishEndpoint: dishUrl, categoryEndpoint: categoryUrl });
  };
  const statusText = syncStatus === 'syncing' ? t.syncing : syncStatus === 'synced' ? t.synced : syncStatus === 'offline' ? t.offline : syncStatus === 'error' ? t.syncError : (dishEndpoint && categoryEndpoint) ? t.syncInfo : t.noEndpoint;
  return <View style={{ flex: 1 }}><Header title={t.settings} onBack={onBack} backLabel={t.back} right={<Pressable onPress={onLanguage}><Text style={styles.linkSmall}>{t.language}</Text></Pressable>} /><ScrollView contentContainerStyle={styles.page}>
    <Text style={styles.sectionTitle}>{t.apiSync}</Text><Text style={styles.help}>{t.endpointHelp}</Text>
    <Field label={t.categoryEndpoint} value={categoryEndpoint} onChangeText={setCategoryEndpoint} placeholder="https://...mockapi.io/api/v1/.../BIT240029_DishCategory" autoCapitalize="none" />
    <Field label={t.dishEndpoint} value={dishEndpoint} onChangeText={setDishEndpoint} placeholder="https://...mockapi.io/api/v1/.../BIT240029_Dish" autoCapitalize="none" />
    <View style={styles.statusBox}><Text style={styles.statusText}>{statusText}</Text></View>
    <View style={[styles.row, { marginTop: 15 }]}><Button title={t.saveSettings} onPress={save} /><Button title={t.syncNow} variant="secondary" onPress={onSync} /></View>
    <Text style={styles.footer}>{t.local}</Text>
  </ScrollView></View>;
}
