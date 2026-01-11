import Store from 'electron-store';

export type ElectronStoreSchema = {
  selectedStore: {
    store: {
      slug: string;
      [key: string]: any;
    };
  } | null;
};

export const electronStore = new Store<ElectronStoreSchema>();
