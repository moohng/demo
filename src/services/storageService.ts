import { supabase } from '../lib/supabase';
import { Category, LinkItem, CategoryType } from '../types';
import { INITIAL_DATA } from '../constants';

const STORAGE_KEY = 'devgo_data'; // Updated to match App.tsx current key

export interface StorageData {
  categories: Category[];
}

type Listener = (data: StorageData) => void;

class StorageService {
  private isCloudEnabled = false;
  private userId: string | null = null;
  private dataCache: StorageData | null = null;
  private listeners: Listener[] = [];

  constructor() {
    this.checkAuth();
    console.log('StorageService constructor');
    // Subscribe to auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        this.userId = session.user.id;
        this.isCloudEnabled = true;
        // Reload data from cloud on login
        this.fetchCloudData().then(data => this.notifyListeners(data));
      } else {
        this.userId = null;
        this.isCloudEnabled = false;
        // Reload local data on logout
        this.loadLocalData().then(data => this.notifyListeners(data));
      }
    });
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(data: StorageData) {
    this.dataCache = data;
    this.listeners.forEach(l => l(data));
  }

  private async checkAuth() {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      this.userId = data.session.user.id;
      this.isCloudEnabled = true;
    }
  }

  async getData(): Promise<StorageData> {
    if (this.isCloudEnabled && this.userId) {
      return this.fetchCloudData();
    }
    return this.loadLocalData();
  }

  private async loadLocalData(): Promise<StorageData> {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        this.dataCache = { categories: parsed };
        return { categories: parsed };
      } catch (e) {
        console.error('Local storage parse error', e);
      }
    }
    this.dataCache = { categories: INITIAL_DATA };
    return { categories: INITIAL_DATA };
  }

  private async fetchCloudData(): Promise<StorageData> {
    try {
      const { data: dbCategories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      if (catError) throw catError;

      const { data: dbLinks, error: linkError } = await supabase
        .from('links')
        .select('*')
        .order('sort_order');

      if (linkError) throw linkError;

      if (!dbCategories || dbCategories.length === 0) {
        // If cloud is empty, returns empty array. 
        // The UI will handle "no data" or we can default to initial if we decide strict fresh start.
        return { categories: [] };
      }

      const categories: Category[] = dbCategories.map((c: any) => ({
        id: c.id,
        type: c.type as CategoryType,
        customName: c.title, // Map title in DB to customName in App (or type name)
        links: dbLinks
          .filter((l: any) => l.category_id === c.id)
          .map((l: any) => ({
            id: l.id,
            title: l.title,
            url: l.url,
            description: l.description || '',
            visitCount: 0, // Not synced yet
            lastVisited: 0
          }))
      }));

      this.dataCache = { categories };
      return { categories };
    } catch (e) {
      console.error('Cloud fetch failed', e);
      return this.loadLocalData(); // Fallback on error?
    }
  }

  async saveCategory(category: Category): Promise<void> {
    // 1. Optimistic Update Local Cache
    if (this.dataCache) {
      const idx = this.dataCache.categories.findIndex(c => c.id === category.id);
      if (idx >= 0) {
        this.dataCache.categories[idx] = category;
      } else {
        this.dataCache.categories.push(category);
      }
      this.notifyListeners(this.dataCache);
    }

    if (this.isCloudEnabled && this.userId) {
      await supabase.from('categories').upsert({
        id: category.id,
        user_id: this.userId,
        type: category.type,
        title: category.customName || category.type,
        icon: '',
        sort_order: 0
      });
    } else {
      this.saveToLocal();
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    if (this.dataCache) {
      this.dataCache.categories = this.dataCache.categories.filter(c => c.id !== categoryId);
      this.notifyListeners(this.dataCache);
    }

    if (this.isCloudEnabled && this.userId) {
      await supabase.from('categories').delete().eq('id', categoryId);
    } else {
      this.saveToLocal();
    }
  }

  async saveLink(categoryId: string, link: LinkItem): Promise<void> {
    // Optimistic
    const cat = this.dataCache?.categories.find(c => c.id === categoryId);
    if (cat) {
      // Check exist
      const idx = cat.links.findIndex(l => l.id === link.id);
      if (idx >= 0) {
        cat.links[idx] = link;
      } else {
        cat.links.push(link);
      }
      this.notifyListeners(this.dataCache!);
    }

    if (this.isCloudEnabled && this.userId) {
      // Upsert logic
      // Note: For upsert, we need link UUID.
      await supabase.from('links').upsert({
        id: link.id,
        user_id: this.userId,
        category_id: categoryId,
        title: link.title,
        url: link.url,
        description: link.description,
        sort_order: 0
      });
    } else {
      this.saveToLocal();
    }
  }

  async deleteLink(categoryId: string, linkId: string): Promise<void> {
    const cat = this.dataCache?.categories.find(c => c.id === categoryId);
    if (cat) {
      cat.links = cat.links.filter(l => l.id !== linkId);
      this.notifyListeners(this.dataCache!);
    }

    if (this.isCloudEnabled && this.userId) {
      await supabase.from('links').delete().eq('id', linkId);
    } else {
      this.saveToLocal();
    }
  }

  async syncLocalToCloud(): Promise<void> {
    if (!this.userId) return;
    const localData = await this.loadLocalData();

    // We will perform a merge strategy or overwrite?
    // Simple strategy: Upload everything from local that doesn't exist?
    // Easier: Upload all categories and links. Conflict on ID will update.

    for (const cat of localData.categories) {
      // Upsert Category
      const { error } = await supabase.from('categories').upsert({
        id: cat.id,
        user_id: this.userId,
        type: cat.type,
        title: cat.customName || cat.type,
        sort_order: 0
      });

      if (!error) {
        // Upsert Links
        const linksToInsert = cat.links.map(l => ({
          id: l.id,
          user_id: this.userId!,
          category_id: cat.id,
          title: l.title,
          url: l.url,
          description: l.description,
          sort_order: 0
        }));

        if (linksToInsert.length > 0) {
          await supabase.from('links').upsert(linksToInsert);
        }
      }
    }

    // After sync, refresh view
    const fresh = await this.fetchCloudData();
    this.notifyListeners(fresh);
  }

  private saveToLocal() {
    if (this.dataCache) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.dataCache.categories));
    }
  }
}

export const storageService = new StorageService();
