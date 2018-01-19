(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Aequirys = require('aequirys')
document.getElementById("date").innerHTML = Aequirys.display(Aequirys.convert())

},{"aequirys":2}],2:[function(require,module,exports){
/**
 * Aequirys
 * A Mithvaerian calendar
 *
 * @author Josh Avanier
 * @version 1.1.0
 * @license MIT
 */
var Aequirys={display:function(a){var c=a.y.toString().substr(-2);return"Y"===a.t||"L"===a.t?""+a.t+c:""+a.m+("0"+a.t).substr(-2)+c},nth:function(a){a=void 0===a?new Date:a;return Math.floor((a-new Date(a.getFullYear(),0,1))/864E5)+1},quarter:function(a){a=void 0===a?this.nth(new Date):a;return Math.floor(this.week(a)/26)+1},month:function(a){a=void 0===a?this.nth(new Date):a;return"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")[Math.floor((a-1)/14)]},week:function(a){a=void 0===a?this.nth(new Date):a;return Math.floor(a/
7)},date:function(a){a=void 0===a?this.nth(new Date):a;a-=14*Math.floor(a/14);0===a&&(a=14);return a},day:function(a){a=void 0===a?new Date:a;return a.getDay()+1},convert:function(a){a=void 0===a?new Date:a;var c=a.getFullYear(),b=this.nth(a),d;switch(b){case 365:var e="Y";var f=0;b=d=void 0;break;case 366:e="L";f=0;b=d=void 0;break;default:e=this.date(b),f=this.week(b),d=this.month(b),b=this.quarter(b)}return{y:c,q:b,m:d,w:f,t:e,d:this.day(a)}}};module.exports=Aequirys;

},{}]},{},[1]);
