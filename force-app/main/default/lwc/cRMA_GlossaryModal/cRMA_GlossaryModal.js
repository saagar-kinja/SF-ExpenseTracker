import { LightningElement, api, track } from 'lwc';

export default class CRMA_GlossaryModal extends LightningElement {

    @api title;
    @api btntitle;

    @track isShowModal = false;

    renderedCallback() {
        if (!this.title) this.title = 'Glossary';
        if (!this.btntitle) this.btntitle = 'Open Glossary';
    }

    showModalBox() {
        this.isShowModal = true;
    }

    hideModalBox() {
        this.isShowModal = false;
    }
}