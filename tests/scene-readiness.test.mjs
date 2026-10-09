import test from 'node:test';
import assert from 'node:assert/strict';
import {waitForSceneImages} from '../src/sceneReadiness.ts';

test('reveals when critical images finish, even if one image fails', async()=>{
 let count=0;
 const cancel=waitForSceneImages([Promise.resolve(),Promise.reject(new Error('image failed'))],()=>count++,1000);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(count,1);
 cancel();
});

test('a hanging download cannot keep the room covered indefinitely', async()=>{
 let finishImage,count=0;
 const slow=new Promise(resolve=>{finishImage=resolve});
 await new Promise(resolve=>waitForSceneImages([slow],()=>{count++;resolve()},10));
 finishImage();
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(count,1,'late completion must not reveal twice');
});

test('switching views cancels both timeout and pending image completion', async()=>{
 let finishImage,count=0;
 const slow=new Promise(resolve=>{finishImage=resolve});
 const cancel=waitForSceneImages([slow],()=>count++,10);
 cancel();finishImage();
 await new Promise(resolve=>setTimeout(resolve,25));
 assert.equal(count,0);
});

test('a room without raster images reveals immediately', async()=>{
 let count=0;
 const cancel=waitForSceneImages([],()=>count++,1000);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(count,1);cancel();
});
