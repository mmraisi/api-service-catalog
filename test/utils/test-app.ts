import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../src/app.module'
import { DataSource } from 'typeorm'

export let app: INestApplication
export let dataSource: DataSource

export async function createTestApp (): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule]
  })
    .compile()

  app = moduleFixture.createNestApplication()
  await app.init()

  dataSource = moduleFixture.get(DataSource)
  return app
}

export async function closeTestApp (): Promise<void> {
  if (app) await app.close()
}
