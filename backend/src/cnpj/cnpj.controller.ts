import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { CnpjService } from "./cnpj.service";
@Controller("cnpj")
export class CnpjController {
  constructor(private readonly cnpjService: CnpjService) {}
  @Get(":cnpj")
  async getCustomerData(@Param("cnpj") cnpj: string): Promise<any> {
    try {
      const data = await this.cnpjService.fetchCustomerData(cnpj);
      return this.treatData(data);
    } catch (error) {
      throw new HttpException(
        "Falha ao buscar os dados do CNPJ na API",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  private treatData(data: any): any {
    return {
      companyName: data.razao_social || "N/A",
      email: data.email || "N/A",
    };
  }
}
