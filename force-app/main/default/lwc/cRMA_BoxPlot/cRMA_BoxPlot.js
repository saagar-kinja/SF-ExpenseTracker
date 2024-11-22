import { LightningElement, api, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import tailwindcss from '@salesforce/resourceUrl/tailwindcss';
import Highcharts from '@salesforce/resourceUrl/highcharts';
import highchartsBoxPlot from '@salesforce/resourceUrl/highchartsBoxPlot';


export default class CRMA_BoxPlot extends LightningElement {

    @api title;
    @api results;
    @track isChartJsInitialized = false;
    static chartColor = 'black';

    renderedCallback() {

        if (this.isChartJsInitialized) {
            return;
        }
        this.isChartJsInitialized = true;

        Promise.all([
            //loadStyle(this, tailwindcss)
        ]).then(() => {
        })

        loadScript(this, Highcharts)
            .then(() => {
                console.log("script loaded: Highcharts.js");
                loadScript(this, highchartsBoxPlot)
                    .then(() => {
                        console.log("script loaded: highchartsBoxPlot.js");
                        this.initializeChart();
                    })
                    .catch(error => { console.log("script loading failed: highchartsBoxPlot.js"); console.error(error) });
            })
            .catch(error => { console.log("script loading failed: Highcharts.js"); console.error(error); });
    }


    initializeChart() {
        console.log('loading chart... ');

        const container = this.template.querySelector(".container-class");

        window.Highcharts.chart(container, {

            chart: {
                type: 'boxplot'
            },

            title: {
                text: this.title
            },

            legend: {
                enabled: false
            },

            xAxis: {
                categories: ['1', '2', '3', '4', '5'],
                title: {
                    text: 'Deal No.'
                }
            },

            yAxis: {
                title: {
                    text: 'Stage'
                },
                plotLines: [{
                    value: 932,
                    color: 'red',
                    width: 1,
                    label: {
                        text: 'Mean: 932',
                        align: 'center',
                        style: {
                            color: 'gray'
                        }
                    }
                }]
            },

            series: [{
                name: 'Stage',
                data: [
                    [760, 801, 848, 895, 965],
                    [733, 853, 939, 980, 1080],
                    [714, 762, 817, 870, 918],
                    [724, 802, 806, 871, 950],
                    [834, 836, 864, 882, 910]
                ],
                tooltip: {
                    headerFormat: '<em>Deal No {point.key}</em><br/>'
                }
            }, {
                name: 'Outliers',
                color: this.chartColor,
                type: 'scatter',
                data: [ // x, y positions where 0 is the first category
                    [0, 644],
                    [4, 718],
                    [4, 951],
                    [4, 969]
                ],
                marker: {
                    fillColor: 'white',
                    lineWidth: 1,
                    lineColor: this.chartColor
                },
                tooltip: {
                    pointFormat: 'Observation: {point.y}'
                }
            }]

        });
    }


}