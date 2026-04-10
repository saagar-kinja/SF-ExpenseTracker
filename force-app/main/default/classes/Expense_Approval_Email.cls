public with sharing class Expense_Approval_Email {

    @InvocableMethod(label='Email Expense Approver' description='Sends an email notification to the manager alerting them of a pending Expense Request. Requires the managers email and a message body.' category='Expense_Request__c')
    public static List<Results> sendEmailForApproval(List<Requests> rqs){
        
        String Email; String Body;
        Results rtn = new Results();

        try{

            for(Requests rq : rqs){
                Email = rq.emailId;
                Body = rq.emailMsg;
            }

            Expense_Approval_Email em = new Expense_Approval_Email();
            em.sendMail(Email, 'Expense Request Approval Request', Body);
            rtn.result = 'success';

        }
        catch(exception e){
            rtn.result = 'failed, error details: '+e;
        }
        return new List<Results>{rtn} ;
    }

    public class Requests {
        @InvocableVariable(label='Expense_Request__c approver Email ID' description='This is the email ID of approver to which email will be send.' required=true)
        public String emailId;
        @InvocableVariable(label='Expense_Request__c Message Details' description='This is the message details which will added to body of email.' required=true)
        public String emailMsg;
    }

    public void sendMail(String address, String subject, String body) {
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {address};
        mail.setToAddresses(toAddresses);
        mail.setSubject(subject);
        mail.setPlainTextBody(body);
        Messaging.SendEmailResult[] results = Messaging.sendEmail(
                                new Messaging.SingleEmailMessage[] { mail });
        inspectResults(results);
    }

    private static Boolean inspectResults(Messaging.SendEmailResult[] results) {
        Boolean sendResult = true;

        for (Messaging.SendEmailResult res : results) {
            if (res.isSuccess()) {
                System.debug('Email sent successfully');
            }
            else {
                sendResult = false;
                System.debug('The following errors occurred: ' + res.getErrors());                 
            }
        }
        return sendResult;
    }

    
    public class Results {
        @InvocableVariable(label='Status of submission' description='This contains result of submission. It includes, if submission was successful or a failure.' required=true)
        public String result;
    }
    

}