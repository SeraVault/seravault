import './global-message.html';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

Template.App_global_message.onRendered(function() {
    //warn folks using broken browsers
    /*if (isEdge || isIE ) {        
        var modalData = {
            modalIcon: 'mdi-info',
            modalButton: 'btn-danger',
            modalAction: "",
            modalActionTarget: TAPi18n.__('browserWontWork'),
            modalMessage: TAPi18n.__("browserBroken"),
            modalMessageTarget: "",
            modalYesButtonText: TAPi18n.__("Ok"),  
            modalShowCancelButton: false          
          };
        Modal.show('App_generic_modal', modalData);
    }*/
});