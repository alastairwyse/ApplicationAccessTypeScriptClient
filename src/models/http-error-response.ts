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

import { NameValuePair } from './name-value-pair';

/**
 * @name HttpErrorResponse
 * @desc Container class holding the data returned from a REST API when an error occurs.
 */
export class HttpErrorResponse {

    /** An internal code representing the error. */
    protected code: string;
    /** A description of the error. */
    protected message: string;
    /** The target of the error. */
    protected target: string | null;
    /** A collection of key/value pairs which give additional details of the error. */
    protected attributes: Array<NameValuePair>;
    /** The error which caused this error. */
    protected innerError: HttpErrorResponse | null;

    /**
     * @returns An internal code representing the error.
     */
    get Code(): string {

        return this.code;
    }

    /**
     * @returns A description of the error.
     */
    get Message(): string {

        return this.message;
    }

    /**
     * @returns The target of the error.
     */
    get Target(): string | null {

        return this.target;
    }

    /**
     * @returns A collection of key/value pairs which give additional details of the error.
     */
    get Attributes(): Array<NameValuePair> {

        return this.attributes;
    }

    /**
     * @returns The error which caused this error.
     */
    get InnerError(): HttpErrorResponse | null {

        return this.innerError;
    }

    /**
     * @desc Creates an HttpErrorResponse.
     * 
     * @param code - An internal code representing the error.
     * @param message - A description of the error.
     * @param target - The (optional) target of the error.
     * @param attributes - A (optional) collection of key/value pairs which give additional details of the error.
     * @param innerError - The (optional) error which caused this error.
     */
    constructor(
        
        code: string, 
        message: string, 
        target: string | null = null, 
        attributes: Array<NameValuePair> = Array<NameValuePair>(), 
        innerError: HttpErrorResponse | null = null, 
    ) {

        this.code = code;
        this.message = message;
        this.target = target;
        this.attributes = attributes;
        this.innerError = innerError;
    }
}