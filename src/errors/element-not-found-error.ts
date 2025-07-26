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

import { NotFoundError } from './not-found-error';

/**
 * @name ElementNotFoundError
 * @desc The error that is thrown when a element was not found in an AccessManager instance.
 */
export class ElementNotFoundError extends NotFoundError {

    /** The type of the element. */
    protected elementType: string;

    /**
     * @returns - The type of the element.
     */
    get ElementType(): string {

        return this.elementType;
    }

    /**
     * @returns - The value of the element.
     */
    get ElementValue(): string {

        return this.resourceId;
    }

    /**
     * @desc Creates an ElementNotFoundError.
     * 
     * @param message - Details of the error.
     * @param elementType - The type of the element.
     * @param elementValue - The value of the element.
     */
    constructor(message: string, elementType: string, elementValue: string) {
        super(message, elementValue);

        this.elementType = elementType;
    }
}