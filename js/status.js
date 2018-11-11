var INVALID = "invalid";
var NOVICE = "nov";
var PRO = "pro";
var PRO_INELIG = "proi";

function easters_status(form_responses) {
    var status_obj = {
        "deb_status": INVALID,
        "message": "Could not determine your status.",
        "reasons": []
    }
    var worlds_deb = form_responses['worlds_deb'];
    var australs_deb = form_responses['australs_deb'];
    var easters_deb = form_responses['easters_deb'];

    if (worlds_deb === null || australs_deb === null || easters_deb == null) {
        status_obj.deb_status = INVALID;
        status_obj.message = "You have not yet given enough information to determine your status.";
        return status_obj
    }
    if (easters_deb == "more" || australs_deb == "more") {
        status_obj.status = PRO_INELIG;
        status_obj.message = "You are a pro. Due to your previous debates:";
        var TOO_MANY_EASTERS = "You are ineligible to debate at Easters, having participated too many times.";
        if (easters_deb == "more") status_obj.reasons.push(TOO_MANY_EASTERS);
        var TOO_MANY_AUSTRALS = "You are ineligible to debate at Australs, having participated too many times.";
        if (australs_deb == "more") status_obj.reasons.push(TOO_MANY_AUSTRALS);
        return status_obj
    }

    // assume novice
    status_obj.deb_status = NOVICE;
    if (worlds_deb != "never"){
        status_obj.deb_status = PRO;
        status_obj.reasons.push("You have previously debated at Worlds.");
    }
    if (australs_deb != "never"){
        status_obj.deb_status = PRO;
        status_obj.reasons.push("You have previously debated at Australs.");
    }
    if (["secondtothird", "more"].includes(easters_deb)){
        status_obj.deb_status = PRO;
        status_obj.reasons.push("You have debated more than twice at Easters.");
    }
   
    if (status_obj.deb_status === NOVICE){
        status_obj.message = "You are a novice.";
    }
    if (status_obj.deb_status === PRO){
        status_obj.message = "You are a pro. This is because: ";
    }

    return status_obj;
}

function womens_status(form_responses) {
    var status_obj = {
        "deb_status": INVALID,
        "message": "Could not determine your status.",
        "reasons": []
    }
    var worlds_deb = form_responses['worlds_deb'];
    var australs_deb = form_responses['australs_deb'];
    var easters_deb = form_responses['easters_deb'];
    var null_deb = worlds_deb === null || australs_deb === null || easters_deb == null;
    
    var australs_suc = form_responses['australs_suc'];
    var worlds_suc = form_responses['worlds_suc'];
    var null_suc = australs_suc === null || worlds_suc == null;
    if (null_deb === true || null_suc === true) {
        status_obj.deb_status = INVALID;
        status_obj.message = "You have not yet given enough information to determine your status.";
        return status_obj
    }

    // assume novice
    status_obj.deb_status = NOVICE;
    if (australs_suc === "broke" || ! ["never", "first"].includes(australs_deb)){
        status_obj.deb_status = PRO;
        if (australs_suc === "broke") status_obj.reasons.push("You made octo-finals at Australs.")
        else status_obj.reasons.push("You have debated more than once at Australs")
    }
    if (worlds_suc === "broke" || ! ["never", "first"].includes(worlds_deb)){
        status_obj.deb_status = PRO;
        if (australs_suc === "broke") status_obj.reasons.push("You made octo-finals at Worlds.")
        else status_obj.reasons.push("You have debated more than once at Worlds.")
    }
   
    if (status_obj.deb_status === NOVICE){
        status_obj.message = "You are a novice.";
    }
    if (status_obj.deb_status === PRO){
        status_obj.message = "You are a pro. This is because: ";
    }

    return status_obj;
}



function get_form_responses(){
    var form_elems = [
        'easters_deb', 
        'easters_suc', 
        'australs_deb', 
        'australs_suc', 
        'worlds_deb', 
        'worlds_suc'
    ];
    var response = {};
    for (i = 0; i < form_elems.length; i++){
        var elem = document.querySelector('input[name='+form_elems[i]+']:checked');
        if (elem !== null) response[form_elems[i]] = elem.id;
        else response[form_elems[i]] = null;
    }
    return response;
}

function update_answers(){
    var status_classes = {};
    status_classes[INVALID] = "grey darken-2";
    status_classes[NOVICE] = "green darken-2";
    status_classes[PRO] = "amber darken-4";
    status_classes[PRO_INELIG] = "deep-orange darken-2";
    var form_responses = get_form_responses();

    var easters_card = document.querySelector('#easters_status');
    var easters_answers = easters_status(form_responses);

    easters_card.className = "card " + status_classes[easters_answers.deb_status];

    var easters_content = easters_card.getElementsByTagName("div")[0];
    easters_content.innerHTML = '<span class="card-title">Easters Status</span>'
    easters_content.innerHTML += "<p>"+easters_answers.message+"</p>"
    if (easters_answers.reasons.length){
        easters_content.innerHTML += "<ul>"
        for (i = 0; i < easters_answers.reasons.length; i++){
            easters_content.innerHTML += "<li>"+easters_answers.reasons[i]+"</li>";
        }
        easters_content.innerHTML += "</ul>"
    }


    var womens_card = document.querySelector('#womens_status');
    var womens_answers = womens_status(form_responses);

    womens_card.className = "card " + status_classes[womens_answers.deb_status];

    var womens_content = womens_card.getElementsByTagName("div")[0];
    womens_content.innerHTML = '<span class="card-title">Womens Status</span>'
    womens_content.innerHTML += "<p>"+womens_answers.message+"</p>"
    if (womens_answers.reasons.length){
        womens_content.innerHTML += "<ul>"
        for (i = 0; i < womens_answers.reasons.length; i++){
            womens_content.innerHTML += "<li>"+womens_answers.reasons[i]+"</li>";
        }
        womens_content.innerHTML += "</ul>"
    }



}
