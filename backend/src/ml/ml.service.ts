// src/ml/ml.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MlService {
  private readonly ML_API_URL = 'http://localhost:5000/predict'; // Adjust if different

  async predictCategory(productName: string): Promise<string> {
    try {
      const response = await axios.post(this.ML_API_URL, { name: productName });
      return response.data.category;
    } catch (error) {
      throw new HttpException(
        `ML service error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
