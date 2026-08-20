import { useState, useEffect, useRef } from "react";

const C={navy:"#4E555C",teal:"#7FA5A4",skyblue:"#D7E4E3",white:"#FFFFFF",mid:"#6E9291",light:"#F8F6EE",border:"#D7E4E3",header:"#4E555C"};
const CAT_COLOR={"景點":"#4A86A8","美食":"#C07A3A","咖啡廳":"#8B6B4A","購物":"#A0527A","酒吧":"#7A3A8A","集合點":"#3A8A70","其他":"#6A5A9A","住宿":"#3A6A9A"};
const CAT_BG={"景點":"#E0EEF7","美食":"#F7EEE0","咖啡廳":"#F0E8DC","購物":"#F5E0EC","酒吧":"#F0E0F5","集合點":"#D8F0E8","其他":"#EAE0F5","住宿":"#D8E8F5"};
const CATS=["景點","美食","咖啡廳","購物","酒吧","集合點","其他","住宿"];
const SUB={"景點":["夕陽","日出","海景","夜景"],"美食":["早餐","正餐","小吃","甜點"],"咖啡廳":["網美","景觀","店寵"],"購物":["百貨商場","伴手禮","精品","服飾","化妝品","公仔","選品店"],"酒吧":["紅白酒","調酒","清酒"],"集合點":[],"其他":["行程體驗","高爾夫","按摩","朝聖","醫美"],"住宿":["飯店","民宿","青旅","度假村"]};
const AVATAR_COLORS=["#7FA5A4","#4E555C","#8FADAC","#5C8887","#A3C1BF","#6E9291","#A0527A","#C07A3A","#3A8A70","#6A5A9A","#8B6B4A","#3A6A9A"];
const WEEKDAYS=["日","一","二","三","四","五","六"];
const TRANSIT_COLORS=[{label:"紅",v:"#E53935"},{label:"藍",v:"#1E88E5"},{label:"綠",v:"#43A047"},{label:"黃",v:"#F9A825"},{label:"咖啡",v:"#6D4C41"},{label:"灰",v:"#757575"}];
const CAT_SVG={
  "景點":'<rect x="2" y="6" width="16" height="11" rx="1.5" stroke-width="1.4" fill="none"/><circle cx="10" cy="11.5" r="2.8" stroke-width="1.4" fill="none"/><path d="M6 6V4.5a1 1 0 011-1h2.5v2.5" stroke-width="1.3" fill="none" stroke-linecap="round"/><circle cx="15" cy="9" r="1" fill="currentColor"/>',
  "美食":'<path d="M7 3v6M7 9q0 3 3 3t3-3V3" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M10 12v5" stroke-width="1.5" stroke-linecap="round"/><path d="M14 3v14" stroke-width="1.5" stroke-linecap="round"/>',
  "咖啡廳":'<path d="M4 7h10v7q0 2-2 2H6q-2 0-2-2V7z" stroke-width="1.4" fill="none"/><path d="M14 9.5q2.5 0 2.5 2T14 13.5" stroke-width="1.4" stroke-linecap="round" fill="none"/><path d="M3.5 7h11" stroke-width="1.4"/>',
  "購物":'<path d="M6 5.5h8l1.5 11H4.5z" stroke-width="1.4" stroke-linejoin="round" fill="none"/><path d="M8 5.5Q8 3 10 3t2 2.5" stroke-width="1.3" stroke-linecap="round" fill="none"/><path d="M6.5 9h7" stroke-width="1.2" stroke-linecap="round"/><path d="M7 12.5h6" stroke-width="1.2" stroke-linecap="round"/>',
  "酒吧":'<path d="M7 3h6l-2 6h-2z" stroke-width="1.3" stroke-linejoin="round" fill="none"/><path d="M8 9q-1 2-1 4h6q0-2-1-4" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M6.5 17h7" stroke-width="1.4" stroke-linecap="round"/><path d="M10 13v4" stroke-width="1.3" stroke-linecap="round"/>',
  "集合點":'<path d="M10 3C7.2 3 5 5.2 5 8c0 4 5 9 5 9s5-5 5-9c0-2.8-2.2-5-5-5z" stroke-width="1.4" fill="none"/><circle cx="10" cy="8" r="2" stroke-width="1.3" fill="none"/>',
  "其他":'<ellipse cx="10" cy="10" rx="7" ry="5" stroke-width="1.4" fill="none"/><circle cx="10" cy="10" r="1.2" fill="currentColor"/><path d="M3 10H1M17 10H19M10 5V3M10 17V15" stroke-width="1.3" stroke-linecap="round"/>',
  "住宿":'<path d="M3 10L10 3l7 7" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M5 8.5V17h10V8.5" stroke-width="1.4" stroke-linecap="round" fill="none"/><rect x="7.5" y="12" width="5" height="5" rx="0.5" stroke-width="1.3" fill="none"/>'
};
const UNASSIGNED_TAB = "unassigned";
const TRIPS_INDEX_KEY = "trips_index_v1";
const TRIP_PREFIX = "trip_v1_";

var _uid = Date.now();
function uid() { return String(++_uid); }
function makeSvgIcon(cat, color, size) {
  var p = CAT_SVG[cat] || CAT_SVG["其他"];
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+size+'" height="'+size+'" viewBox="0 0 20 20" stroke="'+color+'" fill="'+color+'" style="display:block;">'+p+'</svg>';
}
// 只用在最顯眼的地方（header 導覽、主要操作按鈕），跟地點分類的 CAT_SVG 是分開的一套，其餘小地方維持用 emoji
var NAV_SVG={
  plane:'<path d="M21,16V14L13,9V3.5C13,2.67 12.33,2 11.5,2C10.67,2 10,2.67 10,3.5V9L2,14V16L10,13.5V19L7.5,20.5V22L11.5,21L15.5,22V20.5L13,19V13.5L21,16Z" stroke="none"/>',
  users:'<circle cx="7" cy="7" r="3" stroke-width="1.3" fill="none"/><path d="M2 17c0-3 2.2-5 5-5s5 2 5 5" stroke-width="1.3" stroke-linecap="round" fill="none"/><circle cx="14.5" cy="8" r="2.3" stroke-width="1.2" fill="none"/><path d="M12.3 17c0-2.5 1.6-4.3 4-4.3" stroke-width="1.2" stroke-linecap="round" fill="none"/>',
  wallet:'<rect x="2" y="5" width="16" height="11" rx="2" stroke-width="1.3" fill="none"/><path d="M2 8.5h16" stroke-width="1.2" fill="none"/><circle cx="14.5" cy="12" r="1.2"/>',
  more:'<circle cx="4" cy="10" r="1.4"/><circle cx="10" cy="10" r="1.4"/><circle cx="16" cy="10" r="1.4"/>',
  bag:'<path d="M5 7h10l1 10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1L5 7z" stroke-width="1.3" stroke-linejoin="round" fill="none"/><path d="M7 7V5.5a3 3 0 0 1 6 0V7" stroke-width="1.3" stroke-linecap="round" fill="none"/>',
  backpack:'<rect x="4" y="6" width="12" height="10.5" rx="1.5" stroke-width="1.3" fill="none"/><path d="M7.5 6V4.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V6" stroke-width="1.2" fill="none"/><path d="M10 6v10.5" stroke-width="1.1"/><circle cx="7" cy="17.3" r="1"/><circle cx="13" cy="17.3" r="1"/>',
  doc:'<path d="M6 2h6l4 4v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke-width="1.3" stroke-linejoin="round" fill="none"/><path d="M12 2v4h4" stroke-width="1.2" stroke-linejoin="round" fill="none"/><path d="M7.5 11h5M7.5 14h5" stroke-width="1.1" stroke-linecap="round"/>',
  map:'<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  pencil:'<path d="M13 3l4 4-9 9-4.5 1 1-4.5z" stroke-width="1.3" stroke-linejoin="round" fill="none"/>',
  clipboard:'<rect x="4" y="4" width="12" height="14" rx="1.5" stroke-width="1.3" fill="none"/><rect x="7" y="2.5" width="6" height="3" rx="1" stroke-width="1.2" fill="none"/>',
  trash:'<path d="M4 6h12M8 6V4.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V6" stroke-width="1.2" stroke-linecap="round" fill="none"/><path d="M5.5 6l1 10.5a1 1 0 0 0 1 .9h5a1 1 0 0 0 1-.9L14.5 6" stroke-width="1.2" stroke-linejoin="round" fill="none"/><path d="M8.3 9v5M11.7 9v5" stroke-width="1.1" stroke-linecap="round"/>',
  pin:'<path d="M10 18s6-5.5 6-10a6 6 0 0 0-12 0c0 4.5 6 10 6 10z" stroke-width="1.3" fill="none"/><circle cx="10" cy="8" r="2" stroke-width="1.2" fill="none"/>'
};
function navIcon(name,color,size){
  var p=NAV_SVG[name];
  if(!p)return "";
  var vb=(name==="plane"||name==="map")?"0 0 24 24":"0 0 20 20"; // 飛機、迴紋針用的是原生 24x24 座標的圖示，其餘維持共用的 20x20
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+size+'" height="'+size+'" viewBox="'+vb+'" stroke="'+color+'" fill="'+color+'" style="display:block;">'+p+'</svg>';
}
function getTimeMode(cat) { if (cat==="住宿") return "checkin"; if (cat==="集合點"||cat==="其他") return "schedule"; return "hours"; }
function timeModeLabel(mode) { if (mode==="checkin") return {a:"Check-in",b:"Check-out"}; if (mode==="schedule") return {single:"行程時間"}; return {single:"營業時間"}; }
function parseGmapCoords(url) {
  var m1=url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/); if (m1) return {lat:m1[1],lng:m1[2]};
  var m2=url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/); if (m2) return {lat:m2[1],lng:m2[2]};
  return null;
}

// ── Google Maps 匯入：CSV / JSON 通用解析 ──
function detectCsvDelimiter(text) {
  var firstLine=(text.split(/\r\n|\r|\n/)[0])||"";
  var candidates=[",",";","\t"];
  var best=",",bestCount=0;
  candidates.forEach(function(d){
    var count=firstLine.split(d).length-1;
    if (count>bestCount) { bestCount=count; best=d; }
  });
  return best;
}
function parseCSVRows(text,delimiter) {
  delimiter=delimiter||",";
  var rows=[],field="",row=[],inQuotes=false,i=0,len=text.length;
  while (i<len) {
    var c=text[i];
    if (inQuotes) {
      if (c==='"') { if (text[i+1]==='"') { field+='"'; i+=2; continue; } inQuotes=false; i++; continue; }
      field+=c; i++; continue;
    } else {
      if (c==='"') { inQuotes=true; i++; continue; }
      if (c===delimiter) { row.push(field); field=""; i++; continue; }
      if (c==='\r') { i++; continue; }
      if (c==='\n') { row.push(field); rows.push(row); row=[]; field=""; i++; continue; }
      field+=c; i++; continue;
    }
  }
  if (field.length||row.length) { row.push(field); rows.push(row); }
  return rows;
}
function csvTextToObjects(text) {
  var clean=text.replace(/^\uFEFF/,"");
  var delim=detectCsvDelimiter(clean);
  var rows=parseCSVRows(clean,delim).filter(function(r){return !(r.length===1&&r[0].trim()==="");});
  if (!rows.length) return [];
  var header=rows[0].map(function(h){return (h||"").trim();});
  var out=[];
  for (var i=1;i<rows.length;i++) {
    var r=rows[i];
    if (r.length===1&&(r[0]||"").trim()==="") continue;
    var obj={};
    for (var j=0;j<header.length;j++) obj[header[j]]=r[j]!==undefined?r[j]:"";
    out.push(obj);
  }
  return out;
}
function pickFieldByAlias(obj,aliases) {
  var keys=Object.keys(obj);
  for (var a=0;a<aliases.length;a++) {
    for (var k=0;k<keys.length;k++) {
      if (keys[k].trim().toLowerCase()===aliases[a]) return obj[keys[k]];
    }
  }
  // 找不到完全相符的欄位名稱時，改用「包含關鍵字」比對，容忍不同擴充功能的欄位命名差異
  for (var a2=0;a2<aliases.length;a2++) {
    for (var k2=0;k2<keys.length;k2++) {
      if (keys[k2].trim().toLowerCase().indexOf(aliases[a2])!==-1) return obj[keys[k2]];
    }
  }
  return null;
}
function collectFieldValues(obj,aliases) {
  var keys=Object.keys(obj);
  var used={},vals=[];
  aliases.forEach(function(al){
    keys.forEach(function(k){
      if (used[k]) return;
      var kk=k.trim().toLowerCase();
      if (kk===al||kk.indexOf(al)!==-1) {
        var v=(obj[k]==null?"":String(obj[k])).trim();
        if (v) { vals.push(v); used[k]=true; }
      }
    });
  });
  return vals;
}
function findEmbeddedMapsUrl(obj) {
  var keys=Object.keys(obj);
  for (var k=0;k<keys.length;k++) {
    var v=obj[keys[k]];
    if (typeof v!=="string") continue;
    if (v.indexOf("google.com/maps")!==-1||v.indexOf("goo.gl/maps")!==-1||v.indexOf("maps.app.goo.gl")!==-1) return v.trim();
  }
  return null;
}
function findEmbeddedLatLng(obj) {
  var keys=Object.keys(obj);
  var reCommaLatLng=/(-?\d{1,3}\.\d{3,})\s*,\s*(-?\d{1,3}\.\d{3,})/;
  var reWkt=/POINT\s*\(\s*(-?\d{1,3}\.?\d*)\s+(-?\d{1,3}\.?\d*)\s*\)/i; // WKT 格式是「經度 緯度」用空白分隔，且順序跟一般習慣的「緯度,經度」相反
  for (var k=0;k<keys.length;k++) {
    var v=obj[keys[k]];
    if (typeof v!=="string"&&typeof v!=="number") continue;
    var s=String(v);
    var mWkt=s.match(reWkt);
    if (mWkt) return {lat:parseFloat(mWkt[2]),lng:parseFloat(mWkt[1])};
    var m=s.match(reCommaLatLng);
    if (m) return {lat:parseFloat(m[1]),lng:parseFloat(m[2])};
  }
  return null;
}
function normalizeImportItem(obj) {
  var name=pickFieldByAlias(obj,["name","title","place","place name","地點","地點名稱","名稱","標題"]);
  var latRaw=pickFieldByAlias(obj,["lat","latitude","緯度"]);
  var lngRaw=pickFieldByAlias(obj,["lng","lon","long","longitude","經度"]);
  var url=pickFieldByAlias(obj,["url","link","gmap","gmapurl","maps url","google maps url","googlemapsurl","網址","連結"]);
  var hoursRaw=pickFieldByAlias(obj,["hours","opening hours","business hours","open hours","time","開放時間","營業時間","時間"]);
  // 備註類欄位常常不只一個（筆記、留言、標籤…），全部收集起來合併，避免只留下其中一個
  var addressParts=collectFieldValues(obj,["address","note","notes","comment","comments","tags","list","list name","備註","地址","筆記","留言","標籤"]);
  var address=addressParts.join(" / ");
  var lat=(latRaw!=null&&latRaw!=="")?parseFloat(latRaw):null;
  var lng=(lngRaw!=null&&lngRaw!=="")?parseFloat(lngRaw):null;
  if(!url){var foundUrl=findEmbeddedMapsUrl(obj);if(foundUrl)url=foundUrl;}
  if((lat==null||isNaN(lat)||lng==null||isNaN(lng))){
    var ll=findEmbeddedLatLng(obj);
    if(ll){lat=ll.lat;lng=ll.lng;}
  }
  return {name:name?String(name).trim():"",lat:(typeof lat==="number"&&!isNaN(lat))?lat:null,lng:(typeof lng==="number"&&!isNaN(lng))?lng:null,address:address?String(address).trim():"",url:url?String(url).trim():"",hours:hoursRaw?String(hoursRaw).trim():""};
}
function resolveCoords(input,name,city) {
  var q=(input&&input.trim())?input.trim():((name||"")+(city?" "+city:""));
  if(!q)return Promise.resolve(null);
  // 改用 OpenStreetMap 的免費地理編碼服務（Nominatim），不用登入、不用 API 金鑰
  return fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&q="+encodeURIComponent(q))
    .then(function(r){return r.json();})
    .then(function(arr){
      if(!arr||!arr.length)return null;
      var lat=parseFloat(arr[0].lat),lng=parseFloat(arr[0].lon);
      return (!isNaN(lat)&&!isNaN(lng))?{lat:lat,lng:lng}:null;
    }).catch(function(){return null;});
}
function fetchAIDetail(name,city) {
  // 獨立部署版本沒有接 AI 服務，這個「查詢地點資訊」的小提示功能先停用，不影響其他核心功能（行程規劃/記帳/地圖等都正常）
  return Promise.resolve(null);
}
function compressImage(file,maxW,quality) {
  return new Promise(function(res){
    var reader=new FileReader();
    reader.onload=function(e){
      var img=new Image();
      img.onload=function(){
        var w=img.width,h=img.height;
        if (w>maxW){h=Math.round(h*maxW/w);w=maxW;}
        var canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;
        canvas.getContext("2d").drawImage(img,0,0,w,h);
        res(canvas.toDataURL("image/jpeg",quality));
      };
      img.src=e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ── Storage helpers ──
function storageSet(key,val){
  var jsonStr;
  try{jsonStr=JSON.stringify(val);}catch(e){console.error("storageSet: JSON.stringify threw for key:",key,e);return Promise.resolve({ok:false,error:"資料無法序列化：" + (e&&e.message?e.message:e)});}
  try{
    if(window.storage&&window.storage.set){
      return window.storage.set(key,jsonStr,true).then(function(){return {ok:true};}).catch(function(err){
        console.error("storageSet failed for key:",key,err);
        return {ok:false,error:(err&&err.message)?err.message:String(err)};
      });
    }
    return Promise.resolve({ok:false,error:"window.storage.set 無法使用（此環境不支援持久化儲存）"});
  }catch(e){
    console.error("storageSet threw for key:",key,e);
    return Promise.resolve({ok:false,error:(e&&e.message)?e.message:String(e)});
  }
}
function storageGet(key){try{if(window.storage&&window.storage.get)return window.storage.get(key,true).then(function(r){if(!r||!r.value)return null;return JSON.parse(r.value);}).catch(function(err){console.error("storageGet failed for key:",key,err);return null;});}catch(e){console.error("storageGet threw for key:",key,e);}return Promise.resolve(null);}
function storageDel(key){try{if(window.storage&&window.storage.delete)return window.storage.delete(key,true).then(function(){return true;}).catch(function(err){console.error("storageDel failed for key:",key,err);return false;});}catch(e){console.error("storageDel threw for key:",key,e);}return Promise.resolve(false);}
// 帶重試的寫入：遇到暫時性錯誤（例如伺服器端偶發錯誤）時，等一下再試一次
function storageSetWithRetry(key,val,retriesLeft){
  if(retriesLeft==null)retriesLeft=2;
  return storageSet(key,val).then(function(result){
    if(result.ok||retriesLeft<=0)return result;
    return new Promise(function(res){setTimeout(res,500);}).then(function(){return storageSetWithRetry(key,val,retriesLeft-1);});
  });
}
// 依序（不是同時平行）寫入多筆資料：一次只送一個請求，避免同時送出大量請求觸發儲存後端的併發限制
function sequentialStorageWrites(items){
  var results=[];
  var idx=0;
  function next(){
    if(idx>=items.length)return Promise.resolve(results);
    var item=items[idx];idx++;
    return storageSetWithRetry(item.key,item.val).then(function(result){
      results.push({key:item.key,label:item.label,size:item.size,result:result});
      return next();
    });
  }
  return next();
}

function makeTripData(name){return {tripName:name||"新旅行計畫",startDate:"",endDate:"",totalDays:3,friends:[{id:uid(),name:""},{id:uid(),name:""}],locs:[],connectors:{},flights:{outbound:{},inbound:{}},wishlist:[],documents:{},docFolders:["出入境資料","機票","訂房明細","簽證","其他"],packing:{essential:[],other:[]},destinationCity:"",expenses:ensureBudgetPresets([])};}
var DOC_FOLDERS=["出入境資料","機票","訂房明細","簽證","其他"];
// 確保每個旅行計畫的記帳簿裡都有「機票」「住宿」這兩個預設項目（沒有才補，已存在的不會重複新增或覆蓋內容）
function ensureBudgetPresets(expenses){
  var list=(expenses||[]).slice();
  if(!list.some(function(e){return e.budgetCat==="flight";})){
    list.unshift({id:"preset_flight",name:"機票",currency:"TWD",payers:[],splitAmong:[],paymentMethod:"信用卡",notes:"",budgetCat:"flight",createdAt:Date.now()});
  }
  if(!list.some(function(e){return e.budgetCat==="stay";})){
    list.unshift({id:"preset_stay",name:"住宿",currency:"TWD",payers:[],splitAmong:[],paymentMethod:"信用卡",notes:"",budgetCat:"stay",createdAt:Date.now()});
  }
  return list;
}
// 交通資訊的 key 格式：「p_出發地點id_抵達地點id」——綁定實際的兩張卡片，不是綁定第幾個位置。
// 這樣拖曳排序後，原本相鄰的兩張卡片就算換到別的位置，中間的交通資訊還是正確跟著；
// 原本相鄰、後來被拆開的兩張卡片，資料還留著但不會再顯示出來，不會誤導成別的交通方式
function connKeyPair(fromId,toId){return "p_"+fromId+"_"+toId;}
// 把舊版「第幾個位置」格式（d{day}_{index}）的交通資訊，一次轉成新版「兩張卡片」格式；
// 只在載入既有旅行計畫時跑一次，新格式的資料會原封不動保留，沒東西可轉就直接跳過
function migrateConnectorsToPairs(locs,connectors){
  if(!connectors||!Object.keys(connectors).length)return connectors||{};
  var hasOldFormat=Object.keys(connectors).some(function(k){return /^d\d+_\d+$/.test(k);});
  if(!hasOldFormat)return connectors;
  var result={};
  Object.keys(connectors).forEach(function(k){if(k.indexOf("p_")===0)result[k]=connectors[k];}); // 已經是新格式的先保留
  var byDay={};
  (locs||[]).forEach(function(l){if(l.day&&l.day!=="unassigned"){var d=String(l.day);if(!byDay[d])byDay[d]=[];byDay[d].push(l);}});
  Object.keys(byDay).forEach(function(d){byDay[d].sort(function(a,b){return (a.order||0)-(b.order||0);});});
  Object.keys(connectors).forEach(function(k){
    var m=k.match(/^d(\d+)_(\d+)$/);
    if(!m)return;
    var dayLocsArr=byDay[m[1]];
    var idx=parseInt(m[2],10);
    if(!dayLocsArr||idx>=dayLocsArr.length-1)return; // 找不到對應的地點配對，這筆舊資料就自然捨棄
    result[connKeyPair(dayLocsArr[idx].id,dayLocsArr[idx+1].id)]=connectors[k];
  });
  return result;
}

// ── Small UI components ──
function CatBadge(props){var cat=props.cat||"其他",sub=props.sub,small=props.small;var sz=small?12:14,pad=small?"2px 7px 2px 4px":"3px 9px 3px 5px";return React.createElement("span",{style:{display:"inline-flex",alignItems:"center",gap:3,background:CAT_BG[cat]||CAT_BG["其他"],borderRadius:20,padding:pad,fontSize:small?10:11,fontWeight:600,color:CAT_COLOR[cat]||CAT_COLOR["其他"],flexShrink:0}},React.createElement("span",{style:{display:"inline-flex"},dangerouslySetInnerHTML:{__html:makeSvgIcon(cat,CAT_COLOR[cat]||CAT_COLOR["其他"],sz)}}),cat,sub?" · "+sub:"");}
function Avatar(props){var name=props.name,color=props.color,idx=props.idx||0,size=props.size||28,active=props.active;var c=color||AVATAR_COLORS[idx%AVATAR_COLORS.length];return React.createElement("div",{style:{width:size,height:size,borderRadius:"50%",background:active?c:c+"33",color:active?C.white:c,border:"2px solid "+c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round(size*.38),fontWeight:700,flexShrink:0}},name?name[0].toUpperCase():"?");}
function MustAvatars(props){var mustBy=props.mustBy||[],friends=props.friends,size=props.size||16;var mf=mustBy.map(function(id){return friends.find(function(f){return f.id===id;});}).filter(Boolean);if(!mf.length)return null;return React.createElement("div",{style:{display:"flex",alignItems:"center"}},mf.slice(0,3).map(function(f,fi){var c=f.color||AVATAR_COLORS[friends.findIndex(function(x){return x.id===f.id;})%AVATAR_COLORS.length];return React.createElement("div",{key:fi,style:{width:size,height:size,borderRadius:"50%",background:c,color:C.white,fontSize:Math.round(size*.42),display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,marginLeft:fi?-Math.round(size*.3):0,border:"2px solid #fff"}},f.name[0]);}),mf.length>3?React.createElement("div",{style:{width:size,height:size,borderRadius:"50%",background:C.teal,color:C.white,fontSize:Math.round(size*.36),display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,marginLeft:-Math.round(size*.3),border:"2px solid #fff"}},"+"+String(mf.length-3)):null);}
function ConfirmDialog(props){return React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:24}},React.createElement("div",{style:{background:C.white,borderRadius:18,padding:"22px 20px",maxWidth:320,width:"100%"}},React.createElement("div",{style:{fontSize:14,color:C.navy,marginBottom:18,lineHeight:1.5,whiteSpace:"pre-wrap"}},props.msg),React.createElement("div",{style:{display:"flex",gap:10}},React.createElement("button",{onClick:props.onCancel,style:{flex:1,padding:"10px",borderRadius:10,border:"1.5px solid "+C.border,background:C.white,color:C.mid,cursor:"pointer",fontSize:13}},"取消"),React.createElement("button",{onClick:props.onOk,style:{flex:1,padding:"10px",borderRadius:10,border:"none",background:"#E53935",color:C.white,cursor:"pointer",fontSize:13,fontWeight:700}},props.okLabel||"確定刪除"))));}
function RenameModal(props){
  var initialName=props.initialName||"",onSave=props.onSave,onClose=props.onClose,title=props.title||"編輯旅行名稱",placeholder=props.placeholder||"";
  var vS=useState(initialName);var val=vS[0];var setVal=vS[1];
  var inputRef=useRef(null);
  useEffect(function(){setTimeout(function(){if(inputRef.current){inputRef.current.focus();inputRef.current.select();}},50);},[]);
  function commit(){var v=val.trim();if(v)onSave(v);}
  return React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:24},onClick:function(e){if(e.target===e.currentTarget)onClose();}},
    React.createElement("div",{style:{background:C.white,borderRadius:18,padding:"22px 20px",maxWidth:340,width:"100%"}},
      React.createElement("div",{style:{fontSize:14,fontWeight:700,color:C.navy,marginBottom:12}},title),
      React.createElement("input",{ref:inputRef,value:val,onChange:function(e){setVal(e.target.value);},placeholder:placeholder,onKeyDown:function(e){if(e.key==="Enter"){e.preventDefault();commit();}else if(e.key==="Escape"){onClose();}},style:{width:"100%",padding:"10px 12px",border:"1.5px solid "+C.border,borderRadius:10,fontSize:14,boxSizing:"border-box",background:C.white,color:C.navy,outline:"none"}}),
      React.createElement("div",{style:{display:"flex",gap:10,marginTop:16}},
        React.createElement("button",{onClick:onClose,style:{flex:1,padding:"10px",borderRadius:10,border:"1.5px solid "+C.border,background:C.white,color:C.mid,cursor:"pointer",fontSize:13}},"取消"),
        React.createElement("button",{onClick:commit,disabled:!val.trim(),style:{flex:1,padding:"10px",borderRadius:10,border:"none",background:val.trim()?C.teal:"#ccc",color:C.white,cursor:val.trim()?"pointer":"default",fontSize:13,fontWeight:700}},"儲存"))));
}
function AlertModal(props){
  // 取代 window.alert()：這個 sandbox 環境會擋掉瀏覽器原生的 alert/prompt/confirm，
  // 用原生 alert() 顯示的錯誤訊息會完全沒反應，所以錯誤/提示訊息一律要用這個自製彈窗顯示
  var msg=props.msg,onClose=props.onClose;
  return React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.55)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:24},onClick:function(e){if(e.target===e.currentTarget)onClose();}},
    React.createElement("div",{style:{background:C.white,borderRadius:18,padding:"22px 20px",maxWidth:340,width:"100%"}},
      React.createElement("div",{style:{fontSize:14,color:C.navy,marginBottom:18,lineHeight:1.6,whiteSpace:"pre-wrap"}},msg),
      React.createElement("button",{onClick:onClose,style:{width:"100%",padding:"10px",borderRadius:10,border:"none",background:C.teal,color:C.white,cursor:"pointer",fontSize:13,fontWeight:700}},"知道了")));
}
var CURRENCIES=["TWD","JPY","USD","KRW","EUR","GBP","THB","HKD","CNY","VND","SGD","AUD","CAD","MYR"];
// 左滑刪除的通用外框，用移動門檻分辨「橫向滑動想刪除」跟「單純點擊裡面的按鈕」
function SwipeToDeleteRow(props){
  var children=props.children,onDelete=props.onDelete;
  var xS=useState(0);var x=xS[0];var setX=xS[1];
  var draggingRef=useRef(false);
  var startRef=useRef(null);
  var revealWidth=76;
  function onPointerDown(e){startRef.current={x:e.clientX,startX:x};draggingRef.current=false;}
  function onPointerMove(e){
    var start=startRef.current;
    if(!start)return;
    var dx=e.clientX-start.x;
    if(!draggingRef.current){
      if(Math.abs(dx)<8)return;
      draggingRef.current=true;
      try{e.currentTarget.setPointerCapture(e.pointerId);}catch(err){}
    }
    e.preventDefault();
    setX(Math.max(-revealWidth,Math.min(0,start.startX+dx)));
  }
  function onPointerUp(){
    if(draggingRef.current)setX(function(cur){return cur<-revealWidth/2?-revealWidth:0;});
    draggingRef.current=false;startRef.current=null;
  }
  return React.createElement("div",{style:{position:"relative",overflow:"hidden",borderRadius:14,marginBottom:8}},
    React.createElement("button",{onClick:function(){onDelete();setX(0);},style:{position:"absolute",top:0,right:0,bottom:0,width:revealWidth,background:"#E53935",color:"#fff",border:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,cursor:"pointer"}},"🗑 刪除"),
    React.createElement("div",{onPointerDown:onPointerDown,onPointerMove:onPointerMove,onPointerUp:onPointerUp,onPointerCancel:onPointerUp,style:{transform:"translateX("+x+"px)",transition:draggingRef.current?"none":"transform .15s",touchAction:"pan-y",position:"relative",background:C.white,borderRadius:14}},children));
}
var PACK_SUBCATS=["盥洗","衣物","保健","電器","其他"];
var FLOOR_OPTIONS=(function(){var arr=[];for(var i=6;i>=1;i--)arr.push("B"+i);for(var j=1;j<=99;j++)arr.push(j+"F");return arr;})();
var EXPENSE_CATS=[{key:"flight",label:"機票",icon:"✈️"},{key:"stay",label:"住宿",icon:"🏨"},{key:"food",label:"餐食",icon:"🍜"},{key:"entertainment",label:"娛樂",icon:"🎢"},{key:"transport",label:"交通",icon:"🚌"},{key:"other",label:"其他",icon:"🎯"}];
var TRANSPORT_SUBCATS=["計程車","地鐵/公車","包車","其他"];
// 依交通卡填的「交通方式」文字，猜出對應的交通細項分類，猜不出來就算「其他」
function guessTransportSubCat(mode,transitLine){
  if(mode){
    if(/計程車|小黃|的士|taxi|uber|優步|滴滴|didi|grab/i.test(mode))return "計程車";
    if(/捷運|地鐵|mrt|公車|巴士|\bbus\b|客運|輕軌|電車|地下鐵|brt|台鐵|火車|高鐵|新幹線/i.test(mode))return "地鐵/公車";
    if(/包車|接送|charter|專車|司機/i.test(mode))return "包車";
  }
  if(transitLine&&transitLine.trim())return "地鐵/公車"; // 交通方式沒填，但有填捷運線名，代表這段一定是搭捷運/輕軌之類的
  return "其他";
}
var BUDGET_CATS=[{key:"flight",label:"機票",icon:"✈️"},{key:"stay",label:"住宿",icon:"🏨"},{key:"food",label:"餐食",icon:"🍜"},{key:"entertainment",label:"娛樂",icon:"🎢"},{key:"transport",label:"交通",icon:"🚌"},{key:"other",label:"其他",icon:"🎯"}];
var TRANSPORT_TYPES=[{key:"taxi",label:"計程車"},{key:"transit",label:"地鐵/公車"},{key:"charter",label:"包車"},{key:"other",label:"其他"}];
function DocNoteModal(props){
  var item=props.item||{},onSave=props.onSave,onClose=props.onClose;
  var nS=useState(item.name||"");var name=nS[0];var setName=nS[1];
  var noteS=useState(item.note||"");var note=noteS[0];var setNote=noteS[1];
  return React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.5)",zIndex:9600,display:"flex",alignItems:"flex-end",justifyContent:"center"},onClick:function(e){if(e.target===e.currentTarget)onClose();}},
    React.createElement("div",{style:{background:C.light,width:"100%",maxWidth:480,borderRadius:"22px 22px 0 0",maxHeight:"85vh",overflowY:"auto",paddingBottom:"calc(24px + env(safe-area-inset-bottom, 0px))"}},
      React.createElement("div",{style:{background:C.white,padding:"14px 16px",borderRadius:"22px 22px 0 0",borderBottom:"1px solid "+C.border,position:"sticky",top:0,display:"flex",justifyContent:"space-between",alignItems:"center"}},
        React.createElement("span",{style:{fontSize:16,fontWeight:700,color:C.navy}},"📝 文字備註"),
        React.createElement("button",{onClick:onClose,style:{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.mid}},"×")),
      React.createElement("div",{style:{padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}},
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"標題"),
          React.createElement("input",{value:name,onChange:function(e){setName(e.target.value);},placeholder:"例：訂房確認碼、緊急聯絡電話…",style:INP,autoFocus:true})),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"內容"),
          React.createElement("textarea",{value:note,onChange:function(e){setNote(e.target.value);},placeholder:"輸入備註內容…",style:Object.assign({},INP,{minHeight:120,resize:"vertical"})})),
        React.createElement("button",{onClick:function(){onSave(name.trim()||"文字備註",note);},disabled:!note.trim()&&!name.trim(),style:{padding:"12px",borderRadius:12,background:(note.trim()||name.trim())?C.teal:"#ccc",color:C.white,border:"none",cursor:(note.trim()||name.trim())?"pointer":"default",fontSize:14,fontWeight:700}},"儲存"))));
}
var PAYMENT_METHODS=["現金","信用卡","行動支付","其他"];
function ExpenseModal(props){
  var item=props.item||{},friends=props.friends||[],locs=props.locs||[],onSave=props.onSave,onDelete=props.onDelete,onClose=props.onClose;
  var allNamed=friends.filter(function(f){return f.name&&f.name.trim();});
  var named=allNamed.filter(function(f){return !f.archived;}); // 新選擇只給未封存的旅伴
  var isAnchor=item.id==="preset_flight"||item.id==="preset_stay"; // 機票/住宿這兩個固定項目，分類鎖死不能改
  var nS=useState(item.name||"");var name=nS[0];var setName=nS[1];
  var curS=useState(item.currency||"TWD");var currency=curS[0];var setCurrency=curS[1];
  var budgetCatS=useState(item.budgetCat||"other");var budgetCat=budgetCatS[0];var setBudgetCat=budgetCatS[1];
  var transportTypeS=useState(item.transportType||"其他");var transportType=transportTypeS[0];var setTransportType=transportTypeS[1];
  var fromLocIdS=useState(item.fromLocId||"");var fromLocId=fromLocIdS[0];var setFromLocId=fromLocIdS[1];
  var toLocIdS=useState(item.toLocId||"");var toLocId=toLocIdS[0];var setToLocId=toLocIdS[1];
  var initialPayers=(item.payers&&item.payers.length)?item.payers:[{friendId:(named[0]&&named[0].id)||"",amount:""}];
  var payersS=useState(initialPayers.map(function(p){return {friendId:p.friendId,amount:p.amount!=null?String(p.amount):""};}));var payers=payersS[0];var setPayers=payersS[1];
  var isBudgetItem=item.budgetCat==="flight"||item.budgetCat==="stay";
  // 分攤對象：如果這筆資料本來就有存過（不管是空的還是有勾人），照存的來，尊重使用者上次的選擇；
  // 全新的一筆才需要猜預設值——機票/住宿常常是個人自己先付，預設「不平分（只記個人）」比較安全，
  // 其他一般支出通常是大家一起花的，預設「平分所有人」比較符合直覺
  var splitS=useState(item.splitAmong!=null?item.splitAmong:(isBudgetItem?[]:named.map(function(f){return f.id;})));var splitAmong=splitS[0];var setSplitAmong=splitS[1];
  var methodS=useState(item.paymentMethod||"現金");var paymentMethod=methodS[0];var setPaymentMethod=methodS[1];
  var noteS=useState(item.notes||"");var notes=noteS[0];var setNotes=noteS[1];
  function toggleSplit(id){setSplitAmong(function(s){return s.indexOf(id)>=0?s.filter(function(x){return x!==id;}):s.concat([id]);});}
  function updatePayer(idx,patch){setPayers(function(ps){return ps.map(function(p,i){return i===idx?Object.assign({},p,patch):p;});});}
  function addPayer(){
    var usedIds=payers.map(function(p){return p.friendId;});
    var next=named.find(function(f){return usedIds.indexOf(f.id)<0;});
    setPayers(function(ps){return ps.concat([{friendId:next?next.id:"",amount:""}]);});
  }
  function removePayer(idx){setPayers(function(ps){return ps.length>1?ps.filter(function(_,i){return i!==idx;}):ps;});}
  var totalAmount=payers.reduce(function(s,p){var a=parseFloat(p.amount);return s+(isNaN(a)?0:a);},0);
  function doSave(){
    var validPayers=payers.filter(function(p){return p.friendId&&p.amount&&parseFloat(p.amount)>0;}).map(function(p){return {friendId:p.friendId,amount:parseFloat(p.amount)};});
    if(!name.trim()||!validPayers.length)return;
    onSave(Object.assign({},item,{id:item.id||uid(),name:name.trim(),currency:currency,payers:validPayers,splitAmong:splitAmong,paymentMethod:paymentMethod,notes:notes.trim(),budgetCat:isAnchor?item.budgetCat:budgetCat,transportType:budgetCat==="transport"?transportType:null,fromLocId:budgetCat==="transport"?(fromLocId||null):null,toLocId:budgetCat==="transport"?(toLocId||null):null,createdAt:item.createdAt||Date.now()}));
  }
  var canSave=name.trim()&&payers.some(function(p){return p.friendId&&p.amount&&parseFloat(p.amount)>0;});
  return React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.5)",zIndex:9600,display:"flex",alignItems:"flex-end",justifyContent:"center"},onClick:function(e){if(e.target===e.currentTarget)onClose();}},
    React.createElement("div",{style:{background:C.light,width:"100%",maxWidth:480,borderRadius:"22px 22px 0 0",maxHeight:"90vh",overflowY:"auto",paddingBottom:"calc(32px + env(safe-area-inset-bottom, 0px))"}},
      React.createElement("div",{style:{background:C.white,padding:"14px 16px",borderRadius:"22px 22px 0 0",borderBottom:"1px solid "+C.border,position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center"}},
        React.createElement("span",{style:{fontSize:16,fontWeight:700,color:C.navy}},item.id?"編輯支出":"新增支出"),
        React.createElement("button",{onClick:onClose,style:{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.mid}},"×")),
      React.createElement("div",{style:{padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}},
        named.length===0?React.createElement("div",{style:{background:"#FFF8E8",border:"1.5px solid #E8C97A",borderRadius:12,padding:12,fontSize:12,color:"#9A7A2A"}},"還沒有旅伴名單，請先到「👥」加入旅伴名字才能記帳分帳"):null,
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:8,fontWeight:600}},"分類"+(isAnchor?"（固定項目，分類不能改）":"")),
          React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},EXPENSE_CATS.map(function(cat){var checked=budgetCat===cat.key;return React.createElement("button",{key:cat.key,disabled:isAnchor,onClick:function(){setBudgetCat(cat.key);},style:{padding:"7px 12px",minHeight:34,borderRadius:20,border:"1.5px solid "+(checked?C.teal:C.border),background:checked?C.skyblue:C.light,color:C.navy,cursor:isAnchor?"default":"pointer",fontSize:12,fontWeight:checked?700:500,opacity:isAnchor&&!checked?.4:1}},cat.icon+" "+cat.label);})),
          budgetCat==="transport"?React.createElement("div",{style:{marginTop:10}},
            React.createElement("div",{style:{fontSize:11,color:C.mid,marginBottom:6}},"交通細項"),
            React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},TRANSPORT_SUBCATS.map(function(tc){var checked=transportType===tc;return React.createElement("button",{key:tc,onClick:function(){setTransportType(tc);},style:{padding:"6px 11px",minHeight:32,borderRadius:20,border:"1.5px solid "+(checked?C.teal:C.border),background:checked?C.skyblue:C.white,color:C.navy,cursor:"pointer",fontSize:11,fontWeight:checked?700:500}},tc);})),
            locs.length?React.createElement("div",{style:{marginTop:10}},
              React.createElement("div",{style:{fontSize:11,color:C.mid,marginBottom:5}},"路線（選填，方便之後查看是哪一段）"),
              React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6}},
                React.createElement("select",{value:fromLocId,onChange:function(e){setFromLocId(e.target.value);},style:Object.assign({},INP,{flex:1,fontSize:12,padding:"9px 8px",minHeight:36})},React.createElement("option",{value:""},"從…"),locs.map(function(l){return React.createElement("option",{key:l.id,value:l.id},l.name);}))),
              React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6,marginTop:6}},
                React.createElement("select",{value:toLocId,onChange:function(e){setToLocId(e.target.value);},style:Object.assign({},INP,{flex:1,fontSize:12,padding:"9px 8px",minHeight:36})},React.createElement("option",{value:""},"到…"),locs.map(function(l){return React.createElement("option",{key:l.id,value:l.id},l.name);})))):null):null),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"項目名稱 *"),
          React.createElement("input",{value:name,onChange:function(e){setName(e.target.value);},placeholder:"例：晚餐、計程車…",style:INP,autoFocus:true})),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"幣別"),
          React.createElement("select",{value:currency,onChange:function(e){setCurrency(e.target.value);},style:INP},CURRENCIES.map(function(c){return React.createElement("option",{key:c,value:c},c);}))),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}},
            React.createElement("div",{style:{fontSize:12,color:C.mid,fontWeight:600}},"誰付的（可複選，分別填各自付的金額）*"),
            React.createElement("span",{style:{fontSize:12,fontWeight:700,color:C.teal}},"共 "+totalAmount+" "+currency)),
          payers.map(function(p,idx){return React.createElement("div",{key:idx,style:{display:"flex",gap:6,marginBottom:6,alignItems:"center"}},
            React.createElement("select",{value:p.friendId,onChange:function(e){updatePayer(idx,{friendId:e.target.value});},style:Object.assign({},INP,{flex:1.3})},React.createElement("option",{value:""},"選擇"),named.map(function(f){return React.createElement("option",{key:f.id,value:f.id},f.name);}),(function(){var archivedCur=allNamed.find(function(f){return f.id===p.friendId&&f.archived;});return archivedCur?React.createElement("option",{key:archivedCur.id,value:archivedCur.id},archivedCur.name+"（已封存）"):null;})()),
            React.createElement("input",{type:"number",min:"0",value:p.amount,onChange:function(e){updatePayer(idx,{amount:e.target.value});},placeholder:"金額",style:Object.assign({},INP,{flex:1})}),
            payers.length>1?React.createElement("button",{onClick:function(){removePayer(idx);},style:{background:"none",border:"none",color:"#C55",cursor:"pointer",fontSize:18,padding:"0 4px",flexShrink:0}},"×"):null);
          }),
          named.length>payers.length?React.createElement("button",{onClick:addPayer,style:{padding:"7px",borderRadius:9,border:"1.5px dashed "+C.teal,background:"none",color:C.teal,cursor:"pointer",fontSize:12,fontWeight:600,width:"100%",marginTop:2}},"＋ 新增付款人"):null),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:8,fontWeight:600}},"付款方式"),
          React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},PAYMENT_METHODS.map(function(m){var checked=paymentMethod===m;return React.createElement("button",{key:m,onClick:function(){setPaymentMethod(m);},style:{padding:"6px 12px",borderRadius:20,border:"1.5px solid "+(checked?C.teal:C.border),background:checked?C.skyblue:C.light,color:C.navy,cursor:"pointer",fontSize:12,fontWeight:checked?700:500}},m);}))),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}},
            React.createElement("div",{style:{fontSize:12,color:C.mid,fontWeight:600}},"要分攤給誰（沒勾＝不平分，只記個人）"),
            React.createElement("button",{onClick:function(){setSplitAmong(function(s){return s.length?[]:named.map(function(f){return f.id;});});},style:{fontSize:11,color:C.teal,background:"none",border:"none",cursor:"pointer",fontWeight:600,flexShrink:0}},splitAmong.length?"清空":"全選")),
          splitAmong.length===0?React.createElement("div",{style:{fontSize:11,color:"#C07A3A",background:"#FFF3E0",borderRadius:8,padding:"7px 10px",marginBottom:8}},"👤 目前不平分，只會記錄在付款人自己的花費裡，不會出現在其他人的餘額計算中"):null,
          React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},named.concat(allNamed.filter(function(f){return f.archived&&splitAmong.indexOf(f.id)>=0;})).map(function(f){var checked=splitAmong.indexOf(f.id)>=0;return React.createElement("button",{key:f.id,onClick:function(){toggleSplit(f.id);},style:{padding:"6px 12px",borderRadius:20,border:"1.5px solid "+(checked?C.teal:C.border),background:checked?C.skyblue:C.light,color:C.navy,cursor:"pointer",fontSize:12,fontWeight:checked?700:500}},(checked?"✓ ":"")+f.name+(f.archived?"（已封存）":""));}))),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"備註"),React.createElement("textarea",{value:notes,onChange:function(e){setNotes(e.target.value);},style:Object.assign({},INP,{minHeight:50,resize:"vertical"})})),
        React.createElement("div",{style:{display:"flex",gap:8}},
          item.id&&item.id!=="preset_flight"&&item.id!=="preset_stay"?React.createElement("button",{onClick:function(){onDelete(item.id);},style:{padding:"11px 14px",borderRadius:12,border:"1.5px solid #F5C6C6",color:"#C55",background:"#FFF5F5",cursor:"pointer",fontSize:13,fontWeight:600}},"🗑 刪除"):null,
          React.createElement("button",{onClick:doSave,disabled:!canSave,style:{flex:1,padding:"12px",borderRadius:12,background:canSave?C.teal:"#ccc",color:C.white,border:"none",cursor:canSave?"pointer":"default",fontSize:14,fontWeight:700}},"儲存")))));
}
function WishlistItemModal(props){
  var item=props.item||{},onSave=props.onSave,onDelete=props.onDelete,onClose=props.onClose;
  var nS=useState(item.name||"");var name=nS[0];var setName=nS[1];
  var imS=useState(item.image||null);var image=imS[0];var setImage=imS[1];
  var whereS=useState(item.whereToBuy||"");var whereToBuy=whereS[0];var setWhereToBuy=whereS[1];
  var priceS=useState(item.price!=null?String(item.price):"");var price=priceS[0];var setPrice=priceS[1];
  var curS=useState(item.currency||"JPY");var currency=curS[0];var setCurrency=curS[1];
  var qtyS=useState(item.qty!=null?String(item.qty):"1");var qty=qtyS[0];var setQty=qtyS[1];
  var noteS=useState(item.notes||"");var notes=noteS[0];var setNotes=noteS[1];
  function doSave(){
    if(!name.trim())return;
    onSave(Object.assign({},item,{id:item.id||uid(),name:name.trim(),image:image,whereToBuy:whereToBuy.trim(),price:price?parseFloat(price):null,currency:currency,qty:qty?parseInt(qty,10):1,notes:notes.trim(),bought:!!item.bought,day:item.day||null}));
  }
  return React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.5)",zIndex:9600,display:"flex",alignItems:"flex-end",justifyContent:"center"},onClick:function(e){if(e.target===e.currentTarget)onClose();}},
    React.createElement("div",{style:{background:C.light,width:"100%",maxWidth:480,borderRadius:"22px 22px 0 0",maxHeight:"90vh",overflowY:"auto",paddingBottom:"calc(32px + env(safe-area-inset-bottom, 0px))"}},
      React.createElement("div",{style:{background:C.white,padding:"14px 16px",borderRadius:"22px 22px 0 0",borderBottom:"1px solid "+C.border,position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center"}},
        React.createElement("span",{style:{fontSize:16,fontWeight:700,color:C.navy}},item.id?"編輯商品":"新增商品"),
        React.createElement("button",{onClick:onClose,style:{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.mid}},"×")),
      React.createElement("div",{style:{padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}},
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"商品名稱 *"),
          React.createElement("input",{value:name,onChange:function(e){setName(e.target.value);},placeholder:"例：抹茶餅乾",style:INP,autoFocus:true})),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},React.createElement(ImageUploader,{value:image,onChange:setImage})),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"哪裡買"),
          React.createElement("input",{value:whereToBuy,onChange:function(e){setWhereToBuy(e.target.value);},placeholder:"例：唐吉訶德",style:INP})),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},
          React.createElement("div",null,React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"金額"),React.createElement("input",{type:"number",min:"0",value:price,onChange:function(e){setPrice(e.target.value);},placeholder:"1000",style:INP})),
          React.createElement("div",null,React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"幣別"),React.createElement("select",{value:currency,onChange:function(e){setCurrency(e.target.value);},style:INP},CURRENCIES.map(function(c){return React.createElement("option",{key:c,value:c},c);})))),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"數量"),
          React.createElement("input",{type:"number",min:"1",value:qty,onChange:function(e){setQty(e.target.value);},style:INP})),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"備註"),React.createElement("textarea",{value:notes,onChange:function(e){setNotes(e.target.value);},style:Object.assign({},INP,{minHeight:50,resize:"vertical"})})),
        React.createElement("div",{style:{display:"flex",gap:8}},
          item.id?React.createElement("button",{onClick:function(){onDelete(item.id);},style:{padding:"11px 14px",borderRadius:12,border:"1.5px solid #F5C6C6",color:"#C55",background:"#FFF5F5",cursor:"pointer",fontSize:13,fontWeight:600}},"🗑 刪除"):null,
          React.createElement("button",{onClick:doSave,disabled:!name.trim(),style:{flex:1,padding:"12px",borderRadius:12,background:name.trim()?C.teal:"#ccc",color:C.white,border:"none",cursor:name.trim()?"pointer":"default",fontSize:14,fontWeight:700}},"儲存")))));
}
var TRIP_ICONS=["✈️","🏖️","🏔️","🗼","⛩️","🚗","🚢","🏯","🌆","🗺️","🏕️","🎡","⛷️","🏝️","🚂","🎢","🍜","🎌","🏰","🌋"];
function IconPickerModal(props){
  var onSave=props.onSave,onClose=props.onClose,currentIcon=props.currentIcon;
  return React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:24},onClick:function(e){if(e.target===e.currentTarget)onClose();}},
    React.createElement("div",{style:{background:C.white,borderRadius:18,padding:"22px 20px",maxWidth:340,width:"100%"}},
      React.createElement("div",{style:{fontSize:14,fontWeight:700,color:C.navy,marginBottom:14}},"選擇計畫圖示"),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}},
        TRIP_ICONS.map(function(ic){var isCur=ic===currentIcon;return React.createElement("button",{key:ic,onClick:function(){onSave(ic);},style:{fontSize:22,padding:"10px 0",borderRadius:12,border:"2px solid "+(isCur?C.teal:C.border),background:isCur?C.skyblue+"55":C.light,cursor:"pointer"}},ic);})),
      React.createElement("button",{onClick:onClose,style:{width:"100%",padding:"10px",borderRadius:10,border:"1.5px solid "+C.border,background:C.white,color:C.mid,cursor:"pointer",fontSize:13,marginTop:16}},"取消")));
}
function CopyToast(props){return React.createElement("div",{style:{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",background:C.navy,color:C.white,borderRadius:20,padding:"8px 20px",fontSize:13,fontWeight:600,zIndex:9998,pointerEvents:"none",whiteSpace:"nowrap"}},"✓ "+props.text);}

function ImageUploader(props){
  var value=props.value,onChange=props.onChange;
  var ref=useRef(null);
  var eS=useState(false);var enlarged=eS[0];var setEnlarged=eS[1];
  return React.createElement("div",null,
    React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:6,fontWeight:600}},"📷 圖片（選填）"),
    value
      ?React.createElement("div",{style:{position:"relative",display:"inline-block",width:"100%"}},
          React.createElement("img",{src:value,alt:"",onClick:function(){setEnlarged(true);},style:{width:"100%",maxHeight:160,objectFit:"cover",borderRadius:10,cursor:"pointer",display:"block"}}),
          React.createElement("button",{onClick:function(){onChange(null);},style:{position:"absolute",top:6,right:6,width:24,height:24,borderRadius:"50%",background:"rgba(0,0,0,.55)",color:"#fff",border:"none",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}},"×"),
          enlarged?React.createElement("div",{onClick:function(){setEnlarged(false);},style:{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}},React.createElement("img",{src:value,alt:"",style:{maxWidth:"100%",maxHeight:"90vh",borderRadius:12,objectFit:"contain"}})):null)
      :React.createElement("button",{onClick:function(){if(ref.current)ref.current.click();},style:{width:"100%",padding:"12px",borderRadius:10,border:"2px dashed "+C.border,background:C.light,color:C.mid,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:6}},React.createElement("span",{style:{fontSize:18}},"📷")," 點此上傳圖片"),
    React.createElement("input",{ref:ref,type:"file",accept:"image/*",style:{display:"none"},onChange:function(e){var f=e.target.files&&e.target.files[0];if(f)compressImage(f,800,.7).then(function(b){onChange(b);});e.target.value="";}}));
}

function GeoInputBlock(props){
  var name=props.name,city=props.city,onResult=props.onResult;
  var vS=useState("");var val=vS[0];var setVal=vS[1];
  var lS=useState(false);var loading=lS[0];var setLoading=lS[1];
  var mS=useState("");var msg=mS[0];var setMsg=mS[1];
  function apply(){var v=val.trim();if(!v){setMsg("❌ 請先輸入內容");return;}var co=parseGmapCoords(v);if(co){onResult({lat:String(co.lat),lng:String(co.lng),gmapUrl:v});setVal("");setMsg("✓ 連結解析成功");return;}setMsg("AI 查詢中…");setLoading(true);setTimeout(function(){resolveCoords(v,name,city).then(function(res){setLoading(false);if(res){onResult({lat:String(res.lat),lng:String(res.lng)});setVal("");setMsg("✓ 定位成功");}else setMsg("❌ 無法解析");});},50);}
  return React.createElement("div",null,
    React.createElement("div",{style:{fontSize:11,color:C.mid,marginBottom:4,fontWeight:600}},"Google Maps 連結 / Plus Code / 地址"),
    React.createElement("div",{style:{display:"flex",gap:6,marginBottom:4}},
      React.createElement("input",{value:val,onChange:function(e){setVal(e.target.value);setMsg("");},onKeyDown:function(e){if(e.key==="Enter"){e.preventDefault();apply();}},placeholder:"R5Q5+VW / Maps連結 / 地址",style:{flex:1,padding:"8px 10px",border:"1.5px solid "+C.border,borderRadius:9,fontSize:12,boxSizing:"border-box",outline:"none",background:C.white,color:C.navy}}),
      React.createElement("button",{onClick:apply,disabled:loading,style:{padding:"8px 12px",borderRadius:9,background:loading?"#aaa":C.navy,color:C.white,border:"none",cursor:loading?"default":"pointer",fontSize:12,fontWeight:700,flexShrink:0,minWidth:48}},loading?"⏳":"套用")),
    msg?React.createElement("div",{style:{fontSize:11,color:msg.startsWith("✓")?"#5A9A7A":"#C07A3A",fontWeight:600,marginBottom:2}},msg):null);
}

function ConnectorBlock(props){
  var conn=props.conn||{},onChange=props.onChange,dragHandleProps=props.dragHandleProps,onRecordExpense=props.onRecordExpense;
  var oS=useState(false);var open=oS[0];var setOpen=oS[1];
  var imgViewS=useState(false);var imgView=imgViewS[0];var setImgView=imgViewS[1];
  var hasTime=!!(conn.time&&conn.time.trim());
  // 相容舊版單一交通方式格式：沒有 legs 陣列時，用舊的扁平欄位組出一段；
  // 也相容更舊版本「費用掛在整個交通卡」的格式，第一次打開時把舊的 conn.estCost 併進第一段
  var legs=conn.legs;
  if(!legs){
    legs=(conn.transitMode||conn.duration||conn.transitLine)?[{transitMode:conn.transitMode||"",duration:conn.duration||"",durationUnit:conn.durationUnit||"分鐘",transitLine:conn.transitLine||"",transitColor:conn.transitColor||"",transitDirection:"",transferTo:""}]:[];
  }
  if(conn.estCost&&legs.length&&!legs.some(function(lg){return lg.estCost;})){
    legs=legs.map(function(lg,i){return i===0?Object.assign({},lg,{estCost:conn.estCost,estCurrency:conn.estCurrency,costUnit:conn.costUnit}):lg;});
  }
  var hasCost=legs.some(function(lg){return lg.estCost;});
  var hasInfo=hasTime||legs.length>0||conn.image||conn.url;
  var bi={border:"1.5px solid "+C.border,borderRadius:7,fontSize:12,outline:"none",background:C.white,padding:"6px 8px",boxSizing:"border-box"};
  function updateLegs(newLegs){
    // 一律存成新格式 legs（費用現在掛在每一段自己身上），並清掉舊版掛在整個連接段的花費欄位避免混淆
    onChange(Object.assign({},conn,{time:conn.time,legs:newLegs,estCost:null,estCurrency:null,costUnit:null}));
  }
  function updateLeg(idx,patch){
    updateLegs(legs.map(function(lg,i){return i===idx?Object.assign({},lg,patch):lg;}));
  }
  function addLeg(){
    updateLegs(legs.concat([{transitMode:"",duration:"",durationUnit:"分鐘",transitLine:"",transitColor:"",transitDirection:"",transferTo:""}]));
  }
  function removeLeg(idx){
    updateLegs(legs.filter(function(_,i){return i!==idx;}));
  }
  function updateConnField(patch){onChange(Object.assign({},conn,patch));}
  return React.createElement(React.Fragment,null,
    imgView&&conn.image?React.createElement("div",{onClick:function(){setImgView(false);},style:{position:"fixed",inset:0,background:"rgba(0,0,0,.9)",zIndex:9800,display:"flex",alignItems:"center",justifyContent:"center",padding:16}},React.createElement("img",{src:conn.image,alt:"",style:{maxWidth:"100%",maxHeight:"90vh",objectFit:"contain"}}),React.createElement("button",{onClick:function(){setImgView(false);},style:{position:"fixed",top:16,right:16,width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.2)",color:"#fff",border:"none",fontSize:18,cursor:"pointer"}},"×")):null,
    React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"stretch",margin:"0 0 0 28px",maxWidth:"calc(100% - 28px)",boxSizing:"border-box"}},
    React.createElement("div",{style:{width:2,height:8,background:C.skyblue,alignSelf:"center"}}),
    React.createElement("div",{style:{display:"flex",alignItems:"center",gap:4}},
      dragHandleProps?React.createElement("div",Object.assign({},dragHandleProps,{style:{cursor:"grab",padding:"0 2px",color:C.skyblue,fontSize:14,userSelect:"none"}}),"⠿"):null,
      React.createElement("div",{onClick:function(){setOpen(function(o){return !o;});},style:{flex:1,cursor:"pointer",background:open?"rgba(127,165,164,.07)":"rgba(255,255,255,.8)",border:"1.5px dashed "+((hasInfo||hasCost)?C.teal:C.border),borderRadius:10,padding:"4px 10px",display:"flex",alignItems:"center",gap:5,minHeight:26,flexWrap:"wrap"}},
        hasTime?React.createElement("span",{style:{fontSize:10,fontWeight:700,color:C.white,background:C.teal,borderRadius:5,padding:"1px 7px",flexShrink:0}},conn.time):null,
        legs.map(function(lg,li){return React.createElement("span",{key:li,style:{display:"inline-flex",alignItems:"center",gap:3,flexWrap:"wrap",minWidth:0,maxWidth:"100%"}},
          li>0?React.createElement("span",{style:{fontSize:9,color:C.mid,opacity:.5,flexShrink:0}},"→"):null,
          lg.transitMode?React.createElement("span",{style:{fontSize:10,color:C.mid,overflowWrap:"break-word",wordBreak:"break-word",maxWidth:"100%"}},lg.transitMode):null,
          lg.transitLine?React.createElement("span",{style:{fontSize:9,fontWeight:700,color:C.white,background:lg.transitColor||"#888",borderRadius:4,padding:"1px 5px",flexShrink:0}},lg.transitLine):null,
          lg.transitDirection?React.createElement("span",{style:{fontSize:10,color:C.mid,overflowWrap:"break-word",wordBreak:"break-word",maxWidth:"100%"}},lg.transitDirection):null,
          lg.duration?React.createElement("span",{style:{fontSize:10,color:C.mid,flexShrink:0}},lg.duration+(lg.durationUnit||"分鐘")):null,
          lg.estCost?React.createElement("span",{style:{fontSize:9,fontWeight:700,color:"#5A9A7A",background:"#EAF5EE",borderRadius:4,padding:"1px 5px",flexShrink:0}},"💰"+lg.estCost+(lg.estCurrency||"TWD")+(lg.costUnit==="perPerson"?"/人":"")):null,
          lg.transferTo?React.createElement("span",{style:{fontSize:9,color:C.teal,opacity:.8,overflowWrap:"break-word",wordBreak:"break-word",maxWidth:"100%"}},"→到"+lg.transferTo):null);}),
        conn.image?React.createElement("span",{onClick:function(e){e.stopPropagation();setImgView(true);},style:{fontSize:11,cursor:"pointer",flexShrink:0}},"📷"):null,
        conn.url?React.createElement("a",{href:conn.url,target:"_blank",rel:"noreferrer",onClick:function(e){e.stopPropagation();},style:{fontSize:11,flexShrink:0,textDecoration:"none"}},"🔗"):null,
        !hasInfo&&!hasCost?React.createElement("span",{style:{fontSize:10,color:C.mid,opacity:.5}},"＋ 交通資訊"):null,
        React.createElement("span",{style:{marginLeft:"auto",fontSize:10,color:C.mid,opacity:.4,flexShrink:0}},open?"▲":"▼"))),
    open?React.createElement("div",{style:{background:C.white,border:"1.5px solid "+C.border,borderRadius:12,padding:"10px 12px",marginTop:4,display:"flex",flexDirection:"column",gap:10,marginLeft:dragHandleProps?20:0,boxSizing:"border-box",maxWidth:"100%",overflowX:"hidden"}},
      React.createElement("div",null,React.createElement("div",{style:{fontSize:10,color:C.mid,fontWeight:600,marginBottom:3}},"出發時間"),React.createElement("input",{value:conn.time||"",onChange:function(e){updateConnField({time:e.target.value});},placeholder:"09:30",style:Object.assign({},bi,{width:"100%"})})),
      React.createElement("div",{style:{fontSize:10,color:C.mid,fontWeight:600,marginTop:2}},"票根照片（不會直接顯示，點圖示才會放大看）"),
      React.createElement(ImageUploader,{value:conn.image||null,onChange:function(v){updateConnField({image:v});}}),
      React.createElement("div",{style:{fontSize:10,color:C.mid,fontWeight:600,marginTop:2}},"或連結（訂票網址等）"),
      React.createElement("input",{value:conn.url||"",onChange:function(e){updateConnField({url:e.target.value});},placeholder:"https://…",style:Object.assign({},bi,{width:"100%"})}),
      legs.map(function(lg,li){return React.createElement("div",{key:li},
        React.createElement("div",{style:{background:C.light,borderRadius:10,padding:"8px 10px",display:"flex",flexDirection:"column",gap:8}},
          React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
            React.createElement("span",{style:{fontSize:10,color:C.teal,fontWeight:700}},"第 "+(li+1)+" 段交通"),
            React.createElement("button",{onClick:function(){removeLeg(li);},style:{background:"none",border:"none",color:"#C55",cursor:"pointer",fontSize:11,padding:0}},"✕ 移除")),
          React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8}},
            React.createElement("div",null,React.createElement("div",{style:{fontSize:10,color:C.mid,fontWeight:600,marginBottom:3}},"交通方式"),React.createElement("input",{value:lg.transitMode||"",onChange:function(e){updateLeg(li,{transitMode:e.target.value});},placeholder:"捷運 / 步行…",style:Object.assign({},bi,{width:"100%"})})),
            React.createElement("div",null,React.createElement("div",{style:{fontSize:10,color:C.mid,fontWeight:600,marginBottom:3}},"交通時間"),
              React.createElement("div",{style:{display:"flex",gap:4}},
                React.createElement("input",{type:"number",min:"0",value:lg.duration||"",onChange:function(e){updateLeg(li,{duration:e.target.value});},placeholder:"30",style:Object.assign({},bi,{flex:1,width:0})}),
                React.createElement("select",{value:lg.durationUnit||"分鐘",onChange:function(e){updateLeg(li,{durationUnit:e.target.value});},style:{padding:"6px 4px",border:"1.5px solid "+C.border,borderRadius:7,outline:"none",background:C.white,cursor:"pointer",flexShrink:0}},React.createElement("option",null,"分鐘"),React.createElement("option",null,"小時"),React.createElement("option",null,"天"))))),
          React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8}},
            React.createElement("div",null,React.createElement("div",{style:{fontSize:10,color:C.mid,fontWeight:600,marginBottom:3}},"捷運線名（選填）"),React.createElement("input",{value:lg.transitLine||"",onChange:function(e){updateLeg(li,{transitLine:e.target.value});},placeholder:"淡水信義線",style:Object.assign({},bi,{width:"100%"})})),
            React.createElement("div",null,React.createElement("div",{style:{fontSize:10,color:C.mid,fontWeight:600,marginBottom:3}},"捷運方向（選填）"),React.createElement("input",{value:lg.transitDirection||"",onChange:function(e){updateLeg(li,{transitDirection:e.target.value});},placeholder:"往淡水",style:Object.assign({},bi,{width:"100%"})}))),
          lg.transitLine?React.createElement("div",null,
            React.createElement("div",{style:{fontSize:10,color:C.mid,fontWeight:600,marginBottom:3}},"顏色"),
            React.createElement("div",{style:{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}},
              TRANSIT_COLORS.map(function(tc){return React.createElement("div",{key:tc.v,onClick:function(){updateLeg(li,{transitColor:tc.v});},style:{width:20,height:20,borderRadius:"50%",background:tc.v,cursor:"pointer",border:lg.transitColor===tc.v?"3px solid "+C.navy:"2px solid rgba(0,0,0,.15)",boxSizing:"border-box"}});}),
              React.createElement("input",{type:"color",value:lg.transitColor||"#888888",onChange:function(e){updateLeg(li,{transitColor:e.target.value});},style:{width:22,height:22,borderRadius:4,border:"1.5px solid "+C.border,cursor:"pointer",padding:0}}))):null,
          React.createElement("div",{style:{background:"#EAF5EE",borderRadius:9,padding:"7px 8px",display:"flex",flexDirection:"column",gap:6}},
            React.createElement("div",{style:{fontSize:9,color:"#5A9A7A",fontWeight:700}},"💰 這一段的預估花費"),
            React.createElement("div",{style:{display:"flex",gap:5}},
              React.createElement("input",{type:"number",min:"0",value:lg.estCost||"",onChange:function(e){updateLeg(li,{estCost:e.target.value});},placeholder:"0",style:Object.assign({},bi,{flex:1.3})}),
              React.createElement("select",{value:lg.estCurrency||"TWD",onChange:function(e){updateLeg(li,{estCurrency:e.target.value});},style:Object.assign({},bi,{flexShrink:0})},CURRENCIES.map(function(c){return React.createElement("option",{key:c,value:c},c);}))),
            React.createElement("div",{style:{display:"flex",gap:5}},
              React.createElement("button",{onClick:function(){updateLeg(li,{costUnit:"total"});},style:{flex:1,padding:"8px 4px",minHeight:32,borderRadius:6,border:"1.5px solid "+((lg.costUnit||"total")==="total"?C.teal:C.border),background:(lg.costUnit||"total")==="total"?C.white:"transparent",color:C.navy,cursor:"pointer",fontSize:9,fontWeight:(lg.costUnit||"total")==="total"?700:500}},"平分（總額）"),
              React.createElement("button",{onClick:function(){updateLeg(li,{costUnit:"perPerson"});},style:{flex:1,padding:"8px 4px",minHeight:32,borderRadius:6,border:"1.5px solid "+(lg.costUnit==="perPerson"?C.teal:C.border),background:lg.costUnit==="perPerson"?C.white:"transparent",color:C.navy,cursor:"pointer",fontSize:9,fontWeight:lg.costUnit==="perPerson"?700:500}},"每人")),
            onRecordExpense?React.createElement("button",{onClick:function(){onRecordExpense(conn,lg,li);},style:{padding:"8px 6px",minHeight:32,borderRadius:6,border:"1.5px solid #5A9A7A",background:C.white,color:"#3A6A50",cursor:"pointer",fontSize:10,fontWeight:600}},"記這一段的支出"):null)),
        li<legs.length-1?React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6,padding:"6px 4px 6px 14px"}},
          React.createElement("span",{style:{fontSize:14,color:C.teal}},"⇢"),
          React.createElement("input",{value:lg.transferTo||"",onChange:function(e){updateLeg(li,{transferTo:e.target.value});},placeholder:"到哪轉乘？（例：西門站）",style:Object.assign({},bi,{flex:1,fontSize:11,padding:"5px 8px",borderStyle:"dashed"})})):null);}),
      React.createElement("button",{onClick:addLeg,style:{padding:"10px",minHeight:36,borderRadius:9,border:"1.5px dashed "+C.teal,background:"none",color:C.teal,cursor:"pointer",fontSize:12,fontWeight:600}},"＋ 新增一段交通方式")):null,
    React.createElement("div",{style:{width:2,height:8,background:C.skyblue,alignSelf:"center"}})));
}

function MapSpotCard(props){
  var loc=props.loc,idx=props.idx,friends=props.friends,currentUser=props.currentUser;
  var onMust=props.onMust,onStatus=props.onStatus,onSelect=props.onSelect,onAlert=props.onAlert;
  var isSelected=props.isSelected,conn=props.conn,onConnChange=props.onConnChange,isLast=props.isLast,onRecordConnExpense=props.onRecordConnExpense;
  var st=loc.status||"active";
  var isMine=currentUser&&(loc.mustBy||[]).indexOf(currentUser.id)>=0;
  var bdr=isSelected?C.teal:(isMine?C.teal:(st==="visited"?"#5A9A7A":(st==="skipped"?C.skyblue:C.border)));
  var mode=getTimeMode(loc.mainCat||"其他"),tl=timeModeLabel(mode);
  var exS=useState(false);var expanded=exS[0];var setExpanded=exS[1];
  var notes=loc.notes||"";var notesLong=notes.split("\n").length>2||notes.length>80;
  return React.createElement("div",null,
    React.createElement("div",{onClick:function(){onSelect(loc.id);},style:{background:isSelected?"rgba(215,228,227,.35)":"rgba(255,255,255,.6)",backdropFilter:"blur(6px)",border:"2px solid "+bdr,borderRadius:14,filter:st==="skipped"?"grayscale(1) opacity(.5)":"none",cursor:"pointer"}},
      React.createElement("div",{style:{padding:"9px 11px"}},
        React.createElement("div",{style:{display:"flex",alignItems:"flex-start",gap:7}},
          React.createElement("div",{style:{background:isSelected?C.teal:C.navy,color:C.white,borderRadius:6,width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:9,flexShrink:0,marginTop:1}},idx+1),
          React.createElement("div",{style:{flex:1,minWidth:0}},
            React.createElement("div",{style:{display:"flex",gap:3,alignItems:"center",flexWrap:"wrap",marginBottom:2}},
              React.createElement(CatBadge,{cat:loc.mainCat||"其他",sub:loc.subCat,small:true}),
              st==="visited"?React.createElement("span",{style:{fontSize:9,background:"#5A9A7A",color:C.white,borderRadius:4,padding:"1px 5px",fontWeight:600}},"已造訪"):null,
              st==="skipped"?React.createElement("span",{style:{fontSize:9,background:C.teal,color:C.white,borderRadius:4,padding:"1px 5px",fontWeight:600}},"放棄"):null),
            React.createElement("div",{style:{fontSize:12,fontWeight:700,color:C.navy,marginBottom:2}},loc.name),
            mode==="checkin"&&(loc.checkIn||loc.checkOut)?React.createElement("div",{style:{fontSize:10,color:C.teal,marginBottom:1}},"🏨 "+tl.a+":"+(loc.checkIn||"—")+" / "+tl.b+":"+(loc.checkOut||"—")):null,
            mode!=="checkin"&&loc.hours?React.createElement("div",{style:{fontSize:10,color:C.teal,marginBottom:1}},"🕐 "+loc.hours):null,
            loc.image?React.createElement("div",{style:{marginTop:4,marginBottom:2},onClick:function(e){e.stopPropagation();}},React.createElement("img",{src:loc.image,alt:"",style:{width:"100%",maxHeight:90,objectFit:"cover",borderRadius:8,display:"block"}})):null,
            notes?React.createElement("div",{onClick:function(e){e.stopPropagation();}},
              React.createElement("div",{style:Object.assign({fontSize:10,color:C.mid,lineHeight:1.45,whiteSpace:"pre-wrap"},expanded?{}:{display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"})},notes),
              notesLong?React.createElement("button",{onClick:function(e){e.stopPropagation();setExpanded(function(v){return !v;});},style:{fontSize:9,color:C.teal,background:"none",border:"none",cursor:"pointer",padding:"1px 0",fontWeight:600}},expanded?"收起 ▲":"展開 ▼"):null):null),
          React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0},onClick:function(e){e.stopPropagation();}},
            React.createElement("button",{onClick:function(){if(currentUser)onMust(loc.id,currentUser.id);else if(onAlert)onAlert("請先選擇「我是誰」");},style:{background:"none",border:"none",cursor:"pointer",padding:0}},
              isMine?React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"#F5E6A3",stroke:"#C8B45A",strokeWidth:"1.8"},React.createElement("path",{d:"M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z"})):React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"#C8B45A",strokeWidth:"1.8"},React.createElement("path",{d:"M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z"}))),
            React.createElement(MustAvatars,{mustBy:loc.mustBy,friends:friends,size:12}))),
        React.createElement("div",{style:{display:"flex",gap:5,marginTop:6,paddingTop:5,borderTop:"1px solid rgba(78,85,92,.1)",flexWrap:"wrap"},onClick:function(e){e.stopPropagation();}},
          loc.gmapUrl?React.createElement("a",{href:loc.gmapUrl,target:"_blank",rel:"noreferrer",style:{width:32,height:32,minHeight:32,display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",background:"#4285F4",color:C.white,textDecoration:"none",fontWeight:600,boxSizing:"border-box",flexShrink:0}},React.createElement("span",{dangerouslySetInnerHTML:{__html:navIcon("pin",C.white,15)}})):null,
          React.createElement("button",{onClick:function(){onStatus(loc.id,"visited");},style:{fontSize:10,padding:"7px 10px",minHeight:32,borderRadius:7,border:"1.5px solid "+(st==="visited"?"#5A9A7A":C.border),background:st==="visited"?"#5A9A7A":"rgba(255,255,255,.8)",color:st==="visited"?C.white:C.mid,cursor:"pointer"}},"已造訪"),
          React.createElement("button",{onClick:function(){onStatus(loc.id,"skipped");},style:{fontSize:10,padding:"7px 10px",minHeight:32,borderRadius:7,border:"1.5px solid "+(st==="skipped"?C.teal:C.border),background:st==="skipped"?C.teal:"rgba(255,255,255,.8)",color:st==="skipped"?C.white:C.mid,cursor:"pointer"}},"放棄")))),
    !isLast&&onConnChange?React.createElement(ConnectorBlock,{conn:conn||{},onChange:onConnChange,onRecordExpense:onRecordConnExpense}):null);
}

function DraggableList(props){
  var items=props.items,connectors=props.connectors,onReorder=props.onReorder,onConnChange=props.onConnChange,renderCard=props.renderCard,isUnassigned=props.isUnassigned;
  var onDragCardStart=props.onDragCardStart,onDragCardEnd=props.onDragCardEnd,onDragHoverTab=props.onDragHoverTab,onDropOnDayTab=props.onDropOnDayTab,onRecordConnExpense=props.onRecordConnExpense;
  var selS=useState(new Set());var selected=selS[0];var setSelected=selS[1];
  var dragIndexS=useState(null);var dragIndex=dragIndexS[0];var setDragIndex=dragIndexS[1];
  var dragYS=useState(0);var dragY=dragYS[0];var setDragY=dragYS[1];
  var overIndexS=useState(null);var overIndex=overIndexS[0];var setOverIndex=overIndexS[1];
  var itemNodes=useRef({});
  var startYRef=useRef(0);
  var draggingRef=useRef(false);
  var shiftAmountRef=useRef(0);
  var staticPosRef=useRef({}); // 拖曳開始那一刻，每張卡片「還沒被位移前」的原始位置快照，拖曳過程中判斷插入點都用這份快照，不要跟正在做視覺位移的卡片互相干擾
  var rafRef=useRef(null);
  var pendingMoveRef=useRef(null);
  function toggleSelect(id,e){e.stopPropagation();setSelected(function(s){var n=new Set(s);if(n.has(id))n.delete(id);else n.add(id);return n;});}
  function clearSelect(){setSelected(new Set());}
  function computeOverIndex(clientY){
    var dragId=items[dragIndex]&&items[dragIndex].id;
    var excludeSet=selected.size>0?selected:new Set([dragId]);
    for(var i=0;i<items.length;i++){
      var loc=items[i];
      if(excludeSet.has(loc.id))continue;
      var pos=staticPosRef.current[loc.id];
      if(!pos)continue;
      var mid=pos.top+pos.height/2;
      if(clientY<mid)return i;
    }
    return items.length;
  }
  function handlePointerDown(e,i,locId){
    e.preventDefault();
    var captured=true;
    try{e.currentTarget.setPointerCapture(e.pointerId);}catch(err){captured=false;}
    // 保險機制：如果瀏覽器的 pointer capture 失敗或中途遺失，改用綁在 document 上的事件接住手指移動，避免拖到一半突然「斷線」沒反應
    if(!captured){
      document.addEventListener("pointermove",handlePointerMove);
      document.addEventListener("pointerup",handlePointerUp);
      document.addEventListener("pointercancel",handlePointerUp);
    }
    draggingRef.current=true;
    startYRef.current=e.clientY;
    setDragIndex(i);setDragY(0);setOverIndex(i);
    // 拖曳開始的當下，先把每張卡片目前（尚未套用任何位移）的實際位置記錄下來，整個拖曳過程都用這份快照做判斷，
    // 不要在拖曳中重複去讀取 DOM 位置——因為那時候其他卡片可能已經因為視覺讓位效果被位移過，讀到的會是不準確、還會互相干擾的數字
    var snap={};
    items.forEach(function(loc){var node=itemNodes.current[loc.id];if(node){var r=node.getBoundingClientRect();snap[loc.id]={top:r.top,height:r.height};}});
    staticPosRef.current=snap;
    // 量測被拖曳的這組卡片（含多選）的總高度，讓其他卡片拖曳時能挪出對應空間
    var movingIds=selected.size>0?selected:new Set([locId]);
    var total=0,gap=8,countedAny=false;
    items.forEach(function(loc){
      if(movingIds.has(loc.id)){
        var pos=snap[loc.id];
        if(pos){total+=pos.height;if(countedAny)total+=gap;countedAny=true;}
      }
    });
    shiftAmountRef.current=total;
    if(onDragCardStart)onDragCardStart(locId);
  }
  function applyPendingMove(){
    rafRef.current=null;
    var e=pendingMoveRef.current;
    if(!e||!draggingRef.current||dragIndex===null)return;
    var deltaY=e.clientY-startYRef.current;
    setDragY(deltaY);
    var elUnder=document.elementFromPoint(e.clientX,e.clientY);
    var tabEl=elUnder&&elUnder.closest?elUnder.closest("[data-day-tab]"):null;
    if(tabEl){
      if(onDragHoverTab)onDragHoverTab(tabEl.getAttribute("data-day-tab"));
    }else{
      if(onDragHoverTab)onDragHoverTab(null);
      setOverIndex(computeOverIndex(e.clientY));
    }
  }
  function handlePointerMove(e){
    if(!draggingRef.current||dragIndex===null)return;
    e.preventDefault();
    // 用 requestAnimationFrame 節流：手指移動事件觸發頻率很高，每次都同步計算+重新渲染容易卡頓，
    // 改成一個畫面更新週期最多處理一次，只保留最新的座標
    pendingMoveRef.current={clientX:e.clientX,clientY:e.clientY};
    if(rafRef.current===null)rafRef.current=requestAnimationFrame(applyPendingMove);
  }
  function handlePointerUp(e){
    if(rafRef.current!==null){cancelAnimationFrame(rafRef.current);rafRef.current=null;}
    document.removeEventListener("pointermove",handlePointerMove);
    document.removeEventListener("pointerup",handlePointerUp);
    document.removeEventListener("pointercancel",handlePointerUp);
    if(!draggingRef.current||dragIndex===null){draggingRef.current=false;return;}
    draggingRef.current=false;
    var elUnder=document.elementFromPoint(e.clientX,e.clientY);
    var tabEl=elUnder&&elUnder.closest?elUnder.closest("[data-day-tab]"):null;
    var actionTaken=false;
    if(tabEl){
      var day=tabEl.getAttribute("data-day-tab");
      var dragId=items[dragIndex]&&items[dragIndex].id;
      var dropIds=selected.size>0?Array.from(selected):(dragId?[dragId]:[]);
      if(onDropOnDayTab&&dropIds.length){onDropOnDayTab(dropIds,day);actionTaken=true;}
    }else if(onReorder&&overIndex!==null&&overIndex!==dragIndex){
      var selSet=selected.size>0?selected:new Set([items[dragIndex]&&items[dragIndex].id]);
      var moving=[],rest=[];
      items.forEach(function(loc,i){if(selSet.has(loc.id))moving.push(i);else rest.push(i);});
      var insertAt=rest.indexOf(overIndex);if(insertAt<0)insertAt=rest.length;
      rest.splice.apply(rest,[insertAt,0].concat(moving));
      onReorder(rest.map(function(i){return items[i];}));
      actionTaken=true;
    }
    if(actionTaken&&selected.size>0)setSelected(new Set());
    if(onDragHoverTab)onDragHoverTab(null);
    setDragIndex(null);setDragY(0);setOverIndex(null);
    if(onDragCardEnd)onDragCardEnd();
  }
  return React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8}},
    selected.size>0?React.createElement("div",{style:{fontSize:11,color:C.teal,fontWeight:600,textAlign:"center",background:C.skyblue+"55",borderRadius:8,padding:"4px 0"}},
      "已選 "+selected.size+" 個地點，拖曳任一張卡的「⠿」可一起移動　",React.createElement("button",{onClick:clearSelect,style:{background:"none",border:"none",color:C.navy,cursor:"pointer",fontSize:11,fontWeight:700}},"✕ 取消")):null,
    items.map(function(loc,i){
      var isSel=selected.has(loc.id),isDragging=dragIndex===i,isOver=overIndex===i&&dragIndex!==null&&dragIndex!==i;
      var isMoving=dragIndex!==null&&(isDragging||isSel); // 這張卡片是否屬於「正在被拖曳的這一組」（包含多選的其他卡片）
      var conn=connectors&&connectors[i];
      var showConn=!isUnassigned&&i<items.length-1&&!!onConnChange;
      var connBlock=showConn?React.createElement("div",{style:{marginLeft:20}},React.createElement(ConnectorBlock,{conn:conn||{},onChange:function(v){onConnChange(i,v);},onRecordExpense:onRecordConnExpense?function(c,lg,li){onRecordConnExpense(c,lg,li,items[i],items[i+1]);}:null})):null;
      var handleProps={onPointerDown:function(e){handlePointerDown(e,i,loc.id);},onPointerMove:handlePointerMove,onPointerUp:handlePointerUp,onPointerCancel:handlePointerUp,style:{touchAction:"none"}};
      // 拖曳中：讓「即將被插入位置」附近的原有卡片挪出空間，清楚顯示會插入在哪張卡片之上
      var shiftPx=0;
      if(dragIndex!==null&&!isMoving){
        if(overIndex>dragIndex&&i>dragIndex&&i<overIndex)shiftPx=-shiftAmountRef.current;
        else if(overIndex!==null&&overIndex<dragIndex&&i>=overIndex&&i<dragIndex)shiftPx=shiftAmountRef.current;
      }
      // 多選拖曳時，被選中的其他卡片要跟著手指一起視覺移動，不然看起來像沒有一起拖動
      var transform=isMoving?("translateY("+dragY+"px)"+(isDragging?" scale(1.02)":"")):(shiftPx?"translateY("+shiftPx+"px)":"none");
      return React.createElement("div",{key:loc.id,ref:function(node){if(node)itemNodes.current[loc.id]=node;else delete itemNodes.current[loc.id];},style:{opacity:isMoving?.9:1,outline:isOver?"2px dashed "+C.teal:"none",borderRadius:14,transition:isMoving?"none":"outline .1s, transform .15s",transform:transform,boxShadow:isMoving?"0 8px 18px rgba(78,85,92,.25)":"none",position:"relative",zIndex:isMoving?50:"auto"}},
        React.createElement("div",{style:{position:"relative"}},
          React.createElement("div",{onClick:function(e){toggleSelect(loc.id,e);},style:{position:"absolute",top:8,left:-8,zIndex:10,width:18,height:18,borderRadius:4,border:"2px solid "+(isSel?C.teal:C.border),background:isSel?C.teal:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:C.white,boxShadow:"0 1px 4px rgba(0,0,0,.12)"}},isSel?"✓":""),
          renderCard(loc,i,{isSelected:isSel,dragHandleProps:handleProps})),
        connBlock);
    }));
}

// ── CopyToTripMenu：複製地點到其他計畫的選單 ──
function CopyToTripMenu(props){
  var loc=props.loc,trips=props.trips,currentTripId=props.currentTripId,onCopyLocal=props.onCopyLocal,onCopyToTrip=props.onCopyToTrip,onClose=props.onClose;
  var otherTrips=trips.filter(function(t){return t.id!==currentTripId;});
  return React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.4)",zIndex:5000,display:"flex",alignItems:"center",justifyContent:"center",padding:24},onClick:function(e){if(e.target===e.currentTarget)onClose();}},
    React.createElement("div",{style:{background:C.white,borderRadius:18,padding:"18px 16px",width:"100%",maxWidth:320}},
      React.createElement("div",{style:{fontSize:14,fontWeight:700,color:C.navy,marginBottom:4}},"複製「"+loc.name+"」"),
      React.createElement("div",{style:{fontSize:11,color:C.mid,marginBottom:12}},"選擇目標"),
      React.createElement("button",{onClick:onCopyLocal,style:{width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid "+C.border,background:C.light,color:C.navy,cursor:"pointer",fontSize:13,textAlign:"left",marginBottom:8,fontWeight:600}},"📋 複製到本計畫（未分配）"),
      otherTrips.length>0?React.createElement("div",null,
        React.createElement("div",{style:{fontSize:11,color:C.mid,marginBottom:6,fontWeight:600}},"複製到其他計畫"),
        otherTrips.map(function(t){return React.createElement("button",{key:t.id,onClick:function(){onCopyToTrip(t.id);},style:{width:"100%",padding:"9px 14px",borderRadius:10,border:"1.5px solid "+C.border,background:C.white,color:C.navy,cursor:"pointer",fontSize:13,textAlign:"left",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}},React.createElement("span",null,t.name),React.createElement("span",{style:{fontSize:10,color:C.mid}},t.locCount>0?t.locCount+"個地點":""));})):React.createElement("div",{style:{fontSize:11,color:C.mid,textAlign:"center",padding:"8px 0"}},"（沒有其他旅行計畫）"),
      React.createElement("button",{onClick:onClose,style:{width:"100%",padding:"8px",borderRadius:10,border:"1.5px solid "+C.border,background:C.white,color:C.mid,cursor:"pointer",fontSize:13,marginTop:4}},"取消")));
}

function SpotCard(props){
  var loc=props.loc,idx=props.idx,friends=props.friends,currentUser=props.currentUser;
  var onEdit=props.onEdit,onStatus=props.onStatus,onMust=props.onMust,onDayPick=props.onDayPick,onAlert=props.onAlert;
  var onDelete=props.onDelete,onShowCopyMenu=props.onShowCopyMenu,isSelected=props.isSelected,dragHandleProps=props.dragHandleProps,onRecordExpense=props.onRecordExpense;
  var st=loc.status||"active";
  var isMine=currentUser&&(loc.mustBy||[]).indexOf(currentUser.id)>=0;
  var bdr=isSelected?C.teal:(isMine?C.teal:(st==="visited"?"#5A9A7A":(st==="skipped"?C.skyblue:C.border)));
  var mode=getTimeMode(loc.mainCat||"其他"),tl=timeModeLabel(mode);
  var iS=useState(false);var imgEnlarged=iS[0];var setImgEnlarged=iS[1];
  var exS=useState(false);var expanded=exS[0];var setExpanded=exS[1];
  var dS=useState(false);var showDel=dS[0];var setShowDel=dS[1];
  var moreS=useState(false);var showMoreMenu=moreS[0];var setShowMoreMenu=moreS[1];
  var notesLong=(loc.notes||"").split("\n").length>3||(loc.notes||"").length>120;
  return React.createElement(React.Fragment,null,
    showDel?React.createElement(ConfirmDialog,{msg:"確定要刪除「"+loc.name+"」？",onOk:function(){onDelete(loc.id);},onCancel:function(){setShowDel(false);}}):null,
    React.createElement("div",{style:{background:isSelected?C.skyblue+"33":C.white,border:"1.5px solid "+bdr,borderRadius:14,filter:st==="skipped"?"grayscale(1) opacity(.5)":"none",boxShadow:isMine?"0 2px 12px rgba(78,85,92,.18)":"0 1px 4px rgba(78,85,92,.07)"}},
      React.createElement("div",{style:{padding:"10px 12px"}},
        React.createElement("div",{style:{display:"flex",alignItems:"flex-start",gap:8}},
          React.createElement("div",Object.assign({style:{display:"flex",flexDirection:"column",alignItems:"center",gap:2,paddingTop:1,flexShrink:0,width:32,cursor:dragHandleProps?"grab":"default"}},dragHandleProps||{}),
            React.createElement("div",{style:{background:C.navy,color:C.white,borderRadius:6,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:10,pointerEvents:"none"}},idx+1),
            React.createElement("div",{style:{color:dragHandleProps?C.teal:"#ccc",fontSize:16,pointerEvents:"none"}},"⠿")),
          React.createElement("div",{style:{flex:1,minWidth:0}},
            React.createElement("div",{style:{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap",marginBottom:2}},
              React.createElement(CatBadge,{cat:loc.mainCat||"其他",sub:loc.subCat,small:true}),
              st==="visited"?React.createElement("span",{style:{fontSize:9,background:"#5A9A7A",color:C.white,borderRadius:4,padding:"1px 5px",fontWeight:600}},"已造訪"):null,
              st==="skipped"?React.createElement("span",{style:{fontSize:9,background:C.teal,color:C.white,borderRadius:4,padding:"1px 5px",fontWeight:600}},"放棄"):null),
            React.createElement("div",{style:{display:"flex",alignItems:"center",gap:5,marginBottom:2,flexWrap:"wrap"}},
              React.createElement("span",{style:{fontSize:13,fontWeight:700,color:C.navy}},loc.name),
              React.createElement("button",{onClick:function(){onDayPick(loc);},style:{fontSize:9,padding:"2px 6px",borderRadius:6,background:loc.day&&loc.day!==UNASSIGNED_TAB?C.navy:C.skyblue,color:loc.day&&loc.day!==UNASSIGNED_TAB?C.white:C.teal,border:"none",cursor:"pointer",fontWeight:600,flexShrink:0}},(loc.day&&loc.day!==UNASSIGNED_TAB?"第"+loc.day+"天":"未分配")+" ▾")),
            mode==="checkin"&&(loc.checkIn||loc.checkOut)?React.createElement("div",{style:{fontSize:11,color:C.teal,marginBottom:1}},"🏨 "+tl.a+": "+(loc.checkIn||"—")+" / "+tl.b+": "+(loc.checkOut||"—")):null,
            mode!=="checkin"&&loc.hours?React.createElement("div",{style:{fontSize:11,color:C.teal,marginBottom:1}},"🕐 "+tl.single+"："+loc.hours):null,
            loc.image?React.createElement("div",{style:{marginTop:6,marginBottom:2}},
              React.createElement("img",{src:loc.image,alt:"",onClick:function(){setImgEnlarged(true);},style:{width:"100%",maxHeight:140,objectFit:"cover",borderRadius:8,cursor:"pointer",display:"block"}}),
              imgEnlarged?React.createElement("div",{onClick:function(){setImgEnlarged(false);},style:{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}},React.createElement("img",{src:loc.image,alt:"",style:{maxWidth:"100%",maxHeight:"90vh",borderRadius:12,objectFit:"contain"}})):null):null,
            loc.notes?React.createElement("div",null,
              React.createElement("div",{style:Object.assign({fontSize:11,color:C.mid,lineHeight:1.5,whiteSpace:"pre-wrap",marginTop:1},expanded?{}:{display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"})},loc.notes),
              notesLong?React.createElement("button",{onClick:function(){setExpanded(function(v){return !v;});},style:{fontSize:10,color:C.teal,background:"none",border:"none",cursor:"pointer",padding:"2px 0",fontWeight:600}},expanded?"收起 ▲":"展開 ▼"):null):null,
            loc.addedBy?React.createElement("div",{style:{fontSize:10,color:C.teal,marginTop:1}},"👤 "+loc.addedBy):null,
            loc.estCost?React.createElement("div",{style:{marginTop:3}},React.createElement("span",{style:{fontSize:10,color:"#5A9A7A",fontWeight:600,background:"#EAF5EE",borderRadius:5,padding:"1px 6px"}},"💰 "+loc.estCost+" "+(loc.estCurrency||"TWD")+(loc.costUnit==="perPerson"?"/人":""))):null,
            (((loc.floors&&loc.floors.length)||loc.floor)||(loc.brands&&loc.brands.length))?React.createElement("div",{style:{display:"flex",gap:6,marginTop:3,flexWrap:"wrap"}},
              (loc.floors&&loc.floors.length&&typeof loc.floors[0]==="object")?loc.floors.map(function(fl){return React.createElement("span",{key:fl.id,style:{fontSize:10,color:C.navy,fontWeight:600,background:C.skyblue,borderRadius:5,padding:"1px 6px"}},"🏬"+fl.level+(fl.brands&&fl.brands.length?" "+fl.brands.filter(function(b){return b.checked;}).length+"/"+fl.brands.length:""));})
                :((loc.floors&&loc.floors.length)?React.createElement("span",{style:{fontSize:10,color:C.navy,fontWeight:600,background:C.skyblue,borderRadius:5,padding:"1px 6px"}},"🏬 "+loc.floors.join("、")):(loc.floor?React.createElement("span",{style:{fontSize:10,color:C.navy,fontWeight:600,background:C.skyblue,borderRadius:5,padding:"1px 6px"}},"🏬 "+loc.floor):null)),
              loc.brands&&loc.brands.length?React.createElement("span",{style:{fontSize:10,color:C.teal,fontWeight:600,background:C.light,borderRadius:5,padding:"1px 6px"}},"🏷️ "+loc.brands.filter(function(b){return b.checked;}).length+"/"+loc.brands.length+" 品牌"):null):null),
          React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0}},
            React.createElement("button",{onClick:function(){if(currentUser)onMust(loc.id,currentUser.id);else if(onAlert)onAlert("請先選擇「我是誰」");},style:{background:"none",border:"none",cursor:"pointer",padding:0,lineHeight:1}},
              isMine?React.createElement("svg",{width:20,height:20,viewBox:"0 0 24 24",fill:"#F5E6A3",stroke:"#C8B45A",strokeWidth:"1.8"},React.createElement("path",{d:"M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z"})):React.createElement("svg",{width:20,height:20,viewBox:"0 0 24 24",fill:"none",stroke:"#C8B45A",strokeWidth:"1.8"},React.createElement("path",{d:"M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z"}))),
            React.createElement(MustAvatars,{mustBy:loc.mustBy,friends:friends,size:14}))),
        React.createElement("div",{style:{display:"flex",gap:6,marginTop:7,paddingTop:6,borderTop:"1px solid "+C.border,flexWrap:"wrap",alignItems:"center"}},
          loc.gmapUrl?React.createElement("a",{href:loc.gmapUrl,target:"_blank",rel:"noreferrer",style:{width:36,height:36,minHeight:36,display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",background:"#4285F4",color:C.white,textDecoration:"none",fontWeight:600,boxSizing:"border-box",flexShrink:0}},React.createElement("span",{dangerouslySetInnerHTML:{__html:navIcon("pin",C.white,17)}})):null,
          React.createElement("button",{onClick:function(){onStatus(loc.id,"visited");},style:{fontSize:11,padding:"8px 12px",minHeight:36,borderRadius:8,border:"1.5px solid "+(st==="visited"?"#5A9A7A":C.border),background:st==="visited"?"#5A9A7A":C.white,color:st==="visited"?C.white:C.mid,cursor:"pointer"}},"已造訪"),
          React.createElement("button",{onClick:function(){onStatus(loc.id,"skipped");},style:{fontSize:11,padding:"8px 12px",minHeight:36,borderRadius:8,border:"1.5px solid "+(st==="skipped"?C.teal:C.border),background:st==="skipped"?C.teal:C.white,color:st==="skipped"?C.white:C.mid,cursor:"pointer"}},"放棄"),
          onRecordExpense?React.createElement("button",{onClick:function(){onRecordExpense(loc);},style:{padding:"8px 12px",minHeight:36,minWidth:36,borderRadius:8,border:"1.5px solid #C9E2D3",background:"#EAF5EE",color:"#3A6A50",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}},React.createElement("span",{dangerouslySetInnerHTML:{__html:navIcon("wallet","#3A6A50",16)}})):null,
          React.createElement("button",{onClick:function(){onEdit(loc);},style:{marginLeft:"auto",padding:"8px 12px",minHeight:36,minWidth:36,borderRadius:8,border:"1.5px solid "+C.border,background:C.white,color:C.mid,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}},React.createElement("span",{dangerouslySetInnerHTML:{__html:navIcon("pencil",C.mid,16)}})),
          React.createElement("div",{style:{position:"relative"}},
            React.createElement("button",{onClick:function(){setShowMoreMenu(function(s){return !s;});},style:{padding:"8px 12px",minHeight:36,minWidth:36,borderRadius:8,border:"1.5px solid "+C.border,background:showMoreMenu?C.light:C.white,color:C.mid,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}},React.createElement("span",{dangerouslySetInnerHTML:{__html:navIcon("more",C.mid,16)}})),
            showMoreMenu?React.createElement(React.Fragment,null,
              React.createElement("div",{onClick:function(){setShowMoreMenu(false);},style:{position:"fixed",inset:0,zIndex:40}}),
              React.createElement("div",{style:{position:"absolute",bottom:"100%",right:0,marginBottom:6,background:C.white,borderRadius:10,boxShadow:"0 4px 16px rgba(0,0,0,.2)",overflow:"hidden",zIndex:50,minWidth:130,border:"1px solid "+C.border}},
                React.createElement("button",{onClick:function(){setShowMoreMenu(false);onShowCopyMenu(loc);},style:{width:"100%",textAlign:"left",padding:"10px 14px",minHeight:40,border:"none",background:"none",color:C.navy,cursor:"pointer",fontSize:13,boxSizing:"border-box",display:"flex",alignItems:"center",gap:8}},React.createElement("span",{dangerouslySetInnerHTML:{__html:navIcon("clipboard",C.navy,15)}}),"複製"),
                React.createElement("button",{onClick:function(){setShowMoreMenu(false);setShowDel(true);},style:{width:"100%",textAlign:"left",padding:"10px 14px",minHeight:40,border:"none",background:"none",color:"#C55",cursor:"pointer",fontSize:13,boxSizing:"border-box",borderTop:"1px solid "+C.border,display:"flex",alignItems:"center",gap:8}},React.createElement("span",{dangerouslySetInnerHTML:{__html:navIcon("trash","#C55",15)}}),"刪除"))):null)))));
}

function DayPicker(props){
  var loc=props.loc,totalDays=props.totalDays,onAssign=props.onAssign,onClose=props.onClose,onAddDay=props.onAddDay,getDayLabel=props.getDayLabel,zIndex=props.zIndex||9700;
  return React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.4)",zIndex:zIndex,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px"},onClick:function(e){if(e.target===e.currentTarget)onClose();}},
    React.createElement("div",{style:{background:C.white,borderRadius:22,padding:"20px",width:"100%",maxWidth:400}},
      React.createElement("div",{style:{fontSize:14,fontWeight:700,color:C.navy,marginBottom:10}},"「"+loc.name+"」指派到哪天？"),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:10,maxHeight:240,overflowY:"auto",paddingRight:2}},
        Array.from({length:totalDays},function(_,i){return i+1;}).map(function(d){var act=String(loc.day)===String(d),lbl=getDayLabel(d),isObj=typeof lbl==="object";return React.createElement("button",{key:d,onClick:function(){onAssign(loc.id,d);onClose();},style:{padding:"9px 4px",borderRadius:12,border:"2px solid "+(act?C.teal:C.border),background:act?C.skyblue:C.light,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1}},isObj?[React.createElement("span",{key:"a",style:{fontSize:9,fontWeight:act?700:500,color:act?C.navy:C.mid}},lbl.line1),React.createElement("span",{key:"b",style:{fontSize:8,color:act?C.navy:C.mid,opacity:.8}},lbl.line2)]:React.createElement("span",{style:{fontSize:10,fontWeight:act?700:500,color:act?C.navy:C.mid}},lbl));}),
        React.createElement("button",{onClick:onAddDay,style:{padding:"9px 4px",borderRadius:12,border:"2px dashed "+C.border,background:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}},React.createElement("span",{style:{fontSize:18,color:C.teal}},"+"))),
      loc.day&&loc.day!==UNASSIGNED_TAB?React.createElement("button",{onClick:function(){onAssign(loc.id,UNASSIGNED_TAB);onClose();},style:{width:"100%",padding:"8px",borderRadius:10,border:"1.5px dashed "+C.skyblue,background:"none",color:C.mid,cursor:"pointer",fontSize:12}},"移回未分配"):null));
}

var INP={width:"100%",padding:"9px 12px",border:"1.5px solid "+C.border,borderRadius:10,fontSize:14,boxSizing:"border-box",background:C.white,color:C.navy,outline:"none"};

function EditModal(props){
  var spot=props.spot,friends=props.friends,onSave=props.onSave,onDelete=props.onDelete,onClose=props.onClose;
  var named=friends.filter(function(f){return f.name.trim()&&!f.archived;});
  var nS=useState(spot.name||"");var name=nS[0];var setName=nS[1];
  var mcS=useState(spot.mainCat||"景點");var mainCat=mcS[0];var setMainCat=mcS[1];
  var scS=useState(spot.subCat||"");var subCat=scS[0];var setSubCat=scS[1];
  var abS=useState(spot.addedBy||"");var addedBy=abS[0];var setAddedBy=abS[1];
  var noS=useState(spot.notes||"");var notes=noS[0];var setNotes=noS[1];
  var hoS=useState(spot.hours||"");var hours=hoS[0];var setHours=hoS[1];
  var ciS=useState(spot.checkIn||"");var checkIn=ciS[0];var setCheckIn=ciS[1];
  var coS=useState(spot.checkOut||"");var checkOut=coS[0];var setCheckOut=coS[1];
  var laS=useState(spot.lat!=null?String(spot.lat):"");var latStr=laS[0];var setLatStr=laS[1];
  var lgS=useState(spot.lng!=null?String(spot.lng):"");var lngStr=lgS[0];var setLngStr=lgS[1];
  var gmS=useState(spot.gmapUrl||"");var gmapUrl=gmS[0];var setGmapUrl=gmS[1];
  var imS=useState(spot.image||null);var image=imS[0];var setImage=imS[1];
  var cfS=useState(false);var showConfirm=cfS[0];var setShowConfirm=cfS[1];
  var ecS=useState(spot.estCost!=null?String(spot.estCost):"");var estCost=ecS[0];var setEstCost=ecS[1];
  var ecuS=useState(spot.estCurrency||"TWD");var estCurrency=ecuS[0];var setEstCurrency=ecuS[1];
  var cuS=useState(spot.costUnit||"total");var costUnit=cuS[0];var setCostUnit=cuS[1];
  var initFloors=(function(){
    if(spot.floors&&spot.floors.length&&typeof spot.floors[0]==="object")return spot.floors; // 已經是新格式（樓層底下帶品牌）
    var arr=[];
    if(spot.floors&&spot.floors.length)arr=spot.floors.map(function(lv){return {id:uid(),level:lv,brands:[]};}); // 舊格式：純樓層字串陣列
    else if(spot.floor)arr=[{id:uid(),level:spot.floor,brands:[]}]; // 更舊格式：單一樓層字串
    if(spot.brands&&spot.brands.length){ // 更舊格式：品牌是沒有樓層歸屬的扁平陣列，掛到第一個樓層避免資料遺失
      if(!arr.length)arr=[{id:uid(),level:"未分類",brands:[]}];
      arr[0]=Object.assign({},arr[0],{brands:arr[0].brands.concat(spot.brands)});
    }
    return arr;
  })();
  var floorsS=useState(initFloors);var floors=floorsS[0];var setFloors=floorsS[1];
  var newFloorLevelS=useState("1F");var newFloorLevel=newFloorLevelS[0];var setNewFloorLevel=newFloorLevelS[1];
  var brandInputS=useState({});var brandInputs=brandInputS[0];var setBrandInputs=brandInputS[1];
  function addFloorLevel(){if(floors.some(function(f){return f.level===newFloorLevel;}))return;setFloors(function(f){return f.concat([{id:uid(),level:newFloorLevel,brands:[]}]);});}
  function removeFloorLevel(id){setFloors(function(f){return f.filter(function(x){return x.id!==id;});});}
  function setBrandInput(floorId,val){setBrandInputs(function(m){var n=Object.assign({},m);n[floorId]=val;return n;});}
  function addBrandToFloor(floorId){
    var val=(brandInputs[floorId]||"").trim();
    if(!val)return;
    setFloors(function(f){return f.map(function(fl){return fl.id===floorId?Object.assign({},fl,{brands:fl.brands.concat([{id:uid(),name:val,checked:false}])}):fl;});});
    setBrandInput(floorId,"");
  }
  function toggleBrandInFloor(floorId,brandId){setFloors(function(f){return f.map(function(fl){return fl.id===floorId?Object.assign({},fl,{brands:fl.brands.map(function(b){return b.id===brandId?Object.assign({},b,{checked:!b.checked}):b;})}):fl;});});}
  function removeBrandFromFloor(floorId,brandId){setFloors(function(f){return f.map(function(fl){return fl.id===floorId?Object.assign({},fl,{brands:fl.brands.filter(function(b){return b.id!==brandId;})}):fl;});});}
  var mode=getTimeMode(mainCat),tl=timeModeLabel(mode);
  function doSave(){var latN=latStr?parseFloat(latStr):null,lngN=lngStr?parseFloat(lngStr):null;var ecN=estCost?parseFloat(estCost):null;onSave(Object.assign({},spot,{name:name,mainCat:mainCat,subCat:subCat,addedBy:addedBy,notes:notes,hours:hours,checkIn:checkIn,checkOut:checkOut,image:image,lat:latN&&!isNaN(latN)?latN:null,lng:lngN&&!isNaN(lngN)?lngN:null,gmapUrl:gmapUrl,estCost:ecN&&!isNaN(ecN)?ecN:null,estCurrency:estCurrency,costUnit:costUnit,floor:null,floors:floors,brands:null}));}
  return React.createElement(React.Fragment,null,
    showConfirm?React.createElement(ConfirmDialog,{msg:"確定要刪除「"+spot.name+"」？",onOk:function(){onDelete(spot.id);},onCancel:function(){setShowConfirm(false);}}):null,
    React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.5)",zIndex:3000,display:"flex",alignItems:"flex-end",justifyContent:"center"},onClick:function(e){if(e.target===e.currentTarget)onClose();}},
      React.createElement("div",{style:{background:C.light,width:"100%",maxWidth:480,borderRadius:"22px 22px 0 0",maxHeight:"90vh",overflowY:"auto",paddingBottom:"calc(32px + env(safe-area-inset-bottom, 0px))"}},
        React.createElement("div",{style:{background:C.white,padding:"14px 16px",borderRadius:"22px 22px 0 0",borderBottom:"1px solid "+C.border,position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center"}},
          React.createElement("span",{style:{fontSize:16,fontWeight:700,color:C.navy}},"編輯地點"),
          React.createElement("button",{onClick:onClose,style:{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.mid}},"×")),
        React.createElement("div",{style:{padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}},
          React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"地點名稱"),React.createElement("input",{value:name,onChange:function(e){setName(e.target.value);},style:INP})),
          React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
            React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:8,fontWeight:600}},"分類"),
            React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}},CATS.map(function(c){var a=c===mainCat;return React.createElement("button",{key:c,onClick:function(){setMainCat(c);setSubCat("");},style:{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 11px 5px 7px",borderRadius:20,border:"2px solid "+(a?CAT_COLOR[c]:C.border),background:a?CAT_BG[c]:C.light,color:CAT_COLOR[c]||C.teal,fontSize:12,cursor:"pointer",fontWeight:a?700:400}},React.createElement("span",{dangerouslySetInnerHTML:{__html:makeSvgIcon(c,CAT_COLOR[c]||C.teal,14)}}),c);})),
            SUB[mainCat]&&SUB[mainCat].length>0?React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}},SUB[mainCat].map(function(s){var a=s===subCat;return React.createElement("button",{key:s,onClick:function(){setSubCat(a?"":s);},style:{padding:"3px 11px",borderRadius:14,border:"1.5px solid "+(a?C.teal:C.border),background:a?C.skyblue:C.white,color:a?C.navy:C.mid,fontSize:11,cursor:"pointer"}},s);})):null,
            React.createElement("input",{value:subCat,onChange:function(e){setSubCat(e.target.value);},placeholder:"自由輸入次分類…",style:Object.assign({},INP,{fontSize:12,padding:"6px 10px"})})),
          React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},
            React.createElement("div",null,React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"新增者"),React.createElement("select",{value:addedBy,onChange:function(e){setAddedBy(e.target.value);},style:INP},React.createElement("option",{value:""},"選擇"),named.map(function(f){return React.createElement("option",{key:f.id,value:f.name},f.name);}))),
            mode!=="checkin"?React.createElement("div",null,React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},tl.single),React.createElement("input",{value:hours,onChange:function(e){setHours(e.target.value);},style:INP})):null),
          mode==="checkin"?React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},
            React.createElement("div",null,React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},tl.a),React.createElement("input",{value:checkIn,onChange:function(e){setCheckIn(e.target.value);},placeholder:"15:00",style:INP})),
            React.createElement("div",null,React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},tl.b),React.createElement("input",{value:checkOut,onChange:function(e){setCheckOut(e.target.value);},placeholder:"11:00",style:INP}))):null,
          (mainCat==="購物"&&subCat==="百貨商場")?React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13,display:"flex",flexDirection:"column",gap:10}},
            React.createElement("div",{style:{fontSize:12,color:C.mid,fontWeight:600}},"🏬 樓層與品牌"),
            floors.map(function(fl){return React.createElement("div",{key:fl.id,style:{background:C.light,borderRadius:10,padding:"9px 10px",display:"flex",flexDirection:"column",gap:6}},
              React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
                React.createElement("span",{style:{fontSize:12,fontWeight:700,color:C.navy}},fl.level+" ・ "+fl.brands.filter(function(b){return b.checked;}).length+"/"+fl.brands.length),
                React.createElement("button",{onClick:function(){removeFloorLevel(fl.id);},style:{background:"none",border:"none",color:"#C55",cursor:"pointer",fontSize:11,padding:0}},"✕ 移除樓層")),
              fl.brands.map(function(b){return React.createElement("div",{key:b.id,style:{display:"flex",alignItems:"center",gap:8,padding:"3px 2px"}},
                React.createElement("button",{onClick:function(){toggleBrandInFloor(fl.id,b.id);},style:{width:18,height:18,borderRadius:5,border:"1.5px solid "+(b.checked?"#5A9A7A":C.border),background:b.checked?"#5A9A7A":C.white,color:C.white,cursor:"pointer",flexShrink:0,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}},b.checked?"✓":""),
                React.createElement("span",{style:{flex:1,fontSize:12,color:C.navy,textDecoration:b.checked?"line-through":"none",opacity:b.checked?.55:1}},b.name),
                React.createElement("button",{onClick:function(){removeBrandFromFloor(fl.id,b.id);},style:{background:"none",border:"none",color:"#C55",cursor:"pointer",fontSize:15,padding:"0 4px"}},"×"));}),
              React.createElement("div",{style:{display:"flex",gap:6,marginTop:2}},
                React.createElement("input",{value:brandInputs[fl.id]||"",onChange:function(e){setBrandInput(fl.id,e.target.value);},placeholder:"新增品牌，例：Nike",onKeyDown:function(e){if(e.key==="Enter"){e.preventDefault();addBrandToFloor(fl.id);}},style:Object.assign({},INP,{flex:1,fontSize:12,padding:"6px 10px"})}),
                React.createElement("button",{onClick:function(){addBrandToFloor(fl.id);},style:{padding:"0 14px",minHeight:32,borderRadius:8,background:C.teal,color:C.white,border:"none",cursor:"pointer",fontSize:12,fontWeight:700}},"加入")));}),
            React.createElement("div",{style:{display:"flex",gap:6}},
              React.createElement("select",{value:newFloorLevel,onChange:function(e){setNewFloorLevel(e.target.value);},style:Object.assign({},INP,{flex:1})},FLOOR_OPTIONS.map(function(lv){return React.createElement("option",{key:lv,value:lv},lv);})),
              React.createElement("button",{onClick:addFloorLevel,style:{padding:"0 16px",minHeight:36,borderRadius:10,background:C.teal,color:C.white,border:"none",cursor:"pointer",fontSize:13,fontWeight:700}},"＋ 新增樓層"))):null,
          (mainCat!=="住宿"&&mainCat!=="購物")?React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
            React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:8,fontWeight:600}},"💰 預估花費（門票/消費…）"),
            React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}},
              React.createElement("div",null,React.createElement("input",{type:"number",min:"0",value:estCost,onChange:function(e){setEstCost(e.target.value);},placeholder:"0",style:Object.assign({},INP,{fontSize:12,padding:"6px 10px"})})),
              React.createElement("div",null,React.createElement("select",{value:estCurrency,onChange:function(e){setEstCurrency(e.target.value);},style:Object.assign({},INP,{fontSize:12,padding:"6px 10px"})},CURRENCIES.map(function(c){return React.createElement("option",{key:c,value:c},c);})))),
            React.createElement("div",{style:{display:"flex",gap:6}},
              React.createElement("button",{onClick:function(){setCostUnit("total");},style:{flex:1,padding:"9px 6px",minHeight:36,borderRadius:8,border:"1.5px solid "+(costUnit==="total"?C.teal:C.border),background:costUnit==="total"?C.skyblue:C.light,color:C.navy,cursor:"pointer",fontSize:11,fontWeight:costUnit==="total"?700:500}},"平分（這是總額）"),
              React.createElement("button",{onClick:function(){setCostUnit("perPerson");},style:{flex:1,padding:"9px 6px",minHeight:36,borderRadius:8,border:"1.5px solid "+(costUnit==="perPerson"?C.teal:C.border),background:costUnit==="perPerson"?C.skyblue:C.light,color:C.navy,cursor:"pointer",fontSize:11,fontWeight:costUnit==="perPerson"?700:500}},"每人（這是單人金額）"))):
          React.createElement("div",{style:{background:"#EAF2F6",borderRadius:14,padding:13,fontSize:11,color:"#4A6A8A"}},mainCat==="住宿"?"💡 住宿花費請到「💰記帳分帳」新增機票/住宿項目裡記錄":"💡 購物花費請到「🛍️願望清單」裡記錄"),
          React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},React.createElement(ImageUploader,{value:image,onChange:setImage})),
          React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"備註"),React.createElement("textarea",{value:notes,onChange:function(e){setNotes(e.target.value);},style:Object.assign({},INP,{minHeight:64,resize:"vertical"})})),
          React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
            React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:8,fontWeight:600}},"📍 座標 & 地圖"),
            React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}},
              React.createElement("div",null,React.createElement("div",{style:{fontSize:11,color:C.mid,marginBottom:3}},"緯度"),React.createElement("input",{value:latStr,onChange:function(e){setLatStr(e.target.value);},placeholder:"25.0330",style:Object.assign({},INP,{fontSize:12,padding:"6px 10px"})})),
              React.createElement("div",null,React.createElement("div",{style:{fontSize:11,color:C.mid,marginBottom:3}},"經度"),React.createElement("input",{value:lngStr,onChange:function(e){setLngStr(e.target.value);},placeholder:"121.5654",style:Object.assign({},INP,{fontSize:12,padding:"6px 10px"})}))),
            React.createElement(GeoInputBlock,{name:spot.name,city:spot.city||"",onResult:function(r){if(r.lat)setLatStr(r.lat);if(r.lng)setLngStr(r.lng);if(r.gmapUrl)setGmapUrl(r.gmapUrl);}}),
            React.createElement("div",{style:{fontSize:11,color:C.mid,marginBottom:3,marginTop:8}},"導航連結"),
            React.createElement("input",{value:gmapUrl,onChange:function(e){setGmapUrl(e.target.value);},placeholder:"https://…",style:Object.assign({},INP,{fontSize:12,padding:"6px 10px"})}),
            latStr&&lngStr?React.createElement("div",{style:{fontSize:10,color:"#5A9A7A",marginTop:4}},"📍 "+parseFloat(latStr).toFixed(4)+", "+parseFloat(lngStr).toFixed(4)):null),
          React.createElement("div",{style:{display:"flex",gap:8}},
            React.createElement("button",{onClick:function(){setShowConfirm(true);},style:{padding:"11px 14px",borderRadius:12,border:"1.5px solid #F5C6C6",color:"#C55",background:"#FFF5F5",cursor:"pointer",fontSize:13,fontWeight:600}},"🗑 刪除"),
            React.createElement("button",{onClick:doSave,disabled:!name.trim(),style:{flex:1,padding:"12px",borderRadius:12,background:name.trim()?C.teal:"#ccc",color:C.white,border:"none",cursor:name.trim()?"pointer":"default",fontSize:14,fontWeight:700}},"儲存變更"))))));
}

function AddSpotModal(props){
  var friends=props.friends,onSave=props.onSave,onClose=props.onClose;
  var named=friends.filter(function(f){return f.name.trim()&&!f.archived;});
  var nS=useState("");var name=nS[0];var setName=nS[1];
  var cyS=useState("");var city=cyS[0];var setCity=cyS[1];
  var mcS=useState("景點");var mainCat=mcS[0];var setMainCat=mcS[1];
  var scS=useState("");var subCat=scS[0];var setSubCat=scS[1];
  var abS=useState("");var addedBy=abS[0];var setAddedBy=abS[1];
  var noS=useState("");var notes=noS[0];var setNotes=noS[1];
  var hoS=useState("");var hours=hoS[0];var setHours=hoS[1];
  var ciS=useState("");var checkIn=ciS[0];var setCheckIn=ciS[1];
  var coS=useState("");var checkOut=coS[0];var setCheckOut=coS[1];
  var laS=useState("");var latStr=laS[0];var setLatStr=laS[1];
  var lgS=useState("");var lngStr=lgS[0];var setLngStr=lgS[1];
  var gmS=useState("");var gmapUrl=gmS[0];var setGmapUrl=gmS[1];
  var aiLS=useState(false);var aiLoading=aiLS[0];var setAiLoading=aiLS[1];
  var aiDS=useState(false);var aiDone=aiDS[0];var setAiDone=aiDS[1];
  var imS=useState(null);var image=imS[0];var setImage=imS[1];
  var ecS=useState("");var estCost=ecS[0];var setEstCost=ecS[1];
  var ecuS=useState("TWD");var estCurrency=ecuS[0];var setEstCurrency=ecuS[1];
  var cuS=useState("total");var costUnit=cuS[0];var setCostUnit=cuS[1];
  var floorsS=useState([]);var floors=floorsS[0];var setFloors=floorsS[1];
  var newFloorLevelS=useState("1F");var newFloorLevel=newFloorLevelS[0];var setNewFloorLevel=newFloorLevelS[1];
  var brandInputS=useState({});var brandInputs=brandInputS[0];var setBrandInputs=brandInputS[1];
  function addFloorLevel(){if(floors.some(function(f){return f.level===newFloorLevel;}))return;setFloors(function(f){return f.concat([{id:uid(),level:newFloorLevel,brands:[]}]);});}
  function removeFloorLevel(id){setFloors(function(f){return f.filter(function(x){return x.id!==id;});});}
  function setBrandInput(floorId,val){setBrandInputs(function(m){var n=Object.assign({},m);n[floorId]=val;return n;});}
  function addBrandToFloor(floorId){
    var val=(brandInputs[floorId]||"").trim();
    if(!val)return;
    setFloors(function(f){return f.map(function(fl){return fl.id===floorId?Object.assign({},fl,{brands:fl.brands.concat([{id:uid(),name:val,checked:false}])}):fl;});});
    setBrandInput(floorId,"");
  }
  function toggleBrandInFloor(floorId,brandId){setFloors(function(f){return f.map(function(fl){return fl.id===floorId?Object.assign({},fl,{brands:fl.brands.map(function(b){return b.id===brandId?Object.assign({},b,{checked:!b.checked}):b;})}):fl;});});}
  function removeBrandFromFloor(floorId,brandId){setFloors(function(f){return f.map(function(fl){return fl.id===floorId?Object.assign({},fl,{brands:fl.brands.filter(function(b){return b.id!==brandId;})}):fl;});});}
  var mode=getTimeMode(mainCat),tl=timeModeLabel(mode);
  function queryAI(){if(!name.trim())return;setAiLoading(true);setAiDone(false);fetchAIDetail(name.trim(),city.trim()).then(function(ai){setAiLoading(false);setAiDone(true);if(ai){var parts=[];if(ai.status)parts.push("📍 "+ai.status);if(ai.tips)parts.push("💡 "+ai.tips);if(parts.length)setNotes(parts.join("\n"));if(ai.hours&&!hours)setHours(ai.hours);if(ai.lat&&ai.lng&&!latStr){setLatStr(String(ai.lat));setLngStr(String(ai.lng));setGmapUrl("https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(name+(city?" "+city:"")));}}});}
  function save(){if(!name.trim())return;var latN=latStr?parseFloat(latStr):null,lngN=lngStr?parseFloat(lngStr):null;var ecN=estCost?parseFloat(estCost):null;var gUrl=gmapUrl||"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(name+(city?" "+city:""));onSave({id:uid(),name:name.trim(),mainCat:mainCat,subCat:subCat,day:UNASSIGNED_TAB,addedBy:addedBy,notes:notes,hours:hours,checkIn:checkIn,checkOut:checkOut,image:image,status:"active",mustBy:[],order:Date.now(),lat:latN&&!isNaN(latN)?latN:null,lng:lngN&&!isNaN(lngN)?lngN:null,city:city,gmapUrl:gUrl,estCost:ecN&&!isNaN(ecN)?ecN:null,estCurrency:estCurrency,costUnit:costUnit,floor:null,floors:floors,brands:null});}
  return React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.5)",zIndex:3000,display:"flex",alignItems:"flex-end",justifyContent:"center"},onClick:function(e){if(e.target===e.currentTarget)onClose();}},
    React.createElement("div",{style:{background:C.light,width:"100%",maxWidth:480,borderRadius:"22px 22px 0 0",maxHeight:"90vh",overflowY:"auto",paddingBottom:"calc(32px + env(safe-area-inset-bottom, 0px))"}},
      React.createElement("div",{style:{background:C.white,padding:"14px 16px",borderRadius:"22px 22px 0 0",borderBottom:"1px solid "+C.border,position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center"}},
        React.createElement("span",{style:{fontSize:16,fontWeight:700,color:C.navy}},"新增地點"),
        React.createElement("button",{onClick:onClose,style:{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.mid}},"×")),
      React.createElement("div",{style:{padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}},
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"地點名稱 *"),
          React.createElement("input",{value:name,onChange:function(e){setName(e.target.value);},placeholder:"例：台北101、鼎泰豐…",style:INP,autoFocus:true}),
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginTop:10,marginBottom:4,fontWeight:600}},"城市（選填）"),
          React.createElement("div",{style:{display:"flex",gap:8}},
            React.createElement("input",{value:city,onChange:function(e){setCity(e.target.value);},placeholder:"台北、東京…",style:Object.assign({},INP,{flex:1})}),
            React.createElement("button",{onClick:queryAI,disabled:!name.trim()||aiLoading,style:{padding:"9px 14px",borderRadius:10,background:name.trim()&&!aiLoading?C.teal:"#ccc",color:C.white,border:"none",cursor:name.trim()&&!aiLoading?"pointer":"default",fontSize:12,fontWeight:700,flexShrink:0}},aiLoading?"查詢中…":"✨ AI")),
          aiDone?React.createElement("div",{style:{marginTop:6,fontSize:11,color:"#5A9A7A",fontWeight:600}},"✓ AI 資訊已填入"):null),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:8,fontWeight:600}},"主分類"),
          React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}},CATS.map(function(c){var a=c===mainCat;return React.createElement("button",{key:c,onClick:function(){setMainCat(c);setSubCat("");},style:{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 11px 5px 7px",borderRadius:20,border:"2px solid "+(a?CAT_COLOR[c]:C.border),background:a?CAT_BG[c]:C.light,color:CAT_COLOR[c]||C.teal,fontSize:12,cursor:"pointer",fontWeight:a?700:400}},React.createElement("span",{dangerouslySetInnerHTML:{__html:makeSvgIcon(c,CAT_COLOR[c]||C.teal,14)}}),c);})),
          SUB[mainCat]&&SUB[mainCat].length>0?React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}},SUB[mainCat].map(function(s){var a=s===subCat;return React.createElement("button",{key:s,onClick:function(){setSubCat(a?"":s);},style:{padding:"3px 11px",borderRadius:14,border:"1.5px solid "+(a?C.teal:C.border),background:a?C.skyblue:C.white,color:a?C.navy:C.mid,fontSize:11,cursor:"pointer"}},s);})):null,
          React.createElement("input",{value:subCat,onChange:function(e){setSubCat(e.target.value);},placeholder:"自由輸入次分類…",style:Object.assign({},INP,{fontSize:12,padding:"6px 10px"})})),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},
          React.createElement("div",null,React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"新增者"),React.createElement("select",{value:addedBy,onChange:function(e){setAddedBy(e.target.value);},style:INP},React.createElement("option",{value:""},"選擇旅伴"),named.map(function(f){return React.createElement("option",{key:f.id,value:f.name},f.name);}))),
          mode!=="checkin"?React.createElement("div",null,React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},tl.single),React.createElement("input",{value:hours,onChange:function(e){setHours(e.target.value);},placeholder:"09:00–18:00",style:INP})):null),
        mode==="checkin"?React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},
          React.createElement("div",null,React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},tl.a),React.createElement("input",{value:checkIn,onChange:function(e){setCheckIn(e.target.value);},placeholder:"15:00",style:INP})),
          React.createElement("div",null,React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},tl.b),React.createElement("input",{value:checkOut,onChange:function(e){setCheckOut(e.target.value);},placeholder:"11:00",style:INP}))):null,
        (mainCat==="購物"&&subCat==="百貨商場")?React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13,display:"flex",flexDirection:"column",gap:10}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,fontWeight:600}},"🏬 樓層與品牌"),
          floors.map(function(fl){return React.createElement("div",{key:fl.id,style:{background:C.light,borderRadius:10,padding:"9px 10px",display:"flex",flexDirection:"column",gap:6}},
            React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
              React.createElement("span",{style:{fontSize:12,fontWeight:700,color:C.navy}},fl.level+" ・ "+fl.brands.filter(function(b){return b.checked;}).length+"/"+fl.brands.length),
              React.createElement("button",{onClick:function(){removeFloorLevel(fl.id);},style:{background:"none",border:"none",color:"#C55",cursor:"pointer",fontSize:11,padding:0}},"✕ 移除樓層")),
            fl.brands.map(function(b){return React.createElement("div",{key:b.id,style:{display:"flex",alignItems:"center",gap:8,padding:"3px 2px"}},
              React.createElement("button",{onClick:function(){toggleBrandInFloor(fl.id,b.id);},style:{width:18,height:18,borderRadius:5,border:"1.5px solid "+(b.checked?"#5A9A7A":C.border),background:b.checked?"#5A9A7A":C.white,color:C.white,cursor:"pointer",flexShrink:0,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}},b.checked?"✓":""),
              React.createElement("span",{style:{flex:1,fontSize:12,color:C.navy,textDecoration:b.checked?"line-through":"none",opacity:b.checked?.55:1}},b.name),
              React.createElement("button",{onClick:function(){removeBrandFromFloor(fl.id,b.id);},style:{background:"none",border:"none",color:"#C55",cursor:"pointer",fontSize:15,padding:"0 4px"}},"×"));}),
            React.createElement("div",{style:{display:"flex",gap:6,marginTop:2}},
              React.createElement("input",{value:brandInputs[fl.id]||"",onChange:function(e){setBrandInput(fl.id,e.target.value);},placeholder:"新增品牌，例：Nike",onKeyDown:function(e){if(e.key==="Enter"){e.preventDefault();addBrandToFloor(fl.id);}},style:Object.assign({},INP,{flex:1,fontSize:12,padding:"6px 10px"})}),
              React.createElement("button",{onClick:function(){addBrandToFloor(fl.id);},style:{padding:"0 14px",minHeight:32,borderRadius:8,background:C.teal,color:C.white,border:"none",cursor:"pointer",fontSize:12,fontWeight:700}},"加入")));}),
          React.createElement("div",{style:{display:"flex",gap:6}},
            React.createElement("select",{value:newFloorLevel,onChange:function(e){setNewFloorLevel(e.target.value);},style:Object.assign({},INP,{flex:1})},FLOOR_OPTIONS.map(function(lv){return React.createElement("option",{key:lv,value:lv},lv);})),
            React.createElement("button",{onClick:addFloorLevel,style:{padding:"0 16px",minHeight:36,borderRadius:10,background:C.teal,color:C.white,border:"none",cursor:"pointer",fontSize:13,fontWeight:700}},"＋ 新增樓層"))):null,
        (mainCat!=="住宿"&&mainCat!=="購物")?React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:8,fontWeight:600}},"💰 預估花費（門票/消費…，選填）"),
          React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}},
            React.createElement("div",null,React.createElement("input",{type:"number",min:"0",value:estCost,onChange:function(e){setEstCost(e.target.value);},placeholder:"0",style:Object.assign({},INP,{fontSize:12,padding:"6px 10px"})})),
            React.createElement("div",null,React.createElement("select",{value:estCurrency,onChange:function(e){setEstCurrency(e.target.value);},style:Object.assign({},INP,{fontSize:12,padding:"6px 10px"})},CURRENCIES.map(function(c){return React.createElement("option",{key:c,value:c},c);})))),
          React.createElement("div",{style:{display:"flex",gap:6}},
            React.createElement("button",{onClick:function(){setCostUnit("total");},style:{flex:1,padding:"9px 6px",minHeight:36,borderRadius:8,border:"1.5px solid "+(costUnit==="total"?C.teal:C.border),background:costUnit==="total"?C.skyblue:C.light,color:C.navy,cursor:"pointer",fontSize:11,fontWeight:costUnit==="total"?700:500}},"平分（這是總額）"),
            React.createElement("button",{onClick:function(){setCostUnit("perPerson");},style:{flex:1,padding:"9px 6px",minHeight:36,borderRadius:8,border:"1.5px solid "+(costUnit==="perPerson"?C.teal:C.border),background:costUnit==="perPerson"?C.skyblue:C.light,color:C.navy,cursor:"pointer",fontSize:11,fontWeight:costUnit==="perPerson"?700:500}},"每人（這是單人金額）"))):
        React.createElement("div",{style:{background:"#EAF2F6",borderRadius:14,padding:13,fontSize:11,color:"#4A6A8A"}},mainCat==="住宿"?"💡 住宿花費請到「💰記帳分帳」新增機票/住宿項目裡記錄":"💡 購物花費請到「🛍️願望清單」裡記錄"),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},React.createElement(ImageUploader,{value:image,onChange:setImage})),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"備註"),React.createElement("textarea",{value:notes,onChange:function(e){setNotes(e.target.value);},placeholder:"個人備忘…",style:Object.assign({},INP,{minHeight:60,resize:"vertical"})})),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:8,fontWeight:600}},"📍 座標（選填）"),
          React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}},
            React.createElement("div",null,React.createElement("div",{style:{fontSize:11,color:C.mid,marginBottom:3}},"緯度"),React.createElement("input",{value:latStr,onChange:function(e){setLatStr(e.target.value);},placeholder:"25.0330",style:Object.assign({},INP,{fontSize:12,padding:"6px 10px"})})),
            React.createElement("div",null,React.createElement("div",{style:{fontSize:11,color:C.mid,marginBottom:3}},"經度"),React.createElement("input",{value:lngStr,onChange:function(e){setLngStr(e.target.value);},placeholder:"121.5654",style:Object.assign({},INP,{fontSize:12,padding:"6px 10px"})}))),
          React.createElement(GeoInputBlock,{name:name,city:city,onResult:function(r){if(r.lat)setLatStr(r.lat);if(r.lng)setLngStr(r.lng);if(r.gmapUrl)setGmapUrl(r.gmapUrl);}}),
          latStr&&lngStr?React.createElement("div",{style:{fontSize:10,color:"#5A9A7A",marginTop:6}},"📍 "+parseFloat(latStr).toFixed(4)+", "+parseFloat(lngStr).toFixed(4)):null),
        React.createElement("div",{style:{display:"flex",gap:8}},
          React.createElement("button",{onClick:onClose,style:{padding:"11px 14px",borderRadius:12,border:"1.5px solid "+C.border,background:C.white,color:C.mid,cursor:"pointer",fontSize:13}},"取消"),
          React.createElement("button",{onClick:save,disabled:!name.trim(),style:{flex:1,padding:"13px",borderRadius:12,background:name.trim()?C.teal:"#ccc",color:C.white,border:"none",cursor:name.trim()?"pointer":"default",fontSize:14,fontWeight:700}},"儲存到清單 ✓")))));
}

function calcDuration(depDate,depTime,arrDate,arrTime,tzAdj){if(!depDate||!depTime||!arrDate||!arrTime)return null;var dep=new Date(depDate+"T"+depTime),arr=new Date(arrDate+"T"+arrTime);var diff=(arr-dep)+((parseFloat(tzAdj)||0)*3600000);if(isNaN(diff)||diff<0)return null;var h=Math.floor(diff/3600000),m=Math.floor((diff%3600000)/60000);if(h===0)return m+"分鐘";if(m===0)return h+"小時";return h+" 小時 "+m+" 分鐘";}

function FlightEditModal(props){
  var isOut=props.isOut,initialData=props.initialData,onSave=props.onSave,onClose=props.onClose,onOpenLedger=props.onOpenLedger;
  var dS=useState(Object.assign({},initialData||{}));var draft=dS[0];var setDraft=dS[1];
  var dur=calcDuration(draft.depDate,draft.depTime,draft.arrDate,draft.arrTime,draft.tzAdj);
  var lbc={fontSize:12,color:C.mid,marginBottom:4,fontWeight:600};
  function upd(field,val){setDraft(function(d){var n=Object.assign({},d);n[field]=val;return n;});}
  function doSave(){onSave(draft);}
  return React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.5)",zIndex:6000,display:"flex",alignItems:"flex-end",justifyContent:"center"},onClick:function(e){if(e.target===e.currentTarget)onClose();}},
    React.createElement("div",{style:{background:C.light,width:"100%",maxWidth:480,borderRadius:"22px 22px 0 0",maxHeight:"88vh",overflowY:"auto",paddingBottom:"calc(28px + env(safe-area-inset-bottom, 0px))"}},
      React.createElement("div",{style:{background:C.white,padding:"14px 16px",borderRadius:"22px 22px 0 0",borderBottom:"1px solid "+C.border,position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center"}},
        React.createElement("span",{style:{fontSize:16,fontWeight:700,color:C.navy}},isOut?"🛫 去程":"🛬 回程"),
        React.createElement("button",{onClick:onClose,style:{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.mid}},"×")),
      React.createElement("div",{style:{padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}},
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},
          React.createElement("div",null,React.createElement("div",{style:lbc},"航空公司"),React.createElement("input",{value:draft.airline||"",onChange:function(e){upd("airline",e.target.value);},placeholder:"中華航空",style:INP})),
          React.createElement("div",null,React.createElement("div",{style:lbc},"航班號"),React.createElement("input",{value:draft.flightNo||"",onChange:function(e){upd("flightNo",e.target.value);},placeholder:"CI101",style:INP}))),
        React.createElement("div",{onClick:function(){if(onOpenLedger)onOpenLedger();},style:{background:"#EAF5EE",borderRadius:14,padding:"12px 13px",display:"flex",alignItems:"center",gap:8,cursor:onOpenLedger?"pointer":"default"}},
          React.createElement("span",{style:{fontSize:16}},"💰"),
          React.createElement("div",{style:{flex:1}},
            React.createElement("div",{style:{fontSize:12,color:"#3A6A50",fontWeight:700}},"機票花費請到「記帳分帳」記錄"),
            React.createElement("div",{style:{fontSize:10,color:"#5A9A7A",marginTop:1}},"裡面已經幫你預設了「機票」項目，可以填誰付的、各自金額")),
          onOpenLedger?React.createElement("span",{style:{fontSize:11,color:"#3A6A50",fontWeight:700,flexShrink:0}},"前往 ›"):null),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:8,fontWeight:600}},"出發"),
          React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}},
            React.createElement("div",null,React.createElement("div",{style:lbc},"日期"),React.createElement("input",{type:"date",value:draft.depDate||"",onChange:function(e){upd("depDate",e.target.value);},style:INP})),
            React.createElement("div",null,React.createElement("div",{style:lbc},"時間"),React.createElement("input",{type:"time",value:draft.depTime||"",onChange:function(e){upd("depTime",e.target.value);},style:INP}))),
          React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},
            React.createElement("div",null,React.createElement("div",{style:lbc},"機場"),React.createElement("input",{value:draft.depAirport||"",onChange:function(e){upd("depAirport",e.target.value);},placeholder:"TPE",style:INP})),
            React.createElement("div",null,React.createElement("div",{style:lbc},"航廈"),React.createElement("input",{value:draft.depTerminal||"",onChange:function(e){upd("depTerminal",e.target.value);},placeholder:"T2",style:INP})))),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:8,fontWeight:600}},"抵達"),
          React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}},
            React.createElement("div",null,React.createElement("div",{style:lbc},"日期"),React.createElement("input",{type:"date",value:draft.arrDate||"",onChange:function(e){upd("arrDate",e.target.value);},style:INP})),
            React.createElement("div",null,React.createElement("div",{style:lbc},"時間"),React.createElement("input",{type:"time",value:draft.arrTime||"",onChange:function(e){upd("arrTime",e.target.value);},style:INP}))),
          React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},
            React.createElement("div",null,React.createElement("div",{style:lbc},"機場"),React.createElement("input",{value:draft.arrAirport||"",onChange:function(e){upd("arrAirport",e.target.value);},placeholder:"NRT",style:INP})),
            React.createElement("div",null,React.createElement("div",{style:lbc},"航廈"),React.createElement("input",{value:draft.arrTerminal||"",onChange:function(e){upd("arrTerminal",e.target.value);},placeholder:"T3",style:INP})))),
        React.createElement("div",{style:{background:C.white,borderRadius:14,padding:13}},
          React.createElement("div",{style:lbc},"時差調整（選填）"),
          React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:6}},
            React.createElement("select",{value:draft.tzSign||"+",onChange:function(e){var sign=e.target.value==="-"?-1:1;upd("tzSign",e.target.value);upd("tzAdj",sign*Math.abs(parseFloat(draft.tzHours||0)));},style:{padding:"9px 8px",border:"1.5px solid "+C.border,borderRadius:10,fontSize:14,background:C.white,color:C.navy,outline:"none",cursor:"pointer",flexShrink:0}},React.createElement("option",{value:"+"},"＋"),React.createElement("option",{value:"-"},"－")),
            React.createElement("input",{type:"number",value:draft.tzHours||"",min:"0",max:"24",step:"0.5",placeholder:"0",onChange:function(e){var sign=(draft.tzSign||"+")==="-"?-1:1;upd("tzHours",e.target.value);upd("tzAdj",sign*parseFloat(e.target.value||0));},style:Object.assign({},INP,{flex:1})}),
            React.createElement("span",{style:{fontSize:12,color:C.mid,flexShrink:0}},"小時")),
          dur?React.createElement("div",{style:{fontSize:11,color:C.teal,marginBottom:8,fontWeight:600}},"實際飛行時間："+dur):null,
          React.createElement("div",{style:lbc},"直飛 / 轉機說明"),
          React.createElement("input",{value:draft.stopNote||"",onChange:function(e){upd("stopNote",e.target.value);},placeholder:"直飛",style:INP})),
        React.createElement("button",{onClick:doSave,style:{padding:"13px",borderRadius:12,background:C.teal,color:C.white,border:"none",cursor:"pointer",fontSize:14,fontWeight:700}},"儲存 ✓"))));
}

function FlightCard(props){
  var isOut=props.isOut,d=props.data||{},onEdit=props.onEdit;
  var duration=calcDuration(d.depDate,d.depTime,d.arrDate,d.arrTime,d.tzAdj);
  var hasCard=d.depTime||d.arrTime||d.depAirport||d.arrAirport;
  if(!hasCard)return React.createElement("div",{onClick:onEdit,style:{cursor:"pointer",border:"1px dashed rgba(255,255,255,.3)",borderRadius:10,padding:"10px",textAlign:"center",marginBottom:6}},React.createElement("div",{style:{fontSize:11,color:"rgba(255,255,255,.5)"}},isOut?"🛫 點此填寫去程":"🛬 點此填寫回程"));
  return React.createElement("div",{onClick:onEdit,style:{cursor:"pointer",marginBottom:6}},
    React.createElement("div",{style:{fontSize:10,color:"rgba(255,255,255,.6)",marginBottom:4}},(isOut?"🛫 去程":"🛬 回程")+(d.airline?" · "+d.airline:"")+(d.flightNo?" "+d.flightNo:"")),
    React.createElement("div",{style:{display:"flex",alignItems:"center"}},
      React.createElement("div",{style:{textAlign:"left",minWidth:60}},React.createElement("div",{style:{fontSize:22,fontWeight:700,color:C.white,lineHeight:1.1}},d.depTime||"--:--"),React.createElement("div",{style:{fontSize:11,color:"rgba(255,255,255,.7)",marginTop:2}},(d.depAirport||"")+(d.depTerminal?" "+d.depTerminal:""))),
      React.createElement("div",{style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 8px"}},
        duration?React.createElement("div",{style:{fontSize:10,color:"rgba(255,255,255,.65)",marginBottom:3,whiteSpace:"nowrap"}},duration):null,
        React.createElement("div",{style:{display:"flex",alignItems:"center",width:"100%"}},React.createElement("div",{style:{flex:1,height:1,background:"rgba(255,255,255,.4)"}}),React.createElement("div",{style:{fontSize:13,margin:"0 4px",color:"rgba(255,255,255,.8)"}},"✈"),React.createElement("div",{style:{flex:1,height:1,background:"rgba(255,255,255,.4)"}})),
        d.stopNote?React.createElement("div",{style:{fontSize:10,color:C.skyblue,marginTop:3,fontWeight:600}},d.stopNote):null),
      React.createElement("div",{style:{textAlign:"right",minWidth:60}},React.createElement("div",{style:{fontSize:22,fontWeight:700,color:C.white,lineHeight:1.1}},d.arrTime||"--:--"),React.createElement("div",{style:{fontSize:11,color:"rgba(255,255,255,.7)",marginTop:2}},(d.arrAirport||"")+(d.arrTerminal?" "+d.arrTerminal:"")))),
    d.depDate?React.createElement("div",{style:{fontSize:10,color:"rgba(255,255,255,.45)",marginTop:4}},d.depDate):null,
    React.createElement("div",{style:{fontSize:9,color:"rgba(255,255,255,.35)",marginTop:2}},"點此編輯"));
}

function loadLeaflet(){return new Promise(function(res,rej){if(window.L){res(window.L);return;}if(document.querySelector('script[src*="leaflet.min.js"]')){var t=setInterval(function(){if(window.L){clearInterval(t);res(window.L);}},80);return;}var lnk=document.createElement("link");lnk.rel="stylesheet";lnk.href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.min.css";document.head.appendChild(lnk);var sc=document.createElement("script");sc.src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.min.js";sc.onload=function(){res(window.L);};sc.onerror=rej;document.head.appendChild(sc);});}

function MapView(props){
  var locs=props.locs||[],selectedId=props.selectedId,onSelect=props.onSelect,fitIds=props.fitIds,apiRef=props.apiRef,onAlert=props.onAlert;
  var divRef=useRef(null),mapObj=useRef(null),markers=useRef({}),userMk=useRef(null);
  var rS=useState(false);var ready=rS[0];var setReady=rS[1];
  useEffect(function(){if(mapObj.current||!divRef.current)return;loadLeaflet().then(function(L){var m=L.map(divRef.current,{zoomControl:false}).setView([25.033,121.565],12);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19}).addTo(m);L.control.zoom({position:"bottomright"}).addTo(m);mapObj.current=m;setReady(true);});},[]);
  useEffect(function(){if(!ready||!mapObj.current||!window.L||!fitIds||!fitIds.length)return;var pts=fitIds.map(function(id){return locs.find(function(l){return l.id===id;});}).filter(function(l){return l&&l.lat&&l.lng;}).map(function(l){return[l.lat,l.lng];});if(!pts.length)return;var m=mapObj.current,L=window.L;if(pts.length===1)m.setView(pts[0],15,{animate:true});else m.fitBounds(L.latLngBounds(pts),{padding:[60,60],animate:true});},[fitIds,ready]);
  useEffect(function(){if(!ready||!mapObj.current||!window.L)return;var L=window.L,m=mapObj.current;Object.keys(markers.current).forEach(function(k){markers.current[k].remove();delete markers.current[k];});locs.forEach(function(loc){if(!loc.lat||!loc.lng)return;var isSel=loc.id===selectedId,isSkip=loc.status==="skipped";var cc=isSkip?"#aaa":(CAT_COLOR[loc.mainCat]||C.teal);var bg=isSel?cc:(isSkip?"#ddd":C.white),sz=isSel?42:34;var svgStr=makeSvgIcon(loc.mainCat||"其他",isSel?C.white:cc,sz*.45);var lbl=loc.name.length>8?loc.name.slice(0,7)+"…":loc.name;var html='<div style="position:relative;width:'+sz+'px;height:'+(sz+18)+'px;"><div style="position:absolute;top:0;left:50%;transform:translateX(-50%);background:'+(isSkip?"#aaa":C.navy)+';color:#fff;border-radius:4px;padding:2px 5px;font-size:9px;font-weight:700;white-space:nowrap;">'+lbl+'</div><div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:'+sz+'px;height:'+sz+'px;border-radius:50%;background:'+bg+';border:2.5px solid '+(isSel?cc:"#ccc")+';display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.2);opacity:'+(isSkip?.45:1)+';">'+svgStr+'</div></div>';var icon=L.divIcon({html:html,className:"",iconSize:[sz,sz+18],iconAnchor:[sz/2,sz+18]});var mk=L.marker([loc.lat,loc.lng],{icon:icon}).addTo(m);mk.on("click",(function(id){return function(){onSelect(id);};})(loc.id));markers.current[loc.id]=mk;});},[locs,selectedId,ready]);
  function locateUser(){
    if(!navigator.geolocation){if(onAlert)onAlert("這個瀏覽器/環境不支援定位功能。");return;}
    if(!mapObj.current||!window.L){if(onAlert)onAlert("地圖還沒載入完成，請稍等一下再試一次。");return;}
    navigator.geolocation.getCurrentPosition(function(pos){
      var L=window.L,m=mapObj.current;
      if(userMk.current)userMk.current.remove();
      var html='<div style="width:18px;height:18px;border-radius:50%;background:#4285F4;border:3px solid #fff;"></div>';
      userMk.current=L.marker([pos.coords.latitude,pos.coords.longitude],{icon:L.divIcon({html:html,className:"",iconSize:[18,18],iconAnchor:[9,9]})}).addTo(m);
      m.setView([pos.coords.latitude,pos.coords.longitude],15);
    },function(err){
      var msg="無法取得目前位置";
      if(err){
        if(err.code===1)msg="無法取得目前位置：定位權限被拒絕，請到瀏覽器設定裡允許這個網站使用定位功能。";
        else if(err.code===2)msg="無法取得目前位置：目前的位置資訊無法使用（可能是訊號問題）。";
        else if(err.code===3)msg="無法取得目前位置：定位逾時，請重試一次。";
        else if(err.message)msg="無法取得目前位置："+err.message;
      }
      if(onAlert)onAlert(msg);
    },{enableHighAccuracy:true,timeout:10000});
  }
  // 把定位功能透過 apiRef 暴露給外層，讓外層可以把定位按鈕跟天氣徽章放在同一排，而不是各自定位
  useEffect(function(){if(apiRef)apiRef.current.locateUser=locateUser;});
  return React.createElement("div",{style:{position:"relative",width:"100%",height:"100%"}},React.createElement("div",{ref:divRef,style:{width:"100%",height:"100%"}}));
}

// ── App ──
export default function App(){
  // ── 計畫管理 state ──
  var tripsIdxS=useState([]);var tripsIndex=tripsIdxS[0];var setTripsIndex=tripsIdxS[1];
  var currentTripIdS=useState(null);var currentTripId=currentTripIdS[0];var setCurrentTripId=currentTripIdS[1];
  var delTripConfirmS=useState(null);var delTripConfirm=delTripConfirmS[0];var setDelTripConfirm=delTripConfirmS[1];
  var renameTargetS=useState(null);var renameTarget=renameTargetS[0];var setRenameTarget=renameTargetS[1];
  var alertMsgS=useState(null);var alertMsg=alertMsgS[0];var setAlertMsg=alertMsgS[1];
  function showAlertMsg(msg){setAlertMsg(msg);}
  var iconPickerTargetS=useState(null);var iconPickerTarget=iconPickerTargetS[0];var setIconPickerTarget=iconPickerTargetS[1];
  var appViewS=useState("tripList");var appView=appViewS[0];var setAppView=appViewS[1];
  var wishlistS=useState([]);var wishlist=wishlistS[0];var setWishlist=wishlistS[1];
  var documentsS=useState({});var documents=documentsS[0];var setDocuments=documentsS[1];
  var docFoldersS=useState(DOC_FOLDERS.slice());var docFolders=docFoldersS[0];var setDocFolders=docFoldersS[1];
  var docRenameTargetS=useState(null);var docRenameTarget=docRenameTargetS[0];var setDocRenameTarget=docRenameTargetS[1];
  var docImageViewS=useState(null);var docImageView=docImageViewS[0];var setDocImageView=docImageViewS[1];
  var docNoteEditS=useState(null);var docNoteEdit=docNoteEditS[0];var setDocNoteEdit=docNoteEditS[1];
  var docFolderDeleteConfirmS=useState(null);var docFolderDeleteConfirm=docFolderDeleteConfirmS[0];var setDocFolderDeleteConfirm=docFolderDeleteConfirmS[1];
  var packingS=useState({essential:[],other:[]});var packing=packingS[0];var setPacking=packingS[1];
  var destinationCityS=useState("");var destinationCity=destinationCityS[0];var setDestinationCity=destinationCityS[1];
  var expensesS=useState([]);var expenses=expensesS[0];var setExpenses=expensesS[1];
  var expenseEditS=useState(null);var expenseEdit=expenseEditS[0];var setExpenseEdit=expenseEditS[1];
  var expenseTabS=useState("expenses");var expenseTab=expenseTabS[0];var setExpenseTab=expenseTabS[1];
  var expandedBudgetCatS=useState(null);var expandedBudgetCat=expandedBudgetCatS[0];var setExpandedBudgetCat=expandedBudgetCatS[1];
  var calcCurrencyS=useState("JPY");var calcCurrency=calcCurrencyS[0];var setCalcCurrency=calcCurrencyS[1];
  var calcAmountS=useState("");var calcAmount=calcAmountS[0];var setCalcAmount=calcAmountS[1];
  var manualRateInputS=useState("");var manualRateInput=manualRateInputS[0];var setManualRateInput=manualRateInputS[1];
  var balanceSectionOpenS=useState(true);var balanceSectionOpen=balanceSectionOpenS[0];var setBalanceSectionOpen=balanceSectionOpenS[1];
  var settlementModalOpenS=useState(false);var settlementModalOpen=settlementModalOpenS[0];var setSettlementModalOpen=settlementModalOpenS[1];
  var showToolsMenuS=useState(false);var showToolsMenu=showToolsMenuS[0];var setShowToolsMenu=showToolsMenuS[1];
  var showWishlistS=useState(false);var showWishlist=showWishlistS[0];var setShowWishlist=showWishlistS[1];
  var showDocumentsS=useState(false);var showDocuments=showDocumentsS[0];var setShowDocuments=showDocumentsS[1];
  var showPackingS=useState(false);var showPacking=showPackingS[0];var setShowPacking=showPackingS[1];
  var showExchangeS=useState(false);var showExchange=showExchangeS[0];var setShowExchange=showExchangeS[1];
  var wishlistEditS=useState(null);var wishlistEdit=wishlistEditS[0];var setWishlistEdit=wishlistEditS[1];
  var docFolderOpenS=useState(null);var docFolderOpen=docFolderOpenS[0];var setDocFolderOpen=docFolderOpenS[1];
  var exchangeDataS=useState(null);var exchangeData=exchangeDataS[0];var setExchangeData=exchangeDataS[1];
  var exchangeLoadingS=useState(false);var exchangeLoading=exchangeLoadingS[0];var setExchangeLoading=exchangeLoadingS[1];
  var weatherDataS=useState(null);var weatherData=weatherDataS[0];var setWeatherData=weatherDataS[1];
  var weatherLoadingS=useState(false);var weatherLoading=weatherLoadingS[0];var setWeatherLoading=weatherLoadingS[1];
  var weatherWidgetOpenS=useState(false);var weatherWidgetOpen=weatherWidgetOpenS[0];var setWeatherWidgetOpen=weatherWidgetOpenS[1];
  var exportAllJsonS=useState("");var exportAllJson=exportAllJsonS[0];var setExportAllJson=exportAllJsonS[1];
  var exportAllLoadingS=useState(false);var exportAllLoading=exportAllLoadingS[0];var setExportAllLoading=exportAllLoadingS[1];
  var showExportSingleS=useState(false);var showExportSingle=showExportSingleS[0];var setShowExportSingle=showExportSingleS[1];
  var singleRestorePendingS=useState(null);var singleRestorePending=singleRestorePendingS[0];var setSingleRestorePending=singleRestorePendingS[1];
  var singleRestorePickingS=useState(false);var singleRestorePicking=singleRestorePickingS[0];var setSingleRestorePicking=singleRestorePickingS[1];
  var overwriteConfirmS=useState(null);var overwriteConfirm=overwriteConfirmS[0];var setOverwriteConfirm=overwriteConfirmS[1];
  var exportSingleJsonS=useState("");var exportSingleJson=exportSingleJsonS[0];var setExportSingleJson=exportSingleJsonS[1];
  var exportSingleLoadingS=useState(false);var exportSingleLoading=exportSingleLoadingS[0];var setExportSingleLoading=exportSingleLoadingS[1];
  var exportSingleTripS=useState(null);var exportSingleTrip=exportSingleTripS[0];var setExportSingleTrip=exportSingleTripS[1];
  var tripMoreMenuIdS=useState(null);var tripMoreMenuId=tripMoreMenuIdS[0];var setTripMoreMenuId=tripMoreMenuIdS[1];

  // ── 計畫內容 state ──
  var viewS=useState("plan");var view=viewS[0];var setView=viewS[1];
  var unassignedCatFilterS=useState(null);var unassignedCatFilter=unassignedCatFilterS[0];var setUnassignedCatFilter=unassignedCatFilterS[1];
  var showAddS=useState(false);var showAdd=showAddS[0];var setShowAdd=showAddS[1];
  var activeDayS=useState(1);var activeDay=activeDayS[0];var setActiveDay=activeDayS[1];
  var totalDaysS=useState(3);var totalDays=totalDaysS[0];var setTotalDays=totalDaysS[1];
  var tripNameS=useState("我的旅行計畫");var tripName=tripNameS[0];var setTripName=tripNameS[1];
  var startDateS=useState("");var startDate=startDateS[0];var setStartDate=startDateS[1];
  var endDateS=useState("");var endDate=endDateS[0];var setEndDate=endDateS[1];
  var pendingEndS=useState("");var pendingEnd=pendingEndS[0];var setPendingEnd=pendingEndS[1];
  var showDateS=useState(false);var showDateInput=showDateS[0];var setShowDateInput=showDateS[1];
  var colorPickS=useState(null);var colorPickFriend=colorPickS[0];var setColorPickFriend=colorPickS[1];
  var archivedSectionOpenS=useState(false);var archivedSectionOpen=archivedSectionOpenS[0];var setArchivedSectionOpen=archivedSectionOpenS[1];
  var friendArchiveConfirmS=useState(null);var friendArchiveConfirm=friendArchiveConfirmS[0];var setFriendArchiveConfirm=friendArchiveConfirmS[1];
  var friendDeleteConfirmS=useState(null);var friendDeleteConfirm=friendDeleteConfirmS[0];var setFriendDeleteConfirm=friendDeleteConfirmS[1];
  var friendsS=useState(function(){return [{id:uid(),name:""},{id:uid(),name:""}];});var friends=friendsS[0];var setFriends=friendsS[1];
  var locsS=useState([]);var locs=locsS[0];var setLocs=locsS[1];
  var connS=useState({});var connectors=connS[0];var setConnectors=connS[1];
  var editSpotS=useState(null);var editSpot=editSpotS[0];var setEditSpot=editSpotS[1];
  var dayPickS=useState(null);var dayPick=dayPickS[0];var setDayPick=dayPickS[1];
  var wishlistDayPickS=useState(null);var wishlistDayPick=wishlistDayPickS[0];var setWishlistDayPick=wishlistDayPickS[1];
  var newPackingFormS=useState({name:"",section:"essential",subCat:"其他"});var newPackingForm=newPackingFormS[0];var setNewPackingForm=newPackingFormS[1];
  var packingAddOpenS=useState(false);var packingAddOpen=packingAddOpenS[0];var setPackingAddOpen=packingAddOpenS[1];
  var newDocFolderS=useState(null);var newDocFolder=newDocFolderS[0];var setNewDocFolder=newDocFolderS[1];
  var showFriendsS=useState(false);var showFriends=showFriendsS[0];var setShowFriends=showFriendsS[1];
  var flightsOpenRef=useRef(false);
  var flightsOpenS=useState(false);var flightsOpen=flightsOpenS[0];var setFlightsOpen=flightsOpenS[1];
  var flightsS=useState({outbound:{},inbound:{}});var flights=flightsS[0];var setFlights=flightsS[1];
  var flightEditDirS=useState(null);var flightEditDir=flightEditDirS[0];var setFlightEditDir=flightEditDirS[1];
  var selectedIdS=useState(null);var selectedId=selectedIdS[0];var setSelectedId=selectedIdS[1];
  var currentUIDS=useState(null);var currentUID=currentUIDS[0];var setCurrentUID=currentUIDS[1];
  var dropTargetDayS=useState(null);var dropTargetDay=dropTargetDayS[0];var setDropTargetDay=dropTargetDayS[1];
  var draggingTabDayS=useState(null);var draggingTabDay=draggingTabDayS[0];var setDraggingTabDay=draggingTabDayS[1];
  var copyToastS=useState(null);var copyToast=copyToastS[0];var setCopyToast=copyToastS[1];
  var fitIdsS=useState([]);var fitIds=fitIdsS[0];var setFitIds=fitIdsS[1];
  var syncStatusS=useState("");var syncStatus=syncStatusS[0];var setSyncStatus=syncStatusS[1];
  var showExportS=useState(false);var showExport=showExportS[0];var setShowExport=showExportS[1];
  var showImportS=useState(false);var showImport=showImportS[0];var setShowImport=showImportS[1];
  var importTextS=useState("");var importText=importTextS[0];var setImportText=importTextS[1];
  var copyMenuLocS=useState(null);var copyMenuLoc=copyMenuLocS[0];var setCopyMenuLoc=copyMenuLocS[1];

  // ── Google Maps 匯入 state（Takeout JSON / CSV / 其他匯出格式）──
  var showImportGmapS=useState(false);var showImportGmap=showImportGmapS[0];var setShowImportGmap=showImportGmapS[1];
  var gmapImportTextS=useState("");var gmapImportText=gmapImportTextS[0];var setGmapImportText=gmapImportTextS[1];
  var gmapImportResultS=useState(null);var gmapImportResult=gmapImportResultS[0];var setGmapImportResult=gmapImportResultS[1];
  var enrichWithAIS=useState(true);var enrichWithAI=enrichWithAIS[0];var setEnrichWithAI=enrichWithAIS[1];
  var enrichProgressS=useState(null);var enrichProgress=enrichProgressS[0];var setEnrichProgress=enrichProgressS[1];

  var saveTimerRef=useRef(null);
  var isLoadedRef=useRef(false);
  var userEditedRef=useRef(false);
  var lastSnapRef=useRef("");
  var mapListRef=useRef(null);
  var showMapListS=useState(true);var showMapList=showMapListS[0];var setShowMapList=showMapListS[1];
  var mapApiRef=useRef({});
  var scrollTimerRef=useRef(null);
  var switchingRef=useRef(false); // 切換計畫時防止誤寫
  var tabDragSrcDay=useRef(null);
  var switchTokenRef=useRef(0);
  var gmapFileInputRef=useRef(null);

  function toggleFlights(){var next=!flightsOpenRef.current;flightsOpenRef.current=next;setFlightsOpen(next);if(next){setShowFriends(false);setShowToolsMenu(false);setShowExchange(false);setShowDocuments(false);}}
  function closeFlights(){flightsOpenRef.current=false;setFlightsOpen(false);}
  function showCopyToast(msg){setCopyToast(msg);setTimeout(function(){setCopyToast(null);},1800);}

  // ── 把當前計畫 state 打包成物件 ──
  function packCurrentTrip(){return {tripName:tripName,startDate:startDate,endDate:endDate,totalDays:totalDays,friends:friends,locs:locs,connectors:connectors,flights:flights,wishlist:wishlist,documents:documents,docFolders:docFolders,packing:packing,destinationCity:destinationCity,expenses:expenses};}

  // ── 把計畫物件展開到 state ──
  function unpackTrip(data){
    setTripName(data.tripName||"新旅行計畫");
    setStartDate(data.startDate||"");setEndDate(data.endDate||"");
    setTotalDays(data.totalDays||3);setFriends(data.friends||[{id:uid(),name:""},{id:uid(),name:""}]);
    setLocs(data.locs||[]);setConnectors(migrateConnectorsToPairs(data.locs||[],data.connectors||{}));setFlights(data.flights||{outbound:{},inbound:{}});
    setWishlist(data.wishlist||[]);setDocuments(data.documents||{});setDocFolders(data.docFolders&&data.docFolders.length?data.docFolders:DOC_FOLDERS.slice());setPacking(data.packing||{essential:[],other:[]});
    setDestinationCity(data.destinationCity||"");
    setExpenses(ensureBudgetPresets(data.expenses));
    setActiveDay(1);setView("plan");setSelectedId(null);setCurrentUID(null);
    setShowFriends(false);closeFlights();
    setShowWishlist(false);setShowDocuments(false);setShowPacking(false);setShowExchange(false);setShowToolsMenu(false);
    setDocFolderOpen(null);setDocRenameTarget(null);setDocImageView(null);
    setSettlementModalOpen(false);setExpenseEdit(null);setExpenseTab("expenses");
    setSingleRestorePending(null);setSingleRestorePicking(false);setOverwriteConfirm(null);
    setWeatherData(null);
  }

  // ── 更新 index 裡的 meta（名稱、日期、地點數）──
  function syncIndexMeta(tripId,data){
    setTripsIndex(function(idx){
      var newIdx=idx.map(function(t){
        if(t.id!==tripId)return t;
        return Object.assign({},t,{name:data.tripName||"新旅行計畫",startDate:data.startDate||"",endDate:data.endDate||"",locCount:(data.locs||[]).length});
      });
      storageSet(TRIPS_INDEX_KEY,newIdx);
      return newIdx;
    });
  }

  // ── 儲存當前計畫 ──
  function saveCurrentTrip(data,tripId){
    if(!tripId)return;
    storageSet(TRIP_PREFIX+tripId,data);
    syncIndexMeta(tripId,data);
  }

  // ── 初始載入 ──
  useEffect(function(){
    storageGet(TRIPS_INDEX_KEY).then(function(idx){
      if(!idx||!idx.length){
        // 第一次使用：建立預設計畫
        var newId=uid();
        var defaultData=makeTripData("我的旅行計畫");
        var newIdx=[{id:newId,name:"我的旅行計畫",startDate:"",endDate:"",locCount:0,icon:"✈️"}];
        storageSet(TRIPS_INDEX_KEY,newIdx);
        storageSet(TRIP_PREFIX+newId,defaultData);
        setTripsIndex(newIdx);
        setCurrentTripId(newId);
        unpackTrip(defaultData);
        isLoadedRef.current=true;
        lastSnapRef.current=JSON.stringify(defaultData);
        return;
      }
      setTripsIndex(idx);
      var firstId=idx[0].id;
      setCurrentTripId(firstId);
      storageGet(TRIP_PREFIX+firstId).then(function(data){
        if(!data)data=makeTripData(idx[0].name||"我的旅行計畫");
        unpackTrip(data);
        lastSnapRef.current=JSON.stringify(data);
        setTimeout(function(){isLoadedRef.current=true;setSyncStatus("已載入");setTimeout(function(){setSyncStatus("");},2000);},100);
      });
    });
  },[]);

  // ── 自動儲存 ──
  useEffect(function(){
    if(!isLoadedRef.current)return;
    if(switchingRef.current)return;
    var snap=JSON.stringify({tripName:tripName,startDate:startDate,endDate:endDate,totalDays:totalDays,locs:locs,connectors:connectors,friends:friends,flights:flights,wishlist:wishlist,documents:documents,docFolders:docFolders,packing:packing,destinationCity:destinationCity,expenses:expenses});
    if(snap===lastSnapRef.current)return;
    userEditedRef.current=true;
    setSyncStatus("儲存中…");
    var savingTripId=currentTripId;
    var timer=setTimeout(function(){
      var data={tripName:tripName,startDate:startDate,endDate:endDate,totalDays:totalDays,locs:locs,connectors:connectors,friends:friends,flights:flights,wishlist:wishlist,documents:documents,docFolders:docFolders,packing:packing,destinationCity:destinationCity,expenses:expenses};
      saveCurrentTrip(data,savingTripId);
      lastSnapRef.current=snap;userEditedRef.current=false;
      setSyncStatus("✓ 已同步");setTimeout(function(){setSyncStatus("");},2000);
    },1000);
    saveTimerRef.current=timer;
    // 清除函式：只要這個 effect 因為任何原因要重新執行（切換計畫、刪除計畫…）或元件卸載，
    // 一定會先跑這裡，確保「上一支計畫」殘留的計時器不會在背景延遲寫回、造成幽靈資料或覆蓋新資料。
    return function(){clearTimeout(timer);};
  },[tripName,startDate,endDate,totalDays,locs,connectors,friends,flights,wishlist,documents,docFolders,packing,destinationCity,expenses]);

  // ── 切換計畫 ──
  function switchTrip(targetId){
    if(targetId===currentTripId){setAppView("tripDetail");return;}
    switchingRef.current=true;
    isLoadedRef.current=false;
    // 先強制儲存當前計畫
    if(saveTimerRef.current)clearTimeout(saveTimerRef.current);
    var currentData=packCurrentTrip();
    saveCurrentTrip(currentData,currentTripId);
    // 載入目標計畫（用一個遞增的 token 標記這次切換，避免連續快速點擊不同計畫時，
    // 先發出但後回應的請求覆蓋掉後發出但先回應的結果）
    var myToken=++switchTokenRef.current;
    storageGet(TRIP_PREFIX+targetId).then(function(data){
      if(myToken!==switchTokenRef.current)return; // 已經有更新的切換請求，這次結果作廢
      if(!data){var meta=tripsIndex.find(function(t){return t.id===targetId;});data=makeTripData(meta?meta.name:"新旅行計畫");}
      setCurrentTripId(targetId);
      unpackTrip(data);
      lastSnapRef.current=JSON.stringify(data);
      setAppView("tripDetail");
      switchingRef.current=false;isLoadedRef.current=true;
      setSyncStatus("已切換");setTimeout(function(){setSyncStatus("");},1500);
    });
  }

  // ── 新增計畫 ──
  function createTrip(){
    switchTokenRef.current++; // 使任何還在進行中的切換請求作廢
    switchingRef.current=true;isLoadedRef.current=false;
    if(saveTimerRef.current)clearTimeout(saveTimerRef.current);
    var currentData=packCurrentTrip();
    saveCurrentTrip(currentData,currentTripId);
    var newId=uid();
    var newData=makeTripData("新旅行計畫");
    var newMeta={id:newId,name:"新旅行計畫",startDate:"",endDate:"",locCount:0,icon:"✈️"};
    setTripsIndex(function(idx){
      var newIdx=idx.concat([newMeta]);
      storageSet(TRIPS_INDEX_KEY,newIdx);
      return newIdx;
    });
    storageSet(TRIP_PREFIX+newId,newData);
    setCurrentTripId(newId);
    unpackTrip(newData);
    lastSnapRef.current=JSON.stringify(newData);
    setAppView("tripDetail");
    switchingRef.current=false;isLoadedRef.current=true;
  }

  function duplicateTrip(t){
    var sourceId=t.id;
    var sourceDataPromise=(sourceId===currentTripId)?Promise.resolve(packCurrentTrip()):storageGet(TRIP_PREFIX+sourceId);
    sourceDataPromise.then(function(data){
      if(!data){showAlertMsg("複製失敗：找不到來源計畫資料。");return;}
      var cloned=JSON.parse(JSON.stringify(data));
      cloned.tripName=(cloned.tripName||t.name||"旅行計畫")+"（複製）";
      var newId=uid();
      var newMeta={id:newId,name:cloned.tripName,startDate:cloned.startDate||"",endDate:cloned.endDate||"",locCount:(cloned.locs||[]).length,icon:t.icon||"✈️"};
      storageSet(TRIP_PREFIX+newId,cloned).then(function(result){
        if(!result.ok){showAlertMsg("複製失敗：寫入儲存空間時發生錯誤。\n原因："+result.error);return;}
        setTripsIndex(function(idx){
          var newIdx=idx.concat([newMeta]);
          storageSet(TRIPS_INDEX_KEY,newIdx);
          return newIdx;
        });
        showCopyToast("已複製「"+cloned.tripName+"」");
      });
    });
  }
  // ── 計算行程是否已過期 / 還有幾天出發 ──
  function getTripDateInfo(t){
    if(!t.startDate)return {expired:false,daysUntil:null,ongoing:false};
    var today=new Date();today.setHours(0,0,0,0);
    var start=new Date(t.startDate);start.setHours(0,0,0,0);
    var end=t.endDate?new Date(t.endDate):new Date(t.startDate);end.setHours(0,0,0,0);
    if(end<today)return {expired:true,daysUntil:null,ongoing:false};
    if(start>today){
      var diffDays=Math.round((start-today)/864e5);
      return {expired:false,daysUntil:diffDays,ongoing:false};
    }
    return {expired:false,daysUntil:0,ongoing:true};
  }

  // ── 刪除計畫 ──
  function deleteTrip(tripId){
    switchTokenRef.current++; // 使任何還在進行中的切換請求作廢
    storageDel(TRIP_PREFIX+tripId);
    setTripsIndex(function(idx){
      var newIdx=idx.filter(function(t){return t.id!==tripId;});
      if(newIdx.length===0){
        // 刪到最後一個：自動建新的
        var freshId=uid();var freshData=makeTripData("我的旅行計畫");
        var freshMeta={id:freshId,name:"我的旅行計畫",startDate:"",endDate:"",locCount:0,icon:"✈️"};
        newIdx=[freshMeta];
        storageSet(TRIP_PREFIX+freshId,freshData);
        storageSet(TRIPS_INDEX_KEY,newIdx);
        setCurrentTripId(freshId);
        unpackTrip(freshData);
        lastSnapRef.current=JSON.stringify(freshData);
        isLoadedRef.current=true;
      } else {
        storageSet(TRIPS_INDEX_KEY,newIdx);
        if(tripId===currentTripId){
          // 刪的是當前計畫 → 切到第一個
          var nextId=newIdx[0].id;
          switchingRef.current=true;isLoadedRef.current=false;
          var myToken=++switchTokenRef.current;
          storageGet(TRIP_PREFIX+nextId).then(function(data){
            if(myToken!==switchTokenRef.current)return;
            if(!data)data=makeTripData(newIdx[0].name||"");
            setCurrentTripId(nextId);unpackTrip(data);lastSnapRef.current=JSON.stringify(data);
            switchingRef.current=false;isLoadedRef.current=true;
          });
        }
      }
      return newIdx;
    });
    setDelTripConfirm(null);
  }

  // ── 複製地點到其他計畫 ──
  function copyLocToTrip(loc,targetTripId){
    storageGet(TRIP_PREFIX+targetTripId).then(function(data){
      var meta=tripsIndex.find(function(t){return t.id===targetTripId;});
      if(!data)data=makeTripData(meta?meta.name:"");
      var copy=Object.assign({},loc,{id:uid(),day:UNASSIGNED_TAB,order:Date.now(),mustBy:[],status:"active"});
      var newLocs=(data.locs||[]).concat([copy]);
      var newData=Object.assign({},data,{locs:newLocs});
      storageSet(TRIP_PREFIX+targetTripId,newData);
      // 更新 index meta
      setTripsIndex(function(idx){
        var newIdx=idx.map(function(t){return t.id===targetTripId?Object.assign({},t,{locCount:newLocs.length}):t;});
        storageSet(TRIPS_INDEX_KEY,newIdx);
        return newIdx;
      });
      showCopyToast("已複製到「"+(meta?meta.name:"其他計畫")+"」");
    });
    setCopyMenuLoc(null);
  }

  // ── Export / Import：一次備份/還原「所有旅行計畫」 ──
  function buildAllTripsExport(){
    setExportAllLoading(true);
    setExportAllJson("");
    // 先確保目前這個旅行計畫的最新變更已存檔，並直接用記憶體中的最新資料，不用等寫入完成再讀回
    if(saveTimerRef.current)clearTimeout(saveTimerRef.current);
    var currentData=packCurrentTrip();
    if(currentTripId)saveCurrentTrip(currentData,currentTripId);
    var idx=tripsIndex;
    // 依序讀取（不用 Promise.all 同時平行送出），避免一次送太多請求觸發儲存後端的併發限制，
    // 也避免讀取失敗時被 || makeTripData(...) 悄悄補成空計畫、備份出一份看似正常但其實是空的資料
    var trips={};
    var readErrors=[];
    var i=0;
    function nextRead(){
      if(i>=idx.length){
        setExportAllLoading(false);
        if(readErrors.length){
          showAlertMsg("備份時有 "+readErrors.length+" 支計畫讀取失敗，這份備份內容不完整：\n"+readErrors.join("\n")+"\n\n請關閉重試一次。");
          return;
        }
        var payload={version:2,exportedAt:new Date().toISOString(),tripsIndex:idx,trips:trips};
        setExportAllJson(JSON.stringify(payload,null,2));
        return;
      }
      var t=idx[i];i++;
      var readPromise=(t.id===currentTripId)?Promise.resolve(currentData):storageGet(TRIP_PREFIX+t.id);
      readPromise.then(function(data){
        if(data){trips[t.id]=data;}
        else{readErrors.push("・"+t.name+"（讀取結果為空）");}
        nextRead();
      }).catch(function(err){
        readErrors.push("・"+t.name+"（"+(err&&err.message?err.message:err)+"）");
        nextRead();
      });
    }
    nextRead();
  }
  function openExportAll(){
    setShowExport(true);
    buildAllTripsExport();
  }
  // 匯出「單一計畫」：直接用該計畫原本存起來的完整資料（跟舊版單一計畫格式相容），
  // 還原端本來就已經有辨識這種格式的邏輯，還原時一律會產生一個新計畫，不會覆蓋掉任何現有資料
  function buildSingleTripExport(t){
    setExportSingleLoading(true);
    setExportSingleJson("");
    setExportSingleTrip(t);
    if(t.id===currentTripId){
      if(saveTimerRef.current)clearTimeout(saveTimerRef.current);
      var data=packCurrentTrip();
      saveCurrentTrip(data,t.id);
      setExportSingleJson(JSON.stringify(data,null,2));
      setExportSingleLoading(false);
      return;
    }
    storageGet(TRIP_PREFIX+t.id).then(function(data){
      setExportSingleLoading(false);
      if(!data){showAlertMsg("備份失敗：讀取「"+t.name+"」的資料時發生錯誤，請重試一次。");setShowExportSingle(false);return;}
      setExportSingleJson(JSON.stringify(data,null,2));
    }).catch(function(err){
      setExportSingleLoading(false);
      showAlertMsg("備份失敗：讀取「"+t.name+"」的資料時發生錯誤。\n"+(err&&err.message?err.message:err));
      setShowExportSingle(false);
    });
  }
  function openExportSingle(t){
    setShowExportSingle(true);
    buildSingleTripExport(t);
  }
  function importAllFromText(){
    var data;
    try{data=JSON.parse(importText);}catch(err){showAlertMsg("格式錯誤：貼上的內容不是合法的 JSON（"+err.message+"）");return;}
    try{
      if(data&&typeof data==="object"&&data.trips&&typeof data.trips==="object"&&Array.isArray(data.tripsIndex)){
        // 新格式：整批還原所有旅行計畫（會覆蓋目前所有計畫）
        // 依序寫入（不用 Promise.all 同時平行送出），避免一次送太多請求觸發儲存後端的併發限制
        var newIdx=data.tripsIndex;
        var writeItems=[{key:TRIPS_INDEX_KEY,val:newIdx,label:"trips_index_v1",size:JSON.stringify(newIdx).length}];
        Object.keys(data.trips).forEach(function(tid){
          var tripData=data.trips[tid];
          writeItems.push({key:TRIP_PREFIX+tid,val:tripData,label:TRIP_PREFIX+tid+"（"+(tripData&&tripData.tripName?tripData.tripName:"")+"）",size:JSON.stringify(tripData).length});
        });
        switchTokenRef.current++;
        setSyncStatus("還原中…");
        sequentialStorageWrites(writeItems).then(function(results){
          setSyncStatus("");
          var failures=results.filter(function(r){return !r.result.ok;});
          if(failures.length){
            var failLines=failures.map(function(r){return "・"+r.label+"（約 "+Math.round(r.size/1024)+" KB）\n  原因："+r.result.error;});
            showAlertMsg("還原失敗，以下資料寫入儲存空間時發生錯誤：\n"+failLines.join("\n")+"\n\n目前的計畫尚未被覆蓋，請重試一次。");
            return;
          }
          setTripsIndex(newIdx);
          var firstId=newIdx[0]&&newIdx[0].id;
          if(firstId){
            switchingRef.current=true;isLoadedRef.current=false;
            var myToken=++switchTokenRef.current;
            storageGet(TRIP_PREFIX+firstId).then(function(d){
              if(myToken!==switchTokenRef.current)return;
              if(!d)d=makeTripData(newIdx[0].name||"");
              setCurrentTripId(firstId);
              unpackTrip(d);
              lastSnapRef.current=JSON.stringify(d);
              switchingRef.current=false;isLoadedRef.current=true;
            }).catch(function(err){showAlertMsg("還原時讀取資料失敗："+(err&&err.message?err.message:err));});
          }
          showCopyToast("已還原所有旅行計畫 ✓");
          setShowImport(false);setImportText("");
          setAppView("tripList");
        }).catch(function(err){showAlertMsg("還原失敗，發生非預期錯誤："+(err&&err.message?err.message:err));});
      } else if(data&&typeof data==="object"&&(data.tripName||data.locs)){
        // 相容舊版單一計畫備份格式：不要馬上寫入，先整理好資料、跳出「還原成新計畫／覆蓋現有計畫」的選擇
        var restoredData={
          tripName:data.tripName||"還原的旅行計畫",
          startDate:data.startDate||"",
          endDate:data.endDate||"",
          totalDays:data.totalDays||3,
          friends:Array.isArray(data.friends)?data.friends:[{id:uid(),name:""},{id:uid(),name:""}],
          locs:Array.isArray(data.locs)?data.locs:[],
          connectors:migrateConnectorsToPairs(Array.isArray(data.locs)?data.locs:[],data.connectors&&typeof data.connectors==="object"?data.connectors:{}),
          flights:data.flights&&typeof data.flights==="object"?data.flights:{outbound:{},inbound:{}},
          wishlist:Array.isArray(data.wishlist)?data.wishlist:[],
          documents:data.documents&&typeof data.documents==="object"?data.documents:{},
          docFolders:Array.isArray(data.docFolders)&&data.docFolders.length?data.docFolders:DOC_FOLDERS.slice(),
          packing:data.packing&&typeof data.packing==="object"?data.packing:{essential:[],other:[]},
          destinationCity:data.destinationCity||"",
          expenses:ensureBudgetPresets(Array.isArray(data.expenses)?data.expenses:[])
        };
        setSingleRestorePending(restoredData);
      } else {
        showAlertMsg("格式錯誤，無法辨識備份內容：JSON 內容不包含 trips/tripsIndex，也不包含 tripName/locs 欄位，請確認貼的是完整的備份內容。");
      }
    }catch(err){
      showAlertMsg("還原時發生非預期錯誤："+(err&&err.message?err.message:err)+"\n請把這個錯誤訊息回報，方便排查。");
    }
  }
  // 單一計畫還原 - 選項1：還原成新計畫（原本的行為，不會動到任何現有資料）
  function restoreSingleAsNew(restoredData){
    var restoredId=uid();
    var restoredMeta={id:restoredId,name:restoredData.tripName,startDate:restoredData.startDate,endDate:restoredData.endDate,locCount:restoredData.locs.length,icon:"🗂️"};
    storageSetWithRetry(TRIP_PREFIX+restoredId,restoredData).then(function(result){
      if(!result.ok){showAlertMsg("還原失敗：資料寫入儲存空間時發生錯誤（已自動重試過）。\n原因："+result.error+"\n請重試一次。");return;}
      setTripsIndex(function(idx){
        var newIdx2=idx.concat([restoredMeta]);
        storageSetWithRetry(TRIPS_INDEX_KEY,newIdx2);
        return newIdx2;
      });
      showCopyToast("已還原為新計畫「"+restoredData.tripName+"」✓");
      setSingleRestorePending(null);setSingleRestorePicking(false);
      setShowImport(false);setImportText("");
      setAppView("tripList");
    }).catch(function(err){showAlertMsg("還原失敗，發生非預期錯誤："+(err&&err.message?err.message:err));});
  }
  // 單一計畫還原 - 選項2：覆蓋現有的某一個計畫（會整個取代那個計畫原本的內容）
  function restoreSingleOverwrite(restoredData,targetTrip){
    storageSetWithRetry(TRIP_PREFIX+targetTrip.id,restoredData).then(function(result){
      if(!result.ok){showAlertMsg("還原失敗：資料寫入儲存空間時發生錯誤（已自動重試過）。\n原因："+result.error+"\n原本的計畫內容尚未被覆蓋，請重試一次。");return;}
      var updatedMeta={id:targetTrip.id,name:restoredData.tripName,startDate:restoredData.startDate,endDate:restoredData.endDate,locCount:restoredData.locs.length,icon:targetTrip.icon||"🗂️"};
      setTripsIndex(function(idx){
        var newIdx2=idx.map(function(t){return t.id===targetTrip.id?updatedMeta:t;});
        storageSetWithRetry(TRIPS_INDEX_KEY,newIdx2);
        return newIdx2;
      });
      // 如果剛好覆蓋的是目前正打開的這個計畫，記憶體裡的內容也要一起換掉，不然畫面還會顯示舊資料
      if(targetTrip.id===currentTripId){
        switchingRef.current=true;isLoadedRef.current=false;
        unpackTrip(restoredData);
        lastSnapRef.current=JSON.stringify(restoredData);
        switchingRef.current=false;isLoadedRef.current=true;
      }
      showCopyToast("已覆蓋「"+targetTrip.name+"」的內容 ✓");
      setSingleRestorePending(null);setSingleRestorePicking(false);setOverwriteConfirm(null);
      setShowImport(false);setImportText("");
      setAppView("tripList");
    }).catch(function(err){showAlertMsg("還原失敗，發生非預期錯誤："+(err&&err.message?err.message:err));});
  }

  // ── Google Maps 匯入：支援 Takeout JSON、擴充功能匯出的 CSV/JSON ──
  function addImportedLocs(rawItems,enrichAfter){
    var existingNames={};
    locs.forEach(function(l){if(l.name)existingNames[l.name.trim()]=true;});
    var toAdd=[],skipped=0;
    rawItems.forEach(function(item){
      var name=(item.name||"").trim();
      if(!name)return;
      if(existingNames[name]){skipped++;return;}
      existingNames[name]=true;
      var lat=item.lat,lng=item.lng;
      if((lat==null||isNaN(lat)||lng==null||isNaN(lng))&&item.url){
        var co=parseGmapCoords(item.url);
        if(co){lat=parseFloat(co.lat);lng=parseFloat(co.lng);}
      }
      var gUrl=item.url||("https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(name+(item.address?" "+item.address:"")));
      toAdd.push({id:uid(),name:name,mainCat:"其他",subCat:"",day:UNASSIGNED_TAB,addedBy:"",notes:item.address||"",hours:item.hours||"",checkIn:"",checkOut:"",image:null,status:"active",mustBy:[],order:Date.now()+toAdd.length,lat:(typeof lat==="number"&&!isNaN(lat))?lat:null,lng:(typeof lng==="number"&&!isNaN(lng))?lng:null,gmapUrl:gUrl});
    });
    if(toAdd.length)setLocs(function(ls){return ls.concat(toAdd);});
    var withCoords=toAdd.filter(function(l){return l.lat!=null&&l.lng!=null;}).length;
    var withHours=toAdd.filter(function(l){return l.hours;}).length;
    setGmapImportResult({added:toAdd.length,skipped:skipped,withCoords:withCoords,withHours:withHours});
    if(enrichAfter&&toAdd.length){
      enrichImportedLocs(toAdd.map(function(l){return {id:l.id,name:l.name,needsHours:!l.hours};}));
    }
  }
  // ── 匯入後自動查詢缺少營業時間/簡介的地點（重用 AI 查詢邏輯），限制同時 3 筆避免過快打 API ──
  function enrichImportedLocs(items){
    var targets=items.filter(function(it){return it.needsHours;});
    if(!targets.length)return;
    setEnrichProgress({done:0,total:targets.length});
    var idx=0;
    function next(){
      if(idx>=targets.length){setEnrichProgress(null);return;}
      var batch=targets.slice(idx,idx+3);
      idx+=batch.length;
      var promises=batch.map(function(it){
        return fetchAIDetail(it.name,"").then(function(ai){
          if(ai){
            setLocs(function(ls){return ls.map(function(l){
              if(l.id!==it.id)return l;
              var parts=[];
              if(l.notes)parts.push(l.notes);
              if(ai.status)parts.push("📍 "+ai.status);
              if(ai.tips)parts.push("💡 "+ai.tips);
              var newLat=l.lat,newLng=l.lng;
              if((newLat==null||newLng==null)&&ai.lat&&ai.lng){newLat=ai.lat;newLng=ai.lng;}
              return Object.assign({},l,{hours:l.hours||ai.hours||"",notes:parts.join("\n"),lat:newLat,lng:newLng});
            });});
          }
        }).catch(function(){}).then(function(){
          setEnrichProgress(function(p){return p?{done:p.done+1,total:p.total}:p;});
        });
      });
      Promise.all(promises).then(next);
    }
    next();
  }
  function parseGmapImport(text){
    var t=(text||"").trim();
    if(!t){setGmapImportResult({error:"請先貼上匯出內容"});return;}
    var rawItems=[];
    var firstChar=t[0];
    if(firstChar==="{"||firstChar==="["){
      var data;
      try{data=JSON.parse(t);}catch(err){setGmapImportResult({error:"JSON 格式錯誤，請確認貼上的內容完整"});return;}
      var features=data.features||(Array.isArray(data)?data:null);
      if(!features||!features.length){setGmapImportResult({error:"找不到地點資料，請確認貼上的 JSON 內容"});return;}
      features.forEach(function(f){
        if(f&&f.properties&&(f.geometry||f.properties.location)){
          // Google Takeout「Saved Places.json」的 GeoJSON 格式
          var props=f.properties||{};
          var name=props.name||(props.location&&props.location.name)||"";
          var lat=null,lng=null;
          if(f.geometry&&f.geometry.coordinates&&f.geometry.coordinates.length>=2){lng=f.geometry.coordinates[0];lat=f.geometry.coordinates[1];}
          else if(props.location&&props.location.latitude!=null&&props.location.longitude!=null){lat=props.location.latitude;lng=props.location.longitude;}
          var address=(props.location&&(props.location.address||""))||props.address||"";
          var gmapsUrl=props.google_maps_url||props.googleMapsUrl||props["Google Maps URL"]||"";
          var hoursVal=props.hours||props.business_hours||"";
          rawItems.push({name:name?String(name).trim():"",lat:lat,lng:lng,address:address,url:gmapsUrl,hours:hoursVal});
        } else {
          rawItems.push(normalizeImportItem(f||{}));
        }
      });
    } else {
      var objs=csvTextToObjects(t);
      if(!objs.length){setGmapImportResult({error:"找不到地點資料，請確認貼上的是完整的 CSV 或 JSON 內容"});return;}
      rawItems=objs.map(normalizeImportItem);
      var hasAnyName=rawItems.some(function(it){return it.name;});
      if(!hasAnyName){
        var detectedHeaders=Object.keys(objs[0]||{}).join("、")||"（無）";
        setGmapImportResult({error:"辨識不到「地點名稱」欄位。偵測到的欄位有："+detectedHeaders+"，請確認 CSV 有名稱欄位，或把前幾行範例貼給我調整比對規則"});
        return;
      }
    }
    if(!rawItems.some(function(it){return it.name;})){
      setGmapImportResult({error:"辨識不到「地點名稱」欄位，請確認匯出內容包含名稱資訊"});
      return;
    }
    addImportedLocs(rawItems,enrichWithAI);
  }

  var named=friends.filter(function(f){return f.name.trim()&&!f.archived;});
  var currentUser=friends.find(function(f){return f.id===currentUID;})||null;
  var curIdx=friends.findIndex(function(f){return f.id===currentUID;});

  useEffect(function(){var id="ph-style";if(!document.getElementById(id)){var s=document.createElement("style");s.id=id;s.textContent="input::placeholder,textarea::placeholder{color:#bbb!important;opacity:1} input,textarea,select{font-size:16px!important;}";document.head.appendChild(s);}var mv=document.querySelector('meta[name="viewport"]');if(!mv){mv=document.createElement("meta");mv.name="viewport";document.head.appendChild(mv);}mv.content="width=device-width,initial-scale=1";},[]);

  function getDayLabel(d){if(!startDate)return "第"+d+"天";var base=new Date(startDate);base.setDate(base.getDate()+d-1);return {line1:"第"+d+"天",line2:(base.getMonth()+1)+"/"+base.getDate()+"("+WEEKDAYS[base.getDay()]+")"} ;}
  function getDayDateStr(d){if(!startDate)return null;var base=new Date(startDate);base.setDate(base.getDate()+d-1);return base.toISOString().slice(0,10);}
  function handleEndChange(val){setPendingEnd(val);if(val&&startDate){var d1=new Date(startDate),d2=new Date(val);if(d2>=d1){var diff=Math.round((d2-d1)/864e5)+1;setTotalDays(diff);setEndDate(val);setShowDateInput(false);setPendingEnd("");if(activeDay>diff)setActiveDay(1);}}}
  // 交通資訊現在綁定「這個位置的地點卡」跟「下一個位置的地點卡」這兩張卡片本身，不是綁定第幾個位置；
  // dayLocsArr 需要傳入「當天依序排好的地點陣列」，這樣才能正確找出第 i、i+1 個位置實際是哪兩張卡
  function getConn(dayLocsArr,i){
    if(!dayLocsArr||i<0||i>=dayLocsArr.length-1)return {};
    return connectors[connKeyPair(dayLocsArr[i].id,dayLocsArr[i+1].id)]||{};
  }
  function setConn(dayLocsArr,i,val){
    if(!dayLocsArr||i<0||i>=dayLocsArr.length-1)return;
    var key=connKeyPair(dayLocsArr[i].id,dayLocsArr[i+1].id);
    setConnectors(function(c){var n=Object.assign({},c);n[key]=val;return n;});
  }
  function dayLocs(d){return locs.filter(function(l){return Number(l.day)===d;}).sort(function(a,b){return (a.order||0)-(b.order||0);});}
  function unassignedLocs(){return locs.filter(function(l){return !l.day||l.day===UNASSIGNED_TAB;});}
  function unassignedCategoryCounts(){var counts={};unassignedLocs().forEach(function(l){var c=l.mainCat||"其他";counts[c]=(counts[c]||0)+1;});return counts;}
  var isUnassignedTab=activeDay===UNASSIGNED_TAB;
  var allDayLocs=isUnassignedTab?unassignedLocs():dayLocs(activeDay);
  if(isUnassignedTab&&unassignedCatFilter){allDayLocs=allDayLocs.filter(function(l){return (l.mainCat||"其他")===unassignedCatFilter;});}
  var mapMarkerLocs=allDayLocs.filter(function(l){return l.lat&&l.lng;});

  useEffect(function(){if(view!=="map")return;var wc=allDayLocs.filter(function(l){return l.lat&&l.lng;});setFitIds(wc.slice(0,2).map(function(l){return l.id;}));setSelectedId(null);},[view,activeDay]);// eslint-disable-line
  useEffect(function(){if(!isUnassignedTab&&unassignedCatFilter)setUnassignedCatFilter(null);},[activeDay]);// eslint-disable-line

  function handleMapListScroll(){if(selectedId!==null)return;if(scrollTimerRef.current)clearTimeout(scrollTimerRef.current);scrollTimerRef.current=setTimeout(function(){var container=mapListRef.current;if(!container)return;var containerTop=container.getBoundingClientRect().top;var els=container.querySelectorAll("[data-loc-id]");var firstVisible=null;for(var i=0;i<els.length;i++){var r=els[i].getBoundingClientRect();if(r.bottom>containerTop){firstVisible=els[i];break;}}if(!firstVisible)return;var id=firstVisible.getAttribute("data-loc-id");var found=null;for(var j=0;j<allDayLocs.length;j++){if(String(allDayLocs[j].id)===id){found=allDayLocs[j];break;}}if(found&&found.lat&&found.lng)setFitIds([found.id]);},120);}
  function handleMapCardSelect(id){setSelectedId(function(s){return s===id?null:id;});var found=null;for(var i=0;i<allDayLocs.length;i++){if(allDayLocs[i].id===id){found=allDayLocs[i];break;}}if(found&&found.lat&&found.lng)setFitIds([id]);}
  function saveLoc(obj){setLocs(function(ls){var ex=ls.find(function(l){return l.id===obj.id;});return ex?ls.map(function(l){return l.id===obj.id?obj:l;}):ls.concat([obj]);});setShowAdd(false);setEditSpot(null);}
  function delLoc(id){setLocs(function(ls){return ls.filter(function(l){return l.id!==id;});});setEditSpot(null);}
  function assignDay(locIdOrIds,day){
    var ids=Array.isArray(locIdOrIds)?locIdOrIds:[locIdOrIds];
    var idSet={};ids.forEach(function(id){idSet[id]=true;});
    setLocs(function(ls){
      var cnt=ls.filter(function(l){return Number(l.day)===Number(day);}).length;
      var offset=0;
      return ls.map(function(l){
        if(idSet[l.id]){var updated=Object.assign({},l,{day:day,order:cnt+offset});offset++;return updated;}
        return l;
      });
    });
  }
  // ── 願望清單 ──
  function saveWishlistItem(item){setWishlist(function(ws){var ex=ws.find(function(w){return w.id===item.id;});return ex?ws.map(function(w){return w.id===item.id?item:w;}):ws.concat([item]);});setWishlistEdit(null);}
  function deleteWishlistItem(id){setWishlist(function(ws){return ws.filter(function(w){return w.id!==id;});});setWishlistEdit(null);}
  function assignWishlistDay(id,day){setWishlist(function(ws){return ws.map(function(w){return w.id===id?Object.assign({},w,{day:day}):w;});});}
  function toggleWishlistBought(id){setWishlist(function(ws){return ws.map(function(w){return w.id===id?Object.assign({},w,{bought:!w.bought}):w;});});}
  // ── 行李清單 ──
  function addPackingItem(section,name,subCat){if(!name||!name.trim())return;setPacking(function(p){var n=Object.assign({},p);n[section]=(n[section]||[]).concat([{id:uid(),name:name.trim(),checked:false,subCat:section==="other"?(subCat||"其他"):null}]);return n;});}
  function togglePackingItem(section,id){setPacking(function(p){var n=Object.assign({},p);n[section]=(n[section]||[]).map(function(it){return it.id===id?Object.assign({},it,{checked:!it.checked}):it;});return n;});}
  function removePackingItem(section,id){setPacking(function(p){var n=Object.assign({},p);n[section]=(n[section]||[]).filter(function(it){return it.id!==id;});return n;});}
  // ── 文件 ──
  function addDocument(folder,name,image,isPdf){setDocuments(function(d){var n=Object.assign({},d);n[folder]=(n[folder]||[]).concat([{id:uid(),name:name,image:image,isPdf:!!isPdf,note:"",addedAt:Date.now()}]);return n;});}
  function removeDocument(folder,id){setDocuments(function(d){var n=Object.assign({},d);n[folder]=(n[folder]||[]).filter(function(it){return it.id!==id;});return n;});}
  function renameDocument(folder,id,newName){setDocuments(function(d){var n=Object.assign({},d);n[folder]=(n[folder]||[]).map(function(it){return it.id===id?Object.assign({},it,{name:newName}):it;});return n;});}
  function saveDocumentNote(folder,docId,name,note){
    setDocuments(function(d){
      var n=Object.assign({},d);
      if(docId){n[folder]=(n[folder]||[]).map(function(it){return it.id===docId?Object.assign({},it,{name:name,note:note}):it;});}
      else{n[folder]=(n[folder]||[]).concat([{id:uid(),name:name||"文字備註",image:null,isPdf:false,note:note,addedAt:Date.now()}]);}
      return n;
    });
  }
  function addDocFolder(name){
    name=(name||"").trim();
    if(!name)return;
    if(docFolders.indexOf(name)>=0){showAlertMsg("已經有同名的資料夾了");return;}
    setDocFolders(function(f){return f.concat([name]);});
  }
  function renameDocFolderFn(oldName,newName){
    newName=(newName||"").trim();
    if(!newName||newName===oldName)return;
    if(docFolders.indexOf(newName)>=0){showAlertMsg("已經有同名的資料夾了");return;}
    setDocFolders(function(f){return f.map(function(x){return x===oldName?newName:x;});});
    setDocuments(function(d){var n=Object.assign({},d);if(n[oldName]){n[newName]=n[oldName];delete n[oldName];}return n;});
    setDocFolderOpen(function(cur){return cur===oldName?newName:cur;});
  }
  function deleteDocFolder(name){
    setDocFolders(function(f){return f.filter(function(x){return x!==name;});});
    setDocuments(function(d){var n=Object.assign({},d);delete n[name];return n;});
    setDocFolderOpen(function(cur){return cur===name?null:cur;});
  }
  // ── 即時匯率 ──
  // ── 即時匯率：直接呼叫外部匯率 API 在這個 sandbox 環境常常被封鎖（跟先前 alert()/prompt() 被擋是同一類限制），
  // 改用已確認可用的 api.anthropic.com + 網路搜尋工具來查詢，更穩定 ──
  // ── 預算總覽：依機票/住宿/餐食/交通/其他分類加總行程預估花費（全部換算成台幣）──
  function computeBudgetByCategory(){
    var cats={flight:0,stay:0,food:0,entertainment:0,transport:0,other:0};
    var items={flight:[],stay:[],food:[],entertainment:[],transport:[],other:[]};
    var transportBreakdown={};
    TRANSPORT_SUBCATS.forEach(function(tc){transportBreakdown[tc]=0;});
    var hasUnconverted=false;
    var namedCount=friends.filter(function(f){return f.name&&f.name.trim()&&!f.archived;}).length||1;
    // unit为 "perPerson" 時，輸入的數字是「一個人的金額」，要乘上人數才是這個項目的總額；
    // 預設（"total"／平分）則輸入的數字本身就是總額，不用再乘
    function addCost(bucket,amount,currency,unit){
      if(amount==null||isNaN(amount)||amount<=0)return null;
      var twd=toTwd(amount,currency||"TWD");
      if(twd==null){hasUnconverted=true;return null;}
      var total=(unit==="perPerson")?twd*namedCount:twd;
      cats[bucket]+=total;
      return total;
    }
    // 每一筆貢獻到某個分類的錢，額外記一筆明細（來源名稱＋金額），用來在預估旅費裡展開查看是哪一筆造成的
    function addItem(bucket,label,amount,sourceIcon){
      items[bucket].push({label:label,amount:amount,icon:sourceIcon});
    }
    // 記帳簿裡每一筆支出，依它的分類（budgetCat）分別算進對應的類別；交通類的還會再細分子分類
    expenses.forEach(function(exp){
      var bucket=exp.budgetCat||"other";
      if(!cats.hasOwnProperty(bucket))bucket="other";
      var expPayers=exp.payers||[];
      var expTotal=0;
      expPayers.forEach(function(p){
        var added=addCost(bucket,p.amount,exp.currency,"total");
        if(added!=null){
          expTotal+=added;
          if(bucket==="transport"){
            var tt=TRANSPORT_SUBCATS.indexOf(exp.transportType)>=0?exp.transportType:"其他";
            transportBreakdown[tt]+=added;
          }
        }
      });
      if(expTotal>0){
        var expLabel=exp.name;
        if(bucket==="transport"&&(exp.fromLocId||exp.toLocId)){
          var fromL=locs.find(function(l){return l.id===exp.fromLocId;});
          var toL=locs.find(function(l){return l.id===exp.toLocId;});
          if(fromL&&toL)expLabel=exp.name+"（"+fromL.name+" → "+toL.name+"）";
        }
        addItem(bucket,expLabel,expTotal,"📒");
      }
    });
    // 餐食：美食／咖啡廳／酒吧分類的行程卡預估花費
    // 娛樂：景點／集合點／其他分類的行程卡預估花費
    // 住宿／購物分類的行程卡沒有金額欄位（住宿走記帳簿固定項目、購物走願望清單），這裡不用處理
    // 已經標記「放棄」的地點不去了、或還沒被排進任何一天（還在「未分配」），花費都不算進預估旅費；
    // 也排除掉「以前指派過的天數後來被刪掉了」這種孤兒資料（例如原本排在第5天，後來把總天數減少到4天，
    // 這種地點卡其實哪個頁籤都找不到了，理當視同未分配）
    locs.forEach(function(loc){
      if(loc.status==="skipped")return;
      if(!loc.day||loc.day===UNASSIGNED_TAB||Number(loc.day)>totalDays)return;
      var cat=loc.mainCat;
      var bucket=null;
      if(cat==="美食"||cat==="咖啡廳"||cat==="酒吧")bucket="food";
      else if(cat==="景點"||cat==="集合點"||cat==="其他")bucket="entertainment";
      if(!bucket)return;
      var added=addCost(bucket,loc.estCost,loc.estCurrency,loc.costUnit);
      if(added!=null)addItem(bucket,loc.name,added,"📍");
    });
    // 購物：願望清單裡每個商品的金額 × 數量，算進娛樂
    wishlist.forEach(function(w){
      if(!w.price)return;
      var added=addCost("entertainment",w.price*(w.qty||1),w.currency,"total");
      if(added!=null)addItem("entertainment",w.name,added,"🛍️");
    });
    // 交通費：所有交通卡每一段（legs）填的預估花費，也相容舊版掛在整個交通卡上的花費欄位；
    // 細項分類依這一段填的「交通方式」文字去猜（計程車／捷運公車／包車…），猜不出來才算「其他」；
    // 明細標籤會標出「從哪裡到哪裡」，方便對照是哪一段行程（交通卡的 key 本身就是 p_出發地id_抵達地id）
    Object.keys(connectors).forEach(function(k){
      var c=connectors[k];
      if(!c)return;
      var routeLabel="";
      if(k.indexOf("p_")===0){
        var idsPart=k.slice(2).split("_");
        var fromLoc=locs.find(function(l){return l.id===idsPart[0];});
        var toLoc=locs.find(function(l){return l.id===idsPart[1];});
        if(fromLoc&&toLoc)routeLabel=fromLoc.name+" → "+toLoc.name;
      }
      function labelFor(mode){
        var modeLabel=mode?mode+"：":"";
        return routeLabel?(modeLabel+routeLabel):(mode||"交通段");
      }
      if(c.legs&&c.legs.length){
        c.legs.forEach(function(lg){
          if(!lg.estCost)return;
          var added=addCost("transport",parseFloat(lg.estCost),lg.estCurrency,lg.costUnit);
          if(added!=null){
            transportBreakdown[guessTransportSubCat(lg.transitMode,lg.transitLine)]+=added;
            addItem("transport",labelFor(lg.transitMode||lg.transitLine),added,"🚌");
          }
        });
      }else if(c.estCost){
        var added2=addCost("transport",parseFloat(c.estCost),c.estCurrency,c.costUnit);
        if(added2!=null){
          transportBreakdown[guessTransportSubCat(c.transitMode,c.transitLine)]+=added2;
          addItem("transport",labelFor(c.transitMode||c.transitLine),added2,"🚌");
        }
      }
    });
    // 每個分類底下的明細都依金額由大到小排，超出預期的那一筆自然會排在最上面
    Object.keys(items).forEach(function(bucket){items[bucket].sort(function(a,b){return b.amount-a.amount;});});
    var flightPerPerson=cats.flight/namedCount;
    var stayPerPerson=cats.stay/namedCount;
    var foodPerPerson=cats.food/namedCount;
    var entertainmentPerPerson=cats.entertainment/namedCount;
    var transportPerPerson=cats.transport/namedCount;
    var otherPerPerson=cats.other/namedCount;
    var totalPerPerson=flightPerPerson+stayPerPerson+foodPerPerson+entertainmentPerPerson+transportPerPerson+otherPerPerson;
    var total=cats.flight+cats.stay+cats.food+cats.entertainment+cats.transport+cats.other;
    return {flight:cats.flight,stay:cats.stay,food:cats.food,entertainment:cats.entertainment,transport:cats.transport,other:cats.other,total:total,
      flightPerPerson:flightPerPerson,stayPerPerson:stayPerPerson,foodPerPerson:foodPerPerson,entertainmentPerPerson:entertainmentPerPerson,transportPerPerson:transportPerPerson,otherPerPerson:otherPerPerson,totalPerPerson:totalPerPerson,
      transportBreakdown:transportBreakdown,items:items,
      hasUnconverted:hasUnconverted,perPersonCount:namedCount};
  }
  // ── 記帳分帳 ──
  function saveExpense(item){var isNew=!item.id||!expenses.some(function(e){return e.id===item.id;});setExpenses(function(es){var ex=es.find(function(e){return e.id===item.id;});return ex?es.map(function(e){return e.id===item.id?item:e;}):es.concat([item]);});setExpenseEdit(null);if(isNew)showCopyToast("已記一筆「"+item.name+"」✓");}
  // 從交通卡快速記一筆支出：帶一個依交通方式組成的名稱＋已填的通勤預估花費
  function recordConnExpense(conn,leg,li,fromLoc,toLoc){
    var mode=(leg&&leg.transitMode)?leg.transitMode:((conn&&conn.legs&&conn.legs[0]&&conn.legs[0].transitMode)?conn.legs[0].transitMode:(conn&&conn.transitMode));
    var name=mode?("交通費（"+mode+"）"):"交通費";
    var amount=leg?leg.estCost:(conn&&conn.estCost);
    var currency=leg?leg.estCurrency:(conn&&conn.estCurrency);
    var tt=TRANSPORT_SUBCATS.indexOf(guessTransportSubCat(mode,leg&&leg.transitLine))>=0?guessTransportSubCat(mode,leg&&leg.transitLine):"其他";
    setExpenseEdit({name:name,currency:currency||"TWD",budgetCat:"transport",transportType:tt,fromLocId:fromLoc?fromLoc.id:null,toLocId:toLoc?toLoc.id:null,payers:amount?[{friendId:"",amount:amount}]:[{friendId:"",amount:""}]});
  }
  function deleteExpense(id){setExpenses(function(es){return es.filter(function(e){return e.id!==id;});});setExpenseEdit(null);}
  // 把任何幣別換算成台幣，TWD 直接照原數字，其他幣別要有即時匯率資料才能換算，換不了回傳 null
  function toTwd(amount,currency){
    if(currency==="TWD")return amount;
    if(exchangeData&&exchangeData.rates&&exchangeData.rates[currency]!=null)return amount*exchangeData.rates[currency];
    return null;
  }
  // 計算每個人「已付」跟「應付份額」，回傳台幣淨額（正值代表別人欠他、負值代表他欠別人）
  function computeBalances(){
    var balances={};
    friends.forEach(function(f){if(f.name&&f.name.trim())balances[f.id]={paid:0,owe:0};});
    var hasUnconverted=false;
    expenses.forEach(function(exp){
      if(!exp.splitAmong||!exp.splitAmong.length)return; // 沒勾分攤對象＝不平分，純個人記錄，不影響團體餘額計算
      var payers=exp.payers||[];
      var totalAmount=payers.reduce(function(s,p){return s+(p.amount||0);},0);
      var totalTwd=toTwd(totalAmount,exp.currency);
      if(totalTwd==null){hasUnconverted=true;return;} // 沒有匯率資料的幣別先跳過，不計入
      var rate=totalAmount>0?totalTwd/totalAmount:0;
      payers.forEach(function(p){if(balances[p.friendId])balances[p.friendId].paid+=(p.amount||0)*rate;});
      var share=totalTwd/exp.splitAmong.length;
      exp.splitAmong.forEach(function(fid){if(balances[fid])balances[fid].owe+=share;});
    });
    var result=Object.keys(balances).map(function(id){var f=friends.find(function(x){return x.id===id;});return {id:id,name:f?f.name:"？",paid:balances[id].paid,owe:balances[id].owe,net:balances[id].paid-balances[id].owe,archived:f?!!f.archived:false};});
    return {balances:result,hasUnconverted:hasUnconverted};
  }
  // 簡單貪婪演算法算出「誰要付給誰多少錢」讓帳務結清，筆數盡量少
  function computeSettlements(balanceList){
    var creditors=balanceList.filter(function(b){return b.net>0.5;}).map(function(b){return {id:b.id,name:b.name,amt:b.net};}).sort(function(a,b){return b.amt-a.amt;});
    var debtors=balanceList.filter(function(b){return b.net<-0.5;}).map(function(b){return {id:b.id,name:b.name,amt:-b.net};}).sort(function(a,b){return b.amt-a.amt;});
    var settlements=[];
    var ci=0,di=0;
    while(ci<creditors.length&&di<debtors.length){
      var c=creditors[ci],d=debtors[di];
      var amt=Math.min(c.amt,d.amt);
      settlements.push({from:d.name,to:c.name,amount:amt});
      c.amt-=amt;d.amt-=amt;
      if(c.amt<0.5)ci++;
      if(d.amt<0.5)di++;
    }
    return settlements;
  }
  // 手動輸入匯率（AI 查詢失敗、或沒有登入 Claude 帳號無法用 AI 功能時的備援方式）：
  // 直接把使用者輸入的匯率合併進 exchangeData，跟 AI 查到的資料共用同一份，之後記帳/預算換算都吃得到
  function setManualRate(currency,rateStr){
    var r=parseFloat(rateStr);
    if(isNaN(r)||r<=0){showAlertMsg("請輸入大於 0 的數字");return;}
    setExchangeData(function(prev){
      var rates=Object.assign({},prev&&prev.rates?prev.rates:{});
      rates[currency]=r;
      return {date:(prev&&prev.date)||"手動輸入",rates:rates};
    });
    setManualRateInput("");
    showCopyToast("已手動設定 1 "+currency+" ≈ "+r+" TWD");
  }
  function fetchTwdRates(){
    setExchangeLoading(true);
    // 改用免費、不用金鑰的匯率 API（open.er-api.com），用台幣當基準幣別，再換算成「1單位外幣=多少台幣」
    fetch("https://open.er-api.com/v6/latest/TWD")
      .then(function(r){return r.json();})
      .then(function(d){
        setExchangeLoading(false);
        if(!d||d.result!=="success"||!d.rates)throw new Error("匯率服務暫時無法使用，請稍後再試，或改用下方手動輸入");
        var rates={};
        CURRENCIES.filter(function(c){return c!=="TWD";}).forEach(function(c){
          if(d.rates[c])rates[c]=1/d.rates[c];
        });
        setExchangeData({date:d.time_last_update_utc?d.time_last_update_utc.slice(0,16):"",rates:rates});
      })
      .catch(function(err){setExchangeLoading(false);showAlertMsg("查詢匯率失敗：\n"+(err&&err.message?err.message:err)+"\n可以改用下方手動輸入匯率。");});
  }
  // ── 根據行程資料猜測目的地（優先用已填的城市，其次用旅行名稱+地點名稱給 AI 判斷）──
  function guessDestinationQuery(){
    if(destinationCity&&destinationCity.trim())return destinationCity.trim();
    var cityLoc=locs.find(function(l){return l.city&&l.city.trim();});
    if(cityLoc)return cityLoc.city.trim();
    var sampleNames=locs.slice(0,5).map(function(l){return l.name;}).filter(Boolean).join("、");
    if(tripName)return tripName+(sampleNames?"（行程包含："+sampleNames+"）":"");
    return sampleNames||"";
  }
  // ── 即時天氣：改用免費、不用金鑰的 Open-Meteo（地名先查座標，再查預報），優先依行程地點自動判斷目的地 ──
  function weatherCodeToDesc(code){
    var map={0:"晴天",1:"晴時多雲",2:"多雲",3:"陰天",45:"霧",48:"霧",51:"毛毛雨",53:"毛毛雨",55:"毛毛雨",56:"凍雨",57:"凍雨",61:"小雨",63:"雨",65:"大雨",66:"凍雨",67:"凍雨",71:"小雪",73:"雪",75:"大雪",77:"陣雪",80:"陣雨",81:"陣雨",82:"強陣雨",85:"陣雪",86:"陣雪",95:"雷雨",96:"雷雨",99:"雷雨"};
    return map[code]||"—";
  }
  function fetchWeather(cityInput){
    var query=(cityInput&&cityInput.trim())?cityInput.trim():guessDestinationQuery();
    if(!query){showAlertMsg("請先輸入目的地城市名稱，或先在行程裡新增幾個地點，才能自動判斷目的地");return;}
    setWeatherLoading(true);
    fetch("https://geocoding-api.open-meteo.com/v1/search?name="+encodeURIComponent(query)+"&count=1&language=zh")
      .then(function(r){return r.json();})
      .then(function(geo){
        if(!geo.results||!geo.results.length)throw new Error("找不到「"+query+"」，請確認地名，或試試看改用英文/城市名稱");
        var place=geo.results[0];
        return fetch("https://api.open-meteo.com/v1/forecast?latitude="+place.latitude+"&longitude="+place.longitude+"&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=7")
          .then(function(r){return r.json();})
          .then(function(fc){
            if(!fc.daily||!fc.daily.time||!fc.daily.time.length)throw new Error("找不到「"+query+"」的天氣資料");
            var days=fc.daily.time.map(function(date,i){
              return {date:date,tempMin:fc.daily.temperature_2m_min[i],tempMax:fc.daily.temperature_2m_max[i],desc:weatherCodeToDesc(fc.daily.weathercode[i]),rainChance:null};
            });
            setWeatherLoading(false);
            setWeatherData({place:place.name,days:days});
            if(!destinationCity&&place.name)setDestinationCity(place.name);
          });
      })
      .catch(function(err){setWeatherLoading(false);showAlertMsg("查詢天氣失敗：\n"+(err&&err.message?err.message:err));});
  }
  function weatherDescToEmoji(desc){
    desc=desc||"";
    if(desc.indexOf("雷")>=0)return "⛈️";
    if(desc.indexOf("雪")>=0)return "🌨️";
    if(desc.indexOf("雨")>=0)return "🌧️";
    if(desc.indexOf("霧")>=0)return "🌫️";
    if(desc.indexOf("陰")>=0)return "☁️";
    if(desc.indexOf("雲")>=0)return "⛅";
    if(desc.indexOf("晴")>=0)return "☀️";
    return "🌡️";
  }
  function onStatus(id,st){setLocs(function(ls){return ls.map(function(l){return l.id!==id?l:Object.assign({},l,{status:l.status===st?"active":st});});});}
  function onMust(locId,fid){setLocs(function(ls){return ls.map(function(l){if(l.id!==locId)return l;var mb=l.mustBy||[];return Object.assign({},l,{mustBy:mb.indexOf(fid)>=0?mb.filter(function(x){return x!==fid;}):mb.concat([fid])});});});}
  function handleReorder(newOrderLocs){
    setLocs(function(ls){
      var others=ls.filter(function(l){return isUnassignedTab?(l.day&&l.day!==UNASSIGNED_TAB):(Number(l.day)!==Number(activeDay));});
      return others.concat(newOrderLocs.map(function(l,i){return Object.assign({},l,{order:i});}));
    });
    // 交通資訊現在綁定「兩張卡片」不是「位置」，重新排序完全不需要搬動任何交通資料：
    // 原本相鄰的兩張卡片就算換了位置，中間的交通資訊自然還在、還是正確的；
    // 原本相鄰、這次被拆開的兩張卡片，資料還留著但不會再被顯示出來，不會誤導成別的交通方式
  }

  // ── 天數頁籤：觸控拖曳重新排序（用移動門檻避免跟橫向捲動衝突）──
  var tabPointerStartRef=useRef(null);
  var tabDragActiveRef=useRef(false);
  function reorderDays(src,d){
    if(src===d||d===UNASSIGNED_TAB||src===UNASSIGNED_TAB)return;
    var order=Array.from({length:totalDays},function(_,i){return i+1;});
    var si=order.indexOf(src),di=order.indexOf(d);order.splice(si,1);order.splice(di,0,src);
    var map={};order.forEach(function(old,ni){map[old]=ni+1;});
    setLocs(function(ls){return ls.map(function(l){if(!l.day||l.day===UNASSIGNED_TAB)return l;var nd=map[Number(l.day)];return nd?Object.assign({},l,{day:nd}):l;});});
    setActiveDay(function(prev){return prev===UNASSIGNED_TAB?UNASSIGNED_TAB:(map[prev]||1);});
  }
  function onTabPointerDown(e,d){
    tabPointerStartRef.current={x:e.clientX,y:e.clientY,day:d};
    tabDragActiveRef.current=false;
    tabDragSrcDay.current=d;
    try{e.currentTarget.setPointerCapture(e.pointerId);}catch(err){}
  }
  function onTabPointerMove(e){
    var start=tabPointerStartRef.current;
    if(!start)return;
    var dx=e.clientX-start.x,dy=e.clientY-start.y;
    if(!tabDragActiveRef.current){
      if(Math.abs(dx)<10&&Math.abs(dy)<10)return; // 未超過門檻，讓瀏覽器繼續處理橫向捲動
      if(start.day===UNASSIGNED_TAB)return; // 未分配頁籤不可拖曳排序
      tabDragActiveRef.current=true;
      setDraggingTabDay(start.day);
    }
    e.preventDefault();
    var elUnder=document.elementFromPoint(e.clientX,e.clientY);
    var tabEl=elUnder&&elUnder.closest?elUnder.closest("[data-day-tab]"):null;
    if(tabEl){
      var day=tabEl.getAttribute("data-day-tab");
      setDropTargetDay(day===UNASSIGNED_TAB?UNASSIGNED_TAB:Number(day));
    }else{
      setDropTargetDay(null);
    }
  }
  function onTabPointerUp(e){
    var start=tabPointerStartRef.current;
    if(start&&tabDragActiveRef.current&&dropTargetDay!=null){
      reorderDays(start.day,dropTargetDay);
    }
    tabPointerStartRef.current=null;
    tabDragActiveRef.current=false;
    setDraggingTabDay(null);setDropTargetDay(null);tabDragSrcDay.current=null;
  }
  function onDragHoverTab(day){
    if(day==null){setDropTargetDay(null);return;}
    setDropTargetDay(day===UNASSIGNED_TAB?UNASSIGNED_TAB:Number(day));
  }
  function onDropOnDayTab(locIdOrIds,day){
    var d=day===UNASSIGNED_TAB?UNASSIGNED_TAB:Number(day);
    assignDay(locIdOrIds,d);
    if(d!==UNASSIGNED_TAB)setActiveDay(d);
    setDropTargetDay(null);
  }
  function addFriend(){setFriends(function(f){return f.concat([{id:uid(),name:""}]);});}
  // ── 封存旅伴（不是真的刪除）：既有的記帳/地點關聯資料完全保留，只是不再出現在新增選項裡 ──
  function archiveFriend(id){setFriends(function(f){return f.map(function(x){return x.id===id?Object.assign({},x,{archived:true}):x;});});if(currentUID===id)setCurrentUID(null);}
  function unarchiveFriend(id){setFriends(function(f){return f.map(function(x){return x.id===id?Object.assign({},x,{archived:false}):x;});});}
  function friendNetBalance(id){var r=computeBalances();var b=r.balances.find(function(x){return x.id===id;});return b?b.net:0;}
  // ── 永久刪除：只能對「已封存」的旅伴做，會連帶清掉記帳付款人/分攤、地點必去標記裡的殘留關聯 ──
  function permanentlyDeleteFriend(id){
    setFriends(function(f){return f.filter(function(x){return x.id!==id;});});
    setExpenses(function(es){return es.map(function(e){
      var newPayers=(e.payers||[]).filter(function(p){return p.friendId!==id;});
      var newSplit=(e.splitAmong||[]).filter(function(x){return x!==id;});
      return Object.assign({},e,{payers:newPayers,splitAmong:newSplit});
    }).filter(function(e){return (e.payers||[]).length>0;});}); // 如果整筆支出的付款人都被刪光了，這筆記錄留著也沒意義，一併移除
    setLocs(function(ls){return ls.map(function(l){return l.mustBy&&l.mustBy.indexOf(id)>=0?Object.assign({},l,{mustBy:l.mustBy.filter(function(x){return x!==id;})}):l;});});
  }
  function updFriend(id,v){setFriends(function(f){return f.map(function(x){return x.id===id?Object.assign({},x,{name:v}):x;});});}
  function updFriendColor(id,color){setFriends(function(f){return f.map(function(x){return x.id===id?Object.assign({},x,{color:color}):x;});});}

  var days=Array.from({length:totalDays},function(_,i){return i+1;});
  var unassignedCount=unassignedLocs().length;
  var inp2={padding:"4px 8px",borderRadius:7,border:"none",fontSize:12,background:"rgba(255,255,255,.2)",color:C.white,outline:"none"};

  // ── 計畫選單（header 下拉）──
  // ── 頂層畫面：所有旅行計畫 ──
  // ── 在列表直接改計畫名稱 ──
  function applyTripIcon(tripId,icon){
    setTripsIndex(function(idx){
      var newIdx=idx.map(function(tt){return tt.id===tripId?Object.assign({},tt,{icon:icon}):tt;});
      storageSet(TRIPS_INDEX_KEY,newIdx);
      return newIdx;
    });
  }
  function applyTripRename(tripId,newName){
    newName=(newName||"").trim();
    if(!newName)return;
    setTripsIndex(function(idx){
      var newIdx=idx.map(function(tt){return tt.id===tripId?Object.assign({},tt,{name:newName}):tt;});
      storageSet(TRIPS_INDEX_KEY,newIdx);
      return newIdx;
    });
    if(tripId===currentTripId){
      setTripName(newName);
    } else {
      storageGet(TRIP_PREFIX+tripId).then(function(d){
        if(!d)d=makeTripData(newName);
        d=Object.assign({},d,{tripName:newName});
        storageSet(TRIP_PREFIX+tripId,d);
      });
    }
  }
  // ── 依開始日期排序（較晚/較遠的在上面，沒設定日期的排最後）──
  function sortedTripsForList(){
    var arr=tripsIndex.slice();
    arr.sort(function(a,b){
      var ad=a.startDate||"",bd=b.startDate||"";
      if(ad&&bd)return bd.localeCompare(ad);
      if(ad&&!bd)return -1;
      if(!ad&&bd)return 1;
      return 0;
    });
    return arr;
  }
  function TripListScreen(){
    return React.createElement("div",{style:{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}},
      React.createElement("div",{style:{background:C.header,padding:"16px 16px 14px",flexShrink:0}},
        React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"}},
          React.createElement("span",{style:{fontSize:18,fontWeight:700,color:C.white}},"✈️ 所有旅行計畫"),
          React.createElement("div",{style:{display:"flex",gap:6}},
            React.createElement("button",{onClick:openExportAll,style:{background:"rgba(255,255,255,.18)",border:"none",borderRadius:9,padding:"6px 10px",color:C.white,fontSize:13,cursor:"pointer"}},"💾"),
            React.createElement("button",{onClick:function(){setShowImport(true);setImportText("");},style:{background:"rgba(255,255,255,.18)",border:"none",borderRadius:9,padding:"6px 10px",color:C.white,fontSize:13,cursor:"pointer"}},"📂")))),
      React.createElement("div",{style:{flex:1,overflowY:"auto",padding:"14px 14px 100px"}},
        tripsIndex.length===0?React.createElement("div",{style:{textAlign:"center",padding:"3rem 0",color:C.mid}},"尚無旅行計畫，點下方「＋」新增一個吧"):null,
        sortedTripsForList().map(function(t){
          var isCur=t.id===currentTripId;
          var dateInfo=getTripDateInfo(t);
          var dateLine=t.startDate&&t.endDate?(function(){var b=new Date(t.startDate),e2=new Date(t.endDate);return (b.getMonth()+1)+"/"+b.getDate()+" – "+(e2.getMonth()+1)+"/"+e2.getDate();})():null;
          var countdownLabel=dateInfo.expired?"已結束":(dateInfo.ongoing?"進行中":(dateInfo.daysUntil!=null?"還有 "+dateInfo.daysUntil+" 天出發":null));
          return React.createElement("div",{key:t.id,onClick:function(){switchTrip(t.id);},style:{background:C.white,borderRadius:16,padding:"14px 16px",marginBottom:10,cursor:"pointer",boxShadow:"0 1px 6px rgba(78,85,92,.08)",border:isCur?"2px solid "+C.teal:"2px solid transparent",display:"flex",alignItems:"center",opacity:dateInfo.expired?.55:1,filter:dateInfo.expired?"grayscale(0.6)":"none"}},
            React.createElement("button",{onClick:function(e){e.stopPropagation();setIconPickerTarget(t);},style:{width:40,height:40,borderRadius:"50%",background:C.light,border:"1.5px solid "+C.border,fontSize:19,cursor:"pointer",flexShrink:0,marginRight:12,display:"flex",alignItems:"center",justifyContent:"center"}},t.icon||"✈️"),
            React.createElement("div",{style:{flex:1,minWidth:0}},
              React.createElement("div",{style:{fontSize:16,fontWeight:700,color:C.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},t.name),
              React.createElement("div",{style:{fontSize:12,color:C.mid,marginTop:3}},
                [dateLine,t.locCount>0?t.locCount+" 個地點":null].filter(Boolean).join(" · ")||"尚無內容"),
              countdownLabel?React.createElement("div",{style:{fontSize:11,marginTop:3,fontWeight:700,color:dateInfo.expired?C.mid:(dateInfo.ongoing?"#5A9A7A":C.teal)}},(dateInfo.expired?"":(dateInfo.ongoing?"🟢 ":"🕐 "))+countdownLabel):null),
            isCur?React.createElement("span",{style:{fontSize:10,background:C.skyblue,color:C.navy,borderRadius:5,padding:"3px 8px",marginLeft:8,flexShrink:0,fontWeight:700}},"目前"):null,
            React.createElement("button",{onClick:function(e){e.stopPropagation();duplicateTrip(t);},style:{width:36,height:36,borderRadius:"50%",background:"none",border:"none",color:C.mid,cursor:"pointer",fontSize:15,marginLeft:2,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}},"📄"),
            React.createElement("button",{onClick:function(e){e.stopPropagation();setRenameTarget(t);},style:{width:36,height:36,borderRadius:"50%",background:"none",border:"none",color:C.mid,cursor:"pointer",fontSize:15,marginLeft:2,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}},"✏️"),
            React.createElement("div",{style:{position:"relative",flexShrink:0}},
              React.createElement("button",{onClick:function(e){e.stopPropagation();setTripMoreMenuId(function(cur){return cur===t.id?null:t.id;});},style:{width:36,height:36,borderRadius:"50%",background:tripMoreMenuId===t.id?C.light:"none",border:"none",color:C.mid,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}},"⋯"),
              tripMoreMenuId===t.id?React.createElement(React.Fragment,null,
                React.createElement("div",{onClick:function(e){e.stopPropagation();setTripMoreMenuId(null);},style:{position:"fixed",inset:0,zIndex:40}}),
                React.createElement("div",{onClick:function(e){e.stopPropagation();},style:{position:"absolute",top:"100%",right:0,marginTop:4,background:C.white,borderRadius:10,boxShadow:"0 4px 16px rgba(0,0,0,.2)",overflow:"hidden",zIndex:50,minWidth:140,border:"1px solid "+C.border}},
                  React.createElement("button",{onClick:function(){setTripMoreMenuId(null);openExportSingle(t);},style:{width:"100%",textAlign:"left",padding:"10px 14px",minHeight:40,border:"none",background:"none",color:C.navy,cursor:"pointer",fontSize:13,boxSizing:"border-box"}},"💾 備份此計畫"),
                  React.createElement("button",{onClick:function(){setTripMoreMenuId(null);setDelTripConfirm(t);},style:{width:"100%",textAlign:"left",padding:"10px 14px",minHeight:40,border:"none",background:"none",color:"#C55",cursor:"pointer",fontSize:13,boxSizing:"border-box",borderTop:"1px solid "+C.border}},"🗑 刪除"))):null));
        })),
      React.createElement("button",{onClick:createTrip,style:{position:"fixed",right:20,bottom:"calc(20px + env(safe-area-inset-bottom, 0px))",width:52,height:52,borderRadius:"50%",border:"none",background:C.navy,color:C.white,fontSize:26,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(78,85,92,.4)"}},"+"));
  }

  return React.createElement("div",{style:{width:"100%",maxWidth:480,margin:"0 auto",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:C.light,height:"100dvh",display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 0 40px rgba(0,0,0,.08)"}},
    copyToast?React.createElement(CopyToast,{text:copyToast}):null,
    delTripConfirm?React.createElement(ConfirmDialog,{msg:"確定要刪除「"+delTripConfirm.name+"」？此計畫所有地點將一併刪除。",onOk:function(){deleteTrip(delTripConfirm.id);},onCancel:function(){setDelTripConfirm(null);},okLabel:"確定刪除"}):null,
    friendArchiveConfirm?React.createElement(ConfirmDialog,{msg:"「"+friendArchiveConfirm.name+"」還有帳務尚未結清（"+(function(){var net=friendNetBalance(friendArchiveConfirm.id);return net>0?("應收 NT$"+net.toFixed(0)):("應付 NT$"+(-net).toFixed(0));})()+"）。\n\n移除後這個人不會出現在旅伴名單裡，但記帳資料會保留，餘額仍會照常計算，之後可以到「已封存的旅伴」找到他並取消封存。",onOk:function(){archiveFriend(friendArchiveConfirm.id);setFriendArchiveConfirm(null);},onCancel:function(){setFriendArchiveConfirm(null);},okLabel:"移除（保留帳務資料）"}):null,

    // 單一計畫還原：先選「還原成新計畫」還是「覆蓋現有計畫」
    (singleRestorePending&&!singleRestorePicking)?React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:24}},
      React.createElement("div",{style:{background:C.white,borderRadius:18,padding:"22px 20px",maxWidth:340,width:"100%"}},
        React.createElement("div",{style:{fontSize:14,fontWeight:700,color:C.navy,marginBottom:6}},"偵測到單一計畫備份"),
        React.createElement("div",{style:{fontSize:13,color:C.mid,marginBottom:18,lineHeight:1.6}},"「"+singleRestorePending.tripName+"」，要怎麼還原？"),
        React.createElement("button",{onClick:function(){restoreSingleAsNew(singleRestorePending);},style:{width:"100%",padding:"11px",borderRadius:10,border:"none",background:C.teal,color:C.white,cursor:"pointer",fontSize:13,fontWeight:700,marginBottom:8}},"還原成新計畫"),
        React.createElement("button",{onClick:function(){setSingleRestorePicking(true);},style:{width:"100%",padding:"11px",borderRadius:10,border:"1.5px solid "+C.border,background:C.white,color:C.navy,cursor:"pointer",fontSize:13,fontWeight:700,marginBottom:8}},"覆蓋現有計畫…"),
        React.createElement("button",{onClick:function(){setSingleRestorePending(null);},style:{width:"100%",padding:"10px",borderRadius:10,border:"none",background:"none",color:C.mid,cursor:"pointer",fontSize:12}},"取消"))):null,

    // 單一計畫還原：挑選要覆蓋哪一個現有計畫
    (singleRestorePending&&singleRestorePicking)?React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:24}},
      React.createElement("div",{style:{background:C.white,borderRadius:18,padding:"20px",maxWidth:360,width:"100%",maxHeight:"75vh",display:"flex",flexDirection:"column"}},
        React.createElement("div",{style:{fontSize:14,fontWeight:700,color:C.navy,marginBottom:4}},"選擇要覆蓋哪一個計畫"),
        React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:12}},"選好的計畫，內容會被「"+singleRestorePending.tripName+"」整個取代"),
        React.createElement("div",{style:{overflowY:"auto",flex:1,marginBottom:12}},
          tripsIndex.length===0?React.createElement("div",{style:{fontSize:12,color:C.mid,textAlign:"center",padding:"1rem 0"}},"目前沒有其他計畫可以覆蓋"):
          tripsIndex.map(function(t){return React.createElement("button",{key:t.id,onClick:function(){setOverwriteConfirm(t);},style:{width:"100%",textAlign:"left",padding:"11px 12px",borderRadius:10,border:"1.5px solid "+C.border,background:C.light,color:C.navy,cursor:"pointer",fontSize:13,marginBottom:6,display:"flex",alignItems:"center",gap:8}},React.createElement("span",null,t.icon||"✈️"),React.createElement("span",{style:{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},t.name));})),
        React.createElement("button",{onClick:function(){setSingleRestorePicking(false);},style:{width:"100%",padding:"10px",borderRadius:10,border:"1.5px solid "+C.border,background:C.white,color:C.mid,cursor:"pointer",fontSize:12}},"← 返回"))):null,

    // 單一計畫還原：覆蓋前的最後確認（破壞性操作，一定要再確認一次）
    overwriteConfirm?React.createElement(ConfirmDialog,{msg:"確定要用「"+singleRestorePending.tripName+"」的內容，覆蓋掉「"+overwriteConfirm.name+"」嗎？\n\n「"+overwriteConfirm.name+"」原本的所有資料（地點、記帳、願望清單等）都會被取代，且無法復原。",onOk:function(){restoreSingleOverwrite(singleRestorePending,overwriteConfirm);},onCancel:function(){setOverwriteConfirm(null);},okLabel:"確定覆蓋"}):null,
    friendDeleteConfirm?React.createElement(ConfirmDialog,{msg:(function(){var net=friendNetBalance(friendDeleteConfirm.id);var warn=Math.abs(net)>0.5?("\n\n⚠️ 這個人還有「"+(net>0?"應收 NT$"+net.toFixed(0):"應付 NT$"+(-net).toFixed(0))+"」尚未結清，永久刪除後這筆帳務關聯會被移除，餘額計算不會再算到他。"):"";return "確定要永久刪除「"+friendDeleteConfirm.name+"」嗎？這會清除他在所有記帳紀錄跟地點「必去」標記裡的關聯，且無法復原。"+warn;})(),onOk:function(){permanentlyDeleteFriend(friendDeleteConfirm.id);setFriendDeleteConfirm(null);},onCancel:function(){setFriendDeleteConfirm(null);},okLabel:"永久刪除"}):null,
    renameTarget?React.createElement(RenameModal,{initialName:renameTarget.name,onSave:function(v){applyTripRename(renameTarget.id,v);setRenameTarget(null);},onClose:function(){setRenameTarget(null);}}):null,
    alertMsg?React.createElement(AlertModal,{msg:alertMsg,onClose:function(){setAlertMsg(null);}}):null,
    iconPickerTarget?React.createElement(IconPickerModal,{currentIcon:iconPickerTarget.icon||"✈️",onSave:function(ic){applyTripIcon(iconPickerTarget.id,ic);setIconPickerTarget(null);},onClose:function(){setIconPickerTarget(null);}}):null,
    copyMenuLoc?React.createElement(CopyToTripMenu,{loc:copyMenuLoc,trips:tripsIndex,currentTripId:currentTripId,onCopyLocal:function(){var copy=Object.assign({},copyMenuLoc,{id:uid(),day:UNASSIGNED_TAB,order:Date.now(),mustBy:[],status:"active"});setLocs(function(ls){return ls.concat([copy]);});showCopyToast("已複製到未分配");setCopyMenuLoc(null);},onCopyToTrip:function(tid){copyLocToTrip(copyMenuLoc,tid);},onClose:function(){setCopyMenuLoc(null);}}):null,

    appView==="tripDetail" ? React.createElement(React.Fragment,null,
    // Header
    React.createElement("div",{style:{background:C.header,padding:"10px 14px",flexShrink:0}},
      React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"}},
        React.createElement("div",{style:{flex:1,minWidth:0}},
          // 返回所有計畫 + 計畫名稱
          React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6}},
            React.createElement("button",{onClick:function(){setAppView("tripList");},style:{background:"none",border:"none",color:C.white,cursor:"pointer",fontSize:16,padding:"0 4px 0 0",flexShrink:0,lineHeight:1}},"←"),
            React.createElement("div",{
              style:{fontSize:15,fontWeight:700,color:C.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer",userSelect:"none"},
              onClick:function(){setRenameTarget({id:currentTripId,name:tripName});}
            },tripName),
            React.createElement("button",{onClick:function(){setRenameTarget({id:currentTripId,name:tripName});},style:{background:"none",border:"none",color:"rgba(255,255,255,.7)",cursor:"pointer",padding:"6px 0 6px 6px",minHeight:36,minWidth:28,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",boxSizing:"border-box"}},React.createElement("span",{dangerouslySetInnerHTML:{__html:navIcon("pencil","rgba(255,255,255,.85)",14)}}))),
          React.createElement("div",{style:{fontSize:11,color:"rgba(255,255,255,.75)",cursor:"pointer",marginTop:1},onClick:function(){setShowDateInput(function(s){return !s;});}},
            startDate&&endDate?(function(){var b=new Date(startDate),e2=new Date(endDate);return (b.getMonth()+1)+"/"+b.getDate()+" – "+(e2.getMonth()+1)+"/"+e2.getDate()+" · "+totalDays+"天";})():"點擊設定旅行日期"),
          syncStatus?React.createElement("div",{style:{fontSize:10,color:"rgba(255,255,255,.7)",marginTop:1}},"☁ "+syncStatus):null,
          showDateInput?React.createElement("div",{style:{marginTop:6,display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}},
            React.createElement("input",{type:"date",value:startDate,onChange:function(e){var v=e.target.value;setStartDate(v);if(endDate){var d1=new Date(v),d2=new Date(endDate);if(d2>=d1)setTotalDays(Math.round((d2-d1)/864e5)+1);}},style:inp2}),
            React.createElement("span",{style:{color:"rgba(255,255,255,.6)"}},"–"),
            React.createElement("input",{type:"date",value:pendingEnd||endDate,min:startDate,onChange:function(e){handleEndChange(e.target.value);},style:inp2})):null),
        React.createElement("div",{style:{display:"flex",gap:5,alignItems:"center",flexShrink:0}},
          currentUser?React.createElement(Avatar,{name:currentUser.name,color:currentUser.color||AVATAR_COLORS[curIdx<0?0:curIdx%AVATAR_COLORS.length],size:26,active:true}):null,
          React.createElement("button",{onClick:toggleFlights,style:{background:flightsOpen?"rgba(255,255,255,.35)":"rgba(255,255,255,.18)",border:"none",borderRadius:9,padding:"7px 9px",minHeight:36,minWidth:36,color:C.white,cursor:"pointer",lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center",boxSizing:"border-box"}},React.createElement("span",{dangerouslySetInnerHTML:{__html:navIcon("plane",C.white,17)}})),
          React.createElement("button",{onClick:function(){setShowFriends(function(s){return !s;});closeFlights();setShowToolsMenu(false);setShowExchange(false);setShowDocuments(false);},style:{background:showFriends?"rgba(255,255,255,.35)":"rgba(255,255,255,.18)",border:"none",borderRadius:9,padding:"6px 9px",minHeight:36,color:C.white,fontSize:12,cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:4,boxSizing:"border-box"}},React.createElement("span",{dangerouslySetInnerHTML:{__html:navIcon("users",C.white,16)}}),named.length),
          React.createElement("button",{onClick:function(){setShowExchange(true);setShowFriends(false);closeFlights();setShowToolsMenu(false);setShowDocuments(false);},style:{background:showExchange?"rgba(255,255,255,.35)":"rgba(255,255,255,.18)",border:"none",borderRadius:9,padding:"7px 9px",minHeight:36,minWidth:36,color:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxSizing:"border-box"}},React.createElement("span",{dangerouslySetInnerHTML:{__html:navIcon("wallet",C.white,16)}})),
          React.createElement("button",{onClick:function(){setShowToolsMenu(function(s){return !s;});setShowFriends(false);closeFlights();setShowExchange(false);setShowDocuments(false);},style:{background:showToolsMenu?"rgba(255,255,255,.35)":"rgba(255,255,255,.18)",border:"none",borderRadius:9,padding:"7px 9px",minHeight:36,minWidth:36,color:C.white,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxSizing:"border-box"}},React.createElement("span",{dangerouslySetInnerHTML:{__html:navIcon("more",C.white,16)}})))),

      flightsOpen?React.createElement("div",{style:{background:"rgba(255,255,255,.1)",borderRadius:13,padding:"11px",marginTop:10,border:"1px solid rgba(255,255,255,.15)",maxHeight:"60vh",overflowY:"auto"}},
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
          React.createElement("span",{style:{fontSize:12,fontWeight:700,color:C.white}},"✈️ 機票資訊"),
          React.createElement("button",{onClick:closeFlights,style:{background:"rgba(255,255,255,.25)",border:"none",borderRadius:7,padding:"3px 10px",color:C.white,fontSize:15,cursor:"pointer",fontWeight:700}},"×")),
        React.createElement(FlightCard,{isOut:true,data:flights.outbound,onEdit:function(){setFlightEditDir("outbound");closeFlights();}}),
        React.createElement("div",{style:{borderTop:"1px solid rgba(255,255,255,.2)",margin:"10px 0"}}),
        React.createElement(FlightCard,{isOut:false,data:flights.inbound,onEdit:function(){setFlightEditDir("inbound");closeFlights();}})):null,

      showFriends?React.createElement("div",{style:{background:"rgba(255,255,255,.1)",borderRadius:13,padding:"11px",marginTop:10,border:"1px solid rgba(255,255,255,.15)"}},
        React.createElement("div",{style:{fontSize:11,color:"rgba(255,255,255,.8)",marginBottom:8,fontWeight:600}},"點頭像選擇「我是誰」才能標記必去 ❤️"),
        friends.filter(function(f){return !f.archived;}).map(function(f,i){var isCur=f.id===currentUID,fColor=f.color||AVATAR_COLORS[i%AVATAR_COLORS.length];return React.createElement("div",{key:f.id,style:{marginBottom:8}},React.createElement("div",{style:{display:"flex",alignItems:"center",gap:7}},React.createElement("div",{onClick:function(){setCurrentUID(isCur?null:f.id);setColorPickFriend(colorPickFriend===f.id?null:f.id);},style:{cursor:"pointer",position:"relative"}},React.createElement(Avatar,{name:f.name||"?",color:fColor,size:28,active:isCur}),isCur?React.createElement("div",{style:{position:"absolute",top:-2,right:-2,background:C.skyblue,borderRadius:"50%",width:9,height:9,border:"2px solid "+C.header}}):null),isCur?React.createElement("span",{style:{fontSize:9,background:C.skyblue,color:C.navy,borderRadius:4,padding:"1px 5px",fontWeight:700,flexShrink:0}},"我"):null,React.createElement("input",{value:f.name,placeholder:"旅伴 "+(i+1),onChange:function(e){updFriend(f.id,e.target.value);},style:{flex:1,background:"rgba(255,255,255,.12)",border:"none",borderRadius:8,padding:"5px 9px",color:C.white,fontSize:13,outline:"none"}}),friends.filter(function(x){return !x.archived;}).length>1?React.createElement("button",{onClick:function(){
          var net=friendNetBalance(f.id);
          if(Math.abs(net)>0.5){setFriendArchiveConfirm(f);}
          else{archiveFriend(f.id);}
        },style:{background:"none",border:"none",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:17}},"×"):null),colorPickFriend===f.id?React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginTop:6,marginLeft:35}},AVATAR_COLORS.map(function(col){return React.createElement("div",{key:col,onClick:function(){updFriendColor(f.id,col);setColorPickFriend(null);},style:{width:20,height:20,borderRadius:"50%",background:col,cursor:"pointer",border:fColor===col?"3px solid #fff":"2px solid rgba(255,255,255,.3)",boxSizing:"border-box"}});})):null);}),
        React.createElement("button",{onClick:addFriend,style:{fontSize:12,color:"rgba(255,255,255,.7)",background:"none",border:"1px dashed rgba(255,255,255,.3)",borderRadius:7,padding:"4px 11px",cursor:"pointer"}},"+ 新增旅伴"),
        friends.filter(function(f){return f.archived;}).length>0?React.createElement("div",{style:{marginTop:10,paddingTop:8,borderTop:"1px solid rgba(255,255,255,.15)"}},
          React.createElement("div",{onClick:function(){setArchivedSectionOpen(function(s){return !s;});},style:{fontSize:11,color:"rgba(255,255,255,.7)",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}},
            React.createElement("span",null,"📦 已封存的旅伴（"+friends.filter(function(f){return f.archived;}).length+"）"),
            React.createElement("span",null,archivedSectionOpen?"▲":"▼")),
          archivedSectionOpen?React.createElement("div",{style:{marginTop:8}},
            friends.filter(function(f){return f.archived;}).map(function(f){
              var net=friendNetBalance(f.id);
              var netLabel=net>0.5?("應收 NT$"+net.toFixed(0)):(net<-0.5?("應付 NT$"+(-net).toFixed(0)):"已結清");
              return React.createElement("div",{key:f.id,style:{display:"flex",alignItems:"center",gap:6,marginBottom:6,background:"rgba(255,255,255,.08)",borderRadius:8,padding:"6px 9px"}},
                React.createElement("span",{style:{flex:1,fontSize:12,color:"rgba(255,255,255,.85)"}},f.name||"（未命名）"),
                React.createElement("span",{style:{fontSize:10,color:Math.abs(net)>0.5?"#F5C99A":"rgba(255,255,255,.5)",flexShrink:0}},netLabel),
                React.createElement("button",{onClick:function(){unarchiveFriend(f.id);},style:{fontSize:10,background:"rgba(255,255,255,.15)",border:"none",borderRadius:6,padding:"3px 7px",color:"#fff",cursor:"pointer",flexShrink:0}},"取消封存"),
                React.createElement("button",{onClick:function(){setFriendDeleteConfirm(f);},style:{fontSize:10,background:"none",border:"none",color:"rgba(255,100,100,.8)",cursor:"pointer",flexShrink:0}},"🗑"));
            })):null):null):null,

      showToolsMenu?React.createElement("div",{style:{background:"rgba(255,255,255,.1)",borderRadius:13,padding:"10px",marginTop:10,border:"1px solid rgba(255,255,255,.15)",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}},
        [
          {icon:"bag",label:"願望清單",onClick:function(){setShowWishlist(true);setShowToolsMenu(false);}},
          {icon:"backpack",label:"行李清單",onClick:function(){setShowPacking(true);setShowToolsMenu(false);}},
          {icon:"doc",label:"文件",onClick:function(){setShowDocuments(true);setShowToolsMenu(false);}},
          {icon:"map",label:"匯入地標",onClick:function(){setShowImportGmap(true);setGmapImportText("");setGmapImportResult(null);setShowToolsMenu(false);}}
        ].map(function(tool){return React.createElement("button",{key:tool.label,onClick:tool.onClick,style:{background:"rgba(255,255,255,.12)",border:"none",borderRadius:10,padding:"9px 2px",color:C.white,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}},React.createElement("span",{dangerouslySetInnerHTML:{__html:navIcon(tool.icon,C.white,19)}}),React.createElement("span",{style:{fontSize:9,fontWeight:600}},tool.label));})):null),

    // 主內容
    React.createElement("div",{style:{flex:1,overflow:"hidden",display:"flex",flexDirection:"column",minHeight:0}},
      isUnassignedTab?React.createElement("div",{style:{flexShrink:0,display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",padding:"8px 12px 6px",background:C.white,borderBottom:"1px solid "+C.border}},
        (function(){
          var counts=unassignedCategoryCounts();
          var chips=[React.createElement("button",{key:"__all__",onClick:function(){setUnassignedCatFilter(null);},style:{flexShrink:0,padding:"10px 14px",minHeight:38,borderRadius:20,border:"1.5px solid "+(unassignedCatFilter===null?C.teal:C.border),background:unassignedCatFilter===null?C.skyblue:C.light,color:unassignedCatFilter===null?C.navy:C.mid,cursor:"pointer",fontSize:12,fontWeight:unassignedCatFilter===null?700:500}},"全部 "+unassignedLocs().length)];
          CATS.forEach(function(c){
            var n=counts[c]||0;
            if(n===0)return;
            var active=unassignedCatFilter===c;
            chips.push(React.createElement("button",{key:c,onClick:function(){setUnassignedCatFilter(active?null:c);},style:{flexShrink:0,display:"inline-flex",alignItems:"center",gap:4,padding:"10px 14px 10px 10px",minHeight:38,borderRadius:20,border:"1.5px solid "+(active?CAT_COLOR[c]:C.border),background:active?CAT_BG[c]:C.light,color:CAT_COLOR[c]||C.mid,cursor:"pointer",fontSize:12,fontWeight:active?700:500}},React.createElement("span",{dangerouslySetInnerHTML:{__html:makeSvgIcon(c,CAT_COLOR[c]||C.mid,14)}}),c+" "+n));
          });
          return chips;
        })()):null,
      isUnassignedTab&&unassignedCatFilter?React.createElement("div",{style:{flexShrink:0,fontSize:10,color:C.mid,textAlign:"center",padding:"4px 12px",background:C.white,borderBottom:"1px solid "+C.border}},"篩選中無法拖曳排序清單順序（拖到天數頁籤仍可正常指派天數），清除篩選後可恢復排序"):null,
      view==="plan"?React.createElement("div",{style:{flex:1,overflowY:"auto",padding:"10px 12px 160px"}},
        !isUnassignedTab&&wishlist.filter(function(w){return Number(w.day)===Number(activeDay)&&!w.bought;}).length>0?React.createElement("div",{style:{background:"#FFF8E8",border:"1.5px solid #E8C97A",borderRadius:12,padding:"10px 12px",marginBottom:10}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#9A7A2A",marginBottom:6}},"🛍️ 今天記得買"),
          wishlist.filter(function(w){return Number(w.day)===Number(activeDay)&&!w.bought;}).map(function(w){return React.createElement("div",{key:w.id,style:{display:"flex",alignItems:"center",gap:8,marginBottom:4}},
            React.createElement("button",{onClick:function(){toggleWishlistBought(w.id);},style:{width:20,height:20,borderRadius:5,border:"1.5px solid #C8A94A",background:C.white,cursor:"pointer",flexShrink:0}},""),
            React.createElement("span",{onClick:function(){setWishlistEdit(w);},style:{fontSize:12,color:"#7A5A1A",cursor:"pointer",flex:1}},w.name+(w.whereToBuy?"（"+w.whereToBuy+"）":"")+(w.qty>1?" x"+w.qty:"")));
          })):null,
        allDayLocs.length===0?React.createElement("div",{style:{textAlign:"center",padding:"3rem 0"}},
          React.createElement("div",{style:{fontSize:36,marginBottom:8}},isUnassignedTab?"📦":"🗺️"),
          React.createElement("div",{style:{fontSize:14,fontWeight:600,color:C.teal}},isUnassignedTab?(unassignedCatFilter?"這個分類沒有未分配的地點":"沒有未分配的地點"):"目前沒有地點"),
          React.createElement("div",{style:{fontSize:11,marginTop:3,color:C.mid}},"點底部「+」新增")):null,
        React.createElement(DraggableList,{
          items:allDayLocs,
          connectors:isUnassignedTab?null:allDayLocs.map(function(_,i){return getConn(allDayLocs,i);}),
          onReorder:(isUnassignedTab&&unassignedCatFilter)?null:handleReorder,
          onConnChange:isUnassignedTab?null:function(i,val){setConn(allDayLocs,i,val);},
          isUnassigned:isUnassignedTab,
          onDragCardEnd:function(){setDropTargetDay(null);},
          onDragHoverTab:onDragHoverTab,
          onDropOnDayTab:onDropOnDayTab,
          onRecordConnExpense:recordConnExpense,
          renderCard:function(loc,i,extra){return React.createElement(SpotCard,{loc:loc,idx:i,friends:friends,currentUser:currentUser,onEdit:function(l){setEditSpot(l);},onStatus:onStatus,onMust:onMust,onDayPick:function(l){setDayPick(l);},isLast:i===allDayLocs.length-1,onDelete:delLoc,onShowCopyMenu:function(l){setCopyMenuLoc(l);},isSelected:extra.isSelected,dragHandleProps:extra.dragHandleProps,onAlert:showAlertMsg,onRecordExpense:function(l){setExpenseEdit({name:l.name,currency:l.estCurrency||"TWD",payers:l.estCost?[{friendId:"",amount:l.estCost}]:[{friendId:"",amount:""}]});}});}
        })):null,

      view==="map"?React.createElement("div",{style:{flex:1,position:"relative",overflow:"hidden",minHeight:0}},
        React.createElement("div",{style:{position:"absolute",inset:0,zIndex:0}},React.createElement(MapView,{locs:mapMarkerLocs,selectedId:selectedId,onSelect:handleMapCardSelect,fitIds:fitIds,apiRef:mapApiRef,onAlert:showAlertMsg})),
        React.createElement("div",{style:{position:"absolute",top:8,right:8,zIndex:30,display:"flex",alignItems:"flex-start",gap:6}},
          !isUnassignedTab?(function(){
            var dayDate=getDayDateStr(activeDay);
            var dayWeather=(weatherData&&dayDate)?weatherData.days.find(function(dd){return dd.date===dayDate;}):null;
            return React.createElement("div",{style:{position:"relative"}},
              React.createElement("button",{onClick:function(){
                if(weatherLoading)return;
                if(!weatherData){var g=guessDestinationQuery();if(g)fetchWeather(g);else showAlertMsg("找不到目的地資訊，請先在行程裡新增幾個地點，或到地點編輯裡填城市欄位");}
                else setWeatherWidgetOpen(function(s){return !s;});
              },style:{background:"rgba(255,255,255,.95)",border:"1.5px solid "+C.border,borderRadius:12,padding:"6px 10px",display:"flex",alignItems:"center",gap:5,cursor:"pointer",boxShadow:"0 1px 6px rgba(0,0,0,.15)",minHeight:32}},
                weatherLoading?React.createElement("span",{style:{fontSize:11,color:C.mid}},"查詢中…"):
                (dayWeather?React.createElement(React.Fragment,null,
                  React.createElement("span",{style:{fontSize:18}},weatherDescToEmoji(dayWeather.desc)),
                  React.createElement("span",{style:{fontSize:12,fontWeight:700,color:C.navy}},(dayWeather.tempMin!=null?Math.round(dayWeather.tempMin):"—")+"°~"+(dayWeather.tempMax!=null?Math.round(dayWeather.tempMax):"—")+"°")):
                React.createElement("span",{style:{fontSize:11,color:C.mid}},weatherData?"🌤️ 查無此天":"🌤️ 查天氣"))),
              weatherWidgetOpen&&weatherData?React.createElement("div",{style:{position:"absolute",top:40,right:0,background:C.white,borderRadius:12,padding:10,width:190,boxShadow:"0 4px 16px rgba(0,0,0,.2)",maxHeight:240,overflowY:"auto"}},
                React.createElement("div",{style:{fontSize:11,fontWeight:700,color:C.navy,marginBottom:6}},weatherData.place+"（AI 搜尋，僅供參考）"),
                weatherData.days.map(function(day){var isThisDay=day.date===dayDate;return React.createElement("div",{key:day.date,style:{display:"flex",alignItems:"center",gap:6,padding:"3px 4px",borderRadius:6,background:isThisDay?C.skyblue+"55":"none",fontSize:11}},
                  React.createElement("span",{style:{color:C.mid,width:40,flexShrink:0}},day.date.slice(5)),
                  React.createElement("span",null,weatherDescToEmoji(day.desc)),
                  React.createElement("span",{style:{color:C.navy,fontWeight:600}},(day.tempMin!=null?Math.round(day.tempMin):"—")+"~"+(day.tempMax!=null?Math.round(day.tempMax):"—")+"°"));
                })):null);
          })():null,
          React.createElement("button",{onClick:function(){if(mapApiRef.current&&mapApiRef.current.locateUser)mapApiRef.current.locateUser();},style:{width:36,height:36,borderRadius:"50%",background:C.white,border:"1.5px solid "+C.border,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:"0 1px 6px rgba(0,0,0,.15)",flexShrink:0}},"📍")),
        allDayLocs.length>0?React.createElement(React.Fragment,null,
          React.createElement("button",{onClick:function(){setShowMapList(function(s){return !s;});},style:{position:"absolute",top:8,left:showMapList?"min(244px, calc(62vw + 8px))":8,zIndex:21,width:28,height:44,borderRadius:showMapList?"0 10px 10px 0":10,background:"rgba(255,255,255,.95)",border:"1.5px solid "+C.border,borderLeft:showMapList?"none":"1.5px solid "+C.border,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 6px rgba(0,0,0,.15)",fontSize:13,color:C.mid,transition:"left .2s"}},showMapList?"‹":"›"),
          showMapList?React.createElement("div",{ref:mapListRef,onScroll:handleMapListScroll,style:{position:"absolute",top:8,bottom:8,left:8,zIndex:20,width:"min(236px, 62vw)",overflowY:"auto",overflowX:"hidden",scrollbarWidth:"none",paddingBottom:4,display:"flex",flexDirection:"column",gap:8}},
            allDayLocs.map(function(loc,i){return React.createElement("div",{key:loc.id,"data-loc-id":String(loc.id)},React.createElement(MapSpotCard,{loc:loc,idx:i,friends:friends,currentUser:currentUser,onMust:onMust,onStatus:onStatus,onSelect:handleMapCardSelect,isSelected:selectedId===loc.id,conn:isUnassignedTab?null:getConn(allDayLocs,i),onConnChange:isUnassignedTab?null:function(v){setConn(allDayLocs,i,v);},isLast:i===allDayLocs.length-1,onAlert:showAlertMsg,onRecordConnExpense:function(c,lg,li){recordConnExpense(c,lg,li,allDayLocs[i],allDayLocs[i+1]);}}));})):null):null,
        allDayLocs.length===0?React.createElement("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}},React.createElement("div",{style:{background:"rgba(255,255,255,.92)",borderRadius:14,padding:"10px 20px",fontSize:12,color:C.mid,fontWeight:600}},isUnassignedTab?(unassignedCatFilter?"這個分類沒有未分配的地點":"未分配地點無座標資料"):"第"+activeDay+"天尚無地點")):null):null),

    // Tab bar
    React.createElement("div",{style:{flexShrink:0,background:C.white,borderTop:"1px solid "+C.skyblue,zIndex:300}},
      React.createElement("div",{style:{display:"flex",gap:2,overflowX:"auto",scrollbarWidth:"none",borderBottom:"1px solid "+C.skyblue+"88",padding:"5px 8px 3px"}},
        React.createElement("button",{onClick:function(){setActiveDay(UNASSIGNED_TAB);},"data-day-tab":UNASSIGNED_TAB,onPointerDown:function(e){onTabPointerDown(e,UNASSIGNED_TAB);},onPointerMove:onTabPointerMove,onPointerUp:onTabPointerUp,onPointerCancel:onTabPointerUp,style:{flexShrink:0,minWidth:52,padding:"5px 6px",borderRadius:9,border:dropTargetDay===UNASSIGNED_TAB?"2px solid "+C.teal:"2px solid transparent",background:dropTargetDay===UNASSIGNED_TAB?"#D8F0E8":(activeDay===UNASSIGNED_TAB?C.teal:"transparent"),color:dropTargetDay===UNASSIGNED_TAB?C.navy:(activeDay===UNASSIGNED_TAB?C.white:C.mid),cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,userSelect:"none",touchAction:"pan-x"}},
          React.createElement("span",{style:{fontSize:10,fontWeight:activeDay===UNASSIGNED_TAB?700:500,whiteSpace:"nowrap"}},"📦未分"),
          unassignedCount>0?React.createElement("span",{style:{fontSize:8,background:activeDay===UNASSIGNED_TAB?C.white+"44":C.skyblue,color:activeDay===UNASSIGNED_TAB?C.white:C.teal,borderRadius:6,padding:"0 4px",fontWeight:600}},unassignedCount):null),
        days.map(function(d){var act=d===activeDay,cnt=dayLocs(d).length,isDropTarget=dropTargetDay===d,isTabSrc=draggingTabDay===d;var lbl=getDayLabel(d),isObj=typeof lbl==="object";return React.createElement("button",{key:d,onClick:function(){setActiveDay(d);},"data-day-tab":d,onPointerDown:function(e){onTabPointerDown(e,d);},onPointerMove:onTabPointerMove,onPointerUp:onTabPointerUp,onPointerCancel:onTabPointerUp,style:{flexShrink:0,minWidth:isObj?64:46,padding:"5px 6px",borderRadius:9,border:isDropTarget?"2px solid "+C.teal:"2px solid transparent",background:isDropTarget?"#D8F0E8":(act?C.teal:(isTabSrc?"rgba(127,165,164,.2)":"transparent")),color:isDropTarget?C.navy:(act?C.white:C.mid),cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,userSelect:"none",opacity:isTabSrc?.5:1,touchAction:"pan-x"}},
            isObj?[React.createElement("span",{key:"a",style:{fontSize:10,fontWeight:act||isDropTarget?700:500,whiteSpace:"nowrap"}},lbl.line1),React.createElement("span",{key:"b",style:{fontSize:8,opacity:.85,whiteSpace:"nowrap"}},lbl.line2)]:React.createElement("span",{style:{fontSize:11,fontWeight:act||isDropTarget?700:500,whiteSpace:"nowrap"}},lbl),
            cnt>0?React.createElement("span",{style:{fontSize:8,background:act?C.white+"44":C.skyblue,color:act?C.white:C.teal,borderRadius:6,padding:"0 4px",fontWeight:600}},cnt):null);}),
        React.createElement("button",{onClick:function(){setTotalDays(function(n){return n+1;});},style:{flexShrink:0,width:32,padding:"5px 4px",borderRadius:9,border:"2px dashed "+C.skyblue,background:"transparent",color:C.teal,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:300}},"+"),
        totalDays>1?React.createElement("button",{onClick:function(){setTotalDays(function(n){var next=n-1;if(activeDay>next)setActiveDay(1);return next;});},style:{flexShrink:0,width:32,padding:"5px 4px",borderRadius:9,border:"2px dashed "+C.skyblue,background:"transparent",color:C.teal,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:300}},"−"):null),
      React.createElement("div",{style:{display:"flex",padding:"6px 12px calc(10px + env(safe-area-inset-bottom, 0px))",gap:6,alignItems:"center"}},
        React.createElement("button",{onClick:function(){setView("plan");},style:{flex:1,padding:"9px",borderRadius:11,border:"none",background:view==="plan"?C.teal:C.light,color:view==="plan"?C.white:C.mid,fontSize:13,fontWeight:600,cursor:"pointer"}},"📋 行程"),
        React.createElement("button",{onClick:function(){setView("map");},style:{flex:1,padding:"9px",borderRadius:11,border:"none",background:view==="map"?C.teal:C.light,color:view==="map"?C.white:C.mid,fontSize:13,fontWeight:600,cursor:"pointer"}},"🗺️ 地圖"),
        React.createElement("button",{onClick:function(){setShowAdd(true);},style:{width:46,height:46,borderRadius:"50%",border:"none",background:C.navy,color:C.white,fontSize:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(78,85,92,.35)",flexShrink:0}},"+"))))
    : React.createElement(TripListScreen,null),

    // Modals
    showAdd?React.createElement(AddSpotModal,{friends:friends,onSave:saveLoc,onClose:function(){setShowAdd(false);}}):null,
    editSpot?React.createElement(EditModal,{spot:editSpot,friends:friends,onSave:saveLoc,onDelete:delLoc,onClose:function(){setEditSpot(null);}}):null,
    dayPick?React.createElement(DayPicker,{loc:dayPick,totalDays:totalDays,onAssign:assignDay,onAddDay:function(){setTotalDays(function(n){return n+1;});},onClose:function(){setDayPick(null);},getDayLabel:getDayLabel}):null,
    flightEditDir?React.createElement(FlightEditModal,{isOut:flightEditDir==="outbound",initialData:flights[flightEditDir]||{},onSave:function(d){var dir=flightEditDir;setFlights(function(f){var n=Object.assign({},f);n[dir]=Object.assign({},d);return n;});setFlightEditDir(null);},onClose:function(){setFlightEditDir(null);},onOpenLedger:function(){setFlightEditDir(null);setExpenseTab("expenses");setShowExchange(true);}}):null,
    wishlistEdit?React.createElement(WishlistItemModal,{item:wishlistEdit,onSave:saveWishlistItem,onDelete:deleteWishlistItem,onClose:function(){setWishlistEdit(null);}}):null,
    expenseEdit?React.createElement(ExpenseModal,{item:expenseEdit,friends:friends,locs:locs,onSave:saveExpense,onDelete:deleteExpense,onClose:function(){setExpenseEdit(null);}}):null,
    settlementModalOpen?(function(){
      var result=computeBalances();
      var settlements=computeSettlements(result.balances);
      return React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.5)",zIndex:9700,display:"flex",alignItems:"center",justifyContent:"center",padding:24},onClick:function(e){if(e.target===e.currentTarget)setSettlementModalOpen(false);}},
        React.createElement("div",{style:{background:C.white,borderRadius:18,padding:"18px 16px",maxWidth:340,width:"100%",maxHeight:"70vh",overflowY:"auto"}},
          React.createElement("div",{style:{fontSize:15,fontWeight:700,color:C.navy,marginBottom:12}},"🤝 建議結清方式"),
          settlements.length===0?React.createElement("div",{style:{fontSize:13,color:C.mid,textAlign:"center",padding:"1rem 0"}},"目前帳務已結清，不需要再互相支付"):
          settlements.map(function(s,i){return React.createElement("div",{key:i,style:{fontSize:13,color:C.navy,background:C.skyblue+"33",borderRadius:10,padding:"10px 12px",marginBottom:6}},s.from+" 付給 "+s.to+"　NT$"+s.amount.toFixed(0));}),
          React.createElement("button",{onClick:function(){setSettlementModalOpen(false);},style:{width:"100%",padding:"10px",borderRadius:10,border:"none",background:C.teal,color:C.white,cursor:"pointer",fontSize:13,fontWeight:700,marginTop:8}},"關閉")));
    })():null,
    wishlistDayPick?React.createElement(DayPicker,{loc:wishlistDayPick,totalDays:totalDays,onAssign:assignWishlistDay,onAddDay:function(){setTotalDays(function(n){return n+1;});},onClose:function(){setWishlistDayPick(null);},getDayLabel:getDayLabel,zIndex:8700}):null,

    // 🛍️ 願望清單
    showWishlist?React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.6)",zIndex:8500,display:"flex",alignItems:"flex-end",justifyContent:"center"},onClick:function(e){if(e.target===e.currentTarget)setShowWishlist(false);}},
      React.createElement("div",{style:{background:C.light,width:"100%",maxWidth:480,borderRadius:"22px 22px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column"}},
        React.createElement("div",{style:{background:C.white,padding:"14px 16px",borderRadius:"22px 22px 0 0",borderBottom:"1px solid "+C.border,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}},
          React.createElement("span",{style:{fontSize:16,fontWeight:700,color:C.navy}},"🛍️ 願望清單"),
          React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8}},
            React.createElement("button",{onClick:fetchTwdRates,disabled:exchangeLoading,style:{background:"none",border:"1.5px solid "+C.border,borderRadius:8,padding:"5px 9px",color:C.teal,fontSize:11,cursor:"pointer",fontWeight:600}},exchangeLoading?"查詢中…":(exchangeData?"🔄 更新匯率":"💱 查匯率")),
            React.createElement("button",{onClick:function(){setShowWishlist(false);},style:{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.mid}},"×"))),
        React.createElement("div",{style:{flex:1,overflowY:"auto",padding:"12px 14px"}},
          wishlist.length===0?React.createElement("div",{style:{textAlign:"center",padding:"2.5rem 0",color:C.mid,fontSize:13}},"還沒有想買的東西，點下方新增"):null,
          wishlist.length>0?React.createElement("div",{style:{fontSize:10,color:C.mid,textAlign:"center",marginBottom:8}},"👈 左滑卡片可以刪除"):null,
          wishlist.map(function(w){
            var dayLabel=w.day&&w.day!==UNASSIGNED_TAB?"第"+w.day+"天":"未指派";
            var twdAmount=null;
            if(w.price){
              if(w.currency==="TWD")twdAmount=w.price;
              else if(exchangeData&&exchangeData.rates&&exchangeData.rates[w.currency]!=null)twdAmount=w.price*exchangeData.rates[w.currency];
            }
            var priceWithTwd=w.price?(w.price+" "+(w.currency||"")+(twdAmount!=null?"　≈ NT$"+(w.qty>1?(twdAmount*w.qty).toFixed(0):twdAmount.toFixed(0)):"")):null;
            var metaLine=w.whereToBuy?"📍"+w.whereToBuy:"";
            return React.createElement(SwipeToDeleteRow,{key:w.id,onDelete:function(){deleteWishlistItem(w.id);}},
              React.createElement("div",{style:{padding:"10px 12px",border:"1.5px solid "+(w.bought?"#5A9A7A":C.border),borderRadius:14,opacity:w.bought?.6:1,boxSizing:"border-box"}},
                React.createElement("div",{style:{display:"flex",gap:10,alignItems:"flex-start"}},
                  React.createElement("button",{onClick:function(){toggleWishlistBought(w.id);},style:{width:26,height:26,borderRadius:"50%",border:"1.5px solid "+(w.bought?"#5A9A7A":C.border),background:w.bought?"#5A9A7A":C.white,color:C.white,cursor:"pointer",flexShrink:0,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}},w.bought?"✓":""),
                  React.createElement("div",{style:{flex:1,minWidth:0},onClick:function(){setWishlistEdit(w);}},
                    React.createElement("div",{style:{fontSize:14,fontWeight:700,color:C.navy,textDecoration:w.bought?"line-through":"none"}},w.name+(w.qty>1?"　x"+w.qty:"")),
                    priceWithTwd?React.createElement("div",{style:{fontSize:12,color:C.teal,fontWeight:700,marginTop:2}},priceWithTwd):null,
                    metaLine?React.createElement("div",{style:{fontSize:11,color:C.mid,marginTop:1}},metaLine):(!w.price?React.createElement("div",{style:{fontSize:11,color:C.mid,marginTop:2}},"點擊編輯詳情"):null),
                    w.price&&twdAmount==null&&w.currency!=="TWD"?React.createElement("div",{style:{fontSize:10,color:C.mid,marginTop:1,opacity:.7}},"點上方「查匯率」換算台幣"):null),
                  React.createElement("button",{onClick:function(){setWishlistDayPick(w);},style:{fontSize:10,padding:"5px 9px",borderRadius:8,background:w.day&&w.day!==UNASSIGNED_TAB?C.navy:C.skyblue,color:w.day&&w.day!==UNASSIGNED_TAB?C.white:C.teal,border:"none",cursor:"pointer",fontWeight:600,flexShrink:0}},dayLabel+" ▾"))));
          })),
        React.createElement("div",{style:{padding:"10px 14px calc(10px + env(safe-area-inset-bottom, 0px))",flexShrink:0,borderTop:"1px solid "+C.border}},
          React.createElement("button",{onClick:function(){setWishlistEdit({});},style:{width:"100%",padding:"12px",borderRadius:12,background:C.teal,color:C.white,border:"none",cursor:"pointer",fontSize:14,fontWeight:700}},"＋ 新增想買的東西")))):null,

    // 🎒 行李清單
    showPacking?React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.6)",zIndex:8500,display:"flex",alignItems:"flex-end",justifyContent:"center"},onClick:function(e){if(e.target===e.currentTarget)setShowPacking(false);}},
      React.createElement("div",{style:{background:C.light,width:"100%",maxWidth:480,borderRadius:"22px 22px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column"}},
        React.createElement("div",{style:{background:C.white,padding:"14px 16px",borderRadius:"22px 22px 0 0",borderBottom:"1px solid "+C.border,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}},
          React.createElement("span",{style:{fontSize:16,fontWeight:700,color:C.navy}},"🎒 行李清單"),
          React.createElement("button",{onClick:function(){setShowPacking(false);},style:{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.mid}},"×")),
        React.createElement("div",{style:{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:16}},
          [{key:"essential",label:"⭐ 必備重要"},{key:"other",label:"📦 其他"}].map(function(sec){
            var items=packing[sec.key]||[];
            return React.createElement("div",{key:sec.key},
              React.createElement("div",{style:{fontSize:13,fontWeight:700,color:C.navy,marginBottom:8}},sec.label+"（"+items.filter(function(i){return i.checked;}).length+"/"+items.length+"）"),
              items.length===0?React.createElement("div",{style:{fontSize:12,color:C.mid,padding:"4px 2px 8px"}},"還沒有項目"):null,
              items.map(function(it){return React.createElement("div",{key:it.id,style:{display:"flex",alignItems:"center",gap:8,background:C.white,borderRadius:10,padding:"9px 12px",marginBottom:6}},
                React.createElement("button",{onClick:function(){togglePackingItem(sec.key,it.id);},style:{width:22,height:22,borderRadius:5,border:"1.5px solid "+(it.checked?"#5A9A7A":C.border),background:it.checked?"#5A9A7A":C.white,color:C.white,cursor:"pointer",flexShrink:0,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}},it.checked?"✓":""),
                it.subCat?React.createElement("span",{style:{fontSize:9,fontWeight:700,color:C.teal,background:C.skyblue+"55",borderRadius:4,padding:"2px 6px",flexShrink:0}},it.subCat):null,
                React.createElement("span",{style:{flex:1,fontSize:13,color:C.navy,textDecoration:it.checked?"line-through":"none",opacity:it.checked?.5:1}},it.name),
                React.createElement("button",{onClick:function(){removePackingItem(sec.key,it.id);},style:{background:"none",border:"none",color:"#C55",cursor:"pointer",fontSize:16,padding:"0 4px"}},"×"));}));
          })),
        React.createElement("div",{style:{flexShrink:0,borderTop:"1px solid "+C.border,background:C.white,padding:"10px 14px calc(10px + env(safe-area-inset-bottom, 0px))"}},
          packingAddOpen?React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8}},
            React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},
              React.createElement("div",{style:{fontSize:12,fontWeight:700,color:C.navy}},"＋ 新增項目"),
              React.createElement("button",{onClick:function(){setPackingAddOpen(false);},style:{background:"none",border:"none",color:C.mid,cursor:"pointer",fontSize:12}},"收合 ▾")),
            React.createElement("div",{style:{display:"flex",gap:6}},
              React.createElement("button",{onClick:function(){setNewPackingForm(function(f){return Object.assign({},f,{section:"essential"});});},style:{flex:1,padding:"8px",borderRadius:9,border:"1.5px solid "+(newPackingForm.section==="essential"?C.teal:C.border),background:newPackingForm.section==="essential"?C.skyblue:C.light,color:C.navy,cursor:"pointer",fontSize:12,fontWeight:newPackingForm.section==="essential"?700:500}},"⭐ 必備重要"),
              React.createElement("button",{onClick:function(){setNewPackingForm(function(f){return Object.assign({},f,{section:"other"});});},style:{flex:1,padding:"8px",borderRadius:9,border:"1.5px solid "+(newPackingForm.section==="other"?C.teal:C.border),background:newPackingForm.section==="other"?C.skyblue:C.light,color:C.navy,cursor:"pointer",fontSize:12,fontWeight:newPackingForm.section==="other"?700:500}},"📦 其他")),
            newPackingForm.section==="other"?React.createElement("select",{value:newPackingForm.subCat,onChange:function(e){setNewPackingForm(function(f){return Object.assign({},f,{subCat:e.target.value});});},style:INP},PACK_SUBCATS.map(function(sc){return React.createElement("option",{key:sc,value:sc},sc);})):null,
            React.createElement("div",{style:{display:"flex",gap:6}},
              React.createElement("input",{value:newPackingForm.name,onChange:function(e){setNewPackingForm(function(f){return Object.assign({},f,{name:e.target.value});});},placeholder:"物品名稱…",autoFocus:true,onKeyDown:function(e){if(e.key==="Enter"){addPackingItem(newPackingForm.section,newPackingForm.name,newPackingForm.subCat);setNewPackingForm(function(f){return Object.assign({},f,{name:""});});}},style:Object.assign({},INP,{flex:1})}),
              React.createElement("button",{onClick:function(){addPackingItem(newPackingForm.section,newPackingForm.name,newPackingForm.subCat);setNewPackingForm(function(f){return Object.assign({},f,{name:""});});},style:{padding:"0 16px",borderRadius:10,background:C.teal,color:C.white,border:"none",cursor:"pointer",fontSize:13,fontWeight:700}},"加入")))
          :React.createElement("button",{onClick:function(){setPackingAddOpen(true);},style:{width:"100%",padding:"12px",borderRadius:12,background:C.teal,color:C.white,border:"none",cursor:"pointer",fontSize:14,fontWeight:700}},"＋ 新增項目")))):null,

    // 📄 文件
    showDocuments?React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.6)",zIndex:8500,display:"flex",alignItems:"flex-end",justifyContent:"center"},onClick:function(e){if(e.target===e.currentTarget){setShowDocuments(false);setDocFolderOpen(null);}}},
      React.createElement("div",{style:{background:C.light,width:"100%",maxWidth:480,borderRadius:"22px 22px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column"}},
        React.createElement("div",{style:{background:C.white,padding:"14px 16px",borderRadius:"22px 22px 0 0",borderBottom:"1px solid "+C.border,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}},
          React.createElement("span",{style:{fontSize:16,fontWeight:700,color:C.navy}},docFolderOpen?"📄 "+docFolderOpen:"📄 文件"),
          React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6}},
            docFolderOpen?React.createElement("button",{onClick:function(){setDocRenameTarget({type:"folder",folder:docFolderOpen,name:docFolderOpen});},style:{background:"none",border:"none",fontSize:15,cursor:"pointer",color:C.mid}},"✏️"):null,
            docFolderOpen?React.createElement("button",{onClick:function(){setDocFolderDeleteConfirm(docFolderOpen);},style:{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#C55"}},"🗑"):null,
            React.createElement("button",{onClick:function(){if(docFolderOpen)setDocFolderOpen(null);else setShowDocuments(false);},style:{background:"none",border:"none",fontSize:docFolderOpen?15:22,cursor:"pointer",color:C.mid,fontWeight:docFolderOpen?700:400}},docFolderOpen?"← 返回":"×"))),
        React.createElement("div",{style:{flex:1,overflowY:"auto",padding:"12px 14px"}},
          !docFolderOpen?React.createElement(React.Fragment,null,
            docFolders.map(function(folder){
              var items=documents[folder]||[];
              return React.createElement("div",{key:folder,onClick:function(){setDocFolderOpen(folder);},style:{background:C.white,borderRadius:14,padding:"14px 16px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}},
                React.createElement("span",{style:{fontSize:14,fontWeight:600,color:C.navy}},"📁 "+folder),
                React.createElement("span",{style:{fontSize:12,color:C.mid}},items.length+" 個檔案 ›"));
            }),
            React.createElement("button",{onClick:function(){setDocRenameTarget({type:"newFolder",name:""});},style:{width:"100%",padding:"12px",borderRadius:12,border:"1.5px dashed "+C.teal,background:"none",color:C.teal,cursor:"pointer",fontSize:13,fontWeight:600,marginTop:4}},"＋ 新增資料夾")):React.createElement("div",null,
            (documents[docFolderOpen]||[]).length===0?React.createElement("div",{style:{textAlign:"center",padding:"2rem 0",color:C.mid,fontSize:13}},"這個資料夾還沒有檔案"):null,
            React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},
              (documents[docFolderOpen]||[]).map(function(doc){
                var isNote=!doc.image&&!doc.isPdf;
                var noteTrimmed=(doc.note||"").trim();
                var isLink=isNote&&/^https?:\/\//i.test(noteTrimmed);
                return React.createElement("div",{key:doc.id,style:{background:C.white,borderRadius:12,padding:8,position:"relative"}},
                isNote?React.createElement("div",{onClick:isLink?undefined:function(){setDocNoteEdit({folder:docFolderOpen,docId:doc.id});},style:{width:"100%",minHeight:100,borderRadius:8,background:C.light,padding:8,cursor:isLink?"default":"pointer",display:"flex",flexDirection:"column",gap:3,boxSizing:"border-box"}},
                  React.createElement("div",{style:{fontSize:10,color:C.teal,fontWeight:700}},isLink?"🔗 連結":"📝 文字備註"),
                  isLink?React.createElement("a",{href:noteTrimmed,target:"_blank",rel:"noreferrer",style:{fontSize:11,color:"#4285F4",textDecoration:"underline",wordBreak:"break-all",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:4,WebkitBoxOrient:"vertical"}},noteTrimmed):React.createElement("div",{style:{fontSize:11,color:C.navy,whiteSpace:"pre-wrap",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:4,WebkitBoxOrient:"vertical"}},doc.note||"（空白，點擊編輯）")):
                (doc.isPdf?React.createElement("a",{href:doc.image,download:doc.name||"document.pdf",style:{width:"100%",height:100,borderRadius:8,background:C.light,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:2,textDecoration:"none"}},React.createElement("span",{style:{fontSize:32}},"📄"),React.createElement("span",{style:{fontSize:9,color:C.mid,fontWeight:700}},"PDF · 點擊下載")):(doc.image?React.createElement("img",{src:doc.image,alt:doc.name,onClick:function(){setDocImageView(doc.image);},style:{width:"100%",height:100,objectFit:"cover",borderRadius:8,cursor:"pointer"}}):null)),
                React.createElement("div",{onClick:function(){if(isNote)setDocNoteEdit({folder:docFolderOpen,docId:doc.id});else setDocRenameTarget({type:"file",folder:docFolderOpen,docId:doc.id,name:doc.name});},style:{fontSize:11,color:C.navy,marginTop:5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer"}},doc.name+" ✏️"),
                React.createElement("button",{onClick:function(){removeDocument(docFolderOpen,doc.id);},style:{position:"absolute",top:4,right:4,width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,.55)",color:"#fff",border:"none",cursor:"pointer",fontSize:12}},"×"));})))),
        docFolderOpen?React.createElement("div",{style:{padding:"10px 14px calc(10px + env(safe-area-inset-bottom, 0px))",flexShrink:0,borderTop:"1px solid "+C.border}},
          React.createElement("input",{id:"doc-upload-input",type:"file",accept:"image/*,application/pdf",style:{display:"none"},onChange:function(e){
            var f=e.target.files&&e.target.files[0];
            if(!f){e.target.value="";return;}
            if(f.type==="application/pdf"){
              if(f.size>4*1024*1024){showAlertMsg("這個 PDF 檔案有點大（約 "+(f.size/1024/1024).toFixed(1)+" MB），可能會超過儲存空間限制導致存檔失敗。建議改用截圖，或先壓縮過 PDF 再上傳。");}
              var reader=new FileReader();
              reader.onload=function(ev){addDocument(docFolderOpen,f.name,ev.target.result,true);};
              reader.onerror=function(){showAlertMsg("讀取 PDF 檔案失敗，請重試一次。");};
              reader.readAsDataURL(f);
            }else{
              compressImage(f,1000,.75).then(function(b){addDocument(docFolderOpen,f.name,b,false);});
            }
            e.target.value="";
          }}),
          React.createElement("div",{style:{display:"flex",gap:8}},
            React.createElement("button",{onClick:function(){document.getElementById("doc-upload-input").click();},style:{flex:1,padding:"12px",borderRadius:12,background:C.teal,color:C.white,border:"none",cursor:"pointer",fontSize:14,fontWeight:700}},"📷 上傳照片 / PDF"),
            React.createElement("button",{onClick:function(){setDocNoteEdit({folder:docFolderOpen,docId:null});},style:{flex:1,padding:"12px",borderRadius:12,background:"none",border:"1.5px solid "+C.teal,color:C.teal,cursor:"pointer",fontSize:14,fontWeight:700}},"📝 新增文字備註"))):null)):null,

    // 文件相關的小彈窗：新增/改名資料夾、改檔名
    docFolderDeleteConfirm?React.createElement(ConfirmDialog,{msg:"確定要刪除資料夾「"+docFolderDeleteConfirm+"」？裡面的檔案會一併刪除。",onOk:function(){deleteDocFolder(docFolderDeleteConfirm);setDocFolderDeleteConfirm(null);},onCancel:function(){setDocFolderDeleteConfirm(null);},okLabel:"確定刪除"}):null,
    docNoteEdit?React.createElement(DocNoteModal,{item:docNoteEdit.docId?(documents[docNoteEdit.folder]||[]).find(function(d){return d.id===docNoteEdit.docId;})||{}:{},onSave:function(name,note){saveDocumentNote(docNoteEdit.folder,docNoteEdit.docId,name,note);setDocNoteEdit(null);},onClose:function(){setDocNoteEdit(null);}}):null,
    docRenameTarget?React.createElement(RenameModal,{
      initialName:docRenameTarget.name,
      title:docRenameTarget.type==="newFolder"?"新增資料夾":(docRenameTarget.type==="folder"?"編輯資料夾名稱":"編輯檔案名稱"),
      placeholder:docRenameTarget.type==="newFolder"?"例：保險文件":"",
      onSave:function(v){
        if(docRenameTarget.type==="newFolder")addDocFolder(v);
        else if(docRenameTarget.type==="folder")renameDocFolderFn(docRenameTarget.folder,v);
        else if(docRenameTarget.type==="file")renameDocument(docRenameTarget.folder,docRenameTarget.docId,v);
        setDocRenameTarget(null);
      },
      onClose:function(){setDocRenameTarget(null);}}):null,
    // 文件圖片放大檢視（可用手指原生縮放）
    docImageView?React.createElement("div",{onClick:function(){setDocImageView(null);},style:{position:"fixed",inset:0,background:"rgba(0,0,0,.9)",zIndex:9800,display:"flex",alignItems:"center",justifyContent:"center",padding:16,overflow:"auto"}},
      React.createElement("img",{src:docImageView,alt:"",style:{maxWidth:"100%",maxHeight:"90vh",objectFit:"contain",touchAction:"pinch-zoom"}}),
      React.createElement("button",{onClick:function(){setDocImageView(null);},style:{position:"fixed",top:16,right:16,width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.2)",color:"#fff",border:"none",fontSize:18,cursor:"pointer"}},"×")):null,

    // 💰 記帳分帳（原本的即時匯率功能保留在裡面的「換算計算機」分頁）
    showExchange?React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.6)",zIndex:8500,display:"flex",alignItems:"flex-end",justifyContent:"center"},onClick:function(e){if(e.target===e.currentTarget)setShowExchange(false);}},
      React.createElement("div",{style:{background:C.light,width:"100%",maxWidth:480,borderRadius:"22px 22px 0 0",maxHeight:"85vh",display:"flex",flexDirection:"column"}},
        React.createElement("div",{style:{background:C.white,padding:"14px 16px",borderRadius:"22px 22px 0 0",borderBottom:"1px solid "+C.border,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}},
          React.createElement("span",{style:{fontSize:16,fontWeight:700,color:C.navy}},"💰 記帳分帳"),
          React.createElement("button",{onClick:function(){setShowExchange(false);},style:{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.mid}},"×")),
        React.createElement("div",{style:{display:"flex",gap:6,padding:"10px 14px 0",flexShrink:0}},
          React.createElement("button",{onClick:function(){setExpenseTab("expenses");},style:{flex:1,padding:"9px",borderRadius:10,border:"none",background:expenseTab==="expenses"?C.teal:C.light,color:expenseTab==="expenses"?C.white:C.mid,fontSize:12,fontWeight:700,cursor:"pointer"}},"📒 記帳"),
          React.createElement("button",{onClick:function(){setExpenseTab("budget");},style:{flex:1,padding:"9px",borderRadius:10,border:"none",background:expenseTab==="budget"?C.teal:C.light,color:expenseTab==="budget"?C.white:C.mid,fontSize:12,fontWeight:700,cursor:"pointer"}},"📊 預估旅費"),
          React.createElement("button",{onClick:function(){setExpenseTab("calculator");},style:{flex:1,padding:"9px",borderRadius:10,border:"none",background:expenseTab==="calculator"?C.teal:C.light,color:expenseTab==="calculator"?C.white:C.mid,fontSize:12,fontWeight:700,cursor:"pointer"}},"🧮 換算計算機")),

        expenseTab==="budget"?(function(){
          var b=computeBudgetByCategory();
          var rows=[
            {key:"flight",icon:"✈️",label:"機票／人",perVal:b.flightPerPerson,totalVal:b.flight},
            {key:"stay",icon:"🏨",label:"住宿／人",perVal:b.stayPerPerson,totalVal:b.stay},
            {key:"food",icon:"🍜",label:"餐食／人",perVal:b.foodPerPerson,totalVal:b.food},
            {key:"entertainment",icon:"🎢",label:"娛樂／人",perVal:b.entertainmentPerPerson,totalVal:b.entertainment},
            {key:"transport",icon:"🚌",label:"交通費／人",perVal:b.transportPerPerson,totalVal:b.transport},
            {key:"other",icon:"🎯",label:"其他／人",perVal:b.otherPerPerson,totalVal:b.other}
          ];
          return React.createElement("div",{style:{flex:1,overflowY:"auto",padding:"14px"}},
            b.hasUnconverted?React.createElement("div",{style:{fontSize:11,color:"#C07A3A",background:"#FFF3E0",borderRadius:8,padding:"8px 10px",marginBottom:10}},"⚠️ 有些花費的幣別還沒有即時匯率資料，總計可能不完整，請到「換算計算機」分頁先查詢一次匯率"):null,
            React.createElement("div",{style:{fontSize:11,color:C.mid,marginBottom:10}},"以下金額都已經換算成台幣，並依目前 "+b.perPersonCount+" 位旅伴平均分攤"),
            rows.map(function(r){
              var catItems=b.items[r.key]||[];
              var isOpen=expandedBudgetCat===r.key;
              return React.createElement("div",{key:r.key,style:{background:C.white,borderRadius:10,padding:"10px 12px",marginBottom:6}},
              React.createElement("div",{onClick:function(){if(catItems.length)setExpandedBudgetCat(function(cur){return cur===r.key?null:r.key;});},style:{display:"flex",alignItems:"center",gap:8,cursor:catItems.length?"pointer":"default",minHeight:32}},
                React.createElement("span",{style:{fontSize:18,flexShrink:0}},r.icon),
                React.createElement("span",{style:{flex:1,fontSize:13,color:C.navy,fontWeight:600}},r.label),
                React.createElement("span",{style:{fontSize:14,fontWeight:700,color:C.teal}},"NT$ "+r.perVal.toFixed(0)),
                catItems.length?React.createElement("span",{style:{fontSize:10,color:C.mid,flexShrink:0}},isOpen?"▲":"▼"):null),
              React.createElement("div",{style:{fontSize:10,color:C.mid,marginTop:3,marginLeft:26}},"共 NT$ "+r.totalVal.toFixed(0)),
              (r.key==="transport"&&r.totalVal>0)?React.createElement("div",{style:{marginTop:6,marginLeft:26,paddingTop:6,borderTop:"1px dashed "+C.border,display:"flex",flexDirection:"column",gap:3}},
                TRANSPORT_SUBCATS.filter(function(tc){return b.transportBreakdown[tc]>0;}).map(function(tc){return React.createElement("div",{key:tc,style:{display:"flex",justifyContent:"space-between",fontSize:10,color:C.mid}},React.createElement("span",null,tc),React.createElement("span",null,"NT$ "+b.transportBreakdown[tc].toFixed(0)));})):null,
              isOpen?React.createElement("div",{style:{marginTop:8,marginLeft:26,paddingTop:8,borderTop:"1px solid "+C.border,display:"flex",flexDirection:"column",gap:5}},
                catItems.map(function(it,idx){return React.createElement("div",{key:idx,style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}},
                  React.createElement("span",{style:{fontSize:11,color:C.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}},it.icon+" "+it.label),
                  React.createElement("span",{style:{fontSize:11,color:idx===0?"#C07A3A":C.mid,fontWeight:idx===0?700:500,flexShrink:0}},"NT$ "+it.amount.toFixed(0)));})):null);
            }),
            React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8,background:C.navy,borderRadius:10,padding:"12px",marginTop:10}},
              React.createElement("span",{style:{flex:1,fontSize:14,color:C.white,fontWeight:700}},"預估旅費／人"),
              React.createElement("span",{style:{fontSize:18,fontWeight:700,color:C.white}},"NT$ "+b.totalPerPerson.toFixed(0))),
            React.createElement("div",{style:{fontSize:10,color:C.mid,marginTop:4,textAlign:"right"}},b.perPersonCount+" 人共 NT$ "+b.total.toFixed(0)),
            React.createElement("div",{style:{fontSize:10,color:C.mid,marginTop:10}},"機票/住宿/餐食/娛樂/交通/其他都可以直接在「記帳分帳」新增支出時選分類；餐食/娛樂也會自動加總行程卡跟願望清單的預估花費；交通費另外會加總每段交通卡填的通勤預估花費，細項會依那一段填的「交通方式」自動判斷是計程車/地鐵公車/包車，判斷不出來才算其他。不同幣別會依即時匯率換算成台幣。"));
        })():null,

        expenseTab==="expenses"?React.createElement(React.Fragment,null,
          React.createElement("div",{style:{flex:1,overflowY:"auto",padding:"12px 14px"}},
            expenses.length===0?React.createElement("div",{style:{textAlign:"center",padding:"2.5rem 0",color:C.mid,fontSize:13}},"還沒有記帳紀錄，點下方新增支出"):null,
            (function(){
              // 依分類分組，比照預估旅費的呈現方式：每組一個標題＋小計，組內固定項目（機票/住宿）排最前面，其餘依金額由大到小排序，方便一眼看出哪筆特別高
              var grouped={};
              EXPENSE_CATS.forEach(function(c){grouped[c.key]=[];});
              expenses.forEach(function(exp){
                var bucket=exp.budgetCat||"other";
                if(!grouped.hasOwnProperty(bucket))bucket="other";
                grouped[bucket].push(exp);
              });
              function expTotal(exp){return (exp.payers||[]).reduce(function(s,p){return s+(p.amount||0);},0);}
              Object.keys(grouped).forEach(function(bucket){
                grouped[bucket].sort(function(a,b){
                  var aAnchor=a.id==="preset_flight"||a.id==="preset_stay",bAnchor=b.id==="preset_flight"||b.id==="preset_stay";
                  if(aAnchor&&!bAnchor)return -1;
                  if(bAnchor&&!aAnchor)return 1;
                  return expTotal(b)-expTotal(a);
                });
              });
              return EXPENSE_CATS.map(function(cat){
                var list=grouped[cat.key];
                if(!list.length)return null;
                var catTotal=list.reduce(function(s,exp){return s+expTotal(exp);},0);
                return React.createElement("div",{key:cat.key,style:{marginBottom:14}},
                  React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:6,padding:"0 2px"}},
                    React.createElement("span",{style:{fontSize:13}},cat.icon),
                    React.createElement("span",{style:{fontSize:12,fontWeight:700,color:C.navy,flex:1}},cat.label),
                    React.createElement("span",{style:{fontSize:11,color:C.mid}},list.length+" 筆・共 "+catTotal.toFixed(0))),
                  list.map(function(exp){
                    var payers=exp.payers||[];
                    var payerNames=payers.map(function(p){var f=friends.find(function(x){return x.id===p.friendId;});return f?f.name+" "+p.amount:null;}).filter(Boolean);
                    var totalAmt=expTotal(exp);
                    var splitNames=(exp.splitAmong||[]).map(function(fid){var f=friends.find(function(x){return x.id===fid;});return f?f.name:null;}).filter(Boolean);
                    var isTagged=exp.budgetCat==="flight"||exp.budgetCat==="stay";
                    var isAnchor=exp.id==="preset_flight"||exp.id==="preset_stay"; // 只有這兩筆是「固定項目」不能刪，其餘同分類的可以新增/刪除
                    var presetColor=exp.budgetCat==="flight"?"#4A86A8":"#C07A3A";
                    var presetBg=exp.budgetCat==="flight"?"#EAF2F6":"#FBF1E8";
                    var cardInner=React.createElement("div",{onClick:function(){setExpenseEdit(exp);},style:{padding:"10px 12px",borderRadius:14,cursor:"pointer",boxSizing:"border-box",border:isTagged?("1.5px solid "+presetColor):("1.5px solid "+C.border),background:isTagged?presetBg:C.white},key:"inner"},
                      React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}},
                        React.createElement("div",{style:{display:"flex",alignItems:"center",gap:5}},
                          isAnchor?React.createElement("span",{style:{fontSize:9,fontWeight:700,color:C.white,background:presetColor,borderRadius:4,padding:"1px 6px"}},"固定項目"):null,
                          React.createElement("span",{style:{fontSize:14,fontWeight:700,color:C.navy}},exp.name)),
                        React.createElement("div",{style:{fontSize:14,fontWeight:700,color:C.teal}},totalAmt+" "+exp.currency)),
                      React.createElement("div",{style:{fontSize:11,color:C.mid,marginTop:3}},(payerNames.length?payerNames.join("、"):"？")+" 付　·　分攤："+(splitNames.length?splitNames.join("、"):"不平分（個人）")+(exp.paymentMethod?"　·　"+exp.paymentMethod:"")),
                      exp.budgetCat==="transport"&&(exp.transportType||exp.fromLocId||exp.toLocId)?React.createElement("div",{style:{fontSize:10,color:C.mid,marginTop:4}},"🚌 "+(exp.transportType||"")+(function(){
                        if(!exp.fromLocId&&!exp.toLocId)return "";
                        var fromL=locs.find(function(l){return l.id===exp.fromLocId;});
                        var toL=locs.find(function(l){return l.id===exp.toLocId;});
                        return (fromL&&toL)?("　"+fromL.name+" → "+toL.name):"";
                      })()):null);
                    if(isAnchor)return React.createElement("div",{key:exp.id,style:{marginBottom:6}},cardInner);
                    return React.createElement("div",{key:exp.id,style:{marginBottom:6}},React.createElement(SwipeToDeleteRow,{onDelete:function(){deleteExpense(exp.id);}},cardInner));
                  }));
              });
            })(),
            React.createElement("div",{style:{display:"flex",gap:8,marginBottom:10}},
              React.createElement("button",{onClick:function(){setExpenseEdit({budgetCat:"flight",name:"機票"});},style:{flex:1,padding:"10px 7px",minHeight:36,borderRadius:9,border:"1.5px dashed #4A86A8",background:"none",color:"#4A86A8",cursor:"pointer",fontSize:11,fontWeight:600}},"＋ 新增一筆機票"),
              React.createElement("button",{onClick:function(){setExpenseEdit({budgetCat:"stay",name:"住宿"});},style:{flex:1,padding:"10px 7px",minHeight:36,borderRadius:9,border:"1.5px dashed #C07A3A",background:"none",color:"#C07A3A",cursor:"pointer",fontSize:11,fontWeight:600}},"＋ 新增一筆住宿")),
            expenses.length>0?(function(){
              var result=computeBalances();
              var settlements=computeSettlements(result.balances);
              return React.createElement("div",{style:{marginTop:16}},
                result.hasUnconverted?React.createElement("div",{style:{fontSize:11,color:"#C07A3A",background:"#FFF3E0",borderRadius:8,padding:"8px 10px",marginBottom:10}},"⚠️ 有些支出的幣別還沒有即時匯率資料，餘額計算可能不準確，請到「換算計算機」分頁先查詢一次匯率"):null,
                React.createElement("div",{onClick:function(){setBalanceSectionOpen(function(s){return !s;});},style:{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",marginBottom:balanceSectionOpen?8:0}},
                  React.createElement("div",{style:{fontSize:12,fontWeight:700,color:C.navy}},"💵 每人餘額（換算台幣）"),
                  React.createElement("span",{style:{fontSize:11,color:C.mid}},balanceSectionOpen?"收合 ▲":"展開 ▼")),
                balanceSectionOpen?React.createElement("div",{style:{maxHeight:76,overflowY:"auto"}},
                  result.balances.map(function(b){var isMe=currentUID&&b.id===currentUID;return React.createElement("div",{key:b.id,style:{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:isMe?C.skyblue+"55":C.white,border:isMe?"1.5px solid "+C.teal:"1.5px solid transparent",borderRadius:10,marginBottom:5,boxSizing:"border-box"}},
                    React.createElement("span",{style:{fontSize:13,color:isMe?C.navy:C.navy,fontWeight:isMe?800:600}},(isMe?"⭐ ":"")+b.name+(b.archived?"（已封存）":"")),
                    React.createElement("span",{style:{fontSize:13,fontWeight:700,color:b.net>0.5?"#5A9A7A":(b.net<-0.5?"#C55":C.mid)}},b.net>0.5?("應收 NT$"+b.net.toFixed(0)):(b.net<-0.5?("應付 NT$"+(-b.net).toFixed(0)):"已結清")));
                  })):null,
                settlements.length?React.createElement("button",{onClick:function(){setSettlementModalOpen(true);},style:{width:"100%",marginTop:12,padding:"10px 14px",borderRadius:10,border:"1.5px solid "+C.border,background:C.white,color:C.navy,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",justifyContent:"space-between",alignItems:"center"}},React.createElement("span",null,"🤝 查看建議結清方式"),React.createElement("span",{style:{color:C.teal,fontWeight:700}},settlements.length+" 筆 ›")):null);
            })():null),
          React.createElement("div",{style:{padding:"10px 14px calc(10px + env(safe-area-inset-bottom, 0px))",flexShrink:0,borderTop:"1px solid "+C.border}},
            React.createElement("button",{onClick:function(){setExpenseEdit({});},style:{width:"100%",padding:"12px",borderRadius:12,background:C.teal,color:C.white,border:"none",cursor:"pointer",fontSize:14,fontWeight:700}},"＋ 新增支出"))):(expenseTab==="calculator"?

        React.createElement("div",{style:{flex:1,overflowY:"auto",padding:"14px"}},
          React.createElement("button",{onClick:fetchTwdRates,disabled:exchangeLoading,style:{width:"100%",padding:"11px",borderRadius:10,background:exchangeLoading?"#ccc":C.teal,color:C.white,border:"none",cursor:exchangeLoading?"default":"pointer",fontSize:13,fontWeight:700,marginBottom:14}},exchangeLoading?"查詢中…":(exchangeData?"🔄 重新查詢最新匯率":"查詢即時匯率")),
          exchangeData?React.createElement("div",{style:{fontSize:11,color:C.mid,marginBottom:14}},"更新日期："+(exchangeData.date||"—")+"（AI 網路搜尋結果，僅供參考）"):null,
          React.createElement("div",{style:{background:C.white,borderRadius:14,padding:14}},
            React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:6,fontWeight:600}},"選擇幣別"),
            React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}},
              CURRENCIES.filter(function(c){return c!=="TWD";}).map(function(c){return React.createElement("button",{key:c,onClick:function(){setCalcCurrency(c);},style:{padding:"6px 12px",borderRadius:20,border:"1.5px solid "+(calcCurrency===c?C.teal:C.border),background:calcCurrency===c?C.skyblue:C.light,color:C.navy,cursor:"pointer",fontSize:12,fontWeight:calcCurrency===c?700:500}},c);})),
            React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:4,fontWeight:600}},"輸入金額（"+calcCurrency+"）"),
            React.createElement("input",{type:"number",min:"0",value:calcAmount,onChange:function(e){setCalcAmount(e.target.value);},placeholder:"1000",style:Object.assign({},INP,{fontSize:20,fontWeight:700,marginBottom:14})}),
            (function(){
              var amt=parseFloat(calcAmount);
              var rate=exchangeData&&exchangeData.rates?exchangeData.rates[calcCurrency]:null;
              var twd=(!isNaN(amt)&&rate!=null)?amt*rate:null;
              return React.createElement("div",{style:{textAlign:"center",padding:"14px",background:C.light,borderRadius:12}},
                React.createElement("div",{style:{fontSize:12,color:C.mid}},"≈ 台幣"),
                React.createElement("div",{style:{fontSize:28,fontWeight:700,color:C.teal}},twd!=null?("NT$ "+twd.toFixed(0)):"—"),
                rate==null?React.createElement("div",{style:{fontSize:11,color:C.mid,marginTop:6}},"請先點上方「查詢即時匯率」，或在下面手動輸入"):React.createElement("div",{style:{fontSize:10,color:C.mid,marginTop:6}},"匯率：1 "+calcCurrency+" ≈ "+rate.toFixed(4)+" TWD"));
            })(),
            React.createElement("div",{style:{marginTop:12,paddingTop:12,borderTop:"1px solid "+C.border}},
              React.createElement("div",{style:{fontSize:11,color:C.mid,marginBottom:6,fontWeight:600}},"💡 查詢失敗的話，可以在這裡手動輸入匯率"),
              React.createElement("div",{style:{display:"flex",gap:6,alignItems:"center"}},
                React.createElement("span",{style:{fontSize:12,color:C.navy,flexShrink:0}},"1 "+calcCurrency+" ="),
                React.createElement("input",{type:"number",min:"0",step:"0.0001",value:manualRateInput,onChange:function(e){setManualRateInput(e.target.value);},placeholder:"例如 0.22",style:Object.assign({},INP,{flex:1,padding:"8px 10px"})}),
                React.createElement("span",{style:{fontSize:12,color:C.navy,flexShrink:0}},"TWD"),
                React.createElement("button",{onClick:function(){setManualRate(calcCurrency,manualRateInput);},disabled:!manualRateInput,style:{padding:"9px 14px",minHeight:36,borderRadius:9,background:manualRateInput?C.teal:"#ccc",color:C.white,border:"none",cursor:manualRateInput?"pointer":"default",fontSize:12,fontWeight:700,flexShrink:0}},"設定"))))):null))):null,



    showImportGmap ? React.createElement("div", {style:{position:"fixed",inset:0,background:"rgba(78,85,92,.6)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}, onClick:function(e){if(e.target===e.currentTarget){setShowImportGmap(false);setGmapImportText("");setGmapImportResult(null);}}},
      React.createElement("div", {style:{background:C.white,borderRadius:18,padding:20,width:"100%",maxWidth:480}},
        React.createElement("div", {style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}},
          React.createElement("span", {style:{fontSize:15,fontWeight:700,color:C.navy}}, "📥 從 Google Maps 匯入"),
          React.createElement("button", {onClick:function(){setShowImportGmap(false);setGmapImportText("");setGmapImportResult(null);}, style:{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.mid}}, "×")),
        React.createElement("div", {style:{fontSize:12,color:C.mid,marginBottom:4,lineHeight:1.6}},
          "支援貼上 Google Takeout 的 ",
          React.createElement("b", null, "Saved Places.json"),
          "，或瀏覽器擴充功能匯出的 CSV / JSON，會自動判斷格式。"),
        React.createElement("div", {style:{fontSize:11,color:C.teal,marginBottom:10,fontWeight:600}}, "已存在的地點（名稱相同）將自動跳過，不會覆蓋。"),
        gmapImportResult === null
          ? React.createElement(React.Fragment, null,
              React.createElement("div", {style:{display:"flex",gap:8,marginBottom:8}},
                React.createElement("button", {onClick:function(){if(gmapFileInputRef.current)gmapFileInputRef.current.click();}, style:{flex:1,padding:"8px",borderRadius:10,border:"1.5px dashed "+C.border,background:C.light,color:C.mid,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}, "📁 上傳 CSV / JSON 檔案"),
                React.createElement("input", {ref:gmapFileInputRef,type:"file",accept:".csv,.json,text/csv,application/json,text/plain",style:{display:"none"},onChange:function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var reader=new FileReader();reader.onload=function(ev){setGmapImportText(String(ev.target.result||""));};reader.onerror=function(){setGmapImportResult({error:"檔案讀取失敗，請改用貼上文字內容"});};reader.readAsText(f,"utf-8");e.target.value="";}})),
              React.createElement("div", {style:{fontSize:10,color:C.mid,marginBottom:6,textAlign:"center"}}, "或直接貼上內容 ↓"),
              React.createElement("textarea", {value:gmapImportText, onChange:function(e){setGmapImportText(e.target.value);}, placeholder:'貼上 CSV 或 JSON 內容…\n例：Title,Note,URL\n或 {"type":"FeatureCollection","features":[...]}', style:{width:"100%",height:150,padding:"8px 10px",border:"1.5px solid "+C.border,borderRadius:10,fontSize:11,fontFamily:"monospace",boxSizing:"border-box",resize:"none",background:C.light,color:C.navy,outline:"none"}}),
              React.createElement("label", {style:{display:"flex",alignItems:"flex-start",gap:6,marginTop:8,cursor:"pointer"}},
                React.createElement("input", {type:"checkbox",checked:enrichWithAI,onChange:function(e){setEnrichWithAI(e.target.checked);},style:{marginTop:2,flexShrink:0}}),
                React.createElement("span", {style:{fontSize:11,color:C.mid,lineHeight:1.5}}, "匯入後，對沒有營業時間的地點自動用 AI 查詢營業時間與簡介（地點較多時會花較久時間，可以先關閉此視窗，查詢仍會在背景繼續）")),
              React.createElement("div", {style:{display:"flex",gap:8,marginTop:10}},
                React.createElement("button", {onClick:function(){setShowImportGmap(false);setGmapImportText("");}, style:{flex:1,padding:"10px",borderRadius:10,border:"1.5px solid "+C.border,background:C.white,color:C.mid,cursor:"pointer",fontSize:13}}, "取消"),
                React.createElement("button", {onClick:function(){parseGmapImport(gmapImportText);}, disabled:!gmapImportText.trim(), style:{flex:2,padding:"10px",borderRadius:10,border:"none",background:gmapImportText.trim()?C.teal:"#ccc",color:C.white,cursor:gmapImportText.trim()?"pointer":"default",fontSize:13,fontWeight:700}}, "匯入")))
          : React.createElement("div", {style:{textAlign:"center",padding:"16px 0"}},
              gmapImportResult.error
                ? React.createElement(React.Fragment, null,
                    React.createElement("div", {style:{fontSize:32,marginBottom:8}}, "❌"),
                    React.createElement("div", {style:{fontSize:14,color:"#C55",fontWeight:600,marginBottom:16}}, gmapImportResult.error),
                    React.createElement("button", {onClick:function(){setGmapImportResult(null);}, style:{padding:"10px 24px",borderRadius:10,border:"1.5px solid "+C.border,background:C.white,color:C.mid,cursor:"pointer",fontSize:13}}, "重新貼上"))
                : React.createElement(React.Fragment, null,
                    React.createElement("div", {style:{fontSize:32,marginBottom:8}}, "✅"),
                    React.createElement("div", {style:{fontSize:15,fontWeight:700,color:C.navy,marginBottom:6}}, "匯入完成"),
                    React.createElement("div", {style:{fontSize:13,color:C.mid,marginBottom:4}}, "新增 "+gmapImportResult.added+" 個地點"),
                    gmapImportResult.added>0?React.createElement("div", {style:{fontSize:11,color:C.mid,marginBottom:4}}, "其中 "+gmapImportResult.withCoords+" 個有座標、"+gmapImportResult.withHours+" 個有營業時間（原始檔案沒有的部分，開了下方查詢會自動用 AI 補）"):null,
                    gmapImportResult.skipped > 0
                      ? React.createElement("div", {style:{fontSize:12,color:C.teal,marginBottom:enrichProgress?8:16}}, "跳過 "+gmapImportResult.skipped+" 個（名稱已存在）")
                      : React.createElement("div", {style:{marginBottom:enrichProgress?8:16}}),
                    enrichProgress
                      ? React.createElement("div", {style:{fontSize:12,color:C.teal,marginBottom:16,fontWeight:600}}, "🔄 正在查詢營業時間與簡介… ("+enrichProgress.done+"/"+enrichProgress.total+")")
                      : null,
                    React.createElement("button", {onClick:function(){setShowImportGmap(false);setGmapImportText("");setGmapImportResult(null);}, style:{padding:"10px 24px",borderRadius:10,border:"none",background:C.teal,color:C.white,cursor:"pointer",fontSize:13,fontWeight:700}}, enrichProgress?"先關閉，背景繼續查詢":"完成"))))) : null,

    showExport ? React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.6)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:20},onClick:function(e){if(e.target===e.currentTarget)setShowExport(false);}},
      React.createElement("div",{style:{background:C.white,borderRadius:18,padding:20,width:"100%",maxWidth:440}},
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},React.createElement("span",{style:{fontSize:15,fontWeight:700,color:C.navy}},"💾 備份所有旅行計畫"),React.createElement("button",{onClick:function(){setShowExport(false);},style:{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.mid}},"×")),
        React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:8}},exportAllLoading?"整理所有計畫資料中…":"點下方「複製備份內容」按鈕，再貼到備忘錄或雲端硬碟儲存。這份備份包含全部 "+tripsIndex.length+" 個旅行計畫。"),
        React.createElement("textarea",{readOnly:true,value:exportAllLoading?"":exportAllJson,placeholder:exportAllLoading?"整理中…":"",onClick:function(e){e.target.select();},style:{width:"100%",height:180,padding:"8px 10px",border:"1.5px solid "+C.border,borderRadius:10,fontSize:11,fontFamily:"monospace",boxSizing:"border-box",resize:"none",background:C.light,color:C.navy,outline:"none"}}),
        !exportAllLoading?React.createElement("button",{onClick:function(){
          if(navigator.clipboard&&navigator.clipboard.writeText){
            navigator.clipboard.writeText(exportAllJson).then(function(){showCopyToast("已複製備份內容（共 "+exportAllJson.length+" 字元）");}).catch(function(){showAlertMsg("自動複製失敗，請改用手動方式：點一下文字框，全選後用長按選單複製。");});
          }else{
            showAlertMsg("這個瀏覽器不支援自動複製，請改用手動方式：點一下文字框，全選後用長按選單複製。");
          }
        },style:{width:"100%",padding:"11px",borderRadius:10,border:"none",background:C.teal,color:C.white,cursor:"pointer",fontSize:13,fontWeight:700,marginTop:10}},"📋 複製備份內容（共 "+exportAllJson.length+" 字元）"):null,
        React.createElement("div",{style:{fontSize:11,color:C.mid,marginTop:6}},"若自動複製沒反應，也可以點文字框手動全選後長按複製。"))) : null,

    showExportSingle?React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(78,85,92,.6)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:20},onClick:function(e){if(e.target===e.currentTarget)setShowExportSingle(false);}},
      React.createElement("div",{style:{background:C.white,borderRadius:18,padding:20,width:"100%",maxWidth:440}},
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},React.createElement("span",{style:{fontSize:15,fontWeight:700,color:C.navy}},"💾 備份「"+(exportSingleTrip?exportSingleTrip.name:"")+"」"),React.createElement("button",{onClick:function(){setShowExportSingle(false);},style:{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.mid}},"×")),
        React.createElement("div",{style:{fontSize:12,color:C.mid,marginBottom:8}},exportSingleLoading?"整理計畫資料中…":"點下方「複製備份內容」按鈕，再貼到備忘錄或傳給旅伴。這份備份只包含這一個計畫，還原時會產生一個新計畫，不會覆蓋任何現有資料。"),
        React.createElement("textarea",{readOnly:true,value:exportSingleLoading?"":exportSingleJson,placeholder:exportSingleLoading?"整理中…":"",onClick:function(e){e.target.select();},style:{width:"100%",height:180,padding:"8px 10px",border:"1.5px solid "+C.border,borderRadius:10,fontSize:11,fontFamily:"monospace",boxSizing:"border-box",resize:"none",background:C.light,color:C.navy,outline:"none"}}),
        !exportSingleLoading?React.createElement("button",{onClick:function(){
          if(navigator.clipboard&&navigator.clipboard.writeText){
            navigator.clipboard.writeText(exportSingleJson).then(function(){showCopyToast("已複製備份內容（共 "+exportSingleJson.length+" 字元）");}).catch(function(){showAlertMsg("自動複製失敗，請改用手動方式：點一下文字框，全選後用長按選單複製。");});
          }else{
            showAlertMsg("這個瀏覽器不支援自動複製，請改用手動方式：點一下文字框，全選後用長按選單複製。");
          }
        },style:{width:"100%",padding:"11px",borderRadius:10,border:"none",background:C.teal,color:C.white,cursor:"pointer",fontSize:13,fontWeight:700,marginTop:10}},"📋 複製備份內容（共 "+exportSingleJson.length+" 字元）"):null,
        React.createElement("div",{style:{fontSize:11,color:C.mid,marginTop:6}},"還原時到「📂 還原」貼上這段內容即可，系統會自動辨識這是單一計畫的備份。"))):null,

    showImport ? React.createElement("div", {style:{position:"fixed",inset:0,background:"rgba(78,85,92,.6)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}, onClick:function(e){if(e.target===e.currentTarget){setShowImport(false);setImportText("");}}},
      React.createElement("div", {style:{background:C.white,borderRadius:18,padding:20,width:"100%",maxWidth:440}},
        React.createElement("div", {style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},
          React.createElement("span", {style:{fontSize:15,fontWeight:700,color:C.navy}}, "📂 還原備份"),
          React.createElement("button", {onClick:function(){setShowImport(false);setImportText("");}, style:{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.mid}}, "×")),
        React.createElement("div", {style:{fontSize:12,color:C.mid,marginBottom:8,lineHeight:1.6,whiteSpace:"pre-wrap"}}, "將備份內容貼到下方，系統會自動判斷格式：\n・單一計畫備份 → 還原成一個新計畫，不會動到任何現有資料\n・全部計畫備份 → 會整批覆蓋目前所有旅行計畫，請確認內容正確再還原"),
        React.createElement("textarea", {value:importText, onChange:function(e){setImportText(e.target.value);}, placeholder:"貼上備份 JSON…", style:{width:"100%",height:150,padding:"8px 10px",border:"1.5px solid "+C.border,borderRadius:10,fontSize:11,fontFamily:"monospace",boxSizing:"border-box",resize:"none",background:C.light,color:C.navy,outline:"none"}}),
        React.createElement("button",{onClick:function(){
          if(navigator.clipboard&&navigator.clipboard.readText){
            navigator.clipboard.readText().then(function(text){if(text)setImportText(text);else showAlertMsg("剪貼簿目前沒有內容，請先複製備份內容。");}).catch(function(){showAlertMsg("自動貼上失敗，請改用長按選單手動貼上到上方文字框。");});
          }else{
            showAlertMsg("這個瀏覽器不支援自動貼上，請改用長按選單手動貼上到上方文字框。");
          }
        },style:{width:"100%",padding:"9px",borderRadius:10,border:"1.5px dashed "+C.teal,background:"none",color:C.teal,cursor:"pointer",fontSize:12,fontWeight:600,marginTop:8}},"📋 從剪貼簿貼上"),
        React.createElement("div", {style:{display:"flex",gap:8,marginTop:10}},
          React.createElement("button", {onClick:function(){setShowImport(false);setImportText("");}, style:{flex:1,padding:"10px",borderRadius:10,border:"1.5px solid "+C.border,background:C.white,color:C.mid,cursor:"pointer",fontSize:13}}, "取消"),
          React.createElement("button", {onClick:importAllFromText, disabled:!importText.trim(), style:{flex:2,padding:"10px",borderRadius:10,border:"none",background:importText.trim()?C.teal:"#ccc",color:C.white,cursor:importText.trim()?"pointer":"default",fontSize:13,fontWeight:700}}, "還原資料")))) : null);
}
