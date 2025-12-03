import { Test, TestingModule } from '@nestjs/testing';
import { AgenciesController } from './agencies.controller';
import { AgenciesService } from './agencies.service';

describe('AgenciesController', () => {
  let controller: AgenciesController;
  let service: AgenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgenciesController],
      providers: [
        {
          provide: AgenciesService,
          useValue: {
            findAllAgencies: jest.fn(),
            registerAsAgency: jest.fn(),
            findAgencyByName: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AgenciesService>(AgenciesService);
    controller = module.get<AgenciesController>(AgenciesController);
  });
  describe('findAllAgencies', () => {
    it('should return an array of agencies', async () => {
      const result = [
        { name: 'Agency1', agents: [] },
        { name: 'Agency2', agents: [] },
      ];
      jest.spyOn(service, 'findAllAgencies').mockImplementation(async () => result);
      expect(await controller.getAllAgencies()).toBe(result);
    });
  });
  describe('registerAsAgency', () => {
    it('should register a new agency', async () => {
      const agencyRequest = { name: 'New Agency' };
      const result = { name: 'New Agency', agents: [] };
      jest.spyOn(service, 'registerAsAgency').mockImplementation(async () => result);
      expect(await controller.registerAgency(agencyRequest)).toBe(result);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
