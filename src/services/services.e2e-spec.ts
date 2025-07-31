import * as request from 'supertest'
import { createTestApp, closeTestApp, app, dataSource } from '../../test/utils/test-app'

describe('ServicesController (e2e)', () => {
  const testToken = process.env.AUTH_TOKEN || 'test-token'
  let createdServiceId: string

  beforeAll(async () => {
    await createTestApp()

    const entities = dataSource.entityMetadatas
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name)
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE`)
    }

    await dataSource.synchronize(true)
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('POST /services - should create a service', async () => {
    const res = await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ service_name: 'Test Integration' })
      .expect(201)

    createdServiceId = res.body.service_id
    expect(createdServiceId).toBeDefined()
    expect(res.body.service_name).toBe('Test Integration')
  })

  it('GET /services - should list services with created one', async () => {
    const res = await request(app.getHttpServer())
      .get('/services')
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200)

    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
    expect(res.body[0]).toHaveProperty('service_id', createdServiceId)
  })

  it('GET /services/:serviceId - should return the created service', async () => {
    const res = await request(app.getHttpServer())
      .get(`/services/${createdServiceId}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200)

    expect(res.body).toHaveProperty('service_id', createdServiceId)
    expect(res.body).toHaveProperty('service_name', 'Test Integration')
  })

  it('PATCH /services/:serviceId - should update the service name', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/services/${createdServiceId}`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({ service_name: 'Updated Service' })
      .expect(200)

    expect(res.body).toHaveProperty('service_name', 'Updated Service')
  })

  it('DELETE /services/:serviceId - should delete the service', async () => {
    await request(app.getHttpServer())
      .delete(`/services/${createdServiceId}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(204)
  })

  it('GET /services/:serviceId - should return 404 after deletion', async () => {
    await request(app.getHttpServer())
      .get(`/services/${createdServiceId}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(404)
  })
})
