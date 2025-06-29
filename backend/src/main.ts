import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autorise les requêtes venant du front
  app.enableCors({
    origin: process.env.CLIENT_HOST,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // si tu utilises des cookies ou l’authentification
  });

  await app.listen(4000);
  console.log(`🚀 Server ready at ${process.env.API_HOST}/graphql`);
}
bootstrap();