import { ApiV3Instance } from 'api';
import { AxiosResponse } from 'axios';

export const getAllPatterns = (): Promise<AxiosResponse<any>> =>
	ApiV3Instance.get('/logs/patterns');
