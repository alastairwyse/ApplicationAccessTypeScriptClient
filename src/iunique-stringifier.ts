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
 * @name IUniqueStringifier
 * @desc Defines methods for converting objects of a specified type to and from strings which uniquely identify the object.
 * 
 * @template T - The type of objects to convert.
 */
export interface IUniqueStringifier<T> {

    /**
     * @name ToString
     * @desc Converts an object into a string which uniquely identifies that object.
     * 
     * @param inputObject - The object to convert.
     * @returns A string which uniquely identifies that object.
     */
    ToString(inputObject: T) : string;

    /**
     * @name FromString
     * @desc Converts a string which uniquely identifies an object into the object.
     * 
     * @param stringifiedObject - The string representing the object.
     * @returns The object.
     */
    FromString(stringifiedObject: string) : T;
}
