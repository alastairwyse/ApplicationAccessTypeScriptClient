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
import { NameValuePair } from './models/name-value-pair';
import { HttpErrorResponse } from './models/http-error-response';
import { NotFoundError } from './errors/not-found-error';
import { ElementNotFoundError } from './errors/element-not-found-error';
import { IAxiosShim } from './iaxios-shim';
import { DefaultAxios } from './default-axios';
import axios, { AxiosResponse, AxiosRequestConfig, AxiosHeaders, AxiosError } from 'axios';

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

    // TODO:
    //   Create AccessManagerStringElementClient

    static readonly javaScriptObjectType: string = "object";

    /** Axios request config to use for making HTTP requests. */
    protected requestConfig: AxiosRequestConfig;
    /** The base URL for the hosted Web API. */
    protected baseUrl: URL;
    /** Maps an HTTP status code to a function which throws a matching {@link Error} to the status code.  The function accepts 1 parameter: the {@link HttpErrorResponse} representing the exception. */
    protected statusCodeToErrorThrowingFunctionMap: Map<number, (httpErrorResponse: HttpErrorResponse) => void>;
    /** A string converter for users.  Used to convert strings sent to and received from the web API from/to {@link TUser} instances. */
    protected userStringifier: IUniqueStringifier<TUser>;
    /** A string converter for groups.  Used to convert strings sent to and received from the web API from/to {@link TGroup} instances. */
    protected groupStringifier: IUniqueStringifier<TGroup>;
    /** A string converter for application components.  Used to convert strings sent to and received from the web API from/to {@link TComponent} instances. */
    protected applicationComponentStringifier: IUniqueStringifier<TComponent>;
    /** A string converter for access levels.  Used to convert strings sent to and received from the web API from/to {@link TAccess} instances. */
    protected accessLevelStringifier: IUniqueStringifier<TAccess>;
    /** Acts as a {@link https://en.wikipedia.org/wiki/Shim_(computing)| shim} to axios. */
    protected axiosShim: IAxiosShim;

    /**
     * @desc Creates an AccessManagerClientBase.
     * 
     * @param baseUrl - The base URL for the hosted Web API.
     * @param userStringifier - A string converter for users.  Used to convert strings sent to and received from the web API from/to {@link TUser} instances.
     * @param groupStringifier - A string converter for groups.  Used to convert strings sent to and received from the web API from/to {@link TGroup} instances.
     * @param applicationComponentStringifier - A string converter for application components.  Used to convert strings sent to and received from the web API from/to {@link TComponent} instances.
     * @param accessLevelStringifier - A string converter for access levels.  Used to convert strings sent to and received from the web API from/to {@link TAccess} instances.
     * @param requestConfig - (Optional) axios request config to use for making HTTP requests.  Allows specifying request headers, timeouts, etc.
     * @param axiosShim - (Optional) {@link https://en.wikipedia.org/wiki/Shim_(computing)| Shim} to axios for use in unit testing.
     */
    constructor(
        baseUrl: URL,
        userStringifier: IUniqueStringifier<TUser>, 
        groupStringifier: IUniqueStringifier<TGroup>, 
        applicationComponentStringifier: IUniqueStringifier<TComponent>, 
        accessLevelStringifier: IUniqueStringifier<TAccess>, 
        requestConfig: AxiosRequestConfig = { headers: new AxiosHeaders() },
        axiosShim: IAxiosShim = new DefaultAxios()
    ) {
        this.SetBaseConstructorParameters(
            baseUrl, 
            userStringifier,
            groupStringifier,
            applicationComponentStringifier,
            accessLevelStringifier,
            requestConfig, 
            axiosShim
        );
    }

    // #region Private/Protected Methods

    /**
     * @name SendGetRequestAsync
     * @desc Sends an HTTP GET request, expecting a 200 status returned to indicate success.
     * 
     * @param requestUrl - The URL of the request.
     * @returns The body returned by the response to the request.
     */
    protected async SendGetRequestAsync(requestUrl: URL) : Promise<any> {

        let response: AxiosResponse;
        try {
            response = await this.axiosShim.get(requestUrl.href, this.requestConfig);
        }
        catch (error: any) {
            let typedError = <AxiosError>error;
            this.HandleNonSuccessResponseStatus(HttpRequestMethod.Get, requestUrl, typedError.status!, typedError.response?.data!);
        }
        return response!.data;
    }

    /**
     * @name SendGetRequestForContainsMethodAsync
     * @desc Sends an HTTP GET request, expecting either a 200 or 404 status returned.
     * 
     * @param requestUrl - The URL of the request.
     * @returns True in the case a 200 response status is received, or false in the case a 404 status is received.
     */
    protected async SendGetRequestForContainsMethodAsync(requestUrl: URL) : Promise<boolean> {
        
        let response: AxiosResponse;
        try {
            response = await this.axiosShim.get(requestUrl.href, this.requestConfig);
        }
        catch (error: any) {
            let typedError = <AxiosError>error;
            if (typedError.status! === 404) {
                return false;
            }
            this.HandleNonSuccessResponseStatus(HttpRequestMethod.Get, requestUrl, typedError.status!, typedError.response?.data!);
        }
        if (response!.status === 200) {
            return true;
        }

        return false;
    }

    /**
     * @name SendPostRequestAsync
     * @desc Sends an HTTP POST request, expecting a 201 status returned to indicate success.
     * 
     * @param requestUrl - The URL of the request.
     */
    protected async SendPostRequestAsync(requestUrl: URL) : Promise<void> {

        let response: AxiosResponse;
        try {
            response = await this.axiosShim.post(requestUrl.href, this.requestConfig);
        }
        catch (error: any) {
            let typedError = <AxiosError>error;
            this.HandleNonSuccessResponseStatus(HttpRequestMethod.Post, requestUrl, typedError.status!, typedError.response?.data!);
        }
        if (response!.status !== 201) {
            this.HandleNonSuccessResponseStatus(HttpRequestMethod.Post, requestUrl, response!.status, response!.data);
        }
    }

    /**
     * @name SendDeleteRequestAsync
     * @desc Sends an HTTP DELETE request, expecting a 200 status returned to indicate success.
     * 
     * @param requestUrl - The URL of the request.
     */
    protected async SendDeleteRequestAsync(requestUrl: URL) : Promise<void> {

        let response: AxiosResponse;
        try {
            response = await this.axiosShim.delete(requestUrl.href, this.requestConfig);
        }
        catch (error: any) {
            let typedError = <AxiosError>error;
            this.HandleNonSuccessResponseStatus(HttpRequestMethod.Delete, requestUrl, typedError.status!, typedError.response?.data!);
        }
        if (response!.status !== 200) {
            this.HandleNonSuccessResponseStatus(HttpRequestMethod.Delete, requestUrl, response!.status, response!.data);
        }
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
     * @param requestConfig - Axios request config to use for making HTTP requests.
     * @param axiosShim - (Optional) {@link https://en.wikipedia.org/wiki/Shim_(computing)| Shim} to axios for use in unit testing.
     */
    protected SetBaseConstructorParameters(
        baseUrl: URL,
        userStringifier: IUniqueStringifier<TUser>, 
        groupStringifier: IUniqueStringifier<TGroup>, 
        applicationComponentStringifier: IUniqueStringifier<TComponent>, 
        accessLevelStringifier: IUniqueStringifier<TAccess>, 
        requestConfig: AxiosRequestConfig, 
        axiosShim: IAxiosShim
    ) : void {
        this.InitializeBaseUrl(baseUrl);
        this.userStringifier = userStringifier;
        this.groupStringifier = groupStringifier;
        this.applicationComponentStringifier = applicationComponentStringifier;
        this.accessLevelStringifier = accessLevelStringifier;
        this.requestConfig = requestConfig;
        if (requestConfig.headers === undefined) {
            requestConfig.headers = new AxiosHeaders();
        }
        this.requestConfig.headers!["Accept"] = "application/json";
        this.axiosShim = axiosShim;
        this.InitializeStatusCodeToErrorThrowingFunctionMap();
    }

    /**
     * @name AppendPathToBaseUrl
     * @desc Concatenates the specified path (with no leading forward slash) to the 'baseUrl' property and returns it as a new {@link URL} 
     * 
     * @param path - The path to concatenate.
     * @returns The concatenated URL.
     */
    protected AppendPathToBaseUrl(path: string) : URL {

        return this.baseUrl = new URL(this.baseUrl.href + path);
    }

    /**
     * @name InitializeBaseUrl
     * @desc Adds an appropriate path suffix to the specified 'baseUrl' constructor parameter.
     * 
     * @param baseUrl - The base URL to initialize.
     */
    protected InitializeBaseUrl(baseUrl: URL) : void {

        try {
            this.baseUrl = new URL(baseUrl.href + "api/v1/");
        }
        catch (e) {
            throw new Error(`Failed to append API suffix to base URL '${baseUrl.href}'.`, { cause: e });
        }
    }

    /**
     * @name InitializeStatusCodeToErrorThrowingFunctionMap
     * @desc Initializes the 'statusCodeToExceptionThrowingActionMap' member.
     */
    protected InitializeStatusCodeToErrorThrowingFunctionMap() {
        this.statusCodeToErrorThrowingFunctionMap = new Map<number, (httpErrorResponse: HttpErrorResponse) => {}>;
        this.statusCodeToErrorThrowingFunctionMap.set(
            404, 
            (httpErrorResponse: HttpErrorResponse) => {
                if (httpErrorResponse.Code === "UserNotFoundException") {
                    let user: string = this.GetHttpErrorResponseAttributeValue(httpErrorResponse, "User");
                    throw new ElementNotFoundError(httpErrorResponse.Message, "User", user);
                }
                else if (httpErrorResponse.Code === "GroupNotFoundException") {
                    let group: string = this.GetHttpErrorResponseAttributeValue(httpErrorResponse, "Group");
                    throw new ElementNotFoundError(httpErrorResponse.Message, "Group", group);
                }
                else if (httpErrorResponse.Code === "EntityTypeNotFoundException") {
                    let entityType: string = this.GetHttpErrorResponseAttributeValue(httpErrorResponse, "EntityType");
                    throw new ElementNotFoundError(httpErrorResponse.Message, "EntityType", entityType);
                }
                else if (httpErrorResponse.Code === "EntityNotFoundException") {
                    let entity: string = this.GetHttpErrorResponseAttributeValue(httpErrorResponse, "Entity");
                    throw new ElementNotFoundError(httpErrorResponse.Message, "Entity", entity);
                }
                else {
                    let resourceId: string = this.GetHttpErrorResponseAttributeValue(httpErrorResponse, "ResourceId");
                    throw new NotFoundError(httpErrorResponse.Message, resourceId);
                }
            }
        );
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

        let baseExceptionMessage: string = `Failed to call URL '${requestUrl.toString()}' with '${method}' method.  Received non-succces HTTP response status ${status}`;

        let httpErrorResponse: HttpErrorResponse | null = this.DeserializeResponseDataToHttpErrorResponse(responseData);
        if (httpErrorResponse !== null) {
            if (this.statusCodeToErrorThrowingFunctionMap.has(status) == true) {
                let errorThrowingFunction: (httpErrorResponse: HttpErrorResponse) => void = this.statusCodeToErrorThrowingFunctionMap.get(status)!;
                errorThrowingFunction(httpErrorResponse);
            }
            else {
                let exceptionMessagePostfix: string = `, error code '${httpErrorResponse.Code}', and error message '${httpErrorResponse.Message}'.`
                throw new Error(baseExceptionMessage + exceptionMessagePostfix);
            }
        }
        else {
            if (responseData !== null) {
                if (typeof(responseData) === AccessManagerClientBase.javaScriptObjectType) {
                    throw new Error(baseExceptionMessage + `, and response body '${JSON.stringify(responseData)}'.`);
                }
                else {
                    throw new Error(baseExceptionMessage + `, and response body '${responseData.toString()}'.`);
                }
            } 
            else {
                throw new Error(baseExceptionMessage + ".");
            }
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
        if (responseData.hasOwnProperty("error") && typeof(responseData.error) === AccessManagerClientBase.javaScriptObjectType) {
            let error: any = responseData.error;
            if (error.hasOwnProperty("code") == true && error.hasOwnProperty("message")) {
                let code: string = error["code"];
                let message: string = error["message"];
                let target: string | null = null;
                let attributes: Array<NameValuePair> = [];
                let innerError: HttpErrorResponse | null = null;
                if (error.hasOwnProperty("target") == true) {
                    target = error["target"];
                }
                if (error.hasOwnProperty("attributes") == true) {
                    let attributesArray: Array<any> = error["attributes"];
                    for (let i: number = 0; i < attributesArray.length; i++) {
                        attributes.push(new NameValuePair(
                            attributesArray[i].name,
                            attributesArray[i].value,
                        ));
                    }
                }
                if (error.hasOwnProperty("innerError") == true) {
                    innerError = error["innerError"];
                }

                return new HttpErrorResponse(code, message, target, attributes, innerError);
            }
        }
        
        return null;
    }

    /**
     * @name GetHttpErrorResponseAttributeValue
     * @desc Gets the value of the specified {@link HttpErrorResponse} attribute.
     * 
     * @param httpErrorResponse - The {@link HttpErrorResponse} to retrieve the attribute from.
     * @param attributeName - The name of the attribute to retrieve.
     * @returns The value of the attribute, or a blank string if no attribute with that name exists.
     */
    protected GetHttpErrorResponseAttributeValue(httpErrorResponse: HttpErrorResponse, attributeName: string) : string {

        for (let i: number = 0; i < httpErrorResponse.Attributes.length; i++) {
            if (httpErrorResponse.Attributes[i].Name === attributeName) {
                return httpErrorResponse.Attributes[i].Value;
            }
        }

        return "";
    }

    // #endregion
}