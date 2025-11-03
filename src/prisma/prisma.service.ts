import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // 🔹 Conexión inicial a la base de datos
    await this.$connect();
  }

  async onModuleDestroy() {
    // 🔹 Desconexión limpia cuando se apaga la app
    await this.$disconnect();
  }

  // 🔹 Método opcional para ejecutar transacciones manualmente
  async transaction<T>(callback: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(callback);
  }
}
