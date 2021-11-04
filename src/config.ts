export const GRID_CONFIG_KEY = "GRID_CONFIG";
export const DEFAULT_GRID_CONFIG = {
  twin_id: 0,
  mnemonics: "",
  url: "wss://tfchain.dev.threefold.io/ws",
  proxy_url: "https://rmbproxy1.devnet.grid.tf",
};

export interface GridConfig {
  twin_id: number;
  mnemonics: string;
  url: string;
  proxy_url: string;
}

export async function loadConfig() {
  const config = localStorage.getItem(GRID_CONFIG_KEY);

  if (!config) {
    return DEFAULT_GRID_CONFIG;
  }
  return JSON.parse(config);
};

export async function saveConfig(config: any) {
  localStorage.setItem(GRID_CONFIG_KEY, JSON.stringify(config));
};
