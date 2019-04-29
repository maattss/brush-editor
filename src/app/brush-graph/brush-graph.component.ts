import { Component, OnInit } from '@angular/core';
import { BrushService } from '../_services/index';
import { Brush, ChannelNames, ChannelMaxValues } from '../brush';

@Component({
    selector: 'app-brush-graph',
    templateUrl: './brush-graph.component.html',
    styleUrls: ['./brush-graph.component.scss'],
})
export class BrushGraphComponent implements OnInit {
    // Chart variables
    public barChartOptions = {
        animation: false,
        scaleShowVerticalLines: false,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [
                {
                    ticks: {
                        autoSkip: false, // Stops labels from disappearing at certain resolutions
                    },
                },
            ],
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        max: 100,
                        callback: function(value: string) {
                            return value + '%';
                        },
                    },
                },
            ],
        },
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function(tooltipItem: any, data: any) {
                    const allData =
                        data.datasets[tooltipItem.datasetIndex].data;
                    const tooltipData = allData[tooltipItem.index];
                    return ' ' + tooltipData + '%';
                },
            },
        },
    };
    public barChartLabels: string[] = ['No data'];
    public barChartData: any[] = [
        {
            data: 0,
            label: 'No data',
        },
    ];
    public barChartType = 'bar';
    public barChartLegend = false;
    public chartColors: any[] = [
        {
            backgroundColor: [
                'rgba(40, 167, 69, 0.6)', // Green
                'rgba(0, 123, 255, 0.6)', // Dark blue
                'rgba(220, 53, 69, 0.6)', // Red
                'rgba(23, 162, 184, 0.6)', // Light blue
                'rgba(255, 193, 7, 0.6)', // Yellow
            ],
        },
    ];
    public isDataAvailable = false; // Controls if graph is displayed or not

    constructor(private data: BrushService) {}

    // Class variables
    private chNames: ChannelNames;
    private brushes: Brush[];
    private chart: [];
    private initialized = false;
    private currentBrushId: number;
    private channelMaxValues: ChannelMaxValues;

    ngOnInit() {
        // Subscriptions
        this.data.channelNames.subscribe(chNames => {
            this.chNames = chNames;
            if (this.initialized === true) {
                this.addData();
            }
        });
        this.data.currentBrush.subscribe(brushes => {
            if (this.initialized === true) {
                this.addData();
            }
            this.brushes = brushes;
            if (this.brushes.length > 0) {
                this.initialized = true;
            }
        });
        this.data.currentBrushId.subscribe(brushId => {
            this.currentBrushId = brushId;
            if (this.initialized === true) {
                this.addData();
            }
        });
        this.data.channelMaxValues.subscribe(channelMaxValues => {
            this.channelMaxValues = channelMaxValues;
            if (this.initialized === true) {
                this.addData();
            }
        });
    }

    // Add/update labels to graph
    addLabels() {
        const channelAmount = this.returnAmountOfChannels();
        this.barChartLabels.length = 0;

        this.barChartLabels.push(
            this.chNames.ch1,
            this.chNames.ch2,
            this.chNames.ch3
        );
        if (channelAmount >= 4) {
            this.barChartLabels.push(this.chNames.ch4);
        }
        if (channelAmount === 5) {
            this.barChartLabels.push(this.chNames.ch5);
        }
    }

    // Add/update data the graph
    addData() {
        if (this.currentBrushId > 0) {
            // Do not draw graph if no brush is selected
            this.addLabels();
            this.isDataAvailable = true;
            this.barChartData = [];
            const br: Brush = this.brushes[this.currentBrushId - 1];
            const ch1Percent: number =
                (br.ch1 / this.channelMaxValues.ch1) * 100;
            const ch2Percent: number =
                (br.ch2 / this.channelMaxValues.ch2) * 100;
            const ch3Percent: number =
                (br.ch3 / this.channelMaxValues.ch3) * 100;
            const values: number[] = [ch1Percent, ch2Percent, ch3Percent];
            if (br.ch4 >= 0) {
                const ch4Percent: number =
                    (br.ch4 / this.channelMaxValues.ch4) * 100;
                values.push(ch4Percent);
            }
            if (br.ch5 >= 0) {
                const ch5Percent: number =
                    (br.ch5 / this.channelMaxValues.ch5) * 100;
                values.push(ch5Percent);
            }

            this.barChartData.push({
                data: values,
                label: 'BrushID: ' + this.currentBrushId,
            });

            // For Angular to recognize the change in the dataset!
            const clone = JSON.parse(JSON.stringify(this.barChartData));
            clone[0].data = values;
            clone[0].label = 'BrushID ' + this.currentBrushId;
            this.barChartData = clone;
        } else {
            this.isDataAvailable = false;
        }
    }

    returnAmountOfChannels() {
        let totalChannels = 0;
        if (this.brushes[0].ch3 >= 0) {
            totalChannels = 3;
        }
        if (this.brushes[0].ch4 >= 0) {
            totalChannels = 4;
        }
        if (this.brushes[0].ch5 >= 0) {
            totalChannels = 5;
        }
        return totalChannels;
    }
}
