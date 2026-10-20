import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, AppState, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { styles } from './src/components/styles';
import { loadState, saveState } from './src/data/storage';
import { hasSyncEndpoints, syncLocalData } from './src/data/sync';
import { translate } from './src/i18n';
import CategoriesScreen from './src/screens/CategoriesScreen';
import DishDetailScreen from './src/screens/DishDetailScreen';
import DishFormScreen from './src/screens/DishFormScreen';
import DishListScreen from './src/screens/DishListScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const initialFilters = { query: '', categoryId: 'all', availableOnly: false, minPrice: '', maxPrice: '', sort: 'default' };

export default function App() {
  const [data, setData] = useState({ categories: [], dishes: [], lang: 'en', dishEndpoint: '', categoryEndpoint: '', pendingDishDeletes: [], pendingCategoryDeletes: [] });
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState('list');
  const [selectedDish, setSelectedDish] = useState(null);
  const [formIsNew, setFormIsNew] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [syncStatus, setSyncStatus] = useState('idle');
  const dataRef = useRef(data);
  const syncLock = useRef(false);
  const syncAgain = useRef(false);
  const syncAction = useRef(null);
  const lastSyncedSignature = useRef('');
  const storageQueue = useRef(Promise.resolve());
  const t = translate(data.lang);

  useEffect(() => { dataRef.current = data; }, [data]);

  useEffect(() => {
    let mounted = true;
    loadState().then(value => { if (mounted) setData(value); }).finally(() => { if (mounted) setReady(true); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const snapshot = data;
    storageQueue.current = storageQueue.current.catch(() => {}).then(() => saveState(snapshot)).catch(() => setSyncStatus('error'));
  }, [data, ready]);

  const syncNow = useCallback(async (force = false) => {
    const current = dataRef.current;
    if (!hasSyncEndpoints(current)) { setSyncStatus('missing'); return; }
    const signature = JSON.stringify([current.dishes, current.categories, current.pendingDishDeletes, current.pendingCategoryDeletes, current.dishEndpoint, current.categoryEndpoint]);
    if (!force && signature === lastSyncedSignature.current) return;
    if (syncLock.current) { syncAgain.current = true; return; }
    syncLock.current = true;
    setSyncStatus('syncing');
    try {
      const completed = await syncLocalData(current);
      lastSyncedSignature.current = signature;
      setData(value => {
        const categoryIds = new Set(value.categories.map(item => item.id));
        const dishIds = new Set(value.dishes.map(item => item.id));
        const newCategories = completed.categories.filter(item => item.id && !categoryIds.has(item.id) && !value.pendingCategoryDeletes.includes(item.id));
        const newDishes = completed.dishes.filter(item => item.id && !dishIds.has(item.id) && !value.pendingDishDeletes.includes(item.id));
        const pendingDishDeletes = value.pendingDishDeletes.filter(id => !completed.syncedDishDeletes.includes(id));
        const pendingCategoryDeletes = value.pendingCategoryDeletes.filter(id => !completed.syncedCategoryDeletes.includes(id));
        if (!newCategories.length && !newDishes.length && pendingDishDeletes.length === value.pendingDishDeletes.length && pendingCategoryDeletes.length === value.pendingCategoryDeletes.length) return value;
        return {
          ...value,
          categories: [...value.categories, ...newCategories],
          dishes: [...value.dishes, ...newDishes],
          pendingDishDeletes,
          pendingCategoryDeletes,
        };
      });
      setSyncStatus('synced');
    } catch (error) {
      setSyncStatus('error');
    } finally {
      syncLock.current = false;
      if (syncAgain.current) {
        syncAgain.current = false;
        setTimeout(() => syncAction.current?.(), 800);
      }
    }
  }, []);
  useEffect(() => { syncAction.current = syncNow; }, [syncNow]);

  useEffect(() => {
    if (!ready || !hasSyncEndpoints(data)) return undefined;
    const timer = setTimeout(() => syncAction.current?.(), 900);
    return () => clearTimeout(timer);
  }, [ready, data.categories, data.dishes, data.pendingDishDeletes, data.pendingCategoryDeletes, data.dishEndpoint, data.categoryEndpoint]);

  useEffect(() => {
    if (!ready) return undefined;
    const interval = setInterval(() => syncAction.current?.(), 20000);
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') syncAction.current?.();
    });
    return () => { clearInterval(interval); subscription.remove(); };
  }, [ready]);

  const changeLanguage = () => setData(current => ({ ...current, lang: current.lang === 'en' ? 'vi' : 'en' }));
  const openNewDish = () => { if (!data.categories.length) { Alert.alert(t.noCategories); return; } setSelectedDish(null); setFormIsNew(true); setScreen('form'); };
  const openEditDish = dish => { setSelectedDish(dish); setFormIsNew(false); setScreen('form'); };
  const saveDish = dish => {
    const saved = { ...dish, id: dish.id || `dish-${Date.now()}` };
    setData(current => ({ ...current, dishes: dish.id ? current.dishes.map(item => item.id === dish.id ? saved : item) : [saved, ...current.dishes] }));
    setSelectedDish(saved); setScreen('detail');
  };
  const deleteDish = id => { setData(current => ({ ...current, dishes: current.dishes.filter(item => item.id !== id), pendingDishDeletes: [...new Set([...current.pendingDishDeletes, id])] })); setSelectedDish(null); setScreen('list'); };
  const makeCover = (dish, index) => {
    const updated = { ...dish, dishImage: dish.dishImage.map((image, imageIndex) => ({ ...image, isThumbnail: imageIndex === index })) };
    setSelectedDish(updated); setData(current => ({ ...current, dishes: current.dishes.map(item => item.id === dish.id ? updated : item) }));
  };
  const saveEndpoints = endpoints => { setData(current => ({ ...current, ...endpoints })); setSyncStatus('idle'); };
  const addCategory = category => setData(current => ({ ...current, categories: [...current.categories, category] }));
  const deleteCategory = id => {
    setData(current => ({ ...current, categories: current.categories.filter(category => category.id !== id), pendingCategoryDeletes: [...new Set([...current.pendingCategoryDeletes, id])] }));
    if (filters.categoryId === id) setFilters(current => ({ ...current, categoryId: 'all' }));
  };

  if (!ready) return <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}><ActivityIndicator color="#d66a45" /><Text style={styles.muted}>BIT240029_FoodManager</Text></SafeAreaView>;

  return <SafeAreaView style={styles.safe}><StatusBar barStyle="dark-content" backgroundColor="#f6f7f2" />
    {screen === 'list' && <DishListScreen data={data} t={t} filters={filters} setFilters={setFilters} onOpenDish={dish => { setSelectedDish(dish); setScreen('detail'); }} onAdd={openNewDish} onCategories={() => setScreen('categories')} onSettings={() => setScreen('settings')} onLanguage={changeLanguage} />}
    {screen === 'detail' && <DishDetailScreen dish={selectedDish} categories={data.categories} t={t} onBack={() => setScreen('list')} onEdit={openEditDish} onDelete={deleteDish} onMakeCover={makeCover} onLanguage={changeLanguage} />}
    {screen === 'form' && <DishFormScreen key={selectedDish?.id || 'new-dish'} dish={formIsNew ? null : selectedDish} categories={data.categories} t={t} onSave={saveDish} onBack={() => setScreen(formIsNew ? 'list' : 'detail')} onLanguage={changeLanguage} />}
    {screen === 'categories' && <CategoriesScreen categories={data.categories} dishes={data.dishes} t={t} onBack={() => setScreen('list')} onAdd={addCategory} onDelete={deleteCategory} onLanguage={changeLanguage} />}
    {screen === 'settings' && <SettingsScreen data={data} t={t} syncStatus={syncStatus} onBack={() => setScreen('list')} onSave={saveEndpoints} onSync={() => syncAction.current?.(true)} onLanguage={changeLanguage} />}
  </SafeAreaView>;
}
