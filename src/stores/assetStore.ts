import { create } from 'zustand';

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'depth' | 'normal';
  url: string;
  parallaxMapUrl?: string;
}

interface AssetStore {
  assets: Asset[];
  selectedAsset: Asset | null;
  addAsset: (asset: Asset) => void;
  removeAsset: (id: string) => void;
  updateAsset: (id: string, asset: Asset) => void;
  selectAsset: (asset: Asset | null) => void;
  setAssets: (assets: Asset[]) => void;
}

export const useAssetStore = create<AssetStore>((set, get) => ({
  assets: [],
  selectedAsset: null,
  addAsset: (asset) => set((state) => {
    const assets = [...state.assets, asset];
    localStorage.setItem('assets', JSON.stringify(assets));
    return { assets };
  }),
  removeAsset: (id) => set((state) => {
    const assets = state.assets.filter((asset) => asset.id !== id);
    localStorage.setItem('assets', JSON.stringify(assets));
    return { assets, selectedAsset: state.selectedAsset?.id === id ? null : state.selectedAsset };
  }),
  updateAsset: (id, updatedAsset) => set((state) => {
    const assets = state.assets.map((asset) => (asset.id === id ? updatedAsset : asset));
    localStorage.setItem('assets', JSON.stringify(assets));
    return {
      assets,
      selectedAsset: state.selectedAsset?.id === id ? updatedAsset : state.selectedAsset
    };
  }),
  selectAsset: (asset) => set({ selectedAsset: asset }),
  setAssets: (assets) => {
    localStorage.setItem('assets', JSON.stringify(assets));
    set({ assets });
  },
})); 