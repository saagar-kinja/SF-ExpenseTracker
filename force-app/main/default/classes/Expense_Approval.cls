public class Expense_Approval {
    
    
    @InvocableMethod(label='Submit Expense Request For Approval' description='This accepts record id of a Expense Request and submits it for approval. And return result of the submission. ' category='Expense_Request__c')
    public static List<Results> submitforApproval(List<Requests> rqs){

        String expId;
        
        for(Requests rq : rqs)
            expId = rq.expId;

        Results rtn = new Results();
        try{
            changeExpenseStatus(expId, 'Submitted');
            Approval.ProcessSubmitRequest req1 = new Approval.ProcessSubmitRequest();
            req1.setComments('Submitting request for approval.');
            req1.setObjectId(expId);
            req1.setSubmitterId(UserInfo.getUserId()); 
            Approval.ProcessResult result = Approval.process(req1);
            rtn.result = 'success';
        }
        catch(exception e){
            rtn.result = 'failed, error details'+e;
        }
        return new List<Results>{rtn} ;
        
    }

    public class Requests {
        @InvocableVariable(label='Expense_Request__c RecordID' description='This is the recordID of Expense_Request__c record.' required=true)
        public String expId;
    }

    public class Results {
        @InvocableVariable(label='Status of submission' description='This contains result of submission. It includes, if submission was successful or a failure.' required=true)
        public String result;
    }

    
    @AuraEnabled 
    public static rtnResult submitforApproval(id expId){
        rtnResult rtn = new rtnResult();
        system.debug('## expId : '+expId);
        try{
            changeExpenseStatus(expId, 'Submitted');
            // Create an approval request for the account
            Approval.ProcessSubmitRequest req1 = new Approval.ProcessSubmitRequest();
            req1.setComments('Submitting request for approval.');
            req1.setObjectId(expId);
            // Submit on behalf of a specific submitter
            req1.setSubmitterId(UserInfo.getUserId()); 
            // Submit the approval request for the account
            Approval.ProcessResult result = Approval.process(req1);
            rtn.ifSuccess = true ; rtn.details = 'success';
        }
        catch(exception e){
            rtn.ifSuccess = false ; rtn.details = e+'';
        }
        return rtn ;
        
    }
    
    /*
* This method will Approve the Expense
*/
    @AuraEnabled
    public static rtnResult approveRecord(id expId)    {
        
        rtnResult rtn = new rtnResult();
        
        try{
            changeExpenseStatus(expId, 'Approved');
            Approval.ProcessWorkitemRequest req = new Approval.ProcessWorkitemRequest();
            req.setComments('Request is approved');
            req.setAction('Approve');
            Id workItemId = getWorkItemId(expId); 
            req.setWorkitemId(workItemId);
            Approval.ProcessResult result =  Approval.process(req);
            rtn.ifSuccess = true ; rtn.details = 'success';
        }
        catch(exception e){
            rtn.ifSuccess = false ; rtn.details = e+'';
        }
        return rtn ;
        
    }
    
    /*
* This method will Reject the Expense
*/
    @AuraEnabled
    public static rtnResult rejectRecord(id expId) {
        
        rtnResult rtn = new rtnResult();
        
        try{
            changeExpenseStatus(expId, 'Rejected');
            Approval.ProcessWorkitemRequest req = new Approval.ProcessWorkitemRequest();
            req.setComments(' Request is rejected');
            req.setAction('Reject');
            Id workItemId = getWorkItemId(expId); 
            req.setWorkitemId(workItemId);
            Approval.ProcessResult result =  Approval.process(req);
            rtn.ifSuccess = true ; rtn.details = 'success';
        }
        catch(exception e){
            rtn.ifSuccess = false ; rtn.details = e+'';
        }
        return rtn ;
        
    }
    
    /*
* This method return workItemID
*/
    public static Id getWorkItemId(Id targetObjectId) {
        
        Id retVal = null;
        for(ProcessInstanceWorkitem workItem  : [Select p.Id from ProcessInstanceWorkitem p where p.ProcessInstance.TargetObjectId =: targetObjectId])
            retVal  =  workItem.Id;
        return retVal;
    }
    
    /*
* To change the expense status
*/
    public static void changeExpenseStatus(id expId, string status){
        Expense_Request__c exp = new Expense_Request__c();
        exp.id = expId;
        exp.status__c = status;
        update exp;
    }
    
    public class rtnResult{
        @AuraEnabled public Boolean ifSuccess;
        @AuraEnabled public String details ;
    }
    
}