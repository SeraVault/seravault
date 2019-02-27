import './password_modal.html';

generateRandomPassword = function(length, AlphaLower, AlphaUpper, Num, HypenDashUnderscore, Special, Ambiguous) {
    length = typeof length !== 'undefined' ? length : 8;
    AlphaLower = typeof AlphaLower !== 'undefined' ? AlphaLower : true;
    AlphaUpper = typeof AlphaUpper !== 'undefined' ? AlphaUpper : true;
    Num = typeof Num !== 'undefined' ? Num : true;
    HypenDashUnderscore = typeof HypenDashUnderscore !== 'undefined' ? HypenDashUnderscore : false;
    Special = typeof Special !== 'undefined' ? Special : false;
    Ambiguous = typeof Ambiguous !== 'undefined' ? Ambiguous : false;
    var password = '';
    var chars = '';
    if (AlphaLower) chars += 'abcdefghjkmnpqrstuvwxyz';
    if (AlphaUpper) chars += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (Num) chars += '23456789';
    if (HypenDashUnderscore) chars += '-_';
    if (Special) chars += '~!@#$%^&*()=+[]{};:,.<>/?';
    if (AlphaLower && Ambiguous) chars += 'iol';
    if (AlphaLower && Ambiguous) chars += 'IO';
    if (Num && Ambiguous) chars += '01';
    if (!AlphaLower && !Num && Ambiguous) chars += 'iolIO01';
    if (chars == '') return window.lang.convert('Please make at least one selection');
    var list = chars.split('');
    var len = list.length, i = 0;
    do {
        i++;
        var index = Math.floor(Math.random() * len);
        password += list[index];
    } while(i < length);
    return password;
};

Template.svPasswordModal.onRendered(function() {    
    new Clipboard('#go');
})

Template.svPasswordModal.events({
    'click #generate': function(e) {
        e.preventDefault();
        var pwd = generateRandomPassword(
            $("#length_chars_select").val(),
            $("#alphalower_chars_checkbox").is(":checked"),
            $("#alphaupper_chars_checkbox").is(":checked"),
            $("#num_chars_checkbox").is(":checked"),
            $("#hyphen_dash_underscore").is(":checked"),
            $("#special_chars_checkbox").is(":checked"),
            $("#ambiguous_chars_checkbox").is(":checked")
        );

        /*console.log ($("#length_chars_select").val());
        console.log ($("#alphalower_chars_checkbox").is(":checked"));
        console.log ($("#alphaupper_chars_checkbox").is(":checked"));
        console.log ($("#num_chars_checkbox").is(":checked"));
        console.log ($("#hyphen_dash_underscore").is(":checked"));
        console.log ($("#special_chars_checkbox").is(":checked"));
        console.log ($("#ambiguous_chars_checkbox").is(":checked"));*/

        $('#password').text(pwd);
        Session.set('pwd', pwd);
        $("#go").prop("disabled",false);        
        $("#go").attr("data-clipboard-text", pwd);
        $("#go").attr("data-clipboard-action", 'copy')
    },
    'click #go': function() {
        $('#svPassword').val(Session.get('pwd'));
        Session.set('pwd', null);
        Modal.hide('svPasswordModal');
    }
})
