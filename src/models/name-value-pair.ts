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
 * @name NameValuePair
 * @desc Container class holding a name and value pair.
 */
export class NameValuePair {

    /** The name. */
    protected name: string;
    /** The value. */
    protected value: string;

    /**
     * @returns The name.
     */
    get Name(): string {

        return this.name;
    }

    /**
     * @returns The value.
     */
    get Value(): string {

        return this.value;
    }

    /**
     * @desc Creates a NameValuePair.
     * 
     * @param name - The name.
     * @param value - The value.
     */
    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}