import { Test, TestingModule } from '@nestjs/testing';
import { PhonebookController } from './phonebook.controller';
import { PhonebookService } from './phonebook.service';

describe('PhonebookController', () => {
  let controller: PhonebookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhonebookController],
      providers: [PhonebookService],
    }).compile();

    controller = module.get<PhonebookController>(PhonebookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
