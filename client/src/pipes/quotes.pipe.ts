import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'quotesPipe',
    pure: false
})
export class QuotesPipe implements PipeTransform {

    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }

        return items.filter(item => isMatchBestSeller(item, filter) &&
                                              isMatchPolicyMax(item, filter) &&
                                              isMatchType(item, filter) &&
                                              isMatchSection(item, filter));

        function isMatchBestSeller(item, filter) {
            if ((filter.bestSeller === 'Yes' && item.bestSellers) ||
                (filter.bestSeller === 'No' && !item.bestSellers) ||
                (filter.bestSeller === 'All')) {
                return true;
            }
            return false;
        }

        function isMatchPolicyMax(item, filter) {
            if((filter.policy_max === 'All') ||
                (filter.policy_max === '100' && item.price <= 100) ||
                (filter.policy_max === '200' && item.price <= 200) ||
                (filter.policy_max === '300' && item.price <= 300)) {
                return true;
            }
            return false;
        }

        function isMatchType(item, filter) {
            if((filter.type === 'All') ||
                (filter.type === 'Comprehensive' && item.type === 'Comprehensive') ||
                (filter.type === 'Fixed' && item.type === 'Fixed')) {
                return true;
            }
            return false;
        }

        function isMatchSection(item, filter) {
            if((filter.section === 'All') ||
                (filter.section === 'Travel' && item.section.includes('Travel')) ||
                (filter.section === 'Medical' && item.section.includes('Medical')) ||
                (filter.section === 'J1' && item.section.includes('J1')) ||
                (filter.section === 'International' && item.section.includes('International'))) {
                return true;
            }
            return false;
        }



    }

}