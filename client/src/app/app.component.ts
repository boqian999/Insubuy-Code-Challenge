import { Component } from '@angular/core';
import { COMMON_CONSTANT } from '../constants/commonConstants'
import { HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {

    constructor(private http: HttpClient) {

    }

    quoteObj: any = {
        policyMax: '',
        age: '',
        startDate: '',
        endDate: '',
        citizenShip: '',
        mailingState: ''
    };
    quoteList = [];
    step = {
        value: 1
    };
    err_msg = '';
    policies = COMMON_CONSTANT.POLICIES_LIST;
    url = COMMON_CONSTANT.URL;

    searchInsurance() {
        this.err_msg = '';
        if(this.isValidInput()) {
            let obj = this.http.post(this.url, this.quoteObj);
            let reqObj = this.http.get(this.url);
            let quoteList = this.quoteList;
            let step = this.step;
            obj.subscribe({
                next(response) {
                    /* get insurance list */
                    reqObj.subscribe({
                        next(response) {
                            quoteList = response;
                            step.value = 2;
                        }, error(err) {
                            this.err_msg = 'Something wrong with server, please try again later';
                        }
                    })
                }, error(err) {
                    this.err_msg = 'Something wrong with server, please try again later';
                }
            })
        }
    }

    reset() {
        this.err_msg = '';
        this.quoteObj = {
            policyMax: '',
            age: '',
            startDate: '',
            endDate: '',
            citizenShip: '',
            mailingState: ''
        };
    }

    allowClear = true; // Debounce
    clearErrMsg() {
        if(this.allowClear) {
            this.allowClear = false;
            this.err_msg = '';
            setTimeout(() => {
                this.allowClear = true;
            }, 3000)
        }
    }

    isValidInput() {
        if(this.quoteObj.policyMax === '') {
            this.err_msg = 'Please choose policy maximum';
            return false;
        } else if (!this.quoteObj.startDate || new Date(this.quoteObj.startDate) === 'Invalid Date') {
            this.err_msg = 'Please enter a valid start date';
            return false;
        } else if (!this.quoteObj.endDate || new Date(this.quoteObj.endDate) === 'Invalid Date') {
            this.err_msg = 'Please enter a valid end date';
            return false;
        } else if (new Date(this.quoteObj.startDate) >= new Date(this.quoteObj.endDate)) {
            this.err_msg = 'The end date should be after the start date';
            return false;
        } else if (!+(this.quoteObj.age) || +(this.quoteObj.age) > 100 || +(this.quoteObj.age) < 1) {
            this.err_msg = 'Please enter a valid age between 1 and 100';
            return false;
        } else if (!this.quoteObj.citizenShip || !COMMON_CONSTANT.LETTER_FORMAT.test(this.quoteObj.citizenShip)) {
            this.err_msg = 'Please enter a valid citizenship name, i.e., United States';
            return false;
        } else if (!this.quoteObj.mailingState || !COMMON_CONSTANT.LETTER_FORMAT.test(this.quoteObj.mailingState)) {
            this.err_msg = 'Please enter a valid state name, i.e., IL or Illinois';
            return false;
        }

        return true;
    }

}
