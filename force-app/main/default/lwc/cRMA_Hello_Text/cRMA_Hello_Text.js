import { LightningElement, api } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import tailwindcss from '@salesforce/resourceUrl/tailwindcss';

export default class CRMA_Hello_Text extends LightningElement {
    @api title;
    @api showDescription;

    constructor() {
        super();
        /*loadStyle(this, tailwindcss)
            .then(result => {
                console.log('loaded successfully'+tailwindcss);
                // Possibly do something when load is complete.
            })
            .catch(reason => {
                console.log(reason);
                // Checkout why it went wrong.
            }
        );*/

    }
}