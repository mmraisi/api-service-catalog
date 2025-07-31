import * as request from 'supertest'
import { createTestApp, closeTestApp, app, dataSource } from '../../test/utils/test-app'

describe('VersionsController (e2e)', () => {
  const testToken = process.env.AUTH_TOKEN || 'test-token'
  let serviceId: string
  let versionId: string

  beforeAll(async () => {
    await createTestApp()

    const entities = dataSource.entityMetadatas
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name)
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE`)
    }

    await dataSource.synchronize(true)

    // Create a service to link versions to
    const serviceRes = await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ service_name: 'Versioned Service' })
      .expect(201)

    serviceId = serviceRes.body.service_id
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('POST /services/:serviceId/versions - should create a version for a service', async () => {
    const res = await request(app.getHttpServer())
      .post(`/services/${serviceId}/versions`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        version_name: 'v1.0'
      })
      .expect(201)

    versionId = res.body.version_id
    expect(versionId).toBeDefined()
    expect(res.body.version_name).toBe('v1.0')
    expect(res.body.service.service_id).toBe(serviceId)
  })

  it('GET /services/:serviceId/versions - should list versions', async () => {
    const res = await request(app.getHttpServer())
      .get((`/services/${serviceId}/versions`))
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200)

    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
    expect(res.body[0]).toHaveProperty('version_name', 'v1.0')
  })

  it('GET /services/:serviceId/versions/:versionId - should return the version', async () => {
    const res = await request(app.getHttpServer())
      .get(`/services/${serviceId}/versions/${versionId}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200)

    expect(res.body.version_id).toBe(versionId)
    expect(res.body.version_name).toBe('v1.0')
  })

  it('PATCH /services/:serviceId/versions/:versionId - should update version name', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/services/${serviceId}/versions/${versionId}`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({ version_name: 'v2.0' })
      .expect(200)

    expect(res.body.version_name).toBe('v2.0')
  })

  it('DELETE /services/:serviceId/versions/:versionId - should delete the version', async () => {
    await request(app.getHttpServer())
      .delete(`/services/${serviceId}/versions/${versionId}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(204)
  })

  it('GET /services/:serviceId/versions/:versionId - should return 404 after deletion', async () => {
    await request(app.getHttpServer())
      .get(`/services/${serviceId}/versions/${versionId}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(404)
  })
})
