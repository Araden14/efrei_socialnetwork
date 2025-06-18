import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('CatsController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
    appController = new AppController(appService);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const result = 'Hello Wo!';
      jest.spyOn(appService, 'getHello').mockImplementation(() => result);

      expect(appController.getHello()).toBe(result);
    });
  });
});
