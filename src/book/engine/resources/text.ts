/*
 * File: text.js
 *
 * logics for loading a text file into the resource_map
 */

import * as map from "../core/resource_map.js";

// functions from resource_map
let unload = map.unload;
let has = map.has;
let get = map.get;

function decodeText(data: any) {
  console.log(data)
  return data.text();
}

function parseText(text: string) {
  return text;
}

function load(path: string) {
  return map.loadDecodeParse(path, decodeText, parseText);
}

export { has, get, load, unload }