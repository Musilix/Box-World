import { Test, TestingModule } from '@nestjs/testing';
import { BoxesGateway } from './boxes.gateway';

describe('BoxesGateway', () => {
  let gateway: BoxesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoxesGateway],
    }).compile();

    gateway = module.get<BoxesGateway>(BoxesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
