public with sharing class Expense_Request_Insert {
   
    @InvocableMethod(label='Create Expense Request' description='Creates a new Expense Request for Universal Containers. Requires Amount, Category, Date, and Details. Returns the new Record ID.' category='Expense_Request__c')
    public static List<Results> insertExpenseRequest(List<Requests> rqs){
        
        Decimal expsenseAmount; String expsenseCategory; Date expsenseDate; String expsenseDetails;
        Results rtn = new Results();
        
        try{

            for(Requests rq : rqs){
                expsenseAmount = Integer.valueOf(rq.expsenseAmount);
                expsenseCategory = rq.expsenseCategory;
                expsenseDate = rq.expsenseDate;
                expsenseDetails = rq.expsenseDetails;
            }

            Expense_Request__c ex = new Expense_Request__c();
            ex.Amount__c = expsenseAmount;
            ex.Category__c = expsenseCategory;
            ex.Date__c = expsenseDate;
            ex.Details__c = expsenseDetails;
            insert ex;

            rtn.result = 'success and here are the details: '+ex;

        }
        catch(exception e){
            rtn.result = 'failed, error details: '+e;
        }
        return new List<Results>{rtn} ;

    }

    public class Requests {
        @InvocableVariable(label='Expense_Request__c Amount' description='This is total Amount value of Expense Request' required=true)
        public Decimal expsenseAmount;
        @InvocableVariable(label='Expense_Request__c Category__c' description='This is category of Expense Request' required=true)
        public String expsenseCategory;
        @InvocableVariable(label='Expense_Request__c Date__c' description='This is Date__c of Expense Request' required=true)
        public Date expsenseDate;
        @InvocableVariable(label='Expense_Request__c Details__c' description='This is Details of Expense Request' required=true)
        public String expsenseDetails;
    }

    public class Results {
        @InvocableVariable(label='Status of submission' description='This contains result of submission. It includes, if submission was successful or a failure.' required=true)
        public String result;
    }
    

}