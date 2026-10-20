import { fromRemoteCategory, fromRemoteDish, toRemoteCategory, toRemoteDish } from './storage';

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error(`MockAPI request failed (${response.status})`);
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function findRemoteId(rows, clientId) {
  const match = rows.find(row => (row.BIT240029_ClientId || row.BIT240029_Id || row.id) === clientId);
  return match?.id;
}

async function upsertCollection(endpoint, items, serialize) {
  const rows = await request(endpoint);
  if (!Array.isArray(rows)) throw new Error('MockAPI collection response must be a JSON array.');
  for (const item of items) {
    const record = serialize(item);
    const remoteId = findRemoteId(rows, item.id);
    if (remoteId !== undefined && remoteId !== null) {
      await request(`${endpoint.replace(/\/$/, '')}/${encodeURIComponent(remoteId)}`, {
        method: 'PUT', body: JSON.stringify(record),
      });
    } else {
      await request(endpoint, { method: 'POST', body: JSON.stringify(record) });
    }
  }
  return rows;
}

async function deleteCollectionItems(endpoint, clientIds) {
  if (!clientIds?.length) return;
  const rows = await request(endpoint);
  if (!Array.isArray(rows)) throw new Error('MockAPI collection response must be a JSON array.');
  for (const row of rows) {
    const clientId = row.BIT240029_ClientId || row.BIT240029_Id;
    if (clientIds.includes(clientId) && row.id !== undefined) {
      await request(`${endpoint.replace(/\/$/, '')}/${encodeURIComponent(row.id)}`, { method: 'DELETE' });
    }
  }
}

export function hasSyncEndpoints(state) {
  return Boolean(state.dishEndpoint?.trim() && state.categoryEndpoint?.trim());
}

export async function syncLocalData(state) {
  if (!hasSyncEndpoints(state)) throw new Error('Both collection URLs are required.');
  // Sync categories first so a dish's category reference is present remotely.
  await upsertCollection(state.categoryEndpoint.trim(), state.categories, toRemoteCategory);
  await deleteCollectionItems(state.categoryEndpoint.trim(), state.pendingCategoryDeletes);
  await upsertCollection(state.dishEndpoint.trim(), state.dishes, toRemoteDish);
  await deleteCollectionItems(state.dishEndpoint.trim(), state.pendingDishDeletes);
  const [remoteCategories, remoteDishes] = await Promise.all([
    request(state.categoryEndpoint.trim()), request(state.dishEndpoint.trim()),
  ]);
  if (!Array.isArray(remoteCategories) || !Array.isArray(remoteDishes)) throw new Error('MockAPI collection response must be a JSON array.');
  return {
    categories: remoteCategories.map(fromRemoteCategory),
    dishes: remoteDishes.map(fromRemoteDish),
    syncedDishDeletes: state.pendingDishDeletes || [],
    syncedCategoryDeletes: state.pendingCategoryDeletes || [],
  };
}

export function isValidEndpoint(value) {
  return /^https?:\/\/[^/\s]+(?:\/\S*)?$/i.test(value.trim());
}
