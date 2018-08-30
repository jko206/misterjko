/* global Vue, $, Data*/
// jshint esversion: 6
/*
load the data
parse the data



*/

import DatePicker from 'vue2-datepicker';

const META_DATA = {
  MIN_EXPIRE_TIME: Infinity,
  MAX_EXPIRE_TIME: -Infinity,
}

const globalInit = function(){
  // do date related stuff
  Data.forEach(item=>{
    let buyTime = (new Date(item.purchaseDate)).valueOf();
    let expTime = (new Date(item.expirationDate)).valueOf();
    let expIn = expTime - buyTime;
    
    if(expTime < META_DATA.MIN_EXPIRE_TIME) META_DATA.MIN_EXPIRE_TIME = expTime;
    if(expTime > META_DATA.MAX_EXPIRE_TIME) META_DATA.MAX_EXPIRE_TIME = expTime;
    
    item.buyTime = buyTime;
    item.expTime = expTime;
    item.expIn = expIn;
  });
  
  // sort from earliest purchaseTime to the latest
  Data.sort((a,b)=>{
    return a.buyTime - b.buyTime;
  });
};


// import DatePicker from 'vue2-datepicker'
// https://github.com/vuejs/awesome-vue#calendar
// https://mengxiong10.github.io/vue2-datepicker/demo/index.html
window.onload = function(){
  function initVue(){
    window.App = new Vue({
      el: '#vue-app',
      data(){
        let DAY = 24 * 60 * 60 * 1000,
          BARS_PER_CHART = 10,
          DAYS_PER_BAR = 1;
        return{
          VARS: {
            DAY,
            BARS_PER_CHART,
            DAYS_PER_BAR,
            RANGE_LENGTH: BARS_PER_CHART * DAYS_PER_BAR * DAY,
          },
          
          // initializing data
          chartTypes: [
            {
              title: 'Food Purchased by Date',
              value: 0,
            },
            {
              title: 'Food Bought After Expiration',
              value: 1,
            },
            {
              title: 'Food Items by Properties',
              value: 2,
            },
          ],
          categories:[
            {
              title: 'Food',
              propName: 'foods',
              items: [
                {
                  "name": "Asparagus",
                  "type": "Produce"
                },
                {
                  "name": "Cabbage",
                  "type": "Produce"
                },
                {
                  "name": "Green onions",
                  "type": "Produce"
                },
                {
                  "name": "Lettuce",
                  "type": "Produce"
                },
                {
                  "name": "Peas",
                  "type": "Produce"
                },
                {
                  "name": "Radish",
                  "type": "Produce"
                },
                {
                  "name": "Rhubarb",
                  "type": "Produce"
                },
                {
                  "name": "Spinach",
                  "type": "Produce"
                },
                {
                  "name": "Turnips",
                  "type": "Produce"
                },
                {
                  "name": "Watercress",
                  "type": "Produce"
                },
                {
                  "name": "Basil",
                  "type": "Produce"
                },
                {
                  "name": "Broccoli",
                  "type": "Produce"
                },
                {
                  "name": "Cabbage",
                  "type": "Produce"
                },
                {
                  "name": "Carrots",
                  "type": "Produce"
                },
                {
                  "name": "Cauliflower",
                  "type": "Produce"
                },
                {
                  "name": "Cucumbers",
                  "type": "Produce"
                },
                {
                  "name": "Eggplant",
                  "type": "Produce"
                },
                {
                  "name": "Garlic",
                  "type": "Produce"
                },
                {
                  "name": "Onions",
                  "type": "Produce"
                },
                {
                  "name": "Okra",
                  "type": "Produce"
                },
                {
                  "name": "Peppers",
                  "type": "Produce"
                },
                {
                  "name": "Potatoes",
                  "type": "Produce"
                },
                {
                  "name": "Tomatoes",
                  "type": "Produce"
                },
                {
                  "name": "Zucchini",
                  "type": "Produce"
                },
                {
                  "name": "Beets",
                  "type": "Produce"
                },
                {
                  "name": "Fennel",
                  "type": "Produce"
                },
                {
                  "name": "Watermelon",
                  "type": "Produce"
                },
                {
                  "name": "Arugula",
                  "type": "Produce"
                },
                {
                  "name": "Chard",
                  "type": "Produce"
                },
                {
                  "name": "Rutabaga",
                  "type": "Produce"
                },
                {
                  "name": "Milk",
                  "type": "Dairy"
                },
                {
                  "name": "Cheese",
                  "type": "Dairy"
                },
                {
                  "name": "Butter",
                  "type": "Dairy"
                },
                {
                  "name": "Yoghurt",
                  "type": "Dairy"
                },
                {
                  "name": "Ice cream",
                  "type": "Dairy"
                },
                {
                  "name": "Chicken",
                  "type": "Meat"
                },
                {
                  "name": "Fish",
                  "type": "Meat"
                },
                {
                  "name": "Beef",
                  "type": "Meat"
                },
                {
                  "name": "Pork",
                  "type": "Meat"
                },
                {
                  "name": "Lamb",
                  "type": "Meat"
                }
              ],
            },
            {
              title: 'Food Types',
              propName: 'foodTypes',
              items: ["Produce", "Dairy", "Meat"]
            },
            {
              title : 'Stores',
              propName : 'stores',
              items : [
                "Safeway",
                "Albertsons",
                "7-11",
                "Metropolitan Market",
                "Trader Joe's",
                "Grocery Outlet",
                "QFC"
              ],
            }
          ],
          
          // UI state
          currChartTitle: 'Choose Chart Type',
          isChartTypesOpen: false,
          openFilters : {},
          
          // states
          currChartType: -1,
          time: {
            absMin: Data[0].buyTime,
            absMax: Data[Data.length - 1].buyTime,
            buyTimeMin: Data[0].buyTime,
            buyTimeMax: Data[Data.length - 1].buyTime,
            expDateMin: META_DATA.MIN_EXPIRE_TIME,
            expDateMax: META_DATA.MAX_EXPIRE_TIME,
          },
          filterBy: {
            foods: new Set(),
            foodTypes: new Set(),
            stores : new Set(),
            quantity:{
              min: 0,
              max: 10,
            },
          },
          test: '',
        }
      },
      methods: {
        // Filter related
        toggleItem(category, item, {target}){
          let _set = this.filterBy[category];
          if(_set.has(item)){
            _set.delete(item);
            $(target).removeClass('red');
          } else {
            $(target).addClass('red');
            _set.add(item);
          }
        },
        updateGraph(val){
          
        },
        updateRangeLength(){
          let {
            BARS_PER_CHART,
            DAYS_PER_BAR,
            DAY,
          } = this.VARS;
          this.VARS.RANGE_LENGTH = BARS_PER_CHART * DAYS_PER_BAR * DAY;
        },
        
        // UI state

        // Chart related stuff
        changeChartType(val){
          this.currChartType = val;
          this.updateGraph(val);
          this.currChartTitle = this.chartTypes[val].title;
        },
        prevBar(){
          let decrement = this.VARS.DAY * this.VARS.DAYS_PER_BAR;
          this.time.buyTimeMin -= decrement;
          this.time.buyTimeMax -= decrement;
        },
        nextBar(){
          let increment = this.VARS.DAY * this.VARS.DAYS_PER_BAR;
          this.time.buyTimeMin += increment;
          this.time.buyTimeMax += increment;
        },
        prevBarSet(){
          let decrement = this.VARS.RANGE_LENGTH;
          this.time.buyTimeMin -= decrement;
          this.time.buyTimeMax -= decrement;
        },
        nextBarSet(){
          let increment = this.VARS.RANGE_LENGTH;
          this.time.buyTimeMin += increment;
          this.time.buyTimeMax += increment;
        },
      },
      components: {
        DatePicker,
      }
    });
  }
  global 
  globalInit();
  initVue();
}