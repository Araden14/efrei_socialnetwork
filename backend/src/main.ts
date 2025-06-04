import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autorise les requêtes venant du front
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, // si tu utilises des cookies ou l’authentification
  });

  await app.listen(4000);
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}
bootstrap();