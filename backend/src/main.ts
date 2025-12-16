import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io'; // Correct import for Socket.IO


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description for the application')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useWebSocketAdapter(new IoAdapter(app));
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`WebSocket Gateway initialized.`); // This will be logged if the app starts successfully
}
bootstrap();
