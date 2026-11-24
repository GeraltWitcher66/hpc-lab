import type { Client } from '../types/client';

const STORAGE_KEY = 'hpc-lab-clients';

export function getClients(): Client[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveClients(clients: Client[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function getClient(id: string): Client | undefined {
  return getClients().find((c) => c.id === id);
}

export function addClient(client: Client): void {
  const clients = getClients();
  clients.unshift(client);
  saveClients(clients);
}

export function updateClient(updated: Client): void {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === updated.id);
  if (index !== -1) {
    clients[index] = { ...updated, updatedAt: new Date().toISOString() };
    saveClients(clients);
  }
}

export function deleteClient(id: string): void {
  saveClients(getClients().filter((c) => c.id !== id));
}

export function generateClientId(): string {
  return `cli-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateClientCode(): string {
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `C-${n}`;
}
