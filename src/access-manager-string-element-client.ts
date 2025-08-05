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

import { StringUniqueStringifier } from './string-unique-stringifier';
import { IAxiosShim } from './iaxios-shim';
import { DefaultAxios } from './default-axios';
import { AccessManagerClient } from './access-manager-client';
import { AxiosRequestConfig, AxiosHeaders } from 'axios';

/**
 * @name AccessManagerStringElementClient
 * @desc Client class which interfaces to an AccessManager instance hosted as a REST web API, where users, groups, application components, and access levels are strings.
 */
export class AccessManagerStringElementClient extends AccessManagerClient<String, String, String, String> {

    /**
     * @desc Creates an AccessManagerStringElementClient.
     * 
     * @param baseUrl - The base URL for the hosted Web API.
     * @param requestConfig - (Optional) axios request config to use for making HTTP requests.  Allows specifying request headers, timeouts, etc.
     * @param axiosShim - (Optional) {@link https://en.wikipedia.org/wiki/Shim_(computing)| Shim} to axios for use in unit testing.
     */
    constructor (
        baseUrl: URL,
        requestConfig: AxiosRequestConfig = { headers: new AxiosHeaders() },
        axiosShim: IAxiosShim = new DefaultAxios()
    ) {
        super(baseUrl, new StringUniqueStringifier(), new StringUniqueStringifier(), new StringUniqueStringifier(), new StringUniqueStringifier(), requestConfig, axiosShim);
    }
}