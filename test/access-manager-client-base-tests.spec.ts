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

import { HttpErrorResponse } from '../src/models/http-error-response';
import { AccessManagerClientBase } from '../src/access-manager-client-base';
import { describe } from '@jest/globals';

/**
 * @desc Unit tests for the Buffer class.
 */
describe("AccessManagerClientBase Tests", () => {
    let testClientBase: AccessManagerClientBaseWithProtectedMethods<String, String, String, String>;

    beforeEach(() => {
        testClientBase = new AccessManagerClientBaseWithProtectedMethods();
    });

    afterEach(() => { 
    });

    it("SendGetRequestAsync(): Success test.", async() => {
        
        //await testClientBase.SendGetRequestAsync(new URL("http://192.168.0.253:5000/api/v1/groups"));

        let testUrl: URL = new URL("http://192.168.9.1");
        testUrl.pathname += "api/v1/";
        console.log(testUrl.href);
        //let testUrl: URL = new URL("junk");
    });

    it("DeserializeResponseDataToHttpErrorResponse(): Success test.", done => {
        
        let notJsonResponseData: string = "not JSON";

        let result: HttpErrorResponse | null = testClientBase.DeserializeResponseDataToHttpErrorResponse(notJsonResponseData);

        expect(result).toBe(null);


        let code = "GroupNotFoundException";
        let nonHttpErrorResponseResponseData: object = { "code": "GroupNotFoundException" };

        result = testClientBase.DeserializeResponseDataToHttpErrorResponse(nonHttpErrorResponseResponseData);

        expect(result).toBe(null);


        let message = "Group 'asda' does not exist. (Parameter 'group')";
        let minimalHttpErrorResponseResponseData: object = { 
            "code": code,
            "message": message
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
            "code": code,
            "message": message, 
            "target": target, 
            "attributes": attributes, 
            "innerError": innerError
        };

        result = testClientBase.DeserializeResponseDataToHttpErrorResponse(fullHttpErrorResponseResponseData);

        expect(result?.Code).toBe(code);
        expect(result?.Message).toBe(message);
        expect(result?.Target).toBe(target);
        expect(result?.Attributes).toBe(attributes);
        expect(result?.InnerError).toBe(innerError);

        
        done();
    });

});

/**
 * @name AccessManagerClientBaseWithProtectedMethods
 * @desc Version of the AccessManagerClientBase class where protected members are exposed as public so that they can be unit tested.
 */
class AccessManagerClientBaseWithProtectedMethods<TUser, TGroup, TComponent, TAccess> extends AccessManagerClientBase<TUser, TGroup, TComponent, TAccess> {

    public async SendGetRequestAsync<T>(requestUrl: URL) : Promise<T> {

        return await super.SendGetRequestAsync(requestUrl);
    }

    public DeserializeResponseDataToHttpErrorResponse(responseData: any) : HttpErrorResponse | null {

        return super.DeserializeResponseDataToHttpErrorResponse(responseData);
    }
}
