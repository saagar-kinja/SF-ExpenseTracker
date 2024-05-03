public with sharing class Expense_Request_Approved {
   
    @InvocableMethod(label='Approve the Expense Request' description='This accepts record id of a Expense Request and approve the expense request. And return result of the approval. ' category='Expense_Request__c')
    public static List<Results> approveExpenseRequest(List<Requests> rqs){

        String expId;
        Results rtn = new Results();
     
        try{

            for(Requests rq : rqs)
                expId = rq.expId;
           
            Expense_Request__c exp = [select id,Approver_ID__c from Expense_Request__c where id=:expId];
           
            if(UserInfo.getUserId()==exp.Approver_ID__c){
                changeExpenseStatus(expId, 'Approved');
                Approval.ProcessWorkitemRequest req = new Approval.ProcessWorkitemRequest();
                req.setComments('Request is approved');
                req.setAction('Approve');
                Id workItemId = getWorkItemId(expId); 
                req.setWorkitemId(workItemId);
                Approval.ProcessResult result =  Approval.process(req);
                rtn.result = 'success';
            }
            else 
                rtn.result = 'Failed, User is not authorised approver.';
        }
        catch(exception e){
            rtn.result = 'failed, error details: '+e;
        }
        return new List<Results>{rtn} ;
        
    }

    public class Requests {
        @InvocableVariable(label='Expense_Request__c RecordID' description='This is the recordID of Expense_Request__c record.' required=true)
        public String expId;
    }

    public class Results {
        @InvocableVariable(label='Status of approval' description='This contains result of approval. It includes, if approval was successful or a failure.' required=true)
        public String result;
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