export const MockLocalStorage: Storage = (function () {
  let store: { [key: string]: string } = {};

  return {
    key(index: number): string | null {
      return Object.keys(store)[index];
    },

    get length() {
      return Object.keys(store).length;
    },

    getItem(key: string) {
      return store[key];
    },

    setItem(key: string, value: string) {
      store[key] = value;
    },

    clear() {
      store = {};
    },

    removeItem(key: string) {
      delete store[key];
    },

    getAll() {
      return store;
    }
  };
})();

export const MockFetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({}),
  status: 200,
  ok: true
})
) as jest.Mock;