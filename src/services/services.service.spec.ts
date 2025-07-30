import { Test, TestingModule } from '@nestjs/testing'
import { ServicesService } from './services.service'
import { Service } from './entities/service.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateServiceDto } from './dto/create-service.dto'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { UpdateServiceDto } from './dto/update-service.dto'
import { createMockRepository } from '../../test/utils/mocks'
import { QueryServiceDto } from './dto/query-service.dto'

describe('ServicesService', () => {
  let service: ServicesService
  let repo: jest.Mocked<Repository<Service>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(Service),
          useValue: createMockRepository()
        }
      ]
    }).compile()

    service = module.get<ServicesService>(ServicesService)
    repo = module.get(getRepositoryToken(Service))
  })

  describe('create', () => {
    it('should throw ConflictException if service name already exists', async () => {
      const dto: CreateServiceDto = { service_name: 'Test', service_description: 'Test service' }
      repo.findOne.mockResolvedValue({ service_name: 'Test' } as Service)

      await expect(service.create(dto)).rejects.toThrow(ConflictException)
    })

    it('should create and return a new service', async () => {
      const dto: CreateServiceDto = { service_name: 'Test', service_description: 'Test service' }
      const entity = { service_id: '1', ...dto } as Service

      repo.findOne.mockResolvedValue(null)
      repo.create.mockReturnValue(entity)
      repo.save.mockResolvedValue(entity)

      const result = await service.create(dto)
      expect(result).toEqual(entity)
    })
  })

  describe('findAll', () => {
    it('should return list of services', async () => {
      const mockServices = [{ service_id: '1' }, { service_id: '2' }] as Service[]
      repo.find.mockResolvedValue(mockServices)

      const result = await service.findAll({ limit: 10, page: 1, service_name: '__service_name__' } as QueryServiceDto)
      expect(result).toEqual(mockServices)
      expect(repo.find).toHaveBeenCalled()
    })
    it('should return list of services with filters', async () => {
      const mockServices = [{ service_id: '1' }, { service_id: '2' }] as Service[]
      repo.find.mockResolvedValue(mockServices)

      const result = await service.findAll({ service_name: '__service_name__' } as QueryServiceDto)
      expect(result).toEqual(mockServices)
      expect(repo.find).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null)
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException)
    })

    it('should return the service', async () => {
      const entity = { service_id: '1' } as Service
      repo.findOne.mockResolvedValue(entity)

      const result = await service.findOne('1')
      expect(result).toEqual(entity)
    })
  })

  describe('update', () => {
    it('should update and return updated service', async () => {
      const updateDto: UpdateServiceDto = { service_description: 'Updated' }
      const updatedEntity = { service_id: '1', service_description: 'Updated' } as Service

      repo.update.mockResolvedValue({ affected: 1 } as any)
      jest.spyOn(service, 'findOne').mockResolvedValue(updatedEntity)

      const result = await service.update('1', updateDto)
      expect(result).toEqual(updatedEntity)
    })
  })

  describe('remove', () => {
    it('should throw NotFoundException if nothing was deleted', async () => {
      repo.delete.mockResolvedValue({ affected: 0 } as any)
      await expect(service.remove('99')).rejects.toThrow(NotFoundException)
    })

    it('should delete the service', async () => {
      repo.delete.mockResolvedValue({ affected: 1 } as any)
      await expect(service.remove('1')).resolves.toBeUndefined()
    })
  })
})
