import { Module } from "@nestjs/common";
import { CnpjService } from "./cnpj.service";
import { CnpjController } from "./cnpj.controller";
@Module({
  providers: [CnpjService],
  controllers: [CnpjController],
})
export class CnpjModule {}
