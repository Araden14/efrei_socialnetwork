import { AppService } from '../src/app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const result = 'Hello World!';

      expect(appService.getHello()).toBe(result);
    });
  });
});
