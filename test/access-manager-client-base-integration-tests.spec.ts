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

import { ElementNotFoundError } from '../src/errors/element-not-found-error';
import { StringUniqueStringifier } from '../src/string-unique-stringifier';
import { IAxiosShim } from '../src/iaxios-shim';
import { AccessManagerClientBaseWithProtectedMethods } from './access-manager-client-base-tests.spec';

/**
 * @desc Integration tests for the Buffer class.
 */
describe("AccessManagerClientBase Tests", () => {
    let baseUrl: URL;
    let mockAxiosShim: IAxiosShim; 
    let testClientBase: AccessManagerClientBaseWithProtectedMethods<String, String, String, String>;

    beforeEach(() => {
        baseUrl = new URL("http://192.168.0.253:5000/");
        mockAxiosShim = <IAxiosShim><unknown>jest.mock("../src/iaxios-shim");
        testClientBase = new AccessManagerClientBaseWithProtectedMethods(
            baseUrl,
            new StringUniqueStringifier(), 
            new StringUniqueStringifier(), 
            new StringUniqueStringifier(), 
            new StringUniqueStringifier()
        );
    });

    afterEach(() => { 
    });

    it("SendGetRequestAsync(): IllegalArgumentException.", async() => {

        let testUrl = new URL(baseUrl.href += "api/v1/userToGroupMappings/user/user1?includeIndirectMappings=");
        let exceptionCaught: boolean = false;

        try {
            await testClientBase.SendGetRequestAsync(testUrl);

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toBe(`Failed to call URL '${testUrl.href}' with 'Get' method.  Received non-succces HTTP response status 400, error code 'BadRequest', and error message 'One or more validation errors occurred.'.`);
        }
        expect(exceptionCaught).toBe(true); 
    });

    it("SendGetRequestAsync(): ElementNotFoundException.", async() => {

        let testUrl = new URL(baseUrl.href += "api/v1/userToGroupMappings/user/invalid?includeIndirectMappings=false");
        let exceptionCaught: boolean = false;

        try {
            await testClientBase.SendGetRequestAsync(testUrl);

        }
        catch (e: any) {
            exceptionCaught = true;
            expect(e).toBeInstanceOf(ElementNotFoundError);
            expect(e.message).toBe(`User 'invalid' does not exist. (Parameter 'user')`);
        }
        expect(exceptionCaught).toBe(true); 
    });
});