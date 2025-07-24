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

import { IUniqueStringifier } from './iunique-stringifier';
import { HttpRequestMethod } from './http-request-method';
import { HttpErrorResponse } from './models/http-error-response';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

/**
 * @name AccessManagerClientBase
 * @desc Base for client classes which interface to AccessManager instances hosted as REST web APIs.
 * 
 * @template TUser - The type of users in the AccessManager.
 * @template TGroup - The type of groups in the AccessManager.
 * @template TComponent - The type of components in the AccessManager.
 * @template TAccess - The type of levels of access which can be assigned to an application component.
 */
export abstract class AccessManagerClientBase<TUser, TGroup, TComponent, TAccess> {

    /** The base URL for the hosted Web API. */
    protected baseUrl: URL;
    /** Maps an HTTP status code to a function which throws a matching {@link Error} to the status code.  The function accepts 1 parameter: the {@link HttpErrorResponse} representing the exception. */
    protected statusCodeToErrorThrowingFunctionMap: Map<number, (httpErrorResponse: HttpErrorResponse) => {}>;

    constructor() {
        // TODO: Have option to pass AxiosRequestConfig
        //   https://axios-http.com/docs/req_config
        //   https://stackoverflow.com/questions/66062849/how-to-set-axiosconfig-using-typescript
    }

    // #region Private/Protected Methods

    protected async SendGetRequestAsync<T>(requestUrl: URL) : Promise<T> {

        let response: AxiosResponse = await axios.get(requestUrl.toString());
        
        console.log(response);

        throw new Error();
    }

    /**
     * @name SetBaseConstructorParameters
     * @desc Performs setup for a minimal/common set of constructor parameters.
     * 
     * @param baseUrl - The base URL for the hosted Web API.
     * @param userStringifier - A string converter for users.  Used to convert strings sent to and received from the web API from/to {@link TUser} instances.
     * @param groupStringifier - A string converter for groups.  Used to convert strings sent to and received from the web API from/to {@link TGroup} instances.
     * @param applicationComponentStringifier - A string converter for application components.  Used to convert strings sent to and received from the web API from/to {@link TComponent} instances.
     * @param accessLevelStringifier - A string converter for access levels.  Used to convert strings sent to and received from the web API from/to {@link TAccess} instances.
     */
    protected SetBaseConstructorParameters(
        baseUrl: URL,
        userStringifier: IUniqueStringifier<TUser>, 
        groupStringifier: IUniqueStringifier<TGroup>, 
        applicationComponentStringifier: IUniqueStringifier<TComponent>, 
        accessLevelStringifier: IUniqueStringifier<TAccess>, 
    ) : void {
        this.InitializeBaseUrl(baseUrl);
    }

    /**
     * @name InitializeBaseUrl
     * @desc Adds an appropriate path suffix to the specified 'baseUrl' constructor parameter.
     * 
     * @param baseUrl - The base URL to initialize.
     */
    protected InitializeBaseUrl(baseUrl: URL) : void {

        try {
            this.baseUrl = new URL(baseUrl.pathname += "api/v1/");
        }
        catch (e) {
            throw new Error(`Failed to append API suffix to base URL '${baseUrl.href}'.`, { cause: e });
        }
    }

    /**
     * @name HandleNonSuccessResponseStatus
     * @desc Handles receipt of a non-success HTTP response status, by converting the status and response body to an appropriate Error and throwing that Error.

     * @param method - The HTTP method used in the request which generated the response.
     * @param requestUrl - The URL of the request which generated the response.
     * @param status - The received HTTP response status.
     * @param responseData - The received response body.
     */
    protected HandleNonSuccessResponseStatus(method: HttpRequestMethod, requestUrl: URL, status: number, responseData: any) : void {

        let baseExceptionMessage: string = `Failed to call URL '${requestUrl.toString()}' with '${method}' method.  Received non-succces HTTP response status '${status}'`;

        let httpErrorResponse: HttpErrorResponse | null = this.DeserializeResponseDataToHttpErrorResponse(responseData);
        if (httpErrorResponse !== null) {

        }
    }

    /**
     * @name DeserializeResponseDataToHttpErrorResponse
     * @desc Attempts to deserialize the body/data of an HTTP response to an {@link HttpErrorResponse} instance.
     * 
     * @param responseData - The response body/data to deserialize.
     * @returns The deserialized response body, or null if the response could not be deserialized (e.g. null).
     */
    protected DeserializeResponseDataToHttpErrorResponse(responseData: any) : HttpErrorResponse | null {

        if (responseData === null) {
            return null;
        }
        if (responseData.hasOwnProperty("code") == true && responseData.hasOwnProperty("message")) {
            let code: string = responseData["code"];
            let message: string = responseData["message"];
            let target: string | null = null;
            let attributes: Array<[string, string]> = [];
            let innerError: HttpErrorResponse | null = null;
            if (responseData.hasOwnProperty("target") == true) {
                target = responseData["target"];
            }
            if (responseData.hasOwnProperty("attributes") == true) {
                attributes = responseData["attributes"];
            }
            if (responseData.hasOwnProperty("innerError") == true) {
                innerError = responseData["innerError"];
            }

            return new HttpErrorResponse(code, message, target, attributes, innerError);
        }
        else {
            return null;
        }
    }

    // #endregion
}