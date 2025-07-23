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

import { HttpRequestMethod } from './http-request-method';
import { HttpErrorResponse } from './models/http-error-response';
import axios, { AxiosResponse } from 'axios';

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


    // #region Private/Protected Methods

    protected async SendGetRequestAsync<T>(requestUrl: URL) : Promise<T> {

        let response: AxiosResponse = await axios.get(requestUrl.toString());

        console.log(response);

        throw new Error();
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
    }

    /**
     * @name DeserializeResponseDataToHttpErrorResponse
     * @desc Attempts to deserialize the body/data of an HTTP response to an HttpErrorResponse instance.
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