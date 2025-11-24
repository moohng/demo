#!/usr/bin/env bun

import * as path from 'path';
import { fileTypeFromFile } from 'file-type';

const imgPath = path.resolve(process.argv[2]!);
const fileType = await fileTypeFromFile(imgPath);

console.log('图片类型:', fileType);
