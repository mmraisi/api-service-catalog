import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // strips unknown fields
    forbidNonWhitelisted: true, // throws error on unknown fields
    transform: true // transforms input to match DTO types
  }))

  const config = new DocumentBuilder()
    .setTitle('Service Catalog API')
    .setDescription('API for managing services and their versions')
    .setVersion('1.0')
    .addBearerAuth() // adds support for "Authorize" button
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
