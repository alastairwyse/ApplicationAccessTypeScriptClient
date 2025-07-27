/*
 * Copyright 2025 Alastair Wyse (https://github.com/alastairwyse/ApplicationAccessTypeScriptClient/)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AxiosResponse, AxiosRequestConfig } from 'axios';

/**
 * @name IAxiosShim
 * @desc Defines methods which perform HTTP requests via axios.
 *       Acts as a {@link https://en.wikipedia.org/wiki/Shim_(computing)| shim} to axios for use in unit testing.
 */
export interface IAxiosShim {
    
    get(url: string, config: AxiosRequestConfig<any>) : Promise<AxiosResponse<any, any>>;

    post(url: string, config: AxiosRequestConfig<any>) : Promise<AxiosResponse<any, any>>;

    delete(url: string, config: AxiosRequestConfig<any>) : Promise<AxiosResponse<any, any>>;
}