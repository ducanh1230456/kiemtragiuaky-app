import React from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Button, Header } from '../components/ui';
import { styles } from '../components/styles';
import { getCategoryDisplayName } from '../i18n';

export default function DishDetailScreen({ dish, categories, t, onBack, onEdit, onDelete, onMakeCover, onLanguage }) {
  if (!dish) return null;
  const category = categories.find(item => item.id === dish.dishCategoryId);
  const confirmDelete = () => Alert.alert(t.deleteDish, dish.name, [
    { text: t.cancel, style: 'cancel' },
    { text: t.yes, style: 'destructive', onPress: () => onDelete(dish.id) },
  ]);
  return <View style={{ flex: 1 }}><Header title={t.detail} onBack={onBack} backLabel={t.back} right={<Pressable onPress={onLanguage}><Text style={styles.linkSmall}>{t.language}</Text></Pressable>} /><ScrollView contentContainerStyle={styles.page}>
    {dish.dishImage?.length ? dish.dishImage.map((image, index) => <Image key={`${image.imageUrl}-${index}`} source={{ uri: image.imageUrl }} style={styles.detailImage} />) : <View style={styles.detailPlaceholder}><Text style={{ fontSize: 42 }}>🍽️</Text><Text style={styles.muted}>{t.noImages}</Text></View>}
    <Text style={styles.title}>{dish.name}</Text><View style={[styles.row, { marginTop: 7 }]}><Text style={styles.detailPrice}>{Number(dish.price).toLocaleString('vi-VN')} ₫</Text><Text style={styles.muted}>{getCategoryDisplayName(category, t)}</Text></View>
    <View style={styles.detailMeta}><View style={styles.row}><Text style={styles.muted}>{dish.preparationTime} min · {dish.preparationTime <= 15 ? t.quick : t.regular}</Text><Text style={styles.muted}>{dish.isAvailable ? t.available : t.unavailable}</Text></View></View>
    <Text style={styles.sectionTitle}>{t.description}</Text><Text style={styles.description}>{dish.description || '—'}</Text>
    <Text style={styles.sectionTitle}>{t.images} · {dish.dishImage.length}</Text>{dish.dishImage.map((image, index) => <View key={`${image.imageUrl}-${index}`} style={styles.imageRow}><View style={styles.row}><Text numberOfLines={1} style={styles.imageUrlText}>{image.imageUrl}</Text>{image.isThumbnail && <Text style={styles.coverText}>★ {t.cover}</Text>}</View>{!image.isThumbnail && <Pressable onPress={() => onMakeCover(dish, index)}><Text style={styles.linkSmall}>{t.makeCover}</Text></Pressable>}</View>)}
    <View style={[styles.row, { marginTop: 18 }]}><Button title={t.editDish} onPress={() => onEdit(dish)} /><Button title={t.delete} variant="danger" onPress={confirmDelete} /></View>
  </ScrollView></View>;
}
