import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { GenresModule } from './genres/genres.module';
import { TheatersModule } from './theaters/theaters.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { ReservationsModule } from './reservations/reservations.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // Provide PrismaService globally by importing PrismaModule once at the root
    PrismaModule,
    AuthModule,
    UsersModule,
    MoviesModule,
    GenresModule,
    TheatersModule,
    ShowtimesModule,
    ReservationsModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
