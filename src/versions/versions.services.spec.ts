import { Test, TestingModule } from '@nestjs/testing'
import { VersionsService } from './versions.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Version } from './entities/version.entity'
import { Service } from '../services/entities/service.entity'
import { Repository } from 'typeorm'
import { createMockRepository } from '../../test/utils/mocks'
import { CreateVersionDto } from './dto/create-version.dto'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { QueryVersionDto } from './dto/query-version.dto'

describe('VersionsService', () => {
  let versionsService: VersionsService
  let versionRepo: jest.Mocked<Repository<Version>>
  let serviceRepo: jest.Mocked<Repository<Service>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VersionsService,
        {
          provide: getRepositoryToken(Version),
          useValue: createMockRepository()
        },
        {
          provide: getRepositoryToken(Service),
          useValue: createMockRepository()
        }
      ]
    }).compile()

    versionsService = module.get<VersionsService>(VersionsService)
    versionRepo = module.get(getRepositoryToken(Version))
    serviceRepo = module.get(getRepositoryToken(Service))
  })

  describe('create', () => {
    const serviceId = 'svc-1'
    const dto: CreateVersionDto = {
      version_name: 'v1'
    }

    it('should throw NotFoundException if service not found', async () => {
      serviceRepo.findOneBy.mockResolvedValue(null)
      await expect(versionsService.create(serviceId, dto)).rejects.toThrow(NotFoundException)
    })

    it('should throw ConflictException if version already exists for service', async () => {
      serviceRepo.findOneBy.mockResolvedValue({ service_id: serviceId } as Service)
      versionRepo.findOne.mockResolvedValue({ version_name: 'v1' } as Version)

      await expect(versionsService.create(serviceId, dto)).rejects.toThrow(ConflictException)
    })

    it('should create and return a version', async () => {
      const service = { service_id: serviceId } as Service
      const newVersion = { version_id: 'ver-1', ...dto, service } as Version

      serviceRepo.findOneBy.mockResolvedValue(service)
      versionRepo.findOne.mockResolvedValue(null)
      versionRepo.create.mockReturnValue(newVersion)
      versionRepo.save.mockResolvedValue(newVersion)

      const result = await versionsService.create(serviceId, dto)
      expect(result).toEqual(newVersion)
    })
  })

  describe('findAll', () => {
    it('should return list of versions for a service', async () => {
      const serviceId = 'svc-1'
      const resultMock = [
        { version_id: '1', version_name: 'v1' },
        { version_id: '2', version_name: 'v2' }
      ] as Version[]

      versionRepo.find.mockResolvedValue(resultMock)

      const result = await versionsService.findAll(serviceId, { limit: 10, page: 0, version_name: '__version_name__' } as QueryVersionDto)
      expect(result).toEqual(resultMock)
    })
    it('should return list of versions for a service with filters', async () => {
      const serviceId = 'svc-1'
      const resultMock = [
        { version_id: '1', version_name: 'v1' },
        { version_id: '2', version_name: 'v2' }
      ] as Version[]

      versionRepo.find.mockResolvedValue(resultMock)

      const result = await versionsService.findAll(serviceId, { version_name: '__version_name__' } as QueryVersionDto)
      expect(result).toEqual(resultMock)
    })
  })

  describe('findOne', () => {
    const serviceId = 'svc-1'
    it('should return a version', async () => {
      const version = { version_id: '1', version_name: 'v1', service: { service_id: serviceId } } as Version
      versionRepo.findOne.mockResolvedValue(version)

      const result = await versionsService.findOne(serviceId, '1')
      expect(result).toEqual(version)
    })

    it('should throw NotFoundException if not found', async () => {
      versionRepo.findOne.mockResolvedValue(null)
      await expect(versionsService.findOne(serviceId, '999')).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    const serviceId = 'svc-1'
    it('should update and return the version', async () => {
      const updated = { version_id: '1', version_name: 'updated' } as Version

      versionRepo.save.mockResolvedValue(updated)
      jest.spyOn(versionsService, 'findOne').mockResolvedValue({ version_id: '1', version_name: 'before update' } as Version)

      const result = await versionsService.update(serviceId, '1', { version_name: 'updated' })
      expect(result).toEqual(updated)
    })
  })

  describe('remove', () => {
    const serviceId = 'svc-1'
    it('should delete a version', async () => {
      versionRepo.delete.mockResolvedValue({ affected: 1 } as any)
      await expect(versionsService.remove(serviceId, '1')).resolves.toBeUndefined()
    })

    it('should throw NotFoundException if not found', async () => {
      versionRepo.delete.mockResolvedValue({ affected: 0 } as any)
      await expect(versionsService.remove(serviceId, 'x')).rejects.toThrow(NotFoundException)
    })
  })
})
