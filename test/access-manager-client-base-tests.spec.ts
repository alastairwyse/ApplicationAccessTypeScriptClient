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

import { HttpRequestMethod } from '../src/http-request-method';
import { HttpErrorResponse } from '../src/models/http-error-response';
import { NotFoundError } from '../src/errors/not-found-error';
import { ElementNotFoundError } from '../src/errors/element-not-found-error';
import { StringUniqueStringifier } from '../src/string-unique-stringifier';
import { IAxiosShim } from '../src/iaxios-shim';
import { AccessManagerClientBase } from '../src/access-manager-client-base';
import { AxiosResponse, AxiosHeaders, AxiosError } from 'axios';
import { describe } from '@jest/globals';

/**
 * @desc Unit tests for the AccessManagerClientBase class.
 */
describe("AccessManagerClientBase Tests", () => {
    let mockAxiosShim: IAxiosShim; 
    let mockAxiosShimGetMethod: any;
    let mockAxiosShimPostMethod: any;
    let mockAxiosShimDeleteMethod: any;
    let testClientBase: AccessManagerClientBaseWithProtectedMethods<String, String, String, String>;


    beforeEach(() => {
        mockAxiosShim = <IAxiosShim><unknown>jest.mock("../src/iaxios-shim");
        mockAxiosShim.get = jest.fn();
        mockAxiosShimGetMethod = mockAxiosShim.get;
        mockAxiosShim.post = jest.fn();
        mockAxiosShimPostMethod = mockAxiosShim.post;
        mockAxiosShim.delete = jest.fn();
        mockAxiosShimDeleteMethod = mockAxiosShim.delete;
        testClientBase = new AccessManagerClientBaseWithProtectedMethods(
            new URL("http://127.0.0.1:5170/"), 
            new StringUniqueStringifier(), 
            new StringUniqueStringifier(), 
            new StringUniqueStringifier(), 
            new StringUniqueStringifier(), 
            new Object(), 
            mockAxiosShim
        );
    });


    afterEach(() => { 
    });


    it("SendGetRequestAsync(): UserNotFoundException exception.", async() => {
        
        let responseData: AxiosResponse<unknown, any> = {
            data: {
                error: {
                    code: 'UserNotFoundException',
                    message: "User 'sdf' does not exist. (Parameter 'user')",
                    target: 'ThrowUserDoesntExistException',
                    attributes: [       
                        {
                            name: "ParameterName",
                            value: "user"
                        },
                        {
                            name: "User",
                            value: "sdf"
                        }
                    ]
                }
            },
            status: 404, 
            statusText: "Not Found",
            headers: new AxiosHeaders(), 
            config: { 
                headers: new AxiosHeaders()
            }
        };
        let axiosError = new AxiosError("Request failed with status code 404", "ERR_BAD_REQUEST");
        axiosError.response = responseData;
        axiosError.status = 404;
        mockAxiosShimGetMethod.mockImplementation(() => {
            throw axiosError;
        });
        let exceptionCaught: boolean = false;

        try {
            await testClientBase.SendGetRequestAsync(new URL("http://127.0.0.1:5000/api/v1/userToGroupMappings/user/sdf?includeIndirectMappings=true"));

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(ElementNotFoundError);
            expect(e.message).toBe("User 'sdf' does not exist. (Parameter 'user')");
        }
        expect(exceptionCaught).toBe(true); 
    });


    it("SendGetRequestAsync(): Success test.", async() => {

        let responseData: AxiosResponse<unknown, any> = {
            data: [
                { user: "user1", group: "group1" },
                { user: "user1", group: "group3" }
            ],
            status: 200, 
            statusText: "OK",
            headers: new AxiosHeaders(), 
            config: { 
                headers: new AxiosHeaders()
            }
        };
        mockAxiosShimGetMethod.mockReturnValueOnce(responseData);
        
        let result: any = await testClientBase.SendGetRequestAsync(new URL("http://127.0.0.1:5000/api/v1/userToGroupMappings/user/user1?includeIndirectMappings=true"));

        expect(result).toHaveLength(2);
        expect(result[0].user).toEqual("user1");
        expect(result[0].group).toEqual("group1");
        expect(result[1].user).toEqual("user1");
        expect(result[1].group).toEqual("group3");
    });


    it("SendGetRequestForContainsMethodAsync(): ServiceUnavailableException exception.", async() => {
        
        let responseData: AxiosResponse<unknown, any> = {
            data: {
                error: {
                    code: "ServiceUnavailableException",
                    message: "The service is unavailable due to an interal error.",
                    target: "MoveNext"
                }
            },
            status: 503, 
            statusText: "Service Unavailable",
            headers: new AxiosHeaders(), 
            config: { 
                headers: new AxiosHeaders()
            }
        };
        let axiosError = new AxiosError("Request failed with status code 503", "ERR_SERVICE_UNAVAILABLE");
        axiosError.response = responseData;
        axiosError.status = 503;
        mockAxiosShimGetMethod.mockImplementation(() => {
            throw axiosError;
        });
        let exceptionCaught: boolean = false;

        try {
            await testClientBase.SendGetRequestForContainsMethodAsync(new URL("http://127.0.0.1:5000/api/v1/users/user1"));

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Failed to call URL 'http://127.0.0.1:5000/api/v1/users/user1' with 'Get' method.  Received non-succces HTTP response status 503, error code 'ServiceUnavailableException', and error message 'The service is unavailable due to an interal error.'.");
        }
        expect(exceptionCaught).toBe(true); 
    });


    it("SendGetRequestForContainsMethodAsync(): False result.", async() => {
        
        let responseData: AxiosResponse<unknown, any> = {
            data: {
                error: {
                    code: "NotFoundException",
                    message: "User 'userx' does not exist.",
                    target: "ContainsUser",
                    attributes: [
                        {
                            name: "ResourceId",
                            value: "userx"
                        }
                    ]
                }
            },
            status: 404, 
            statusText: "Service Unavailable",
            headers: new AxiosHeaders(), 
            config: { 
                headers: new AxiosHeaders()
            }
        };
        let axiosError = new AxiosError("Request failed with status code 404", "ERR_NOT_FOUND");
        axiosError.response = responseData;
        axiosError.status = 404;
        mockAxiosShimGetMethod.mockImplementation(() => {
            throw axiosError;
        });

        let result: boolean = await testClientBase.SendGetRequestForContainsMethodAsync(new URL("http://127.0.0.1:5000/api/v1/users/userx"));

        expect(result).toBe(false); 
    });


    it("SendGetRequestForContainsMethodAsync(): False true.", async() => {
        
        let responseData: AxiosResponse<unknown, any> = {
            data: "user1",
            status: 200, 
            statusText: "OK",
            headers: new AxiosHeaders(), 
            config: { 
                headers: new AxiosHeaders()
            }
        };
        mockAxiosShimGetMethod.mockReturnValueOnce(responseData);

        let result: boolean = await testClientBase.SendGetRequestForContainsMethodAsync(new URL("http://127.0.0.1:5000/api/v1/users/user1"));

        expect(result).toBe(true); 
    });


    it("SendPostRequestAsync(): ServiceUnavailableException exception.", async() => {
        
        let responseData: AxiosResponse<unknown, any> = {
            data: {
                error: {
                    code: "ServiceUnavailableException",
                    message: "The service is unavailable due to an interal error.",
                    target: "MoveNext"
                }
            },
            status: 503, 
            statusText: "Service Unavailable",
            headers: new AxiosHeaders(), 
            config: { 
                headers: new AxiosHeaders()
            }
        };
        let axiosError = new AxiosError("Request failed with status code 503", "ERR_SERVICE_UNAVAILABLE");
        axiosError.response = responseData;
        axiosError.status = 503;
        mockAxiosShimPostMethod.mockImplementation(() => {
            throw axiosError;
        });
        let exceptionCaught: boolean = false;

        try {
            await testClientBase.SendPostRequestAsync(new URL("http://127.0.0.1:5000/api/v1/users/user1"));

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Failed to call URL 'http://127.0.0.1:5000/api/v1/users/user1' with 'Post' method.  Received non-succces HTTP response status 503, error code 'ServiceUnavailableException', and error message 'The service is unavailable due to an interal error.'.");
        }
        expect(exceptionCaught).toBe(true); 
    });


    it("SendPostRequestAsync(): Non 201 response.", async() => {
        
        let responseData: AxiosResponse<unknown, any> = {
            data: null,
            status: 200, 
            statusText: "OK",
            headers: new AxiosHeaders(), 
            config: { 
                headers: new AxiosHeaders()
            }
        };
        mockAxiosShimPostMethod.mockReturnValueOnce(responseData);
        let exceptionCaught: boolean = false;

        try {
            await testClientBase.SendPostRequestAsync(new URL("http://127.0.0.1:5000/api/v1/users/user1"));

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Failed to call URL 'http://127.0.0.1:5000/api/v1/users/user1' with 'Post' method.  Received non-succces HTTP response status 200.");
        }
        expect(exceptionCaught).toBe(true); 
    });


    it("SendPostRequestAsync(): Success test.", async() => {
        
        let responseData: AxiosResponse<unknown, any> = {
            data: null,
            status: 201, 
            statusText: "OK",
            headers: new AxiosHeaders(), 
            config: { 
                headers: new AxiosHeaders()
            }
        };
        mockAxiosShimPostMethod.mockReturnValueOnce(responseData);

        await testClientBase.SendPostRequestAsync(new URL("http://127.0.0.1:5000/api/v1/users/user1"));

        expect(mockAxiosShimPostMethod.mock.calls[0][0]).toBe("http://127.0.0.1:5000/api/v1/users/user1");
    });


    it("SendDeleteRequestAsync(): ServiceUnavailableException exception.", async() => {
        
        let responseData: AxiosResponse<unknown, any> = {
            data: {
                error: {
                    code: "ServiceUnavailableException",
                    message: "The service is unavailable due to an interal error.",
                    target: "MoveNext"
                }
            },
            status: 503, 
            statusText: "Service Unavailable",
            headers: new AxiosHeaders(), 
            config: { 
                headers: new AxiosHeaders()
            }
        };
        let axiosError = new AxiosError("Request failed with status code 503", "ERR_SERVICE_UNAVAILABLE");
        axiosError.response = responseData;
        axiosError.status = 503;
        mockAxiosShimDeleteMethod.mockImplementation(() => {
            throw axiosError;
        });
        let exceptionCaught: boolean = false;

        try {
            await testClientBase.SendDeleteRequestAsync(new URL("http://127.0.0.1:5000/api/v1/users/user1"));

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Failed to call URL 'http://127.0.0.1:5000/api/v1/users/user1' with 'Delete' method.  Received non-succces HTTP response status 503, error code 'ServiceUnavailableException', and error message 'The service is unavailable due to an interal error.'.");
        }
        expect(exceptionCaught).toBe(true); 
    });


    it("SendDeleteRequestAsync(): ServiceUnavailableException exception.", async() => {
        
        let responseData: AxiosResponse<unknown, any> = {
            data: {
                error: {
                    code: "ServiceUnavailableException",
                    message: "The service is unavailable due to an interal error.",
                    target: "MoveNext"
                }
            },
            status: 503, 
            statusText: "Service Unavailable",
            headers: new AxiosHeaders(), 
            config: { 
                headers: new AxiosHeaders()
            }
        };
        let axiosError = new AxiosError("Request failed with status code 503", "ERR_SERVICE_UNAVAILABLE");
        axiosError.response = responseData;
        axiosError.status = 503;
        mockAxiosShimDeleteMethod.mockImplementation(() => {
            throw axiosError;
        });
        let exceptionCaught: boolean = false;

        try {
            await testClientBase.SendDeleteRequestAsync(new URL("http://127.0.0.1:5000/api/v1/users/user1"));

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Failed to call URL 'http://127.0.0.1:5000/api/v1/users/user1' with 'Delete' method.  Received non-succces HTTP response status 503, error code 'ServiceUnavailableException', and error message 'The service is unavailable due to an interal error.'.");
        }
        expect(exceptionCaught).toBe(true); 
    });


    it("SendDeleteRequestAsync(): Non 200 response.", async() => {
        
        let responseData: AxiosResponse<unknown, any> = {
            data: null,
            status: 201, 
            statusText: "OK",
            headers: new AxiosHeaders(), 
            config: { 
                headers: new AxiosHeaders()
            }
        };
        mockAxiosShimDeleteMethod.mockReturnValueOnce(responseData);
        let exceptionCaught: boolean = false;

        try {
            await testClientBase.SendDeleteRequestAsync(new URL("http://127.0.0.1:5000/api/v1/users/user1"));

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Failed to call URL 'http://127.0.0.1:5000/api/v1/users/user1' with 'Delete' method.  Received non-succces HTTP response status 201.");
        }
        expect(exceptionCaught).toBe(true); 
    });


    it("HandleNonSuccessResponseStatus(): UserNotFoundException.", done => {
        
        let url = new URL("http://127.0.0.1:5000/api/v1/userToGroupMappings/user/sdf?includeIndirectMappings=true");
        let responseData: object = {
            error: {
                code: 'UserNotFoundException',
                message: "User 'sdf' does not exist. (Parameter 'user')",
                target: 'ThrowUserDoesntExistException',
                attributes: [    
                    {
                        name: "ParameterName",
                        value: "user"
                    },
                    {
                        name: "User",
                        value: "sdf"
                    }
                ]
            }
        }
        let exceptionCaught: boolean = false;
        
        try {
            testClientBase.HandleNonSuccessResponseStatus(HttpRequestMethod.Get, url, 404, responseData);

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(ElementNotFoundError);
            expect(e.message).toBe("User 'sdf' does not exist. (Parameter 'user')");
            expect(e.ResourceId).toEqual("sdf");
            expect(e.ElementType).toEqual("User");
        }
        expect(exceptionCaught).toBe(true); 

        done();
    });


    it("HandleNonSuccessResponseStatus(): GroupNotFoundException.", done => {
        
        let url = new URL("http://127.0.0.1:5000/api/v1/groupToGroupMappings/group/abc?includeIndirectMappings=false");
        let responseData: object = {
            error: {
                code: 'GroupNotFoundException',
                message: "Group 'abc' does not exist. (Parameter 'group')",
                target: "ThrowGroupDoesntExistException",
                attributes: [
                    {
                        "name": "ParameterName",
                        "value": "group"
                    },
                    {
                        "name": "Group",
                        "value": "abc"
                    }
                ]
            }
        }
        let exceptionCaught: boolean = false;
        
        try {
            testClientBase.HandleNonSuccessResponseStatus(HttpRequestMethod.Get, url, 404, responseData);

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(ElementNotFoundError);
            expect(e.message).toBe("Group 'abc' does not exist. (Parameter 'group')");
            expect(e.ResourceId).toEqual("abc");
            expect(e.ElementType).toEqual("Group");
        }
        expect(exceptionCaught).toBe(true); 

        done();
    });


    it("HandleNonSuccessResponseStatus(): EntityTypeNotFoundException.", done => {
        
        let url = new URL("http://127.0.0.1:5000/api/v1/entityTypes/dfg/entities");
        let responseData: object = {
            error: {
                code: "EntityTypeNotFoundException",
                message: "Entity type 'dfg' does not exist. (Parameter 'entityType')",
                target: "ThrowEntityTypeDoesntExistException",
                attributes: [
                    {
                        "name": "ParameterName",
                        "value": "entityType"
                    },
                    {
                        "name": "EntityType",
                        "value": "dfg"
                    }
                ]
            }
        }
        let exceptionCaught: boolean = false;
        
        try {
            testClientBase.HandleNonSuccessResponseStatus(HttpRequestMethod.Get, url, 404, responseData);

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(ElementNotFoundError);
            expect(e.message).toBe("Entity type 'dfg' does not exist. (Parameter 'entityType')");
            expect(e.ResourceId).toEqual("dfg");
            expect(e.ElementType).toEqual("EntityType");
        }
        expect(exceptionCaught).toBe(true); 

        done();
    });


    it("HandleNonSuccessResponseStatus(): EntityNotFoundException.", done => {
        
        let url = new URL("http://127.0.0.1:5000/api/v1/entityTypes/ProductLines/entities/ghjkl");
        let responseData: object = {
            error: {
                code: "EntityNotFoundException",
                message: "Entity 'ghjkl' does not exist. (Parameter 'entity')",
                target: "ThrowEntityDoesntExistException",
                attributes: [
                    {
                        "name": "ParameterName",
                        "value": "entity"
                    },
                    {
                        "name": "EntityType",
                        "value": "ProductLines"
                    },
                    {
                        "name": "Entity",
                        "value": "ghjkl"
                    }
                ]
            }
        }
        let exceptionCaught: boolean = false;
        
        try {
            testClientBase.HandleNonSuccessResponseStatus(HttpRequestMethod.Delete, url, 404, responseData);

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(ElementNotFoundError);
            expect(e.message).toBe("Entity 'ghjkl' does not exist. (Parameter 'entity')");
            expect(e.ResourceId).toEqual("ghjkl");
            expect(e.ElementType).toEqual("Entity");
        }
        expect(exceptionCaught).toBe(true); 

        done();
    });


    it("HandleNonSuccessResponseStatus(): NotFoundException.", done => {
        
        let url = new URL("http://127.0.0.1:5000/api/v1/groups/xyz");
        let responseData: object = {
            error: {
                code: "NotFoundException",
                message: "Group 'xyz' does not exist.",
                target: "ContainsGroup",
                attributes: [
                    {
                        "name": "ResourceId",
                        "value": "xyz"
                    }
                ]
            }
        }
        let exceptionCaught: boolean = false;
        
        try {
            testClientBase.HandleNonSuccessResponseStatus(HttpRequestMethod.Delete, url, 404, responseData);

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(NotFoundError);
            expect(e.message).toBe("Group 'xyz' does not exist.");
            expect(e.ResourceId).toEqual("xyz");
        }
        expect(exceptionCaught).toBe(true); 

        done();
    });


    it("HandleNonSuccessResponseStatus(): ServiceUnavailableException.", done => {
        
        let url = new URL("http://127.0.0.1:5000/api/v1/groups/xyz");
        let responseData: object = {
            error: {
                code: "ServiceUnavailableException",
                message: "The service is unavailable due to an interal error.",
                target: "MoveNext"
            }
        }
        let exceptionCaught: boolean = false;
        
        try {
            testClientBase.HandleNonSuccessResponseStatus(HttpRequestMethod.Get, url, 503, responseData);

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Failed to call URL 'http://127.0.0.1:5000/api/v1/groups/xyz' with 'Get' method.  Received non-succces HTTP response status 503, error code 'ServiceUnavailableException', and error message 'The service is unavailable due to an interal error.'.");
        }
        expect(exceptionCaught).toBe(true); 

        done();
    });


    it("HandleNonSuccessResponseStatus(): String response body.", done => {
        
        let url = new URL("http://127.0.0.1:5000/api/v1/groups/xyz");
        let responseData: string = "Error string";
        let exceptionCaught: boolean = false;
        
        try {
            testClientBase.HandleNonSuccessResponseStatus(HttpRequestMethod.Get, url, 500, responseData);

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Failed to call URL 'http://127.0.0.1:5000/api/v1/groups/xyz' with 'Get' method.  Received non-succces HTTP response status 500, and response body 'Error string'.");
        }
        expect(exceptionCaught).toBe(true); 

        done();
    });

    it("HandleNonSuccessResponseStatus(): Object response body.", done => {
        
        let url = new URL("http://127.0.0.1:5000/api/v1/groups/xyz");
        let responseData: any = { };
        let exceptionCaught: boolean = false;
        
        try {
            testClientBase.HandleNonSuccessResponseStatus(HttpRequestMethod.Get, url, 500, responseData);

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Failed to call URL 'http://127.0.0.1:5000/api/v1/groups/xyz' with 'Get' method.  Received non-succces HTTP response status 500, and response body '{}'.");
        }
        expect(exceptionCaught).toBe(true); 

        done();
    });


    it("HandleNonSuccessResponseStatus(): Empty string response body.", done => {
        
        let url = new URL("http://127.0.0.1:5000/api/v1/groups/xyz");
        let responseData: string = "";
        let exceptionCaught: boolean = false;
        
        try {
            testClientBase.HandleNonSuccessResponseStatus(HttpRequestMethod.Get, url, 500, responseData);

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Failed to call URL 'http://127.0.0.1:5000/api/v1/groups/xyz' with 'Get' method.  Received non-succces HTTP response status 500, and response body ''.");
        }
        expect(exceptionCaught).toBe(true); 

        done();
    });


    it("HandleNonSuccessResponseStatus(): Null response body.", done => {
        
        let url = new URL("http://127.0.0.1:5000/api/v1/groups/xyz");
        let responseData: any = null;
        let exceptionCaught: boolean = false;
        
        try {
            testClientBase.HandleNonSuccessResponseStatus(HttpRequestMethod.Get, url, 500, responseData);

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe("Failed to call URL 'http://127.0.0.1:5000/api/v1/groups/xyz' with 'Get' method.  Received non-succces HTTP response status 500.");
        }
        expect(exceptionCaught).toBe(true); 

        done();
    });


    it("DeserializeResponseDataToHttpErrorResponse(): Success test.", done => {
        
        let notJsonResponseData: string = "not JSON";

        let result: HttpErrorResponse | null = testClientBase.DeserializeResponseDataToHttpErrorResponse(notJsonResponseData);

        expect(result).toBe(null);


        let code = "GroupNotFoundException";
        let nonHttpErrorResponseResponseData: object = { 
            error: {
                code: "GroupNotFoundException" 
            }
        };

        result = testClientBase.DeserializeResponseDataToHttpErrorResponse(nonHttpErrorResponseResponseData);

        expect(result).toBe(null);


        let message = "Group 'asda' does not exist. (Parameter 'group')";
        let minimalHttpErrorResponseResponseData: object = { 
            error: {
                code: code,
                message: message
            }
        };

        result = testClientBase.DeserializeResponseDataToHttpErrorResponse(minimalHttpErrorResponseResponseData);

        expect(result?.Code).toBe(code);
        expect(result?.Message).toBe(message);


        let target: string = "ThrowGroupDoesntExistException";
        let attributes: object = [
            {
                "name": "ParameterName",
                "value": "group"
            },
            {
                "name": "Group",
                "value": "asda"
            }
        ]
        let innerError: HttpErrorResponse = new HttpErrorResponse("InnerErrorCode", "InnerErrorMessage");
        let fullHttpErrorResponseResponseData: object = { 
            error: {
                code: code,
                message: message, 
                target: target, 
                attributes: attributes, 
                innerError: innerError
            }
        };

        result = testClientBase.DeserializeResponseDataToHttpErrorResponse(fullHttpErrorResponseResponseData);

        expect(result?.Code).toBe(code);
        expect(result?.Message).toBe(message);
        expect(result?.Target).toBe(target);
        expect(result?.Attributes.length).toBe(2);
        expect(result?.Attributes[0].Name).toBe("ParameterName");
        expect(result?.Attributes[0].Value).toBe("group");
        expect(result?.Attributes[1].Name).toBe("Group");
        expect(result?.Attributes[1].Value).toBe("asda");
        expect(result?.InnerError).toBe(innerError);

        
        done();
    });

});

/**
 * @name AccessManagerClientBaseWithProtectedMethods
 * @desc Version of the AccessManagerClientBase class where protected members are exposed as public so that they can be unit tested.
 */
export class AccessManagerClientBaseWithProtectedMethods<TUser, TGroup, TComponent, TAccess> extends AccessManagerClientBase<TUser, TGroup, TComponent, TAccess> {

    public async SendGetRequestAsync(requestUrl: URL) : Promise<any> {

        return await super.SendGetRequestAsync(requestUrl);
    }

    public async SendGetRequestForContainsMethodAsync(requestUrl: URL) : Promise<any> {

        return await super.SendGetRequestForContainsMethodAsync(requestUrl);
    }

    public async SendPostRequestAsync(requestUrl: URL) : Promise<void> {

        await super.SendPostRequestAsync(requestUrl);
    }

    public async SendDeleteRequestAsync(requestUrl: URL) : Promise<void> {

        await super.SendDeleteRequestAsync(requestUrl);
    }

    public HandleNonSuccessResponseStatus(method: HttpRequestMethod, requestUrl: URL, status: number, responseData: any) : void {

        super.HandleNonSuccessResponseStatus(method, requestUrl, status, responseData)
    }

    public DeserializeResponseDataToHttpErrorResponse(responseData: any) : HttpErrorResponse | null {

        return super.DeserializeResponseDataToHttpErrorResponse(responseData);
    }
}
