import { } from 'reflect-metadata';
import { IJsonMetaData, JsonProperty, getClazz, getJsonProperty } from './jsonmappermetadata';

const jsonMetadataKey = 'jsonProperty';

export default class MapUtils {
    static isPrimitive(obj) {
        switch (typeof obj) {
            case 'string':
            case 'number':
            case 'boolean':
                return true;
        }
        return !!(obj instanceof String || obj === String ||
            obj instanceof Number || obj === Number ||
            obj instanceof Boolean || obj === Boolean);
    }


    static isArray(object) {
        if (object === Array) {
            return true;
        } else if (typeof Array.isArray === 'function') {
            return Array.isArray(object);
        } else {
            return !!(object instanceof Array);
        }

    }

    static deserialize<T>(clazz: { new (): T }, jsonObject) {
        // tslint:disable-next-line:curly
        if ((clazz === undefined) || (jsonObject === undefined)) return undefined;
        const obj = new clazz();
        Object.keys(obj).forEach((key) => {
            const propertyMetadataFn: (IJsonMetaData) => any = (propertyMetadata) => {
                const propertyName = propertyMetadata.name || key;
                const innerJson = jsonObject ? jsonObject[propertyName] : undefined;
                // tslint:disable-next-line:no-shadowed-variable
                const clazz = getClazz(obj, key);
                if (MapUtils.isArray(clazz)) {
                    const metadata = getJsonProperty(obj, key);
                    if (metadata.clazz || MapUtils.isPrimitive(clazz)) {
                        if (innerJson && MapUtils.isArray(innerJson)) {
                            return innerJson.map(
                                (item) => MapUtils.deserialize(metadata.clazz, item)
                            );
                        } else {
                            return undefined;
                        }
                    } else {
                        return innerJson;
                    }

                } else if (!MapUtils.isPrimitive(clazz)) {
                    return MapUtils.deserialize(clazz, innerJson);
                } else {
                    return jsonObject ? jsonObject[propertyName] : undefined;
                }
            };

            const propertyMetadata = getJsonProperty(obj, key);
            if (propertyMetadata) {
                obj[key] = propertyMetadataFn(propertyMetadata);
            } else {
                if (jsonObject && jsonObject[key] !== undefined) {
                    obj[key] = jsonObject[key];
                }
            }
        });
        return obj;
    }

    static getClazz(target: any, propertyKey: string): any {
        return Reflect.getMetadata('design:type', target, propertyKey);
    }

    static getJsonProperty<T>(target: any, propertyKey: string): IJsonMetaData<T> {
        return Reflect.getMetadata(jsonMetadataKey, target, propertyKey);
    }
}
