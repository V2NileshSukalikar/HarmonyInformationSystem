import { GlobalDataBO } from './GlobalDataBO';
import { FrequentDataBO } from './FrequentDataBO';
import { SpecificDataBO } from './SpecificDataBO';
import { IJsonMetaData, JsonProperty, getClazz, getJsonProperty } from '../utils/jsonmappermetadata';

export class SiteDataBO {
    g: GlobalDataBO;
    @JsonProperty({ clazz: FrequentDataBO })
    f: FrequentDataBO[];
    s: SpecificDataBO;
}

