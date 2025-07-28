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

import { StringUniqueStringifier } from '../src/string-unique-stringifier';
import { IAxiosShim } from '../src/iaxios-shim';
import { AccessManagerClient } from '../src/access-manager-client';

/**
 * @desc Unit tests for the AccessManagerClient class.
 */
describe("AccessManagerClient Tests", () => {
    let userStringifier: CallCountingStringUniqueStringifier;
    let groupStringifier: CallCountingStringUniqueStringifier;
    let componentStringifier: CallCountingStringUniqueStringifier;
    let accessStringifier: CallCountingStringUniqueStringifier;
    let testClient: AccessManagerClient<String, String, String, String>;

    beforeEach(() => {
        userStringifier = new CallCountingStringUniqueStringifier;
        groupStringifier = new CallCountingStringUniqueStringifier;
        componentStringifier = new CallCountingStringUniqueStringifier;
        accessStringifier = new CallCountingStringUniqueStringifier;
        testClient = new AccessManagerClient(
            new URL("http://127.0.0.1:5170/"), 
            userStringifier, 
            groupStringifier, 
            componentStringifier, 
            accessStringifier
        );

            
        afterEach(() => { 
        });



    });

});

/**
 * @name CallCountingStringUniqueStringifier
 * @desc Subclass of {@link StringUniqueStringifier} which counts the number of calls to its public methods.
 */
export class CallCountingStringUniqueStringifier extends StringUniqueStringifier {

    /** The number of times the ToString() method has been called. */
    protected toStringCount: number;
    /** The number of times the FromString() method has been called. */
    protected fromStringCount: number;

    /**
     * @returns The number of times the ToString() method has been called.
     */
    get ToStringCount(): number {

        return this.toStringCount;
    }

    /**
     * @returns The number of times the FromString() method has been called.
     */
    get FromStringCount(): number {

        return this.fromStringCount;
    }

    /** @inheritdoc */
    public override ToString(inputObject: string): string {
        
        this.toStringCount++;
        return super.ToString(inputObject);
    }

    /** @inheritdoc */
    public override FromString(stringifiedObject: string): string {
        
        this.fromStringCount++;
        return super.FromString(stringifiedObject);
    }
}