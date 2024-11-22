import { LightningElement, api, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import tailwindcss from '@salesforce/resourceUrl/tailwindcss';
import Highcharts from '@salesforce/resourceUrl/highcharts';
import highchartsWordCloud from '@salesforce/resourceUrl/highchartsWordCloud';

import { publish, subscribe, unsubscribe, createMessageContext, releaseMessageContext } from 'lightning/messageService';
import SAMPLEMC from "@salesforce/messageChannel/MyMessageChannel__c";
const messageContext = createMessageContext();




export default class CRMA_WordArt extends LightningElement {

    scriptLoaded = false;

    @api title;
    @api description;
    //@api results;
    @api metadata;
    @api selectMode;
    @api setSelection;
    @api getState;
    @api setState;
    @api refresh;


    @api stateChangedCallback(prevState, newState) {
        //console.log(prevState, newState);
        this.currentState = newState;
    }

    @api
    get results() {
        return this._results;
    }


    set results(results) {
        console.warn('results: ', JSON.parse(JSON.stringify(results)));
        this._results = results;
        if (this.chart && this.isChartJsInitialized) {
            this.initializeChart();
        }
    }

    @api
    get selection() {
        if (this.chart && this.isChartJsInitialized) {
            this.initializeChart();
        } return this._selection;
    }

    set selection(selection) {
        console.warn('selection: ', JSON.parse(JSON.stringify(selection)));
        this._selection = selection;
        if (this.chart && this.isChartJsInitialized) {
            this.initializeChart();
        }
    }

    @track isChartJsInitialized = false;
    @track selectedText;


    get stringResults() {
        //JSON.stringify(this.results);
        var arr = [];
        this.results.forEach(opt => {
            arr.push({ 'name': opt?.['Name'], 'weight': opt?.['A'] });
        });
        return arr;
    }

    constructor() {
        super();
    }

    renderedCallback() {

        if (this.isChartJsInitialized) {
            return;
        }
        this.isChartJsInitialized = true;
        this.subscribeMC();

        Promise.all([
            //loadStyle(this, tailwindcss)
        ]).then(() => {
        })

        loadScript(this, Highcharts)
            .then(() => {
                console.log("script loaded: Highcharts.js");
                loadScript(this, highchartsWordCloud)
                    .then(() => {
                        console.log("script loaded: highchartsWordCloud.js");
                        this.scriptLoaded = true;
                        this.initializeChart();
                    })
                    .catch(error => { console.log("script loading failed: highchartsWordCloud.js"); console.error(error) });
            })
            .catch(error => { console.log("script loading failed: Highcharts.js"); console.error(error); });
    }

    handleValueChanged(event) {
        var test = event.detail;
        this.selectedText = 'test';
    }

    publishMC() {
        const message = {
            messageToSend: this.myMessage,
            sourceSystem: "From ME"
        };
        publish(this.context, SAMPLEMC, message);
    }

    subscribeMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(messageContext, SAMPLEMC, (message) => {
            this.displayMessage(message);
        });
    }

    displayMessage(message) {
        var test = message.messageToSend;
        //this.selectedText = test;
        console.log('##########');
        console.log(test);

        const row = { 'Name': test.name, 'A': test.key };
        console.log(row);
        const selectedRowsByHash = this.getSelectedRowsByHash();
        this.setSelection(this.isMultiSelect() ? [...selectedRowsByHash.values(), row] : [row]);

    }

    isMultiSelect() {
        return this.selectMode.includes('multi');
    }

    getSelectedRowsByHash() {
        return new Map((this.selection ?? []).map((row) => [this.hash(row), row]));
    }

    hash(row) {
        return this.metadata.groups.map((group) => row[group]).join('|^|');
    }

    initializeChart() {
        console.log('loading chart... ');
        const container = this.template.querySelector(".container-class");
        var arr = [];
        this.results.forEach(opt => {
            arr.push({ 'name': opt?.['Name'], 'weight': opt?.['A'] });
        });

        this.chart = window.Highcharts.chart(container, {
            accessibility: {
                enabled: false
            },
            series: [{
                type: 'wordcloud',
                data: arr,
                cursor: 'pointer',
                events: {
                    click: function (e) {
                        const message = {
                            messageToSend: { name: e.point.name, key: e.point.weight },
                            sourceSystem: "From ME"
                        }
                        publish(messageContext, SAMPLEMC, message);
                    }
                }
            }],
            title: {
                text: this.title,
                align: 'left'
            },
            subtitle: {
                text: this.description,
                align: 'left'
            },
            tooltip: {
                headerFormat: '<span style="font-size: 16px"><b>{point.key}</b>' +
                    '</span><br>'
            }
        });
    }


}
