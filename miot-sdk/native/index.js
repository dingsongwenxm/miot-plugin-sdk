import{DeviceEventEmitter,Platform}from"react-native";import AndroidModules from"./android";import I18n from"./common/i18n";import resolveAssetResource from"./common/node/resolve";import createEventBuilder from"./events";import IosModules from"./ios";import utils from"./utils";export const Utils=utils;export function createI18n(e,t){return new I18n(e,t)};export const IOS="ios";export const ANDROID="android";export const DEBUG="debug";export const RELEASE="release";export const NativeType="android"===Platform.OS.toLowerCase()?ANDROID:IOS;export const isAndroid=NativeType===ANDROID;export const isIOS=NativeType===IOS;const modules=isAndroid?AndroidModules:IosModules;modules.MIOTPackage&&resolveAssetResource(modules.MIOTPackage.basePath,modules.MIOTPackage.localFilePath,modules.MIOTPackage.plugPath);const nativePropertiesMap=new WeakMap;export const Properties={init:(e,t)=>(nativePropertiesMap.set(e,t||{}),e),of:e=>nativePropertiesMap.get(e)||{}};function getSystemLanguage(){return Utils.getStandardLanguageName(modules.MIOTHost.language,modules.LanguageNameMap)}const MIOTRPC=modules.MIOTRPC;MIOTRPC.standardCall=((e,t,o)=>{MIOTRPC.nativeCall(e,t,(e,t)=>{if(e)return t&&null==t.result&&(t.result={}),void o(e,t.result);o(!1,t)})});export const SetTimeout=(e,t=0)=>setTimeout(e,t);export const ClearTimeout=e=>e&&clearTimeout(e);const INTERVAL=4999,onPackageInterval={current:0,funcs:[],timer:0};export const NativeTimer={addListener(e,t){if(!t||t<1||!e)return{remove(){},get isValid(){return!1}};const{funcs:o,timer:n}=onPackageInterval;if(!n){onPackageInterval.timer=setTimeout(function e(){if(!onPackageInterval.timer)return;const t=(new Date).getTime();let n=INTERVAL;o.forEach((e,a)=>{if(e)if(e.expire<=t)"continue"==e.func()?e.expire=t+e.timeout:o[a]=0;else{const o=e.expire-t;o<n&&(n=o)}}),onPackageInterval.timer=setTimeout(e,n)},INTERVAL)}t*=1e3;const a=o.push({func:e,timeout:t,expire:t+(new Date).getTime()})-1;return{get isValid(){return o[a]?1:0},remove(){o[a]=0}}}};const onPackageExit={funcs:[]};export const PackageExitAction={register(e,t){if(!onPackageExit.funcs.includes(e))return onPackageExit.funcs.push(e),t&&t(modules.LocalCache),!0},unregister(e){onPackageExit.funcs.forEach((t,o)=>{t==e&&(onPackageExit.funcs[o]=0)})},execute(){const{timer:e}=onPackageInterval;onPackageInterval.timer=0,e&&clearTimeout(e),onPackageInterval.funcs=[],onPackageInterval.current=0,onPackageExit.funcs.forEach((e,t)=>{if(e)try{e(modules.LocalCache),onPackageExit.funcs[t]=0}catch(e){console.log(e)}}),modules.LocalCache.clear(),onPackageExit.funcs=[]}};const EventRandom=modules.MIOTPackage.eventRandom||"";export const MIOTEventEmitter={addListener:(e,t)=>DeviceEventEmitter.addListener(e+EventRandom,t),emit(e,...t){DeviceEventEmitter.emit(e+EventRandom,...t)}};modules.LocalCache.globalEventProfiles={};const eventBuilder=createEventBuilder(modules.LocalCache.globalEventProfiles,MIOTEventEmitter);export const createEventManager=eventBuilder.createEventManager;export const buildEvents=e=>{const t=createEventManager(e);Object.keys(t).forEach(o=>{Utils.setReadonly(e,o,t[o])})};PackageExitAction.register(e=>{e.globalEventProfiles={}});export default{...modules,MIOTRPC:MIOTRPC,MIOTEventEmitter:MIOTEventEmitter,type:NativeType,isAndroid:isAndroid,isIOS:isIOS,language:getSystemLanguage(),SetTimeout:SetTimeout,ClearTimeout:ClearTimeout,INVALID_PATH:"DONOTUSETHIS://"};