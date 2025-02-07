import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import axios from "axios";
@Injectable()
export class CnpjService {
  private readonly apiUrl = "https://publica.cnpj.ws/cnpj";
  async fetchCustomerData(cnpj: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/${cnpj}`);
      return response.data;
    } catch (error) {
      console.error("Falha ao buscar os dados do CNPJ na API:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw new HttpException(
        "Falha ao buscar os dados do CNPJ na API",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
