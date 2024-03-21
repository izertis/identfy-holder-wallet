jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.useFakeTimers()
const localStorageMock = function () {
  let store = {}

  return {
    getItem(key) {
      return store[key]
    },

    setItem(key, value) {
      store[key] = value
    },

    clear() {
      store = {}
    },

    removeItem(key) {
      delete store[key]
    },

    getAll() {
      return store
    },
  }
}
const storageCache = {}
const AsyncStorage = localStorageMock
jest.mock('react-native-randombytes', () => {
  return {
    seed: jest.fn(),
  }
})
jest.setMock('@react-native-async-storage/async-storage', AsyncStorage)
jest.mock('i18next', () => ({
  addResourceBundle: jest.fn(),
  use: () => {
    class MockClass {
      constructor() {}

      init() {
      }
    }
    return new MockClass()
  },
}))
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Simula la función de traducción t()
  }),
}))
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useFocusEffect: jest.fn(),
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn()
    }),
  };
});

