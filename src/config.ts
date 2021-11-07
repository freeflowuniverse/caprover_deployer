export const GRID_CONFIG_KEY = "GRID_CONFIG";
export const DEFAULT_GRID_CONFIG = {
  mnemonics: "",
  url: "wss://tfchain.dev.threefold.io/ws",
  proxy_url: "https://rmbproxy1.devnet.grid.tf",
  public_key: ""
};

export interface GridConfig {
  mnemonics: string;
  url: string;
  proxy_url: string;
  public_key?: string
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
