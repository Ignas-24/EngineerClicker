import { ResourceManager } from '../ResourceManager.js';

describe('ResourceManager', () => {
  let mockGame;
  let resourceManager;

  beforeEach(() => {
    mockGame = { notifyUpdate: vi.fn() };

    global.localStorage = {
        getItem: vi.fn(),
        setItem: vi.fn(),
      };

    resourceManager = new ResourceManager(mockGame);
});
  

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('saveData should save euro value to localStorage', () => {
    resourceManager.euro = 100;
    resourceManager.saveData();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'ResourceManagerData',
      JSON.stringify({ euro: 100 })
    );
  });

  it('loadData should load euro value from localStorage when it is saved correctly', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({ euro: 200 }));

    resourceManager.loadData();

    expect(resourceManager.euro).toBe(200);
  });

  it('loadData should not update euro if there is no gameData found', () => {
    localStorage.getItem.mockReturnValue(null);
    resourceManager.euro = 10;
    resourceManager.loadData();

    expect(resourceManager.euro).toBe(10);
  });

  it('loadData should set euro to 0 if no data is found', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({ notEuro: 200 }));

    resourceManager.loadData();

    expect(resourceManager.euro).toBe(0);
  });

});