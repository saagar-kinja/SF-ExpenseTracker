import { LightningElement, api } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import tailwindcss from '@salesforce/resourceUrl/tailwindcss';


export default class CRMA_UserProfile_Info extends LightningElement {

    @api title;
    @api results;

    get stringResults() {
        return JSON.stringify(this.results);
        //return JSON.stringify(this.results[0].Name);
    }

    get getName() {
        //return JSON.stringify(this.results)
        return this.results[0].Name;
    }

    get getTitle() {
        //return JSON.stringify(this.results)
        return this.results[0].Title;
    }
    
    get getEmail() {
        //return JSON.stringify(this.results)
        return this.results[0].Email;
    }

    get getPic() {
        //return JSON.stringify(this.results)
        return this.results[0].SmallPhotoUrl;
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