import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { COMMON_CONSTANT } from '../constants/commonConstants'
import { HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
    quoteObj: any = {
        policyMax: '',
        age: '',
        startDate: '',
        endDate: '',
        citizenShip: '',
        mailingState: ''
    };
    quoteList:any;
    step = {
        value: 1
    };
    err_msg = '';
    filter_list = COMMON_CONSTANT.FILTER_OBJ;
    policies = COMMON_CONSTANT.POLICIES_LIST;
    url = COMMON_CONSTANT.URL;
    filter_obj: any = {
        bestSeller: 'All',
        policy_max: 'All',
        type: 'All',
        section: 'All'
    };
    sortIsOpen = false;
    filterIsOpen = true;
    listIsOpen = true;
    gridIsOpen = false;
    sortList = COMMON_CONSTANT.SORT_LIST;
    currentSort:any = {};
    currentSelectPlans:any = [];

    quoteSortByName = [];
    quoteSortByPriceLowToHigh = [];
    quoteSortByPriceHighToLow = [];

    isModalOpen = false;

    ngOnInit() {
        this.currentSort = this.sortList[0];
    }

    constructor(private http: HttpClient, private changeDetector: ChangeDetectorRef) {

    }

    searchInsurance() {
        this.err_msg = '';
        if(this.isValidInput()) {
            let obj = this.http.post(this.url, this.quoteObj);
            let reqObj = this.http.get(this.url);
            let _this = this;
            obj.subscribe({
                next(response:any) {
                    /* get insurance list */
                    reqObj.subscribe({
                        next(response:any) {
                            if(response.quotes) {
                                _this.quoteList = response.quotes;
                                /* init 3 sorts type for reuse */
                                _this.quoteSortByName = _this.sortByName([..._this.quoteList]);
                                _this.quoteSortByPriceLowToHigh = _this.sortByPriceLowToHigh([..._this.quoteList]);
                                _this.quoteSortByPriceHighToLow = _this.sortByPriceHighToLow([..._this.quoteList]);
                                _this.sortQuote(_this.currentSort);
                                _this.step.value = 2;
                            }
                        }, error(err) {
                            _this.err_msg = 'Something wrong with server, please try again later';
                        }
                    })
                }, error(err) {
                    _this.err_msg = 'Something wrong with server, please try again later';
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
        } else if (!this.quoteObj.startDate || !(new Date(this.quoteObj.startDate))) {
            this.err_msg = 'Please enter a valid start date';
            return false;
        } else if (!this.quoteObj.endDate || !(new Date(this.quoteObj.endDate))) {
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

    triggerDropdown(type) {
        if(type === 'sort') {
            this.sortIsOpen = !this.sortIsOpen;
        } else {
            this.filterIsOpen = !this.filterIsOpen;
        }
    }

    changeSort(obj) {
        this.currentSort = obj;
        setTimeout(() => {
            this.sortQuote(obj);
            this.sortIsOpen = false;
        }, 300);

    }

    selectPlan(plan) {
        if(!plan.isDisabled) {
            /* add to compare list */
            if(this.currentSelectPlans.length < 4) {
                plan.isDisabled = true;
                this.currentSelectPlans.push(plan);
            }
        } else if(plan.isDisabled){
            /* remove from compare list*/
            plan.isDisabled = false;
            this.currentSelectPlans = this.currentSelectPlans.filter(item => {
                return item.id !== plan.id;
            });
        }
    }

    setView(type) {
        if(type === 'list') {
            this.gridIsOpen = false;
            this.listIsOpen = true;
        } else {
            this.listIsOpen = false;
            this.gridIsOpen = true;
        }
    }

    sortQuote(type) {
        if (type.value === 'Name') {
            this.quoteList = this.quoteSortByName;
        } else if (type.value === 'LowToHigh') {
            this.quoteList = this.quoteSortByPriceLowToHigh;
        } else if (type.value === 'HighToLow') {
            this.quoteList = this.quoteSortByPriceHighToLow;
        }
        this.changeDetector.markForCheck();
    }

    openCompareModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    sortByName(obj) {
        return obj.sort((obj1, obj2) => (obj1.name > obj2.name)? 1: -1);
    }

    sortByPriceLowToHigh(obj) {
        return obj.sort((obj1, obj2) => (obj1.price > obj2.price)? 1: -1);
    }

    sortByPriceHighToLow(obj) {
        return obj.sort((obj1, obj2) => (obj1.price < obj2.price)? 1: -1);
    }

}
