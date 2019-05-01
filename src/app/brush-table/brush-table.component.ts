import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Brush, ChannelNames, ChannelMaxValues } from '../brush';
import { PagerService, BrushService, ViewService } from '../_services/index';

@Component({
    selector: 'app-brush-table',
    templateUrl: './brush-table.component.html',
    styleUrls: ['./brush-table.component.scss'],
})
export class BrushTableComponent implements OnInit {
    // Class variables
    private brushes: Brush[];
    private channelNames: ChannelNames;
    private initialized = false;
    private channelMaxValues: ChannelMaxValues;
    private currentChannelMaxValue: number;
    private currentBrushId: number; // Need this when moving to a page where the active row is
    private currentChannel: string;

    // Pagination
    private currentPage = 1;
    private pager: any = {};
    private pagedItems: Brush[];

    // Input validation
    private inputError = false;

    constructor(
        private cookieService: CookieService,
        private data: BrushService,
        private pagerService: PagerService
    ) {}

    ngOnInit() {
        this.data.currentBrush.subscribe(brushes => {
            this.brushes = brushes;

            if (this.initialized === true) {
                // Page is fully initialized
                this.setPage(this.currentPage);
            }
        });

        this.data.channelNames.subscribe(chNames => {
            this.channelNames = chNames;
            if (this.initialized === true) {
                // Page is fully initialized
                this.addChannelCookie();
            }
            this.initialized = true;
        });

        this.data.channelMaxValues.subscribe(channelMaxValues => {
            this.channelMaxValues = channelMaxValues;
        });

        // Check if a cookie named chNames exist
        if (this.cookieService.check('chNames')) {
            this.data.changeChannelName(
                JSON.parse(this.cookieService.get('chNames'))
            );
        }

        if (this.cookieService.check('channelMaxValues')) {
            const cookieValue = JSON.parse(
                this.cookieService.get('channelMaxValues')
            );
            console.log(
                'Updating channelMaxValues cookie: ' +
                    this.cookieService.get('channelMaxValues')
            );
            this.data.updateChannelMaxValue(cookieValue);
        }
    }

    inputValidation(brushId: number, channel): boolean {
        // Update the current max value to current channel
        for (const obj in this.channelMaxValues) {
            if (obj.toString() === channel) {
                this.currentChannelMaxValue = this.channelMaxValues[obj];
            }
        }

        const brush = this.brushes[brushId - 1];
        for (const channelX in brush) {
            // Loops through channel names in current brush object
            if (channelX.toString() === channel) {
                if (brush[channelX] > this.channelMaxValues[channelX]) {
                    this.inputError = true;
                } else if (brush[channelX] === null || brush[channelX] < 0) {
                    brush[channelX] = '';
                }

                while (brush[channelX] > this.channelMaxValues[channelX]) {
                    // Reduce by 10 until demand is met
                    brush[channelX] = Math.floor(brush[channelX] / 10);
                    if (brush[channelX] <= this.channelMaxValues[channelX]) {
                        return;
                    }
                }
            }
        }
        this.updateBrushObject();
        this.inputError = false;
    }

    updateBrushObject() {
        this.data.changeBrush(this.brushes);
    }

    setPage(page: number) {
        this.currentPage = page;
        // Get pager object from service
        this.pager = this.pagerService.getPager(this.brushes.length, page);

        // Get current page of items
        this.pagedItems = this.brushes.slice(
            this.pager.startIndex,
            this.pager.endIndex + 1
        );
    }

    markRow(rowId: number) {
        this.currentBrushId = rowId;
        this.data.changeCurrentBrushID(rowId);
        const colorClass = 'table-primary';

        let index = 10 * (this.currentPage - 1) + 1; // Current first row index
        const indexEnd = index + this.pagedItems.length - 1; // Last index for current page

        // Clear color of all inactive rows
        for (index; index <= indexEnd; index++) {
            document
                .getElementById(index.toString())
                .classList.remove(colorClass);
        }

        // Setting color of the active row
        document.getElementById(rowId.toString()).classList.add(colorClass);
    }

    changeChannelValue(channelId: number) {
        const newChannelName = (<HTMLInputElement>(
            document.getElementById('channelName' + channelId)
        )).value;

        for (const oldName in this.channelNames) {
            if (oldName === 'ch' + channelId.toString()) {
                this.channelNames[oldName] = newChannelName;
            }
        }
        this.data.changeChannelName(this.channelNames);
    }

    // Add/customize a cookie containing users channelnames
    addChannelCookie() {
        const jsonChannelNames = JSON.stringify(this.channelNames);
        this.cookieService.set('chNames', jsonChannelNames, 365); // Expires after 1 year
    }

    deleteRow(brushId: number) {
        const brush = this.brushes[brushId - 1];
        for (const obj in brush) {
            // Loops through channel names in brush
            if (obj.toString() === 'desc') {
                brush[obj] = '';
            } else if (obj.toString() !== 'brushId') {
                if (!isNaN(+brush[obj])) {
                    brush[obj] = 0;
                }
            }
        }
        this.updateBrushObject();
    }

    isNumber(n: any) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}
