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
 * @name EntityTypeAndEntity
 * @desc Container class holding an entity type and entity of that type.
 */
export class EntityTypeAndEntity {

    /** The type of the entity. */
    protected entityType: string;
    /** The entity. */
    protected entity: string;

    /**
     * @returns - The type of the entity.
     */
    get EntityType(): string {

        return this.entityType;
    }

    /**
     * @returns - The entity.
     */
    get Entity(): string {

        return this.entity;
    }

    /**
     * @desc Creates an EntityTypeAndEntity.
     * 
     * @param entityType - The type of the entity.
     * @param entity - The entity.
     */
    constructor(entityType: string, entity: string) {

        this.entityType = entityType;
        this.entity = entity;
    }
}