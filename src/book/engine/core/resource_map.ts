/*
 * File: resource_map.js
 *  
 * base module for managing storage and synchronization of all resources
 * 
 */


class MapEntry {
  mRefCount: number;

  constructor(public mData: any) {
    this.mRefCount = 1;
  }
  decRef() { this.mRefCount--; }
  incRef() { this.mRefCount++; }

  set(data: any) { this.mData = data; }
  data() { return this.mData; }

  canRemove() { return (this.mRefCount == 0); }
}

let mMap = new Map();
let mOutstandingPromises: Promise<any>[] = [];

function has(path: string) { return mMap.has(path) }

function set(key: string, value: any) {
  mMap.get(key).set(value);
}

function loadRequested(path: string) {
  mMap.set(path, new MapEntry(null));
}

function incRef(path: string) {
  mMap.get(path).incRef();
}


// returns the resource of path. An error to if path is not found
function get(path: string) {
  if (!has(path)) {
    throw new Error("Error [" + path + "]: not loaded");
  }
  return mMap.get(path).data();
}

// generic loading function, 
//   Step 1: fetch from server
//   Step 2: decodeResource on the loaded package
//   Step 3: parseResource on the decodedResource
//   Step 4: store result into the map
// Push the promised operation into an array
function loadDecodeParse(path: string, decodeResource: any, parseResource: any) {
  let fetchPromise = null;
  if (!has(path)) {
    loadRequested(path);
    fetchPromise = fetch(path)
      .then(res => decodeResource(res))
      .then(data => parseResource(data))
      .then(data => { return set(path, data) })
      .catch(err => { throw err });
    pushPromise(fetchPromise);
  } else {
    incRef(path);  // increase reference count
  }
  return fetchPromise;
}

// returns true if unload is successful
function unload(path: string) {
  let entry = mMap.get(path);
  entry.decRef();
  if (entry.canRemove())
    mMap.delete(path)
  return entry.canRemove();
}

function pushPromise(p: Promise<any>) { mOutstandingPromises.push(p); }

// will block, wait for all outstanding promises complete
// before continue
async function waitOnPromises() {
  await Promise.all(mOutstandingPromises);
  mOutstandingPromises = []; // remove all
}

export { has, get, set, loadRequested, incRef, loadDecodeParse, unload, pushPromise, waitOnPromises }