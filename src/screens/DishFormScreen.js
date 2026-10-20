import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Button, Field, Header } from '../components/ui';
import { styles } from '../components/styles';
import { getCategoryDisplayName } from '../i18n';

const emptyDish = categoryId => ({ id: '', name: '', price: '', preparationTime: '', isAvailable: true, description: '', dishCategoryId: categoryId || '', dishImage: [] });

export default function DishFormScreen({ dish, categories, t, onSave, onBack, onLanguage }) {
  const [draft, setDraft] = useState(() => dish ? { ...dish, dishImage: [...dish.dishImage] } : emptyDish(categories[0]?.id));
  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => { if (!draft.dishCategoryId && categories[0]) setDraft(current => ({ ...current, dishCategoryId: categories[0].id })); }, [categories, draft.dishCategoryId]);
  const save = () => {
    const name = draft.name.trim();
    const price = Number(draft.price);
    const preparationTime = Number(draft.preparationTime);
    if (!name || !Number.isFinite(price) || price <= 0 || !Number.isInteger(preparationTime) || preparationTime <= 0 || !categories.some(item => item.id === draft.dishCategoryId)) {
      Alert.alert(t.validation); return;
    }
    if (draft.dishImage.filter(image => image.isThumbnail).length > 1) {
      Alert.alert(t.validation); return;
    }
    onSave({ ...draft, name, price, preparationTime });
  };
  const addImage = () => {
    const url = imageUrl.trim();
    if (!/^https?:\/\//i.test(url)) { Alert.alert(t.imageUrlError); return; }
    const images = [...draft.dishImage, { imageUrl: url, isThumbnail: draft.dishImage.length === 0 }];
    setDraft(current => ({ ...current, dishImage: images })); setImageUrl('');
  };
  const setCover = index => setDraft(current => ({ ...current, dishImage: current.dishImage.map((image, imageIndex) => ({ ...image, isThumbnail: imageIndex === index })) }));
  const removeImage = index => setDraft(current => {
    const images = current.dishImage.filter((_, imageIndex) => imageIndex !== index);
    if (images.length && !images.some(image => image.isThumbnail)) images[0].isThumbnail = true;
    return { ...current, dishImage: images };
  });

  return <View style={{ flex: 1 }}><Header title={dish ? t.editDish : t.newDish} onBack={onBack} backLabel={t.back} right={<Pressable onPress={onLanguage}><Text style={styles.linkSmall}>{t.language}</Text></Pressable>} /><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <Field label={t.name} value={draft.name} onChangeText={value => setDraft(current => ({ ...current, name: value }))} />
    <Field label={t.price} value={String(draft.price)} onChangeText={value => setDraft(current => ({ ...current, price: value.replace(/\D/g, '') }))} keyboardType="numeric" />
    <Field label={t.preparation} value={String(draft.preparationTime)} onChangeText={value => setDraft(current => ({ ...current, preparationTime: value.replace(/\D/g, '') }))} keyboardType="numeric" />
    <Text style={styles.label}>{t.category}</Text><View style={[styles.wrap, { marginBottom: 14 }]}>{categories.map(category => <Pressable key={category.id} onPress={() => setDraft(current => ({ ...current, dishCategoryId: category.id }))} style={[styles.choice, draft.dishCategoryId === category.id && styles.choiceActive]}><Text style={[styles.choiceText, draft.dishCategoryId === category.id && styles.choiceTextActive]}>{getCategoryDisplayName(category, t)}</Text></Pressable>)}</View>
    <View style={[styles.row, { marginBottom: 12 }]}><Text style={styles.label}>{draft.isAvailable ? t.available : t.unavailable}</Text><Switch value={draft.isAvailable} onValueChange={value => setDraft(current => ({ ...current, isAvailable: value }))} trackColor={{ true: '#d66a45' }} /></View>
    <Field label={t.description} value={draft.description} onChangeText={value => setDraft(current => ({ ...current, description: value }))} multiline />
    <Text style={styles.label}>{t.images}</Text><View style={styles.row}><View style={{ flex: 1 }}><Field label="" value={imageUrl} onChangeText={setImageUrl} placeholder={t.imageUrl} autoCapitalize="none" /></View><Button title={t.addImage} onPress={addImage} compact /></View>
    {draft.dishImage.map((image, index) => <View key={`${image.imageUrl}-${index}`} style={styles.imageRow}><View style={styles.row}><Text numberOfLines={1} style={styles.imageUrlText}>{image.imageUrl}</Text>{image.isThumbnail && <Text style={styles.coverText}>★ {t.cover}</Text>}</View><View style={styles.row}>{!image.isThumbnail && <Pressable onPress={() => setCover(index)}><Text style={styles.linkSmall}>{t.makeCover}</Text></Pressable>}<Pressable onPress={() => removeImage(index)}><Text style={[styles.linkSmall, { color: '#bc5746' }]}>{t.removeImage}</Text></Pressable></View></View>)}
    <View style={[styles.row, { marginTop: 17 }]}><Button title={t.save} onPress={save} /><Button title={t.cancel} variant="secondary" onPress={onBack} /></View>
  </ScrollView></KeyboardAvoidingView></View>;
}
