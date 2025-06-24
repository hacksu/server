import { existsSync } from 'fs';
import { __defaultScript, __script } from './config';
export * from './config';

if (existsSync(__script)) {
    require(__script);
} else {
    require(__defaultScript);
}

