import { LightningElement, track, wire, api } from 'lwc';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import submitforApproval from '@salesforce/apex/Expense_Approval.submitforApproval';
import approveRecord from '@salesforce/apex/Expense_Approval.approveRecord';
import rejectRecord from '@salesforce/apex/Expense_Approval.rejectRecord';

import USERID from '@salesforce/user/Id'; // We receive 18 digit id
import STATUS from '@salesforce/schema/Expense_Request__c.Status__c';
import NAME from '@salesforce/schema/Expense_Request__c.Name';
import USERMANAGERID from '@salesforce/schema/Expense_Request__c.UserManagerID__c';

const FIELDS = [
    STATUS, NAME, USERMANAGERID
];

export default class Expense_Approval extends LightningElement {

    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    Expense_Request__c;

    get status() {
        return getFieldValue(this.Expense_Request__c.data, STATUS);
    }

    get isNew() {
        if (getFieldValue(this.Expense_Request__c.data, STATUS) == 'New')
            return true;
        return false;
    }

    get isRejected() {
        if (getFieldValue(this.Expense_Request__c.data, STATUS) == 'Rejected')
            return true;
        return false;
    }

    get isManagernSubmitted() {
        if (USERID && USERID.slice(0, 15) == getFieldValue(this.Expense_Request__c.data, USERMANAGERID) && getFieldValue(this.Expense_Request__c.data, STATUS) == 'Submitted')
            return true;
        return false;
    }

    handleSubmit() {

        /*updateRecord(recordInput) .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contact updated',
                            variant: 'success'
                        })
                    );
                    // Display fresh data in the form
                    return refreshApex(this.contact);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
        */
        submitforApproval({ expId: this.recordId }).then(result => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Expense request submitted for approval !',
                variant: 'success'
            }));
            location.reload();
        })
            .catch(error => {
                console.log(error);
            });
    }

    handleApproved() {
        approveRecord({ expId: this.recordId }).then(result => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Approved',
                message: 'Expense request approved !',
                variant: 'success'
            }));
            location.reload();
        })
            .catch(error => {
                console.log(error);
            });
    }

    handleRejected() {
        rejectRecord({ expId: this.recordId }).then(result => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Rejected',
                message: 'Expense request rejected !',
                variant: 'success'
            }));
            location.reload();
        })
            .catch(error => {
                console.log(error);
            });
    }

}