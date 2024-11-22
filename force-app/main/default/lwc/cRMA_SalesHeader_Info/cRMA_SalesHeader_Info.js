import { LightningElement, api } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import tailwindcss from '@salesforce/resourceUrl/tailwindcss';


export default class CRMA_SalesHeader_Info extends LightningElement {

    @api title;
    @api results;

    get stringResults() {
        return JSON.stringify(this.results);
        //return JSON.stringify(this.results[0].Name);
    }

    constructor() {
        super();
        loadStyle(this, tailwindcss)
            .then(result => {
                console.log('loaded successfully' + tailwindcss);
                // Possibly do something when load is complete.
            })
            .catch(reason => {
                console.log(reason);
                // Checkout why it went wrong.
            }
            );

    }

}