export let baseUrl = null
export let config = null;

export const getConfig = () => {
    if (!config) {
      throw new Error('Config has not been loaded!');
    }
    return config;
  };

  export const loadConfig = async () => {
    const response = await fetch('/config.json');
    config = await response.json();
    baseUrl = config.baseUrl;
}