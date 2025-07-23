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
 * @name ApplicationComponentAndAccessLevel
 * @desc Container class holding an application component and level of access.
 * 
 * @template TComponent - The type of components in the application to manage access to.
 * @template TAccess - The type of levels of access which can be assigned to an application component.
 */
export class ApplicationComponentAndAccessLevel<TComponent, TAccess> {

    /** The application component. */
    protected applicationComponent: TComponent;
    /** The level of access to the application component. */
    protected accessLevel: TAccess;

    /**
     * @returns The application component.
     */
    get ApplicationComponent(): TComponent {

        return this.applicationComponent;
    }

    /**
     * @returns - The level of access to the application component.
     */
    get AccessLevel(): TAccess {

        return this.accessLevel;
    }

    /**
     * @desc Creates an ApplicationComponentAndAccessLevel.
     * 
     * @param applicationComponent - The application component.
     * @param accessLevel - The level of access to the application component.
     */
    constructor(applicationComponent: TComponent, accessLevel: TAccess) {

        this.applicationComponent = applicationComponent;
        this.accessLevel = accessLevel;
    }
}