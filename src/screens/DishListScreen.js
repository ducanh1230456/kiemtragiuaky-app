import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { Button, Chip } from '../components/ui';
import { styles } from '../components/styles';

export default function DishListScreen({ data, t, filters, setFilters, onOpenDish, onAdd, onCategories, onSettings, onLanguage }) {
  const update = (key, value) => setFilters(current => ({ ...current, [key]: value }));
  const categoryName = id => data.categories.find(category => category.id === id)?.name || '—';
  const visible = useMemo(() => {
    const result = data.dishes.filter(dish =>
      dish.name.toLowerCase().includes(filters.query.trim().toLowerCase()) &&
      (filters.categoryId === 'all' || dish.dishCategoryId === filters.categoryId) &&
      (!filters.availableOnly || dish.isAvailable) &&
      (filters.minPrice === '' || dish.price >= Number(filters.minPrice)) &&
      (filters.maxPrice === '' || dish.price <= Number(filters.maxPrice))
    );
    if (filters.sort === 'priceAsc') result.sort((a, b) => a.price - b.price);
    if (filters.sort === 'priceDesc') result.sort((a, b) => b.price - a.price);
    if (filters.sort === 'timeAsc') result.sort((a, b) => a.preparationTime - b.preparationTime);
    return result;
  }, [data.dishes, filters]);

  return <View style={{ flex: 1 }}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <View style={styles.row}><View style={{ flex: 1 }}><Text style={styles.eyebrow}>BIT240029_FOODMANAGER</Text><Text style={styles.title}>{t.appName}</Text></View><Pressable onPress={onLanguage} style={styles.languageButton}><Text style={styles.languageText}>{t.language}</Text></Pressable></View>
    <Text style={styles.subtitle}>{t.tagline}</Text>
    <View style={styles.row}><TextInput value={filters.query} onChangeText={value => update('query', value)} placeholder={t.search} placeholderTextColor="#98a09b" style={[styles.search, { flex: 1, marginBottom: 10 }]} /><Pressable onPress={onSettings} style={styles.languageButton}><Text style={styles.languageText}>⚙</Text></Pressable></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontal}><Chip title={t.allCategories} active={filters.categoryId === 'all'} onPress={() => update('categoryId', 'all')} />{data.categories.map(category => <Chip key={category.id} title={category.name} active={filters.categoryId === category.id} onPress={() => update('categoryId', category.id)} />)}</ScrollView>
    <View style={styles.panel}><View style={styles.row}><Text style={styles.label}>{t.sellingOnly}</Text><Switch value={filters.availableOnly} onValueChange={value => update('availableOnly', value)} trackColor={{ true: '#d66a45' }} /></View><View style={styles.row}><TextInput value={filters.minPrice} onChangeText={value => update('minPrice', value.replace(/\D/g, ''))} placeholder={t.minPrice} keyboardType="numeric" style={styles.smallInput} /><TextInput value={filters.maxPrice} onChangeText={value => update('maxPrice', value.replace(/\D/g, ''))} placeholder={t.maxPrice} keyboardType="numeric" style={styles.smallInput} /></View><View style={[styles.wrap, { marginTop: 10 }]}><Text style={styles.sortLabel}>{t.sort}</Text>{[['defaultSort', 'default'], ['priceAsc', 'priceAsc'], ['priceDesc', 'priceDesc'], ['timeAsc', 'timeAsc']].map(([label, value]) => <Pressable key={value} onPress={() => update('sort', value)} style={[styles.sortChip, filters.sort === value && styles.sortChipActive]}><Text style={[styles.sortText, filters.sort === value && styles.chipTextActive]}>{t[label]}</Text></Pressable>)}</View></View>
    <View style={[styles.row, { marginTop: 20, marginBottom: 11 }]}><Text style={styles.sectionTitle}>{visible.length} {t.dishes}</Text><Pressable onPress={onCategories}><Text style={styles.linkSmall}>{t.categories} →</Text></Pressable></View>
    {filters.minPrice && filters.maxPrice && Number(filters.minPrice) > Number(filters.maxPrice) ? <Text style={styles.empty}>{t.badRange}</Text> : visible.length === 0 ? <Text style={styles.empty}>{t.empty}</Text> : visible.map(dish => {
      const thumbnail = dish.dishImage.find(image => image.isThumbnail) || dish.dishImage[0];
      return <Pressable key={dish.id} onPress={() => onOpenDish(dish)} style={styles.card}><View style={styles.cardImage}>{thumbnail ? <Image source={{ uri: thumbnail.imageUrl }} style={styles.image} /> : <Text>🍽️</Text>}</View><View style={styles.cardContent}><View style={styles.row}><Text style={styles.cardName} numberOfLines={1}>{dish.name}</Text><Text style={styles.price}>{Number(dish.price).toLocaleString('vi-VN')} ₫</Text></View><Text style={styles.muted}>{categoryName(dish.dishCategoryId)} · {dish.preparationTime} min</Text><View style={styles.row}><View style={[styles.badge, !dish.isAvailable && styles.badgeOff]}><Text style={[styles.badgeText, !dish.isAvailable && styles.badgeOffText]}>{dish.isAvailable ? t.available : t.unavailable}</Text></View><Text style={styles.timeText}>{dish.preparationTime <= 15 ? t.quick : t.regular}</Text></View></View></Pressable>;
    })}
    <View style={[styles.row, { marginTop: 8 }]}><Button title={t.addDish} onPress={onAdd} /><Button title={t.settings} variant="secondary" onPress={onSettings} /></View><Text style={styles.footer}>{t.studentId}</Text>
  </ScrollView></View>;
}
