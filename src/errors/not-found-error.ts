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

/**
 * @name NotFoundError
 * @desc The error that is thrown when a resource doesn't exist or could not be found.
 */
export class NotFoundError extends Error {

    /** A unique identifier for the resource. */
    protected resourceId: string;

    /**
     * @returns - A unique identifier for the resource.
     */
    get ResourceId(): string {

        return this.resourceId;
    }

    /**
     * @desc Creates a NotFoundError.
     * 
     * @param message - Details of the error.
     * @param resourceId - A unique identifier for the resource.
     */
    constructor(message: string, resourceId: string) {
        super(message);
    }
}