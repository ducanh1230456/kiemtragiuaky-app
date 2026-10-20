import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Button, Field, Header } from '../components/ui';
import { styles } from '../components/styles';

export default function CategoriesScreen({ categories, dishes, t, onBack, onAdd, onDelete, onLanguage }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const create = () => {
    const trimmed = name.trim();
    if (!trimmed) { Alert.alert(t.validation); return; }
    if (categories.some(category => category.name.toLowerCase() === trimmed.toLowerCase())) { Alert.alert(t.categoryDuplicate); return; }
    onAdd({ id: `category-${Date.now()}`, name: trimmed, description: description.trim() });
    setModalOpen(false); setName(''); setDescription('');
  };
  const confirmDelete = category => {
    if (dishes.some(dish => dish.dishCategoryId === category.id)) { Alert.alert(t.categoryUsed); return; }
    Alert.alert(t.deleteCategory, category.name, [{ text: t.cancel, style: 'cancel' }, { text: t.yes, style: 'destructive', onPress: () => onDelete(category.id) }]);
  };
  return <View style={{ flex: 1 }}><Header title={t.categories} onBack={onBack} backLabel={t.back} right={<Pressable onPress={onLanguage}><Text style={styles.linkSmall}>{t.language}</Text></Pressable>} /><ScrollView contentContainerStyle={styles.page}>
    {categories.map(category => <View key={category.id} style={styles.categoryCard}><View style={[styles.row, { alignItems: 'flex-start' }]}><View style={{ flex: 1 }}><Text style={styles.sectionTitle}>{category.name}</Text><Text style={styles.muted}>{category.description || '—'}</Text></View><Pressable onPress={() => confirmDelete(category)}><Text style={[styles.linkSmall, { color: '#bc5746' }]}>{t.delete}</Text></Pressable></View></View>)}
    <Button title={`＋  ${t.addCategory}`} onPress={() => setModalOpen(true)} />
  </ScrollView><Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}><View style={styles.modalShade}><View style={styles.modalCard}><Text style={styles.sectionTitle}>{t.addCategory}</Text><View style={{ height: 16 }} /><Field label={t.categoryName} value={name} onChangeText={setName} /><Field label={t.categoryDescription} value={description} onChangeText={setDescription} multiline /><View style={styles.row}><Button title={t.save} onPress={create} /><Button title={t.cancel} variant="secondary" onPress={() => setModalOpen(false)} /></View></View></View></Modal></View>;
}
