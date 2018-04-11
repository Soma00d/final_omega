$(document).ready(function () {
    var userInfo = {};
    var allUser = {};
    var allLogs = {};
    var allSerial = {};
    var arrayAllUser = $(".adm_all_user_container .array_all_user");
    var arrayAllLogs = $(".adm_logs_container .array_all_logs");
    var arrayAllSerial = $(".adm_serial_container .array_all_sn");
    
    var contentArrayAllUser = $(".adm_all_user_container .array_all_user .content_array_user");
    var contentArrayAlllogs = $(".adm_logs_container .array_all_logs .content_array_logs");
    var contentArrayAllSerial = $(".adm_serial_container .array_all_sn .content_array_sn");
    
    var contentArrayDicoButton = $(".adm_dictionary_container .dictionary_type_listing.bouton-type .content_new_dico");
    var contentArrayDicoJoystick = $(".adm_dictionary_container .dictionary_type_listing.joystick-type .content_new_dico");
    var contentArrayDicoDisplay = $(".adm_dictionary_container .dictionary_type_listing.display-type .content_new_dico");
    
    var contentArrayDicoButtonShow = $(".adm_show_dictionary_container .dictionary_type_listing.bouton-type .content_new_dico");
    var contentArrayDicoJoystickShow = $(".adm_show_dictionary_container .dictionary_type_listing.joystick-type .content_new_dico");
    var contentArrayDicoDisplayShow = $(".adm_show_dictionary_container .dictionary_type_listing.display-type .content_new_dico");
    
    var updateUserBox = $(".adm_all_user_container .overlay_udpdate .update_user_box");
    var createUserBox = $(".adm_all_user_container .overlay_create .create_user_box");
    var UIsoftVersion = "1.2.5";
    
    console.log("welcome admin");
    
    
    //============================================================================//
    //                              LOGIN ADMIN                                   //
    //============================================================================//
    
    //gestion du background login admin
    var height = $( window ).height();
    $(".overlay_admin_login").css("height",height+"px");    
    $( window ).resize(function() {
        var height = $( window ).height();
        $(".overlay_admin_login").css("height",height+"px");
    });
    
    //envoi du formulaire d'authentification
    $("#sub_bt").on('click', function () {
        var user_sso = $("input#username_admin").val();

        if (user_sso !== "") {
            $.ajax({
                url: '../php/api.php?function=check_user_sso&param1=' + user_sso,
                type: 'GET',
                dataType: 'JSON',
                success: function (data, statut) {
                    userInfo = data;
                    if (userInfo.length == 0) {
                        alert("No result found with this SSO : " + user_sso);
                    } else if (userInfo[0].user_is_admin == 1) {
                        $("#main_admin_content").removeClass("hidden");
                        $(".overlay_admin_login").addClass("hidden");
                        $(".authenticate_admin input").val("");
                        $(".sso_user").html(user_sso);
                        $(".head_userinfo").removeClass("hidden");
                        $(".head_userinfo .info .role_user").html(userInfo[0].user_name + " - " + userInfo[0].user_description);
                    } else {
                        alert("This user does not have access rights for this section.");
                        $("#main_admin_content").addClass("hidden");
                        $(".head_userinfo").addClass("hidden");
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Error while trying to access database.");
                    $("#main_admin_content").addClass("hidden");
                    $(".head_userinfo").addClass("hidden");
                }
            });

        } else {
            alert("Some fields are missing");
            $("#content_homeE .information").addClass("hidden");
            $(".head_userinfo").addClass("hidden");
        }
    });
    

    //============================================================================//
    //                              MENU                                          //
    //============================================================================//

    //gestion des liens du menu et de l'ouverture des panels
    $(".menu_item").on('click', function () {
        var link = $(this).data('menulink');
        if (link !== "") {
            $(".page_content.active").removeClass("active");
            setTimeout(function () {
                $(document).find("#adm_content_" + link).addClass("active");
            }, 100);
        }
    });
    
    //gestion du menu déroulant
    $(function () {
        var Accordion = function (el, multiple) {
            this.el = el || {};
            // more then one submenu open?
            this.multiple = multiple || false;

            var dropdownlink = this.el.find('.dropdownlink');
            dropdownlink.on('click',
                    {el: this.el, multiple: this.multiple},
                    this.dropdown);
        };

        Accordion.prototype.dropdown = function (e) {
            var $el = e.data.el,
                    $this = $(this),
                    //this is the ul.submenuItems
                    $next = $this.next();

            $next.slideToggle();
            $this.parent().toggleClass('open');

            if (!e.data.multiple) {
                //show only one menu at the same time
                $el.find('.submenuItems').not($next).slideUp().parent().removeClass('open');
            }
        }

        var accordion = new Accordion($('.accordion-menu'), false);
    });

    
    //============================================================================//
    //                              USERS ADMIN                                   //
    //============================================================================//
    
    //recupération de la table users
    function getAllUser(){
        $.ajax({
            url: '../php/api.php?function=get_all_user',
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                allUser = data;   
                fillUserTable(allUser);
            }
        });
    };
    //remplissage du tableau html et génération json pour export excel
    function fillUserTable(allUser){
        var userLength = allUser.length;
        if(userLength > 0){
            console.log(allUser);
            arrayAllUser.find(".content_array_user").empty();
            
            $(".adm_all_user_container .result_description span").html(userLength);
            for(var i=0; i < userLength; i++){
                var isAdmin;
                if(allUser[i].user_is_admin == 1){isAdmin = "<img src='../images/check_admin.png' class='check_admin'>"}else{isAdmin = "-"}
                contentArrayAllUser.append(
                    "<div class='line_user'>"+
                        "<div class='user_item user_id'>"+allUser[i].id+"</div>"+
                        "<div class='user_item user_name'>"+allUser[i].user_name+"</div>"+
                        "<div class='user_item user_sso'>"+allUser[i].user_sso+"</div>"+
                        "<div class='user_item user_description'>"+allUser[i].user_description+"</div>"+
                        "<div class='user_item user_role'>"+allUser[i].user_role+"</div>"+    
                        "<div class='user_item user_is_admin' data-admin='"+allUser[i].user_is_admin+"'>"+isAdmin+"</div>"+
                        "<div class='user_item user_action' data-id='"+allUser[i].id+"' data-name='"+allUser[i].user_name+"' data-sso='"+allUser[i].user_sso+"' data-description='"+allUser[i].user_description+"' data-role='"+allUser[i].user_role+"' data-admin='"+allUser[i].user_is_admin+"'>"+
                            "<img src='../images/modif_admin.png' class='modif_admin'>"+
                            "<img src='../images/delete_admin.png' class='delete_admin'>"+
                        "</div>"+
                    "</div>"
                );
            }
            generateUserJson();
        }
        contentArrayAllUser.find(".delete_admin").on('click', function(){
            var idLine = $(this).parent().data("id");
            if (confirm('Confirm the deletion of user ID '+idLine+'. This action is irreversible.')) {
                deleteLineByID(idLine, "user");
                setTimeout(function(){
                    getAllUser();
                },500);
            }
        });
        contentArrayAllUser.find(".modif_admin").on('click', function(){
            var idLine = $(this).parent().data("id");
            var nameLine = $(this).parent().data("name");
            var ssoLine = $(this).parent().data("sso");
            var descriptionLine = $(this).parent().data("description");
            var roleLine = $(this).parent().data("role");
            var adminLine = $(this).parent().data("admin");  
            openUserUpdateBox(idLine, nameLine, ssoLine, descriptionLine, roleLine, adminLine);
        });
    };   
    
    //Ouverture de la fenetre d'update user
    function openUserUpdateBox(idLine, name, sso, description, permission, isAdmin){
        updateUserBox.find("select option").each(function(){
            $(this).removeAttr('selected');
        });
        updateUserBox.find(".id_user_span").html(idLine);
        updateUserBox.find(".update_user_name").val(name);
        updateUserBox.find(".update_user_sso").val(sso);
        updateUserBox.find(".update_user_description option").each(function(){
            if($(this).val()== description){                
                $(this).attr("selected","selected");
            }
        });
        updateUserBox.find(".update_user_role option").each(function(){
            if($(this).val()== permission){
                $(this).attr("selected","selected");
            }
        });
        updateUserBox.find(".update_user_admin option").each(function(){
            if($(this).val()== isAdmin){
                $(this).attr("selected","selected");
            }
        });
        $(".adm_all_user_container .overlay_udpdate").fadeIn(300);
        
        updateUserBox.find(".update_tsui_btn").off();
        updateUserBox.find(".update_user_btn").on('click', function(){
            var nameLine = updateUserBox.find(".update_user_name").val();
            var ssoLine = updateUserBox.find(".update_user_sso").val();
            var descriptionLine = updateUserBox.find(".update_user_description option:selected").val();
            var roleLine = updateUserBox.find(".update_user_role option:selected").val();
            var adminLine = updateUserBox.find(".update_user_admin option:selected").val();
            updateUserByID(idLine, nameLine, ssoLine, descriptionLine, roleLine, adminLine);
        });
        
    }
    //Fermeture de la fenetre d'update user
    function closeUserUpdateBox(){        
        $(".adm_all_user_container .overlay_udpdate").fadeOut(300);
    }    
    //Appel ajax pour modifier un utilisateur
    function updateUserByID(idLine, name, sso, description, permission, isAdmin){        
        $.ajax({
            url: '../php/api.php?function=update_user_by_id',
            type: 'POST',
            dataType: 'JSON',
            data:{id:idLine,name:name, sso:sso,description:description,permission:permission,isadmin:isAdmin}
        });
        setTimeout(function(){
            getAllUser();
            closeUserUpdateBox();
        },200);
    }
    
    //Ouverture de la fenetre de creation user
    function openCreateUserBox(){
        createUserBox.find("select option").each(function(){
            $(this).removeAttr('selected');
        });        
        createUserBox.find("input").each(function(){
            $(this).val('');
        });
        
        $(".adm_all_user_container .overlay_create").fadeIn(300);
        
        createUserBox.find(".create_user_btn").off();
        createUserBox.find(".create_user_btn").on('click', function(){
            var nameLine = createUserBox.find(".create_user_name").val();
            var ssoLine = createUserBox.find(".create_user_sso").val();
            var descriptionLine = createUserBox.find(".create_user_description option:selected").val();
            var roleLine = createUserBox.find(".create_user_role option:selected").val();
            var adminLine = createUserBox.find(".create_user_admin option:selected").val();
            createUser(nameLine, ssoLine, descriptionLine, roleLine, adminLine);
        });
        
        createUserBox.find(".cancel_tsui_btn").off();
        createUserBox.find(".cancel_tsui_btn").on('click', function(){
            closeUserCreateBox();
        });
        
    }
    //Appel ajax pour creer un utilisateur
    function createUser(nameLine, ssoLine, descriptionLine, roleLine, adminLine){        
        $.ajax({
            url: '../php/api.php?function=create_user',
            type: 'POST',
            dataType: 'JSON',
            data:{name:nameLine, sso:ssoLine,description:descriptionLine,permission:roleLine,isadmin:adminLine}
        });
        setTimeout(function(){
            getAllUser();
            closeUserCreateBox();
        },200);
    }    
    //Fermeture de la fenetre de creation user
    function closeUserCreateBox(){        
        $(".adm_all_user_container .overlay_create").fadeOut(300);
    }
    
    $(".create_user_box .create_cancel_user_btn").on('click', function(){
        closeUserCreateBox();
    })
    
    //remplissage du tableau all user
    $(".all_user_page").on('click', function(){
        getAllUser();
    });
    //bouton d'ajout d'user user
    $(".add_user_description").on('click', function(){
        openCreateUserBox();
    });
    //fermture de la fenetre d'update user
    $(".adm_all_user_container .overlay_udpdate .update_user_box .cancel_user_btn").on('click', function(){
        closeUserUpdateBox();
    });
        
        
        
        
    //============================================================================//
    //                              LOGS ADMIN                                   //
    //============================================================================//
    
    //remplissage du tableau logs
    $(".log_page").on('click', function(){
        searchLog();
    });
    $(".search_container .search_bt").on('click', function(){
        searchLog();
    });
    $(".search_container .export_bt").on('click', function(){
       generateLogsJson();
    });
    
    function searchLog() {
        var historyPNVal = $(".search_container .search_pn_input").val().trim();
        var historySNVal = $(".search_container .search_sn_input").val().trim();
        var historySSOVal = $(".search_container .search_sso_input").val().trim();
           
        $.ajax({            
            url: '../php/api.php?function=get_global_log&param1=' + historyPNVal + '&param2=' + historySNVal + '&param3=' + historySSOVal + '&param4',
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                if (data.length == 0) {
                    alert("No result found with this part number.")
                } else {

                    $(".search_pn_input").val(historyPNVal);
                    $(".search_sn_input").val(historySNVal);
                    $(".search_sso_input").val(historySSOVal);

                    allLogs = data;   
                    console.log(allLogs);
                    fillLogsTable(allLogs);
                    
                }
            }
        });
    }
   
    //remplissage du tableau html et génération json pour export excel
    function fillLogsTable(allLogs){
        var logsLength = allLogs.length;
        if(logsLength > 0){
            console.log(allLogs);
            arrayAllLogs.find(".content_array_logs").empty();
            
            $(".adm_logs_container .result_description span").html(logsLength);
            for(var i=0; i < logsLength; i++){
                
                contentArrayAlllogs.append(
                    "<div class='line_logs'>"+
                        "<div class='logs_item logs_id'>"+allLogs[i].id+"</div>"+
                        "<div class='logs_item logs_sso'>"+allLogs[i].user_sso+"</div>"+
                        "<div class='logs_item logs_role'>"+allLogs[i].role+"</div>"+
                        "<div class='logs_item logs_sn'>"+allLogs[i].serial_number+"</div>"+
                        "<div class='logs_item logs_pn'>"+allLogs[i].part_number+"</div>"+
                        "<div class='logs_item logs_type'>"+allLogs[i].type+"</div>"+                        
                        "<div class='logs_item logs_date'>"+allLogs[i].date+"</div>"+                        
                        "<div class='logs_item logs_powertest hidden'>"+allLogs[i].json_powertest_log+"</div>"+                        
                        "<div class='logs_item logs_calibration hidden'>"+allLogs[i].json_calib_log+"</div>"+                        
                        "<div class='logs_item logs_testhw hidden'>"+allLogs[i].json_testhw_log+"</div>"+                        
                        "<div class='logs_item logs_json hidden'>"+allLogs[i].json_log+"</div>"+                        
                        "<div class='logs_item logs_actions' data-type='"+allLogs[i].type+"' data-id='"+allLogs[i].id+"'><a class='open' style='cursor:pointer;text-decoration:underline'>Logs file</a></div>"+
                    "</div>"
                );
            }
            $(".open").on('click', function(){
                var id_el = $(this).parent().data("id");
                var type_el = $(this).parent().data("type");

                if(type_el == "pretest"){
                    printHistoryLog(id_el);
                }else{
                    printHistoryLogFinal(id_el);
                }
            })
            
            generateLogsJson();
        }
        
    };   
       
    
    
    //Generation du rapport de test et affichage de la fenetre d'impression 
    function printHistoryLog(id) {
       $.ajax({
            //get global log with param1 = PN, param2 = SN, param3 = userSSO, param4= date
            url: '../php/api.php?function=get_global_log_by_id&param1=' + id,
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                console.log(data);
                var date = data[0].date;
                var fw_fct_version = data[0].fw_fct_version;
                var json_log = data[0].json_log;
                var part_number = data[0].part_number;
                var serial_number = data[0].serial_number;
                var sw_version = data[0].sw_version;
                var user_sso = data[0].user_sso;   
                var nodeID_history = data[0].node_id;
                var global_name_rapport = data[0].global_name_rapport;
                var model_name_rapport = data[0].model_name_rapport;
                printJsonLog(json_log, serial_number, part_number, user_sso, nodeID_history, date, fw_fct_version, sw_version,global_name_rapport, model_name_rapport);
            }
        });
    }

    //Generation du rapport de test FINAL et affichage de la fenetre d'impression 
    function printHistoryLogFinal(id) {
        $.ajax({
            //get global log with param1 = PN, param2 = SN, param3 = userSSO, param4= date
            url: '../php/api.php?function=get_global_log_by_id&param1=' + id,
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                console.log(data);
                var alim_testbench = data[0].alim_testbench;
                var alim_tsui = data[0].alim_tsui;
                var date = data[0].date;
                var enable_freq = data[0].enable_freq;
                var enable_tens = data[0].enable_tens;
                var fw_calib_version = data[0].fw_calib_version;
                var fw_fct_version = data[0].fw_fct_version;
                var id = data[0].id;
                var json_calib_log = data[0].json_calib_log;
                var json_testhw_log = data[0].json_testhw_log;
                var json_powertest_log = data[0].json_powertest_log;
                var json_log = data[0].json_log;
                var part_number = data[0].part_number;
                var role = data[0].role;
                var safety_freq = data[0].safety_freq;
                var safety_tens = data[0].safety_tens;
                var serial_number = data[0].serial_number;
                var sw_version = data[0].sw_version;
                var type = data[0].type;
                var user_sso = data[0].user_sso;
                var SRTLfinalTest = data[0].is_SRTL;
                var shouldHaveSRTL = data[0].should_have_SRTL;
                var initial_safety_srtl = data[0].initial_safety_SRTL;
                var initial_enable_srtl = data[0].initial_enable_SRTL;
                var nodeID_history = data[0].node_id;
                var globalNameRapport = data[0].global_name_rapport;
                var modelNameRapport = data[0].model_name_rapport;
                
                printJsonLogFinal(json_log, serial_number, part_number, user_sso, nodeID_history, fw_fct_version, fw_calib_version, sw_version, alim_testbench, alim_tsui, enable_freq, enable_tens, safety_freq, safety_tens, json_calib_log, json_testhw_log, json_powertest_log, date, SRTLfinalTest, shouldHaveSRTL, initial_safety_srtl, initial_enable_srtl, globalNameRapport, modelNameRapport);
            }
        });
    }
    
    //Generation du rapport de test et affichage de la fenetre d'impression 
    function printJsonLog(jsonLog, serialNumber, partNumber, userSSO, nodeID, datetime, FWfctV, SWv, globalNameRapport, modelNameRapport) {
        var msg = JSON.parse(jsonLog);
        var lineButton = "";
        var lineLed = "";
        var lineDisplay = "";
        var lineJoystick = "";
        var lineBuzzer = "";
        for (var i = 0; i < msg.length; i++) {
            if (msg[i].fct == "button") {
                if (msg[i].test == "untested") {
                    var line = "<div><span style='width:100px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:orange'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "OK") {
                    var line = "<div><span style='width:100px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:green'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "FAILED") {
                    var line = "<div><span style='width:100px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:red'>" + msg[i].test + "</span></div>"
                }

                lineButton += line;
            }
            if (msg[i].fct == "led" || msg[i].fct == "led_emergency") {
                if (msg[i].test == "untested") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:orange'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "OK") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:green'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "FAILED") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:red'>" + msg[i].test + "</span></div>"
                }
                lineLed += line;
            }
            if (msg[i].fct == "buzzer") {
                if (msg[i].test == "untested") {
                    var line = "<div><span style='width:100px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:orange'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "OK") {
                    var line = "<div><span style='width:100px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:green'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "FAILED") {
                    var line = "<div><span style='width:100px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:red'>" + msg[i].test + "</span></div>"
                }
                lineBuzzer += line;
            }
            if (msg[i].fct == "joystick" || msg[i].fct == "mushroom") {
                if (msg[i].test == "untested") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:orange'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "OK") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:green'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "FAILED") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:red'>" + msg[i].test + "</span></div>"
                }
                lineJoystick += line;
            }
            if (msg[i].fct == "display") {
                if (msg[i].test == "untested") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:orange'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "OK") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:green'>" + msg[i].test + "</span></div>"
                }
                if (msg[i].test == "FAILED") {
                    var line = "<div><span style='width:150px;display:inline-block;'>" + msg[i].name + "</span> = <span style='color:red'>" + msg[i].test + "</span></div>"
                }
                lineDisplay += line;
            }

        }
        
        
        var myWindow = window.open('', '', 'width=1000,height=800');
        if(globalNameRapport == "OMEGA"){
            myWindow.document.write("<h2>PRETEST LOG RECORD - " + datetime + "</h2><div style='border:1px solid black;padding:5px;'><b>PN</b>: " + partNumber + " - <b>SN</b>: " + serialNumber + " - <b>UI version</b>: "+UIsoftVersion+" - <b>Sofware version</b>: "+SWv+" - <b>User SSO</b>: " + userSSO + "</div><h3>BUTTONS</h3><div>" + lineButton + "</div><h3>BUZZERS</h3><div>" + lineBuzzer + "</div><h3>BACKLIGHTS</h3><div>" + lineLed + "</div><h3>DISPLAYS</h3><div>" + lineDisplay + "</div><h3>JOYSTICKS</h3><div>" + lineJoystick + "</div>");
        }else{
            myWindow.document.write("<h2>PRETEST LOG RECORD - " + datetime + "</h2><div style='border:1px solid black;padding:5px;'><b>PN</b>: " + partNumber + " - <b>SN</b>: " + serialNumber + " - <b>UI version</b>: "+UIsoftVersion+" - <b>Firmware version</b>: "+FWfctV+" - <b>Sofware version</b>: "+SWv+" - <b>User SSO</b>: " + userSSO + " - <b>Node ID:</b> "+nodeID+"</div><h3>BUTTONS</h3><div>" + lineButton + "</div><h3>BUZZERS</h3><div>" + lineBuzzer + "</div><h3>BACKLIGHTS</h3><div>" + lineLed + "</div><h3>DISPLAYS</h3><div>" + lineDisplay + "</div><h3>JOYSTICKS</h3><div>" + lineJoystick + "</div>");
        }
        myWindow.document.close();
        myWindow.focus();
        myWindow.print();
        myWindow.close();
    }
    
    //Generation du rapport de test et affichage de la fenetre d'impression 
    function printJsonLogFinal(jsonLogFinal, serialNumber, partNumber, userSSO, nodeID, FWfctV, FWcalibV, SWv, currGlobalVoltage, currTsuiVoltage, initial_enable_freq, initial_enable_tens, initial_safety_freq, initial_safety_tens, calibLogJSON, testhwLogJSON, powertestLogJSON, datetime, SRTLfinalTest, shouldHaveSRTL, initial_safety_srtl, initial_enable_srtl, globalNameRapport, modelNameRapport) {
        var msg = JSON.parse(jsonLogFinal);
        var msgCalib = JSON.parse(calibLogJSON);
        if(globalNameRapport == "OMEGA"){
            var msgTesthw = JSON.parse(testhwLogJSON);            
            var msgPowertest = JSON.parse(powertestLogJSON);
        }
        
        var lineButton = "";
        var lineSafety = "";
        var lineLed = "";
        var lineDisplay = "";
        var lineJoystick = "";
        var lineBuzzer = "";
        var lineCalib = "";
        var lineTestHw = "";
        var lineInitial ="";
        var linePowerTest ="";
        var counterCalibServ = 0;
        var counterCalibSwitch = 0;
        var lineCalibJoystick = "<h4>Joysticks calibration</h4><h5>Test is PASS when axis raw value is in the range of acceptance from database. </h5><div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Action</b></span></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Raw Data</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Zero Range</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Axis Range</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Result</b></span></div>";
        var lineCalibService = "<h4>Service button</h4><h5>Test is PASS when user correctly checks press/release actions on the button. </h5><div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Action</b></span></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Result</b></span></div>";
        var lineCalibSwitch = "<h4>Switch position</h4><h5>Test is PASS when user correctly checks switch positions. </h5><div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Action</b></span></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Result</b></span></div>";
        var lsl = 21.6;
        var usl = 26.4;
        var testAlimGlobal;
        var testAlimTSUI;
        
        if(shouldHaveSRTL == 0 || shouldHaveSRTL == "0"){
            var shouldHaveSRTLtxt = "No";
        }else{
            var shouldHaveSRTLtxt = "Yes";
        }
        if(SRTLfinalTest == 0 || SRTLfinalTest == "0"){
            var SRTLfinalTesttxt = "FAIL";
        }else{
            var SRTLfinalTesttxt = "PASS";
        }
        
        if (currGlobalVoltage != "undefined" && currTsuiVoltage) {
            currGlobalVoltage = parseFloat(currGlobalVoltage).toFixed(2);
        }
        if (currTsuiVoltage != "undefined" && currTsuiVoltage) {
            currTsuiVoltage = parseFloat(currTsuiVoltage).toFixed(2);
        }        
        if (initial_enable_tens != "undefined" && initial_enable_tens) {
            initial_enable_tens = parseFloat(initial_enable_tens).toFixed(2);
        }        
        if (initial_safety_tens != "undefined" && initial_safety_tens) {
            initial_safety_tens = parseFloat(initial_safety_tens).toFixed(2);
        }

        if (lsl < currGlobalVoltage && usl > currGlobalVoltage) {
            testAlimGlobal = "Pass"
        } else {
            testAlimGlobal = "Fail"
        }
        if (lsl < currTsuiVoltage && usl > currTsuiVoltage) {
            testAlimTSUI = "Pass"
        } else {
            testAlimTSUI = "Fail"
        }
        
        for (var i = 0; i < msg.length; i++) {
            if(msg[i].result == "TEST OK"){
                msg[i].result = "PASS";
            }else{
                msg[i].result = "FAIL";
            }            
            if (msg[i].type == "button" && msg[i].is_safety == "0") {
                if(msg[i].is_srtl =="1"){                    
                        var enabletens = msg[i].enable_srtl;                    
                        var enablefreq = ""; 
                        var enabletensrel = msg[i].enable_srtl_rel;                    
                        var enablefreqrel = ""; 
                }else{
                    if (msg[i].enable_tens !== "") {
                        var enabletens = msg[i].enable_tens.toFixed(2) + "V"
                    } else {
                        var enabletens = ""
                    }
                    if (msg[i].enable_tens_rel !== "") {
                        var enabletensrel = msg[i].enable_tens_rel.toFixed(2) + "V"
                    } else {
                        var enabletensrel = ""
                    }
                    if (msg[i].enable_freq !== "") {
                        var enablefreq = msg[i].enable_freq + "Hz / "
                    } else {
                        var enablefreq = ""
                    }
                    if (msg[i].enable_freq_rel !== "") {
                        var enablefreqrel = msg[i].enable_freq_rel + "Hz / "
                    } else {
                        var enablefreqrel = ""
                    }
                }               
                
                if (msg[i].is_enable == 0) {
                    msg[i].is_enable = "-"
                } else {
                    msg[i].is_enable = "Y"
                }                
                if (msg[i].is_cdrh == 0) {
                    msg[i].is_cdrh = "-"
                } else {
                    msg[i].is_cdrh = "Y"
                }
                var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>PRESS</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].result + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + enablefreq + enabletens + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_enable + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;border-left:1px solid black;'>" + msg[i].is_cdrh + "</span></div>"
                line += "<div style='margin-bottom:2px;border-bottom:1px solid grey;padding-bottom:2px;'><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>RELEASE</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].result + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + enablefreqrel + enabletensrel + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_enable + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;border-left:1px solid black;'>" + msg[i].is_cdrh + "</span></div>"
                lineButton += line;
            }
            if (msg[i].type == "button" && msg[i].is_safety == "1") {
                 if(msg[i].is_srtl == "1"){                    
                    var safetytens = msg[i].safety_srtl;                    
                    var safetyfreq = ""; 
                    var safetytensrel = msg[i].safety_srtl_rel;                    
                    var safetyfreqrel = ""; 
                }else{
                    //alert(msg[i].safety_tens_rel + " "+msg[i].safety_freq_rel);
                    if (msg[i].safety_tens !== "") {
                        var safetytens = msg[i].safety_tens.toFixed(2) + "V"
                    } else {
                        var safetytens = ""
                    }
                    if (msg[i].safety_tens_rel !== "" ) {
                        var safetytensrel = msg[i].safety_tens_rel + "V"
                    } else {
                        var safetytensrel = ""
                    }
                    if (msg[i].safety_freq !== "") {
                        var safetyfreq = msg[i].safety_freq + "Hz / "
                    } else {
                        var safetyfreq = ""
                    }
                    if (msg[i].safety_freq_rel !== "" ) {
                        var safetyfreqrel = msg[i].safety_freq_rel + "Hz / "
                    } else {
                        var safetyfreqrel = ""
                    }
                }
                if (msg[i].is_safety == 0) {
                    msg[i].is_safety = "-"
                } else {
                    msg[i].is_safety = "Y"
                }
                if (msg[i].is_cdrh == 0) {
                    msg[i].is_cdrh = "-"
                } else {
                    msg[i].is_cdrh = "Y"
                }
                
                var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>PRESS</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].result + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + safetyfreq + safetytens + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_safety + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;border-left:1px solid black;'>" + msg[i].is_cdrh + "</span></div>"
                line += "<div style='margin-bottom:2px;border-bottom:1px solid grey;padding-bottom:2px;'><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>RELEASE</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].result + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + safetyfreqrel + safetytensrel + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_safety + "</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;border-left:1px solid black;'>" + msg[i].is_cdrh + "</span></div>"
                lineSafety += line;
            }
            if (msg[i].type == "led") {
                if (msg[i].is_enable == 0) {
                    msg[i].is_enable = "-";
                } else {
                    msg[i].is_enable = "Y";
                }
                if (msg[i].is_cdrh == 0) {
                    msg[i].is_cdrh = "-";
                } else {
                    msg[i].is_cdrh = "Y";
                }
                var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].result + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                lineLed += line;
            }
            if (msg[i].type == "display") {
                if (msg[i].is_enable == 0) {
                    msg[i].is_enable = "-";
                } else {
                    msg[i].is_enable = "Y";
                }
                if (msg[i].is_cdrh == 0) {
                    msg[i].is_cdrh = "-";
                } else {
                    msg[i].is_cdrh = "Y"
                }
                var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].result + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                lineDisplay += line;
            }
            if (msg[i].type == "buzzer") {
                if (msg[i].is_enable == 0) {
                    msg[i].is_enable = "-"
                } else {
                    msg[i].is_enable = "Y"
                }
                if (msg[i].is_cdrh == 0) {
                    msg[i].is_cdrh = "-"
                } else {
                    msg[i].is_cdrh = "Y"
                }
                var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].result + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                lineBuzzer += line;
            }
            if (msg[i].type == "joystick") {
                if (msg[i].is_enable == 0) {
                    msg[i].is_enable = "-"
                } else {
                    msg[i].is_enable = "Y"
                }
                if (msg[i].is_cdrh == 0) {
                    msg[i].is_cdrh = "-"
                } else {
                    msg[i].is_cdrh = "Y"
                }
                if (msg[i].result == "TEST OK" || msg[i].result == "PASS") {
                    var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>LEFT</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                    line += "<div style='margin-bottom:2px;'><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>RIGHT</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                    line += "<div style='margin-bottom:2px;'><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>TOP</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                    line += "<div style='margin-bottom:2px;border-bottom:1px solid grey;padding-bottom:2px;'><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>BOTTOM</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>PASS</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                }else{
                    var line = "<div style='margin-bottom:2px;border-bottom:1px solid grey;padding-bottom:2px;'><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msg[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>--</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>FAIL</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>FAIL</span><span style='text-align:center;display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + msg[i].is_cdrh + "</span></div>"
                }
                lineJoystick += line;
            }

        }
        var ind = 0;
        
        for (var i = 0; i < msgCalib.length; i++){            
            if(msgCalib[i].type == "joystick"){
                if(msgCalib[i].result != "-"){
                    var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msgCalib[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msgCalib[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+msgCalib[i].description+"</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>"+msgCalib[i].result+"</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'> "+msgCalib[i].minZero+"  - | "+msgCalib[i].maxZero+" |</span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'>| "+msgCalib[i].minAxis+" | - | "+msgCalib[i].maxAxis+" |</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>PASS</span></div>";
                    
                    lineCalibJoystick += line;
                }
            }else if(msgCalib[i].type == "service"){
                var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msgCalib[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msgCalib[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+msgCalib[i].description+"</span></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>"+msgCalib[i].result+"</span></div>";
                lineCalibService += line;
                counterCalibServ++;
            }else if(msgCalib[i].type == "switch"){
                var line = "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msgCalib[i].name + "</span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>" + msgCalib[i].standard_name + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+msgCalib[i].description+"</span></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'>"+msgCalib[i].result+"</span></div>";
                lineCalibSwitch += line;
                counterCalibSwitch++;
            }            
        }
        
        if(counterCalibServ > 0){
            lineCalib += lineCalibService;
        }
        if(counterCalibSwitch > 0){
            lineCalib += lineCalibSwitch;
        }
        lineCalib += lineCalibJoystick;
        
        
        if(shouldHaveSRTL == 0 || shouldHaveSRTL == "0"){
            if(initial_enable_freq == 0){var testResultInitialEnableFreq = "Pass"}else{var testResultInitialEnableFreq = "Fail"}
            if(initial_enable_tens == 0){var testResultInitialEnableTens = "Pass"}else{var testResultInitialEnableTens = "Fail"}
            if(initial_safety_freq >= 1800 && initial_safety_freq <= 2200){var testResultInitialSafetyFreq = "Pass"}else{var testResultInitialSafetyFreq = "Fail"}
            if(initial_safety_tens >= 21.6 && initial_safety_tens <= 26.4){var testResultInitialSafetyTens = "Pass"}else{var testResultInitialSafetyTens = "Fail"}           
            
            lineInitial = "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'><b>Type</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Measured Value</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>LSL</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>USL</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Pass/Fail</b></span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Enable Frequency</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+initial_enable_freq+"Hz</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>0Hz</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>0Hz</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+testResultInitialEnableFreq+"</span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Enable Voltage</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+initial_enable_tens+"V</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>0V</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>0V</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+testResultInitialEnableTens+"</span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Safety Frequency</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+initial_safety_freq+"Hz</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>1800Hz</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>2200Hz</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+testResultInitialSafetyFreq+"</span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Safety Voltage</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+initial_safety_tens+"V</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>21.6V</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>26.4V</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+testResultInitialSafetyTens+"</span></div>";
        }else{
            if(initial_enable_srtl == 0 ){var testInitialSRTLenable = "Pass"}else{var testInitialSRTLenable = "Fail"}
            if(initial_safety_srtl == 0 ){var testInitialSRTLsafety = "Pass"}else{var testInitialSRTLsafety = "Fail"}
            lineInitial = "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'><b>Type</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Value</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Required Value</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Pass/Fail</b></span></div>"
            + "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Test SRTL</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+SRTLfinalTesttxt+"</span></div>"
            + "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Enable SRTL</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+initial_enable_srtl+"</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>0</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+testInitialSRTLenable+"</span></div>"
            + "<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Safety SRTL</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+initial_safety_srtl+"</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>0</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+testInitialSRTLsafety+"</span></div>"
        }
        if(globalNameRapport == "ELEGANCE"){
            linePowerTest = "<div><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Type</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Measured Value</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>LSL</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>USL</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>Pass/Fail</b></span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>V alimentation</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + currTsuiVoltage + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + lsl + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + usl + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + testAlimGlobal + "</span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>V TSUI</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + currGlobalVoltage + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + lsl + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + usl + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + testAlimTSUI + "</span></div>"
        
            var partInitial = "<h3>INITIAL STATES</h3><div>"+ "<div>"+lineInitial+"</div>"; 
            if(modelNameRapport == "TSSC"){
                var partBuzzer = "<h3>BUZZER</h3>"
                    + "<h5>Test is PASS when user has confirmed he heard TSUI buzzer. </h5>"
                    + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Test Result</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>CDRH</b></span></div>"
                    + "<div>" + lineBuzzer + "</div>";
            }else{
                var partBuzzer = "";
            }
            var partDisplay = "<h3>7 SEGMENTS DISPLAYS</h3>"
                + "<h5>Test is PASS when user has confirmed 8 is lit. </h5>"
                + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Test Result</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>CDRH</b></span></div>"
                + "<div>" + lineDisplay + "</div>";
            var partSafety = "<h3>EMERGENCY STOP (SAFETY LOOP)</h3>"
                + "<h5>Test is PASS when CAN signal press is present and CAN signal release is present.<br>When tested entry is Safety, test is PASS if measured values are 0Hz and 0V.<br>If SRTL is active and tested entry is Safety, test is PASS if measured bit is 1 for press and 1 for release.</h5>"
                + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Action</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Test Result</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Measure</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>Safety</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>CDRH</b></span></div>"
                + "<div>" +lineSafety+"</div>";
            var partTestHW = "";
            var partButton = "<h3>BUTTONS</h3>"
                + "<h5>Test is PASS when CAN signal press is present and CAN signal release is present.<br>When tested entry is Enable, test is PASS if measured values are between 1800Hz-2200Hz and 21.6V-26.4V.<b>If SRTL is active and tested entry is Enable, test is PASS if measured bit is 1 for press and 0 for release.</h5>"
                + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Action</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Test Result</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Measure</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>Enable</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>CDRH</b></span></div>"
                + "<div>" +lineButton+"</div>";    
            var partIntro = "<b>UI Software V.<b> : "+UIsoftVersion+" - <b>PN</b> : " + partNumber + " - <b>SN</b> : " + serialNumber + " - <b>SSO</b> : " + userSSO + " - <b>FW Fonct. V.</b> : " + FWfctV + " - <b>FW Calib. V.</b> : " + FWcalibV + " - <b>Software Version</b> : " + SWv + " - <b>SRTL</b> : "+shouldHaveSRTLtxt+" - <b>Node ID</b> : "+nodeID+"</div>";
            var partCalibration = "<h3>CALIBRATION (calibration FW)</h3>"                
                + "<div>" + lineCalib + "</div>";
            var partJoystick = "<h3>JOYSTICKS (functionnal FW)</h3>"
                + "<h5>Test is PASS when axis value reaches +/-100%. </h5>"
                + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Action</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Linearity Result</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Range Result</b></span><span style='display:inline-block;vertical-align:top;width:80px;margin-left:5px;'><b>CDRH</b></span></div>"
                + "<div>" + lineJoystick + "</div>";
        }else{
            if(msgPowertest[0].tsuiSupply > lsl && msgPowertest[0].tsuiSupply < usl){var testTsuiSupply = "Pass"}else{var testTsuiSupply = "Fail"}
            if(msgPowertest[0].FRTLgantry > lsl && msgPowertest[0].FRTLgantry < usl){var testFRTL = "Pass"}else{var testFRTL = "Fail"}
            if(msgPowertest[0].unreg5 > 8 && msgPowertest[0].unreg5 < 10){var testUnreg5 = "Pass"}else{var testUnreg5 = "Fail"}
            if(msgPowertest[0].unreg12 > 17 && msgPowertest[0].unreg12 < 21){var testUnreg12 = "Pass"}else{var testUnreg12 = "Fail"}
            
            linePowerTest = "<div><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Type</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Measured Value</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>LSL</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>USL</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>Pass/Fail</b></span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>TSUI Supply</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + msgPowertest[0].tsuiSupply.toFixed(2) + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + lsl + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + usl + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + testTsuiSupply + "</span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>Gantry En. Ref.</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + msgPowertest[0].FRTLgantry.toFixed(2) + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + lsl + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + usl + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + testFRTL + "</span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>Unreg-5V</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + msgPowertest[0].unreg5.toFixed(2) + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>8V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>10V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + testUnreg5 + "</span></div>"
                + "<div><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>Unreg-12V</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + msgPowertest[0].unreg12.toFixed(2) + "V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>17V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>21V</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>" + testUnreg12 + "</span></div>"
            for (var i = 0; i < msgTesthw.length; i++){
                if(msgTesthw[i].hw1){
                    var hw1 = msgTesthw[i].hw1;
                    var lineTest = "<div style='margin-top:15px'><span style='display:inline-block;vertical-align:top;width:220px;margin-left:5px;'>"+msgTesthw[i].description+"</span><span style='display:inline-block;vertical-align:top;width:250px;margin-left:5px;'>" + hw1 + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + msgTesthw[i].hw1Val + "</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>PASS</span></div>";
                }
                if(msgTesthw[i].hw2){
                    var hw2 = msgTesthw[i].hw2;
                    lineTest += "<div><span style='display:inline-block;vertical-align:top;width:220px;margin-left:5px;'></span><span style='display:inline-block;vertical-align:top;width:250px;margin-left:5px;'>" + hw2 + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + msgTesthw[i].hw2Val + "</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>PASS</span></div>"  
                }
                if(msgTesthw[i].hw3){
                    var hw3 = msgTesthw[i].hw3;
                    lineTest += "<div><span style='display:inline-block;vertical-align:top;width:220px;margin-left:5px;'></span><span style='display:inline-block;vertical-align:top;width:250px;margin-left:5px;'>" + hw3 + "</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>" + msgTesthw[i].hw3Val + "</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>PASS</span></div>"  
                }
            
                lineTestHw += lineTest;
            }
            if(modelNameRapport == "TSSC"){
                var partInitial =  "<h3>INITIAL STATES</h3>"
                    +"<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'><b>Type</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Measured Value</b></span></div>" 
                    +"<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Coding Wheel - II23</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+msgPowertest[0].roue+"</span></div>" 
                    +"<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Switch - II14B1</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+msgPowertest[0].switch1+"</span></div>" 
                    +"<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Switch - II14B2</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+msgPowertest[0].switch2+"</span></div>" 
                    +"<div><span style='display:inline-block;vertical-align:top;width:150px;margin-left:5px;'>Switch - II24</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>"+msgPowertest[0].switch3+"</span></div>"; 
            }else{
                var partInitial = "";    
            }
            if(modelNameRapport == "TSSC"){
                var partBuzzer = "<h3>BUZZER</h3>"
                    + "<h5>Test is PASS when user has confirmed he heard TSUI buzzer. </h5>"
                    + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Test Result</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>CDRH</b></span></div>"
                    + "<div>" + lineBuzzer + "</div>";
                var partDisplay = "<h3>7 SEGMENTS DISPLAYS</h3>"
                    + "<h5>Test is PASS when user has confirmed 8 is lit. </h5>"
                    + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Test Result</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>CDRH</b></span></div>"
                    + "<div>" + lineDisplay + "</div>";
            }else{
                var partBuzzer = "";
                var partDisplay = "";
            }            
            
            var partSafety = "";
            var partIntro = "<b>UI Software V.</b> : "+UIsoftVersion+" - <b>PN</b> : " + partNumber + " - <b>SN</b> : " + serialNumber + " - <b>SSO</b> : " + userSSO + " - <b>FW Fonct. V.</b> : " + FWcalibV + "</div>";
            var partButton = "<h3>BUTTONS</h3>"
                + "<h5>Test is PASS when CAN signal press is present and CAN signal release is present.</h5>"
                + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Action</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Test Result</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Measure</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>Enable</b></span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'><b>CDRH</b></span></div>"
                + "<div>" +lineButton+"</div>"    
            var partTestHW = "<h3>OMEGA TEST HARDWARE</h3>"
                    + "<h5>For enable signals, Test is PASS when measured pressed value is between 20V & 26V, and 0V for released value. For logical output signals, Test is PASS when change of state is effective for measured pressed value between 20V and 26V, and for 0V for released value.</h5>"
                    + "<div><span style='display:inline-block;vertical-align:top;width:220px;margin-left:5px;'>Description</span><span style='display:inline-block;vertical-align:top;width:250px;margin-left:5px;'>Signal</span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'>Press/Rel</span><span style='display:inline-block;vertical-align:top;width:50px;margin-left:5px;'>Result</span></div>"
                    + "<div>" +lineTestHw+"</div>";
            var partCalibration = "<h3>CALIBRATION</h3>"                
                + "<div>" + lineCalib + "</div>";
            var partJoystick = "<h3>JOYSTICKS</h3>"
                + "<h5>Test is PASS when axis value reaches +/-100%. </h5>"
                + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Action</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Linearity Result</b></span><span style='display:inline-block;vertical-align:top;width:120px;margin-left:5px;'><b>Range Result</b></span><span style='display:inline-block;vertical-align:top;width:80px;margin-left:5px;'><b>CDRH</b></span></div>"
                + "<div>" + lineJoystick + "</div>";
        }
        var myWindow = window.open('', '', 'width=1000,height=800');
        myWindow.document.write(
                "<h2>FINAL TEST LOG RECORD - " + datetime + "</h2>"
                + "<div style='border:1px solid black;padding:5px;'>"
                + partIntro 
                + "<h3>POWER TEST</h3><div>"
                + "<div>"+linePowerTest+"</div>"
                + "</div>"                
                + partInitial
                + partButton
                + partSafety
                + "<h3>BACKLIGHTS</h3>"
                + "<h5>Test is PASS when user has confirmed light is lit. </h5>"
                + "<div><span style='display:inline-block;vertical-align:top;width:75px;margin-left:5px;'><b>Name</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Ref. TST</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>Test Result</b></span><span style='display:inline-block;vertical-align:top;width:100px;margin-left:5px;'><b>CDRH</b></span></div>"
                + "<div>" + lineLed + "</div>"
                + partDisplay
                + partCalibration
                + partJoystick
                + partBuzzer
                + partTestHW
                );
        myWindow.document.close();
        myWindow.focus();
        myWindow.print();
        myWindow.close();
    }

    
    //============================================================================//
    //                            SERIALS ADMIN                                   //
    //============================================================================//
    //
    //remplissage du tableau logs
    $(".serial_page").on('click', function(){
        searchSerial();
    });
    $(".search_container_sn .search_bt").on('click', function(){
        searchSerial();
    });
    $(".search_container_sn .export_bt").on('click', function(){
       generateSerialJson();
    });
    
    function searchSerial() {        
        var SNVal = $(".search_container_sn .search_sn_input").val().trim();
        if(SNVal == ""){
            SNVal = "all";
        }
           
        $.ajax({            
            url: '../php/api.php?function=get_sn&param1=' + SNVal,
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                if (data.length == 0) {
                    alert("No result found with this serial number.")
                } else {                                       
                    allSerial = data;   
                    console.log(allSerial);
                    fillSerialTable(allSerial);
                    
                }
            }
        });
    }
   
    //remplissage du tableau html et génération json pour export excel
    function fillSerialTable(allSerial){
        var serialLength = allSerial.length;
        if(serialLength > 0){
            console.log(allSerial);
            arrayAllSerial.find(".content_array_sn").empty();
            
            $(".adm_serial_container .result_description span").html(serialLength);
            for(var i=0; i < serialLength; i++){
                if(allSerial[i].commentary != "" && allSerial[i].commentary){var date_comment = allSerial[i].date_commentary}else{var date_comment = "-"};
                console.log(allSerial[i].commentary);
                contentArrayAllSerial.append(
                    "<div class='line_sn'>"+
                        "<div class='sn_item sn_id'>"+allSerial[i].id+"</div>"+
                        "<div class='sn_item sn_sn'>"+allSerial[i].serial_number+"</div>"+
                        "<div class='sn_item sn_comment'>"+allSerial[i].commentary+"</div>"+          
                        "<div class='sn_item sn_date_serial'>"+allSerial[i].date+"</div>"+                        
                        "<div class='sn_item sn_date_comment'>"+date_comment+"</div>"+    
                        "<div class='sn_item sn_action' data-id='"+allSerial[i].id+"' data-sn='"+allSerial[i].serial_number+"' data-comment='"+allSerial[i].commentary+"''>"+
                            "<img src='../images/delete.png' class='delete_admin'>"+
                        "</div>"+
                    "</div>"
                );
            }
            generateSerialJson();
        }
        contentArrayAllSerial.find(".delete_admin").on('click', function(){
            console.log("coucou")
            var idLine = $(this).parent().data("id");
            if (confirm('Confirm the deletion of serial ID '+idLine+'. This action is irreversible.')) {
                deleteLineByID(idLine, "log_sn");
                setTimeout(function(){
                    searchSerial();
                },500);
            }
        });
        contentArrayAllSerial.find(".modif_admin").on('click', function(){
            var idLine = $(this).parent().data("id");
            var nameLine = $(this).parent().data("name");
            var ssoLine = $(this).parent().data("sso");
            var descriptionLine = $(this).parent().data("description");
            var roleLine = $(this).parent().data("role");
            var adminLine = $(this).parent().data("admin");  
            openUserUpdateBox(idLine, nameLine, ssoLine, descriptionLine, roleLine, adminLine);
        });
    };   
    
    
    //============================================================================//
    //                              FUNCTIONS ADMIN                               //
    //============================================================================//
    
    //Suppression d'une ligne d'une table par ID + effacement dans le tableau admin
    function deleteLineByID(idLine, tableName){
        if(idLine !== "" && tableName !== ""){
            $.ajax({
                url: '../php/api.php?function=delete_line_by_id',
                type: 'POST',
                dataType: 'JSON',
                data:{id:idLine,table:tableName}
            });
        }
    }
    
    
    //============================================================================//
    //                              EXPORT EXCEL ADMIN                            //
    //============================================================================//

    function generateUserJson() {
        var jsonExcel = [];
        contentArrayAllUser.find(".line_user").each(function () {
            var lineID = $(this).find(".user_id").html();
            var lineName = $(this).find(".user_name").html();
            var lineSSO = $(this).find(".user_sso").html();
            var lineDescription = $(this).find(".user_description").html();
            var lineRole = $(this).find(".user_role").html();
            var lineAdmin = $(this).find(".user_is_admin").data("admin");
            jsonExcel.push({user_id: lineID, user_name: lineName, user_sso: lineSSO, user_description: lineDescription, user_role: lineRole, user_admin: lineAdmin});
        });
        jsonExcel = JSON.stringify(jsonExcel);
        generateUserExcelFile(jsonExcel);

    };
    function generateUserExcelFile(jsonObj) {
        testTypes = {
            "user_id": "Number",
            "user_name": "String",
            "user_sso": "String",
            "user_description": "String",
            "user_role": "String",
            "user_admin": "Number"
        };

        emitXmlHeader = function () {
            var headerRow = '<ss:Row>\n';
            for (var colName in testTypes) {
                headerRow += '  <ss:Cell>\n';
                headerRow += '    <ss:Data ss:Type="String">';
                headerRow += colName + '</ss:Data>\n';
                headerRow += '  </ss:Cell>\n';
            }
            headerRow += '</ss:Row>\n';
            return '<?xml version="1.0"?>\n' +
                    '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
                    '<ss:Worksheet ss:Name="Sheet1">\n' +
                    '<ss:Table>\n\n' + headerRow;
        };

        emitXmlFooter = function () {
            return '\n</ss:Table>\n' +
                    '</ss:Worksheet>\n' +
                    '</ss:Workbook>\n';
        };

        jsonToSsXml = function (jsonObject) {
            var row;
            var col;
            var xml;
            var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;

            xml = emitXmlHeader();

            for (row = 0; row < data.length; row++) {
                xml += '<ss:Row>\n';

                for (col in data[row]) {
                    xml += '  <ss:Cell>\n';
                    xml += '    <ss:Data ss:Type="' + testTypes[col] + '">';
                    xml += data[row][col] + '</ss:Data>\n';
                    xml += '  </ss:Cell>\n';
                }

                xml += '</ss:Row>\n';
            }

            xml += emitXmlFooter();
            return xml;
        };        

        download = function (content, filename, contentType) {
            if (!contentType)
                contentType = 'application/octet-stream';
            var a = document.getElementById('export_user');            
            var blob = new Blob([content], {
                'type': contentType
            });
            a.href = window.URL.createObjectURL(blob);
            a.download = filename;
        };

        download(jsonToSsXml(jsonObj), 'testbench_users.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');


    };
    
    function generateLogsJson() {
        var jsonExcel = [];
        contentArrayAlllogs.find(".line_logs").each(function () {
            var lineID = $(this).find(".logs_id").html();
            var linePN = $(this).find(".logs_pn").html();
            var lineSN = $(this).find(".logs_sn").html();
            var lineSSO = $(this).find(".logs_sso").html();
            var lineRole = $(this).find(".logs_role").html();
            var lineType = $(this).find(".logs_type").html();
            var lineDate = $(this).find(".logs_date").html();
            var lineTestHw = $(this).find(".logs_testhw").html();
            var lineCalibration = $(this).find(".logs_calibration").html();
            var linePowerTest = $(this).find(".logs_powertest").html();
            var lineJson = $(this).find(".logs_json").html();
            jsonExcel.push({
                id: lineID, part_number: linePN, serial_number: lineSN, user_sso: lineSSO, 
                type: lineType, date: lineDate, role:lineRole, 
                json_logs: lineJson, 
                //json_test_hw:lineTestHw, 
                json_calibration:lineCalibration, 
                json_power_test:linePowerTest
            });
        });
        jsonExcel = JSON.stringify(jsonExcel);
        generateLogsExcelFile(jsonExcel);

    };
    function generateLogsExcelFile(jsonObj) {
        testTypes = {
            "id": "Number",
            "part_number": "String",
            "serial_number": "String",
            "user_sso": "String",
            "type": "String",
            "date": "String",
            "role": "String",
            "json_logs": "String",
            //"json_test_hw": "String",
            "json_calibration": "String",
            "json_power_test": "String"
        };

        emitXmlHeader = function () {
            var headerRow = '<ss:Row>\n';
            for (var colName in testTypes) {
                headerRow += '  <ss:Cell>\n';
                headerRow += '    <ss:Data ss:Type="String">';
                headerRow += colName + '</ss:Data>\n';
                headerRow += '  </ss:Cell>\n';
            }
            headerRow += '</ss:Row>\n';
            return '<?xml version="1.0"?>\n' +
                    '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
                    '<ss:Worksheet ss:Name="Sheet1">\n' +
                    '<ss:Table>\n\n' + headerRow;
        };

        emitXmlFooter = function () {
            return '\n</ss:Table>\n' +
                    '</ss:Worksheet>\n' +
                    '</ss:Workbook>\n';
        };

        jsonToSsXml = function (jsonObject) {
            var row;
            var col;
            var xml;
            var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;

            xml = emitXmlHeader();

            for (row = 0; row < data.length; row++) {
                xml += '<ss:Row>\n';

                for (col in data[row]) {
                    xml += '  <ss:Cell>\n';
                    xml += '    <ss:Data ss:Type="' + testTypes[col] + '">';
                    xml += data[row][col] + '</ss:Data>\n';
                    xml += '  </ss:Cell>\n';
                }

                xml += '</ss:Row>\n';
            }

            xml += emitXmlFooter();
            return xml;
        };        

        download = function (content, filename, contentType) {
            if (!contentType)
                contentType = 'application/octet-stream';
            var a = document.getElementById('export_logs');            
            var blob = new Blob([content], {
                'type': contentType
            });
            a.href = window.URL.createObjectURL(blob);
            a.download = filename;
        };

        download(jsonToSsXml(jsonObj), 'testbench_logs.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');


    };
    
    function generateSerialJson() {
        var jsonExcel = [];
        contentArrayAllSerial.find(".line_sn").each(function () {
            var lineID = $(this).find(".sn_id").html();
            var lineSN = $(this).find(".sn_sn").html();
            var lineComment = $(this).find(".sn_comment").html();
            var lineDateSerial = $(this).find(".sn_date_serial").html();
            var lineDateComment = $(this).find(".sn_date_comment").html();
            jsonExcel.push({id: lineID, serial_number: lineSN, comment: lineComment, date_serial: lineDateSerial, date_comment: lineDateComment});
        });
        jsonExcel = JSON.stringify(jsonExcel);
        generateSerialExcelFile(jsonExcel);

    };
    function generateSerialExcelFile(jsonObj) {
        testTypes = {
            "id": "Number",
            "serial_number": "String",
            "comment": "String",
            "date_serial": "String",
            "date_comment": "String"
        };

        emitXmlHeader = function () {
            var headerRow = '<ss:Row>\n';
            for (var colName in testTypes) {
                headerRow += '  <ss:Cell>\n';
                headerRow += '    <ss:Data ss:Type="String">';
                headerRow += colName + '</ss:Data>\n';
                headerRow += '  </ss:Cell>\n';
            }
            headerRow += '</ss:Row>\n';
            return '<?xml version="1.0"?>\n' +
                    '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
                    '<ss:Worksheet ss:Name="Sheet1">\n' +
                    '<ss:Table>\n\n' + headerRow;
        };

        emitXmlFooter = function () {
            return '\n</ss:Table>\n' +
                    '</ss:Worksheet>\n' +
                    '</ss:Workbook>\n';
        };

        jsonToSsXml = function (jsonObject) {
            var row;
            var col;
            var xml;
            var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;

            xml = emitXmlHeader();

            for (row = 0; row < data.length; row++) {
                xml += '<ss:Row>\n';

                for (col in data[row]) {
                    xml += '  <ss:Cell>\n';
                    xml += '    <ss:Data ss:Type="' + testTypes[col] + '">';
                    xml += data[row][col] + '</ss:Data>\n';
                    xml += '  </ss:Cell>\n';
                }

                xml += '</ss:Row>\n';
            }

            xml += emitXmlFooter();
            return xml;
        };        

        download = function (content, filename, contentType) {
            if (!contentType)
                contentType = 'application/octet-stream';
            var a = document.getElementById('export_serial');            
            var blob = new Blob([content], {
                'type': contentType
            });
            a.href = window.URL.createObjectURL(blob);
            a.download = filename;
        };

        download(jsonToSsXml(jsonObj), 'testbench_serials.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');


    };


    //============================================================================//
    //                              DICTIONARIES ADMIN                            //
    //============================================================================//

    $(".type-entry.create").on('click', function(){
        
        var _this = $(this);
        $(".dico_step2 .dictionary_type_listing").fadeOut(300);
        $(".dico_step2 .type-entry").each(function(){
            $(this).removeClass("selected");
        });
        setTimeout(function(){
            if(_this.hasClass("entry-bt")){
                _this.addClass("selected");
                $(".dico_step2 .dictionary_type_listing.bouton-type").fadeIn(300);
            }
            else if(_this.hasClass("entry-joy")){
                _this.addClass("selected");
                $(".dico_step2 .dictionary_type_listing.joystick-type").fadeIn(300);
            }
            else{
                _this.addClass("selected");
                $(".dico_step2 .dictionary_type_listing.display-type").fadeIn(300);
            }
        },300)
        
    });
    $(".type-entry.show").on('click', function(){
        
        var _this = $(this);
        $(".step_two .dictionary_type_listing").fadeOut(300);
        $(".step_two .type-entry").each(function(){
            $(this).removeClass("selected");
        });
        setTimeout(function(){
            if(_this.hasClass("entry-bt")){
                _this.addClass("selected");
                $(".step_two .dictionary_type_listing.bouton-type").fadeIn(300);
            }
            else if(_this.hasClass("entry-joy")){
                _this.addClass("selected");
                $(".step_two .dictionary_type_listing.joystick-type").fadeIn(300);
            }
            else{
                _this.addClass("selected");
                $(".step_two .dictionary_type_listing.display-type").fadeIn(300);
            }
        },300)
        
    });
    
    
    $(".bt_send_dico_form.step1").on('click', function(){
        var newID = $(".new_id_dico_input").val().trim();
        var description = $(".new_description_dico_input").val().trim();
        var refID = $(".model_ref_selector option:selected").val();
        var refFamily = $(".model_ref_selector option:selected").data('family');
        var refModel = $(".model_ref_selector option:selected").data('model');
        var refType = $(".model_ref_selector option:selected").data('type');        
        
               
        if(newID != "" && description != "" ){
            if(Math.floor(newID) == newID && $.isNumeric(newID)){
                $(".step1 .error_form_text").html("");
                $(".dico_form.step1").removeClass("error");  
                checkNewID(newID, description, refID, refFamily, refModel, refType);
            }else{
                $(".step1 .error_form_text").html("New dictionary ID must be an Integer.");
                $(".dico_form.step1").addClass("error");
            }
        }else{
            $(".step1 .error_form_text").html("Some fields are missing.");
            $(".dico_form.step1").addClass("error");
        }        
    });    
    
    function checkNewID(newID, description, refID, refFamily, refModel, refType){
       $.ajax({
            url: '../php/api.php?function=check_new_id',
            type: 'POST',
            dataType: 'JSON',
            data:{newID:newID},
            success: function (data, statut) {
                if (data.length == 0) {
                    launchStep2(newID, description, refID, refFamily, refModel, refType);
                }else {
                    $(".step1 .error_form_text").html("This ID already exists and can't be added.");
                    $(".dico_form.step1").addClass("error");
                }
            }
        });
    }
    
    function launchStep2(newID, description, refID, refFamily, refModel, refType){
        $(".dico_step1").fadeOut(500);
        $(".dico_step2 .presentation .newID").html(newID);
        $(".dico_step2 .presentation .description_new_dico").html(description);
        $(".dico_step2 .presentation .ref_model").html(refFamily+ " "+refModel+" "+refType);      
        $.ajax({
            url: '../php/api.php?function=get_dictionaries_by_id&param1='+refID,
            type: 'GET',
            dataType: 'JSON',
            data:{},
            success: function (data, statut) {
                if (data.length == 0) {
                    alert("error");
                }else {
                    console.log(data);
                    contentArrayDicoButton.empty();
                    contentArrayDicoDisplay.empty();
                    contentArrayDicoDisplay.empty();
                    
                    for(var i=0; i< data.length; i++){
                        if(data[i].is_safety == 1){var isSafety = "<img src='../images/check_admin.png' title='This component is safety.'>"}else{var isSafety = "-"}
                        if(data[i].is_enable == 1){var isEnable = "<img src='../images/check_admin.png' title='This component is enable.'>"}else{var isEnable = "-"}
                        if(data[i].is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                        if(data[i].is_led == 1 || data[i].is_led == 2){var isLED = "<img src='../images/check_admin.png' title='This component is LED.'>"}else{var isLED = "-"}
                        if(data[i].is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}
                        
                        if(data[i].type == "button"){
                            contentArrayDicoButton.append("<div class='line_new_dico bt_"+i+"' data-index='bt_"+i+"' data-calibsubindexx='"+data[i].calib_subindex_x+"' data-calibsubindexy='"+data[i].calib_subindex_y+"' data-canid='"+data[i].can_id+"' data-description='"+data[i].description+"' data-dimsignal='"+data[i].dim_signal+"' data-familyid='"+data[i].family_id+"' data-flashsignal='"+data[i].flash_signal+"' data-id='"+data[i].id+"' data-iscdrh='"+data[i].is_cdrh+"' data-isenable='"+data[i].is_enable+"' data-isfinal='"+data[i].is_final+"' data-isled='"+data[i].is_led+"' data-issafety='"+data[i].is_safety+"' data-offsignal='"+data[i].off_signal+"' data-onsignal='"+data[i].on_signal+"' data-photolink='"+data[i].photo_link+"' data-pressedval='"+data[i].pressed_val+"' data-releasedval='"+data[i].released_val+"' data-standardname='"+data[i].standard_name+"' data-symbolname='"+data[i].symbol_name+"' data-thresholdmaxaxis='"+data[i].threshold_max_axis+"' data-threshold_max_zero='"+data[i].threshold_max_zero+"' data-thresholdminaxis='"+data[i].threshold_min_axis+"' data-thresholdminzero='"+data[i].threshold_min_zero+"' data-timer='"+data[i].timer+"' data-type='"+data[i].type+"' data-value='"+data[i].value+"' data-xpos='"+data[i].x_pos+"' data-ypos='"+data[i].y_pos+"' data-zone='"+data[i].zone+"'>"
                                    +"<div class='td_dico symbol_name'>"+data[i].symbol_name+"</div>"
                                    +"<div class='td_dico standard_name'>"+data[i].standard_name+"</div>"
                                    +"<div class='td_dico description'>"+data[i].description+"</div>"
                                    +"<div class='td_dico photo_link'><img src='../images/"+data[i].photo_link+"'></div>"
                                    +"<div class='td_dico is_safety'>"+isSafety+"</div>"
                                    +"<div class='td_dico is_enable'>"+isEnable+"</div>"
                                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"      
                                    +"<div class='td_dico is_led'>"+isLED+"</div>"
                                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                                    +"<div class='td_dico can_info' title='CAN ID : "+data[i].can_id+"\nCAN Data Press : "+data[i].pressed_val+"\nCAN Data Release : "+data[i].released_val+"'><img src='../images/search.png' ></div>"
                                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                                +"</div>");
                        }else if(data[i].type == "joystick" || data[i].type == "mushroom"){
                            contentArrayDicoJoystick.append("<div class='line_new_dico joy_"+i+"' data-index='joy_"+i+"' data-calibsubindexx='"+data[i].calib_subindex_x+"' data-calibsubindexy='"+data[i].calib_subindex_y+"' data-canid='"+data[i].can_id+"' data-description='"+data[i].description+"' data-dimsignal='"+data[i].dim_signal+"' data-familyid='"+data[i].family_id+"' data-flashsignal='"+data[i].flash_signal+"' data-id='"+data[i].id+"' data-iscdrh='"+data[i].is_cdrh+"' data-isenable='"+data[i].is_enable+"' data-isfinal='"+data[i].is_final+"' data-isled='"+data[i].is_led+"' data-issafety='"+data[i].is_safety+"' data-offsignal='"+data[i].off_signal+"' data-onsignal='"+data[i].on_signal+"' data-photolink='"+data[i].photo_link+"' data-pressedval='"+data[i].pressed_val+"' data-releasedval='"+data[i].released_val+"' data-standardname='"+data[i].standard_name+"' data-symbolname='"+data[i].symbol_name+"' data-thresholdmaxaxis='"+data[i].threshold_max_axis+"' data-threshold_max_zero='"+data[i].threshold_max_zero+"' data-thresholdminaxis='"+data[i].threshold_min_axis+"' data-thresholdminzero='"+data[i].threshold_min_zero+"' data-timer='"+data[i].timer+"' data-type='"+data[i].type+"' data-value='"+data[i].value+"' data-xpos='"+data[i].x_pos+"' data-ypos='"+data[i].y_pos+"' data-zone='"+data[i].zone+"'>"
                                    +"<div class='td_dico symbol_name'>"+data[i].symbol_name+"</div>"
                                    +"<div class='td_dico standard_name'>"+data[i].standard_name+"</div>"
                                    +"<div class='td_dico description'>"+data[i].description+"</div>"
                                    +"<div class='td_dico photo_link'><img src='../images/"+data[i].photo_link+"'></div>"
                                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"   
                                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                                +"</div>");
                        }else if(data[i].type == "display" || data[i].type == "buzzer"){
                            contentArrayDicoDisplay.append("<div class='line_new_dico disp_"+i+"'data-index='disp_"+i+"' data-calibsubindexx='"+data[i].calib_subindex_x+"' data-calibsubindexy='"+data[i].calib_subindex_y+"' data-canid='"+data[i].can_id+"' data-description='"+data[i].description+"' data-dimsignal='"+data[i].dim_signal+"' data-familyid='"+data[i].family_id+"' data-flashsignal='"+data[i].flash_signal+"' data-id='"+data[i].id+"' data-iscdrh='"+data[i].is_cdrh+"' data-isenable='"+data[i].is_enable+"' data-isfinal='"+data[i].is_final+"' data-isled='"+data[i].is_led+"' data-issafety='"+data[i].is_safety+"' data-offsignal='"+data[i].off_signal+"' data-onsignal='"+data[i].on_signal+"' data-photolink='"+data[i].photo_link+"' data-pressedval='"+data[i].pressed_val+"' data-releasedval='"+data[i].released_val+"' data-standardname='"+data[i].standard_name+"' data-symbolname='"+data[i].symbol_name+"' data-thresholdmaxaxis='"+data[i].threshold_max_axis+"' data-threshold_max_zero='"+data[i].threshold_max_zero+"' data-thresholdminaxis='"+data[i].threshold_min_axis+"' data-thresholdminzero='"+data[i].threshold_min_zero+"' data-timer='"+data[i].timer+"' data-type='"+data[i].type+"' data-value='"+data[i].value+"' data-xpos='"+data[i].x_pos+"' data-ypos='"+data[i].y_pos+"' data-zone='"+data[i].zone+"'>"
                                    +"<div class='td_dico symbol_name'>"+data[i].symbol_name+"</div>"
                                    +"<div class='td_dico standard_name'>"+data[i].standard_name+"</div>"
                                    +"<div class='td_dico description'>"+data[i].description+"</div>"
                                    +"<div class='td_dico photo_link'><img src='../images/"+data[i].photo_link+"'></div>"
                                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"   
                                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                                +"</div>");
                        }
                    }
                    
                    $(".delete_line").on('click', function(){
                        var name = $(this).parents(".line_new_dico").data('standard_name');
                        if (confirm('Confirm the deletion of entry '+name+'. This action is irreversible.')) {
                            $(this).parents(".line_new_dico").remove();
                        }                        
                    });
                    
                    $(".update_line").on('click', function(){
                        var id = $(this).parents(".line_new_dico").data('index');
                        var type = $(this).parents(".line_new_dico").data('type');
                        updateDictionaryLine(id, type); 
                    });
                    
                    
                    setTimeout(function(){
                        $(".dico_step2 .entry-bt").addClass("selected");
                        $(".dico_step2 .dictionary_type_listing.bouton-type").fadeIn(300);
                        $(".dico_step2").fadeIn(300);
                    },500);
                }
            }
        });
        
        function updateDictionaryLine(id, type){  
            
            console.log(id);
            
            var calib_subindex_x = $("."+id).data("calibsubindexx");
            var calib_subindex_y = $("."+id).data("calibsubindexy");
            var can_id = $("."+id).data("canid");
            var description = $("."+id).data("description");
            var dim_signal = $("."+id).data("dimsignal");
            var family_id = $("."+id).data("calibsubindexx");
            var flash_signal = $("."+id).data("flashsignal");
            var is_cdrh = $("."+id).data("iscdrh");
            var is_enable = $("."+id).data("isenable");
            var is_final = $("."+id).data("isfinal");
            var is_led = $("."+id).data("isled");
            var is_safety = $("."+id).data("issafety");
            var off_signal = $("."+id).data("offsignal");
            var on_signal = $("."+id).data("onsignal");
            var photo_link = $("."+id).data("photolink");
            var pressed_val = $("."+id).data("pressedval");
            var released_val = $("."+id).data("releasedval");
            var standard_name = $("."+id).data("standardname");
            var symbol_name = $("."+id).data("symbolname");
            var threshold_max_axis = $("."+id).data("thresholdmaxaxis");
            var threshold_max_zero = $("."+id).data("threshold_max_zero");
            var threshold_min_axis = $("."+id).data("thresholdminaxis");
            var threshold_min_zero = $("."+id).data("thresholdminzero");
            var timer = $("."+id).data("timer");
            var type_t = $("."+id).data("type");
            var value = $("."+id).data("value");
            var x_pos = $("."+id).data("xpos");
            var y_pos = $("."+id).data("ypos");
            var zone = $("."+id).data("zone");
            
            var lineArray = {
                symbol_name:symbol_name, standard_name: standard_name, description:description,
                is_led:is_led, is_safety:is_safety, is_enable:is_enable,
                is_cdrh:is_cdrh, is_final:is_final, zone:zone, timer:timer,
                photo_link:photo_link, can_id:can_id, pressed_val:pressed_val, released_val:released_val,
                on_signal:on_signal, off_signal:off_signal, flash_signal:flash_signal, dim_signal:dim_signal,
                x_pos:x_pos,y_pos:y_pos,threshold_max_axis:threshold_max_axis, threshold_max_zero:threshold_max_zero,
                threshold_min_axis:threshold_min_axis,threshold_min_zero:threshold_min_zero,
                calib_subindex_x:calib_subindex_x, calib_subindex_y:calib_subindex_y, type:type_t
            };
            if(type == "button"){
                updateFormButton(id, lineArray);
            }else if(type == "joystick" || type == "mushroom"){
                console.log(lineArray);
                updateFormJoystick(id, lineArray);
            }else if(type == "display" || type == "buzzer"){
                updateFormDisplay(id, lineArray);
            }
        }
        
        function updateFormButton(id, lineArray){            
            var formBtCtn = $(".dico_main_container .formulaire_update_button");
            
            formBtCtn.find(".update_bt").off();
            formBtCtn.find(".cancel_bt").off();
            
            formBtCtn.find(".cancel_bt").on('click', function(){
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
            });
            
            formBtCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
            
            console.log(lineArray);
            formBtCtn.find(".title").html("Update Button <b>"+lineArray.symbol_name+"</b> <img src='../images/"+lineArray.photo_link+"'>");
            formBtCtn.find(".symbol_name").val(lineArray.symbol_name);
            formBtCtn.find(".photo_link").val(lineArray.photo_link);
            formBtCtn.find(".standard_name").val(lineArray.standard_name);
            formBtCtn.find(".timer").val(lineArray.timer);
            formBtCtn.find(".description").val(lineArray.description);
            
            formBtCtn.find(".can_id").val(lineArray.can_id);
            formBtCtn.find(".pressed_value").val(lineArray.pressed_val);
            formBtCtn.find(".released_value").val(lineArray.released_val);
            
            formBtCtn.find(".on_signal").val(lineArray.on_signal);
            formBtCtn.find(".off_signal").val(lineArray.off_signal);
            formBtCtn.find(".dim_signal").val(lineArray.dim_signal);
            formBtCtn.find(".flash_signal").val(lineArray.flash_signal);
            
            formBtCtn.find(".is_safety option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_safety){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".is_enable option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_enable){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".is_cdrh option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_cdrh){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".is_final option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_final){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".is_led option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_led){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".zone option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.zone){$(this).attr('selected', 'selected')};
            });
            
            $(".dico_step2").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formBtCtn.fadeIn("200");
            
            
            
            formBtCtn.find(".update_bt").on('click', function(){
                
                var newLineArrayBt = {
                    type_array:"bt",
                    symbol_name:formBtCtn.find(".symbol_name").val(),
                    standard_name: formBtCtn.find(".standard_name").val(), 
                    description:formBtCtn.find(".description").val(),
                    is_led:formBtCtn.find(".is_led option:selected").val(), 
                    is_safety:formBtCtn.find(".is_safety option:selected").val(), 
                    is_enable:formBtCtn.find(".is_enable option:selected").val(),
                    is_cdrh:formBtCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formBtCtn.find(".is_final option:selected").val(), 
                    zone:formBtCtn.find(".zone option:selected").val(), 
                    timer:formBtCtn.find(".timer").val(),
                    photo_link:formBtCtn.find(".photo_link").val(),
                    can_id:formBtCtn.find(".can_id").val(),
                    pressed_val:formBtCtn.find(".pressed_value").val(),
                    released_val:formBtCtn.find(".released_value").val(),
                    on_signal:formBtCtn.find(".on_signal").val(),
                    off_signal:formBtCtn.find(".off_signal").val(),
                    flash_signal:formBtCtn.find(".flash_signal").val(),
                    dim_signal:formBtCtn.find(".dim_signal").val()
                }
                
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
                
                updateLineNewInfo(id, newLineArrayBt)
            });
        }
        
        function updateFormJoystick(id, lineArray){
            
            var formBtCtn = $(".dico_main_container .formulaire_update_joystick");
            formBtCtn.find(".update_bt").off();
            formBtCtn.find(".cancel_bt").off();
            
            
            formBtCtn.find(".cancel_bt").on('click', function(){
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
            });
            
            formBtCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
            
            console.log(lineArray);
            formBtCtn.find(".title").html("Update Joystick <b>"+lineArray.symbol_name+"</b> <img src='../images/"+lineArray.photo_link+"'>");
            
            formBtCtn.find(".symbol_name").val(lineArray.symbol_name);
            
            formBtCtn.find(".photo_link").val(lineArray.photo_link);
            formBtCtn.find(".standard_name").val(lineArray.standard_name);
            formBtCtn.find(".timer").val(lineArray.timer);
            formBtCtn.find(".description").val(lineArray.description);
            
            formBtCtn.find(".x_pos").val(lineArray.x_pos);
            formBtCtn.find(".y_pos").val(lineArray.y_pos);
            formBtCtn.find(".calib_subindex_x").val(lineArray.calib_subindex_x);
            formBtCtn.find(".calib_subindex_y").val(lineArray.calib_subindex_y);
            formBtCtn.find(".threshold_max_zero").val(lineArray.threshold_max_zero);
            formBtCtn.find(".threshold_max_axis").val(lineArray.threshold_max_axis);
            formBtCtn.find(".threshold_min_axis").val(lineArray.threshold_min_axis);
            formBtCtn.find(".threshold_min_zero").val(lineArray.threshold_min_zero);
            formBtCtn.find(".calib_subindex_x").val(lineArray.calib_subindex_x);
            formBtCtn.find(".calib_subindex_y").val(lineArray.calib_subindex_y);
            
            formBtCtn.find(".can_id").val(lineArray.can_id);
            formBtCtn.find(".pressed_value").val(lineArray.pressed_val);
            formBtCtn.find(".released_value").val(lineArray.released_val);
                                   
                        
            formBtCtn.find(".is_cdrh option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_cdrh){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".is_final option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_final){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".type option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.type){$(this).attr('selected', 'selected')};
            });
            
            
            
            $(".dico_step2").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formBtCtn.fadeIn("200");
            
            formBtCtn.find(".update_bt").on('click', function(){
                
                var newLineArrayBt = {
                    type_array:"joy",
                    symbol_name:formBtCtn.find(".symbol_name").val(),
                    standard_name: formBtCtn.find(".standard_name").val(), 
                    description:formBtCtn.find(".description").val(),
                    is_cdrh:formBtCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formBtCtn.find(".is_final option:selected").val(),
                    timer:formBtCtn.find(".timer").val(),
                    photo_link:formBtCtn.find(".photo_link").val(),
                    can_id:formBtCtn.find(".can_id").val(),
                    x_pos:formBtCtn.find(".x_pos").val(),
                    y_pos:formBtCtn.find(".y_pos").val(),
                    threshold_max_axis:formBtCtn.find(".threshold_max_axis").val(), 
                    threshold_max_zero:formBtCtn.find(".threshold_max_zero").val(),
                    threshold_min_axis:formBtCtn.find(".threshold_min_axis").val(),
                    threshold_min_zero:formBtCtn.find(".threshold_min_zero").val(),
                    calib_subindex_x:formBtCtn.find(".calib_subindex_x").val(),
                    calib_subindex_y:formBtCtn.find(".calib_subindex_y").val(),
                    type:formBtCtn.find(".type option:selected").val()
                }
                
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
                
                updateLineNewInfo(id, newLineArrayBt)
            });
        }
        
        function updateFormDisplay(id, lineArray){
            
            var formDispCtn = $(".dico_main_container .formulaire_update_display");
            
            formDispCtn.find(".update_bt").off();
            formDispCtn.find(".cancel_bt").off();
            
            formDispCtn.find(".cancel_bt").on('click', function(){
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formDispCtn.fadeOut("200");
            });
            
            formDispCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
            
            console.log(lineArray);
            formDispCtn.find(".title").html("Update Display/Buzzer <b>"+lineArray.symbol_name+"</b> <img src='../images/"+lineArray.photo_link+"'>");
            formDispCtn.find(".symbol_name").val(lineArray.symbol_name);
            formDispCtn.find(".photo_link").val(lineArray.photo_link);
            formDispCtn.find(".standard_name").val(lineArray.standard_name);
            formDispCtn.find(".timer").val(lineArray.timer);
            formDispCtn.find(".description").val(lineArray.description);
            formDispCtn.find(".on_signal").val(lineArray.on_signal);
            formDispCtn.find(".off_signal").val(lineArray.off_signal);
            formDispCtn.find(".dim_signal").val(lineArray.dim_signal);
            formDispCtn.find(".flash_signal").val(lineArray.flash_signal);
            
            
            formDispCtn.find(".is_cdrh option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_cdrh){$(this).attr('selected', 'selected')};
            });
            
            formDispCtn.find(".is_final option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_final){$(this).attr('selected', 'selected')};
            }); 
            
            formDispCtn.find(".type option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.type){$(this).attr('selected', 'selected')};
            });      
            
            $(".dico_step2").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formDispCtn.fadeIn("200");
            
            formDispCtn.find(".update_bt").on('click', function(){
                
                var newLineArrayBt = {
                    type_array:"disp",
                    symbol_name:formDispCtn.find(".symbol_name").val(),
                    standard_name: formDispCtn.find(".standard_name").val(), 
                    description:formDispCtn.find(".description").val(),                                         
                    is_cdrh:formDispCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formDispCtn.find(".is_final option:selected").val(),
                    timer:formDispCtn.find(".timer").val(),
                    photo_link:formDispCtn.find(".photo_link").val(),          
                    on_signal:formDispCtn.find(".on_signal").val(),
                    off_signal:formDispCtn.find(".off_signal").val(),
                    flash_signal:formDispCtn.find(".flash_signal").val(),
                    dim_signal:formDispCtn.find(".dim_signal").val(),
                    type:formDispCtn.find(".type option:selected").val()
                }
                
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formDispCtn.fadeOut("200");
                
                updateLineNewInfo(id, newLineArrayBt)
            });
        }
        
        function updateLineNewInfo(id, newLineArrayBt){
            console.log(id);
            console.log(newLineArrayBt);
            
            
            if(newLineArrayBt.type_array == "bt"){
                var formBtCtn = $(".dico_main_container .formulaire_update_button");
                
                if(newLineArrayBt.is_safety == 1){var isSafety = "<img src='../images/check_admin.png' title='This component is safety.'>"}else{var isSafety = "-"}
                if(newLineArrayBt.is_enable == 1){var isEnable = "<img src='../images/check_admin.png' title='This component is enable.'>"}else{var isEnable = "-"}
                if(newLineArrayBt.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                if(newLineArrayBt.is_led == 1 || newLineArrayBt.is_led == 2){var isLED = "<img src='../images/check_admin.png' title='This component is LED.'>"}else{var isLED = "-"}
                if(newLineArrayBt.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}                
                
                $(".dictionary_type_listing").find("."+id).data('symbolname', newLineArrayBt.symbol_name);
                $(".dictionary_type_listing").find("."+id).data('standardname', newLineArrayBt.standard_name);
                $(".dictionary_type_listing").find("."+id).data('description', newLineArrayBt.description);
                $(".dictionary_type_listing").find("."+id).data('isled', newLineArrayBt.is_led);
                $(".dictionary_type_listing").find("."+id).data('issafety', newLineArrayBt.is_safety);
                $(".dictionary_type_listing").find("."+id).data('isenable', newLineArrayBt.is_enable);
                $(".dictionary_type_listing").find("."+id).data('iscdrh', newLineArrayBt.is_cdrh);
                $(".dictionary_type_listing").find("."+id).data('isfinal', newLineArrayBt.is_final);
                $(".dictionary_type_listing").find("."+id).data('zone', newLineArrayBt.zone);
                $(".dictionary_type_listing").find("."+id).data('timer', newLineArrayBt.timer);
                $(".dictionary_type_listing").find("."+id).data('photolink', newLineArrayBt.photo_link);
                $(".dictionary_type_listing").find("."+id).data('canid', newLineArrayBt.can_id);
                $(".dictionary_type_listing").find("."+id).data('pressedval', newLineArrayBt.pressed_val);
                $(".dictionary_type_listing").find("."+id).data('releasedval', newLineArrayBt.released_val);
                $(".dictionary_type_listing").find("."+id).data('onsignal', newLineArrayBt.on_signal);
                $(".dictionary_type_listing").find("."+id).data('offsignal', newLineArrayBt.off_signal);
                $(".dictionary_type_listing").find("."+id).data('flashsignal', newLineArrayBt.flash_signal);
                $(".dictionary_type_listing").find("."+id).data('dimsignal', newLineArrayBt.dim_signal);
                
                $(".dictionary_type_listing").find("."+id+" .symbol_name").html(newLineArrayBt.symbol_name);
                $(".dictionary_type_listing").find("."+id+" .standard_name").html(newLineArrayBt.standard_name);
                $(".dictionary_type_listing").find("."+id+" .description").html(newLineArrayBt.description);
                $(".dictionary_type_listing").find("."+id+" .photo_link").html("<img src='../images/"+newLineArrayBt.photo_link+"'>");
                
                $(".dictionary_type_listing").find("."+id+" .can_info").attr('title', "CAN ID : "+newLineArrayBt.can_id+"\nCAN Data Press : "+newLineArrayBt.pressed_val+"\nCAN Data Release : "+newLineArrayBt.released_val);
                
                $(".dictionary_type_listing").find("."+id+" .is_safety").html(isSafety);
                $(".dictionary_type_listing").find("."+id+" .is_enable").html(isEnable);
                $(".dictionary_type_listing").find("."+id+" .is_cdrh").html(isCDRH);
                $(".dictionary_type_listing").find("."+id+" .is_led").html(isLED);
                $(".dictionary_type_listing").find("."+id+" .is_final").html(isFinal);
                
                formBtCtn.find(".update_bt").off();
                formBtCtn.find(".cancel_bt").off();
                
            }else if(newLineArrayBt.type_array == "joy"){
                var formBtCtn = $(".dico_main_container .formulaire_update_button");
                
                if(newLineArrayBt.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}                
                if(newLineArrayBt.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}                
                
                $(".dictionary_type_listing").find("."+id).data('symbolname', newLineArrayBt.symbol_name);
                $(".dictionary_type_listing").find("."+id).data('standardname', newLineArrayBt.standard_name);
                $(".dictionary_type_listing").find("."+id).data('description', newLineArrayBt.description);
                $(".dictionary_type_listing").find("."+id).data('isenable', newLineArrayBt.is_enable);
                $(".dictionary_type_listing").find("."+id).data('iscdrh', newLineArrayBt.is_cdrh);
                $(".dictionary_type_listing").find("."+id).data('isfinal', newLineArrayBt.is_final);
                $(".dictionary_type_listing").find("."+id).data('timer', newLineArrayBt.timer);
                $(".dictionary_type_listing").find("."+id).data('photolink', newLineArrayBt.photo_link);
                $(".dictionary_type_listing").find("."+id).data('canid', newLineArrayBt.can_id);
                $(".dictionary_type_listing").find("."+id).data('type', newLineArrayBt.type);
                
                $(".dictionary_type_listing").find("."+id).data('xpos', newLineArrayBt.x_pos);
                $(".dictionary_type_listing").find("."+id).data('ypos', newLineArrayBt.y_pos);
                
                $(".dictionary_type_listing").find("."+id).data('calibsubindexx', newLineArrayBt.calib_subindex_x);
                $(".dictionary_type_listing").find("."+id).data('calibsubindexy', newLineArrayBt.calib_subindex_y);
                
                $(".dictionary_type_listing").find("."+id).data('thresholdmaxaxis', newLineArrayBt.threshold_max_axis);
                $(".dictionary_type_listing").find("."+id).data('thresholdminaxis', newLineArrayBt.threshold_min_axis);
                $(".dictionary_type_listing").find("."+id).data('thresholdminzero', newLineArrayBt.threshold_min_zero);
                $(".dictionary_type_listing").find("."+id).data('threshold_max_zero', newLineArrayBt.threshold_max_zero);
                
                $(".dictionary_type_listing").find("."+id+" .symbol_name").html(newLineArrayBt.symbol_name);
                $(".dictionary_type_listing").find("."+id+" .standard_name").html(newLineArrayBt.standard_name);
                $(".dictionary_type_listing").find("."+id+" .description").html(newLineArrayBt.description);
                $(".dictionary_type_listing").find("."+id+" .photo_link").html("<img src='../images/"+newLineArrayBt.photo_link+"'>");
                
                $(".dictionary_type_listing").find("."+id+" .is_cdrh").html(isCDRH);
                $(".dictionary_type_listing").find("."+id+" .is_final").html(isFinal);
                
                formBtCtn.find(".update_bt").off();
                formBtCtn.find(".cancel_bt").off();
                
            }else if(newLineArrayBt.type_array == "disp"){
                var formBtCtn = $(".dico_main_container .formulaire_update_button");
                
                if(newLineArrayBt.is_safety == 1){var isSafety = "<img src='../images/check_admin.png' title='This component is safety.'>"}else{var isSafety = "-"}
                if(newLineArrayBt.is_enable == 1){var isEnable = "<img src='../images/check_admin.png' title='This component is enable.'>"}else{var isEnable = "-"}
                if(newLineArrayBt.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                if(newLineArrayBt.is_led == 1 || newLineArrayBt.is_led == 2){var isLED = "<img src='../images/check_admin.png' title='This component is LED.'>"}else{var isLED = "-"}
                if(newLineArrayBt.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}                
                
                $(".dictionary_type_listing").find("."+id).data('symbolname', newLineArrayBt.symbol_name);
                $(".dictionary_type_listing").find("."+id).data('standardname', newLineArrayBt.standard_name);
                $(".dictionary_type_listing").find("."+id).data('description', newLineArrayBt.description);
                $(".dictionary_type_listing").find("."+id).data('iscdrh', newLineArrayBt.is_cdrh);
                $(".dictionary_type_listing").find("."+id).data('isfinal', newLineArrayBt.is_final);
                $(".dictionary_type_listing").find("."+id).data('timer', newLineArrayBt.timer);
                $(".dictionary_type_listing").find("."+id).data('photolink', newLineArrayBt.photo_link);
                $(".dictionary_type_listing").find("."+id).data('canid', newLineArrayBt.can_id);
                $(".dictionary_type_listing").find("."+id).data('onsignal', newLineArrayBt.on_signal);
                $(".dictionary_type_listing").find("."+id).data('offsignal', newLineArrayBt.off_signal);
                $(".dictionary_type_listing").find("."+id).data('flashsignal', newLineArrayBt.flash_signal);
                $(".dictionary_type_listing").find("."+id).data('dimsignal', newLineArrayBt.dim_signal);
                $(".dictionary_type_listing").find("."+id).data('type', newLineArrayBt.type);
                
                $(".dictionary_type_listing").find("."+id+" .symbol_name").html(newLineArrayBt.symbol_name);
                $(".dictionary_type_listing").find("."+id+" .standard_name").html(newLineArrayBt.standard_name);
                $(".dictionary_type_listing").find("."+id+" .description").html(newLineArrayBt.description);
                $(".dictionary_type_listing").find("."+id+" .photo_link").html("<img src='../images/"+newLineArrayBt.photo_link+"'>");
                
                $(".dictionary_type_listing").find("."+id+" .can_info").attr('title', "CAN ID : "+newLineArrayBt.can_id+"\nCAN Data Press : "+newLineArrayBt.pressed_val+"\nCAN Data Release : "+newLineArrayBt.released_val);
                
                $(".dictionary_type_listing").find("."+id+" .is_cdrh").html(isCDRH);
                $(".dictionary_type_listing").find("."+id+" .is_final").html(isFinal);
                
                formBtCtn.find(".update_bt").off();
                formBtCtn.find(".cancel_bt").off();
            }
            
            $(".dictionary_type_listing").find("."+id).addClass("updated_state");
            
            console.log($(".dictionary_type_listing").find("."+id).data('symbolname'));
            
            
        }
        
        $(".add_new_entry").on('click', function(){
            if($(this).hasClass("bt")){
                createNewButton();
            }else if($(this).hasClass("joy")){
                createNewJoystick();
            }else if($(this).hasClass("disp")){
                createNewDisplay();
            }
        })
        
        function createNewButton(){
            var formBtCtn = $(".dico_main_container .formulaire_create_button");
            
            $(".dico_step2").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formBtCtn.fadeIn("200");
            
            formBtCtn.find(".symbol_name").val("");
            formBtCtn.find(".standard_name").val(""); 
            formBtCtn.find(".description").val("");
            
            formBtCtn.find(".is_led option").removeAttr('selected'); 
            formBtCtn.find(".is_safety option").removeAttr('selected');;
            formBtCtn.find(".is_enable option").removeAttr('selected');
            formBtCtn.find(".is_cdrh option").removeAttr('selected');
            formBtCtn.find(".is_final option").removeAttr('selected');
            formBtCtn.find(".zone option").removeAttr('selected');
            
            formBtCtn.find(".timer").val("");
            formBtCtn.find(".photo_link").val("");
            formBtCtn.find(".can_id").val("");
            formBtCtn.find(".pressed_value").val("");
            formBtCtn.find(".released_value").val("");
            formBtCtn.find(".on_signal").val("");
            formBtCtn.find(".off_signal").val("");
            formBtCtn.find(".flash_signal").val("");
            formBtCtn.find(".dim_signal").val("");
            
            formBtCtn.find(".create_bt").off();
            formBtCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
    
            formBtCtn.find(".create_bt").on('click', function(){
                
                var newLineArrayBt = {
                    type_array: "bt",
                    symbol_name:formBtCtn.find(".symbol_name").val(),
                    standard_name: formBtCtn.find(".standard_name").val(), 
                    description:formBtCtn.find(".description").val(),
                    is_led:formBtCtn.find(".is_led option:selected").val(), 
                    is_safety:formBtCtn.find(".is_safety option:selected").val(), 
                    is_enable:formBtCtn.find(".is_enable option:selected").val(),
                    is_cdrh:formBtCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formBtCtn.find(".is_final option:selected").val(), 
                    zone:formBtCtn.find(".zone option:selected").val(), 
                    timer:formBtCtn.find(".timer").val(),
                    photo_link:formBtCtn.find(".photo_link").val(),
                    can_id:formBtCtn.find(".can_id").val(),
                    pressed_val:formBtCtn.find(".pressed_value").val(),
                    released_val:formBtCtn.find(".released_value").val(),
                    on_signal:formBtCtn.find(".on_signal").val(),
                    off_signal:formBtCtn.find(".off_signal").val(),
                    flash_signal:formBtCtn.find(".flash_signal").val(),
                    dim_signal:formBtCtn.find(".dim_signal").val()
                }
                
                if(newLineArrayBt.is_safety == 1){var isSafety = "<img src='../images/check_admin.png' title='This component is safety.'>"}else{var isSafety = "-"}
                if(newLineArrayBt.is_enable == 1){var isEnable = "<img src='../images/check_admin.png' title='This component is enable.'>"}else{var isEnable = "-"}
                if(newLineArrayBt.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                if(newLineArrayBt.is_led == 1 || newLineArrayBt.is_led == 2){var isLED = "<img src='../images/check_admin.png' title='This component is LED.'>"}else{var isLED = "-"}
                if(newLineArrayBt.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}   
                
                var count = ($(".dico_step2 .dictionary_type_listing.bouton-type .line_new_dico").length)+50;;
                
                var newEntry = "<div class='line_new_dico bt_"+count+" created_state' data-index='bt_"+count+"' data-calibsubindexx='' data-calibsubindexy='' data-canid='"+newLineArrayBt.can_id+"' data-description='"+newLineArrayBt.description+"' data-dimsignal='"+newLineArrayBt.dim_signal+"' data-familyid='' data-flashsignal='"+newLineArrayBt.flash_signal+"' data-id='' data-iscdrh='"+newLineArrayBt.is_cdrh+"' data-isenable='"+newLineArrayBt.is_enable+"' data-isfinal='"+newLineArrayBt.is_final+"' data-isled='"+newLineArrayBt.is_led+"' data-issafety='"+newLineArrayBt.is_safety+"' data-offsignal='"+newLineArrayBt.off_signal+"' data-onsignal='"+newLineArrayBt.on_signal+"' data-photolink='"+newLineArrayBt.photo_link+"' data-pressedval='"+newLineArrayBt.pressed_val+"' data-releasedval='"+newLineArrayBt.released_val+"' data-standardname='"+newLineArrayBt.standard_name+"' data-symbolname='"+newLineArrayBt.symbol_name+"' data-thresholdmaxaxis='0' data-threshold_max_zero='0' data-thresholdminaxis='0' data-thresholdminzero='0' data-timer='"+newLineArrayBt.timer+"' data-type='button' data-value='' data-xpos='' data-ypos='' data-zone='"+newLineArrayBt.zone+"'>"
                    +"<div class='td_dico symbol_name'>"+newLineArrayBt.symbol_name+"</div>"
                    +"<div class='td_dico standard_name'>"+newLineArrayBt.standard_name+"</div>"
                    +"<div class='td_dico description'>"+newLineArrayBt.description+"</div>"
                    +"<div class='td_dico photo_link'><img src='../images/"+newLineArrayBt.photo_link+"'></div>"
                    +"<div class='td_dico is_safety'>"+isSafety+"</div>"
                    +"<div class='td_dico is_enable'>"+isEnable+"</div>"
                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"      
                    +"<div class='td_dico is_led'>"+isLED+"</div>"
                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                    +"<div class='td_dico can_info' title='CAN ID : "+newLineArrayBt.can_id+"\nCAN Data Press : "+newLineArrayBt.pressed_val+"\nCAN Data Release : "+newLineArrayBt.released_val+"'><img src='../images/search.png' ></div>"
                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                +"</div>";
        
                $(".dictionary_type_listing.bouton-type .content_new_dico").append(newEntry);
                
                
                $(".bt_"+count+" .delete_line").on('click', function(){
                        var name = $(this).parents(".line_new_dico").data('standard_name');
                        if (confirm('Confirm the deletion of entry '+name+'. This action is irreversible.')) {
                            $(this).parents(".line_new_dico").remove();
                        }                        
                });

                $(".bt_"+count+" .update_line").on('click', function(){
                    var id = $(this).parents(".line_new_dico").data('index');
                    var type = $(this).parents(".line_new_dico").data('type');
                    updateDictionaryLine(id, type); 
                });
                
                
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
                
            });
        
            formBtCtn.find(".cancel_bt").on('click', function(){
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
            });
        
        }
        
        function createNewJoystick(){
            var formJoyCtn = $(".dico_main_container .formulaire_create_joystick");
            formJoyCtn.find(".create_bt").off();
            $(".dico_step2").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formJoyCtn.fadeIn("200");
            formJoyCtn.find("input").val("");
            formJoyCtn.find(".create_button").off();
            formJoyCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
    
            formJoyCtn.find(".create_bt").on('click', function(){
                
                var newLineArrayJoy = {
                    type_array:"joy",
                    symbol_name:formJoyCtn.find(".symbol_name").val(),
                    standard_name: formJoyCtn.find(".standard_name").val(), 
                    description:formJoyCtn.find(".description").val(),
                    is_cdrh:formJoyCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formJoyCtn.find(".is_final option:selected").val(),
                    type:formJoyCtn.find(".type option:selected").val(),
                    timer:formJoyCtn.find(".timer").val(),
                    photo_link:formJoyCtn.find(".photo_link").val(),
                    can_id:formJoyCtn.find(".can_id").val(),
                    x_pos:formJoyCtn.find(".x_pos").val(),
                    y_pos:formJoyCtn.find(".y_pos").val(),
                    threshold_max_axis:formJoyCtn.find(".threshold_max_axis").val(), 
                    threshold_max_zero:formJoyCtn.find(".threshold_max_zero").val(),
                    threshold_min_axis:formJoyCtn.find(".threshold_min_axis").val(),
                    threshold_min_zero:formJoyCtn.find(".threshold_min_zero").val(),
                    calib_subindex_x:formJoyCtn.find(".calib_subindex_x").val(),
                    calib_subindex_y:formJoyCtn.find(".calib_subindex_y").val()
                }
                               
                if(newLineArrayJoy.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                if(newLineArrayJoy.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}   
                
                var count = ($(".dico_step2 dictionary_type_listing.joystick-type .line_new_dico").length)+50;;
                                       
                var newEntry = "<div class='line_new_dico joy_"+count+" created_state' data-index='joy_"+count+"' data-calibsubindexx='"+newLineArrayJoy.calib_subindex_x+"' data-calibsubindexy='"+newLineArrayJoy.calib_subindex_y+"' data-canid='"+newLineArrayJoy.can_id+"' data-description='"+newLineArrayJoy.description+"' data-dimsignal='' data-familyid='' data-flashsignal='' data-id='' data-iscdrh='"+newLineArrayJoy.is_cdrh+"' data-isenable='0' data-isfinal='"+newLineArrayJoy.is_final+"' data-isled='0' data-issafety='0' data-offsignal='' data-onsignal='' data-photolink='"+newLineArrayJoy.photo_link+"' data-pressedval='' data-releasedval='' data-standardname='"+newLineArrayJoy.standard_name+"' data-symbolname='"+newLineArrayJoy.symbol_name+"' data-thresholdmaxaxis='"+newLineArrayJoy.threshold_max_axis+"' data-threshold_max_zero='"+newLineArrayJoy.threshold_max_zero+"' data-thresholdminaxis='"+newLineArrayJoy.threshold_min_axis+"' data-thresholdminzero='"+newLineArrayJoy.threshold_min_zero+"' data-timer='"+newLineArrayJoy.timer+"' data-type='"+newLineArrayJoy.type+"' data-value='' data-xpos='"+newLineArrayJoy.x_pos+"' data-ypos='"+newLineArrayJoy.y_pos+"' data-zone='50'>"
                    +"<div class='td_dico symbol_name'>"+newLineArrayJoy.symbol_name+"</div>"
                    +"<div class='td_dico standard_name'>"+newLineArrayJoy.standard_name+"</div>"
                    +"<div class='td_dico description'>"+newLineArrayJoy.description+"</div>"
                    +"<div class='td_dico photo_link'><img src='../images/"+newLineArrayJoy.photo_link+"'></div>"
                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"   
                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                +"</div>";
        
                $(".dictionary_type_listing.joystick-type .content_new_dico").append(newEntry);
                                
                $(".joy_"+count+" .delete_line").on('click', function(){
                        var name = $(this).parents(".line_new_dico").data('standard_name');
                        if (confirm('Confirm the deletion of entry '+name+'. This action is irreversible.')) {
                            $(this).parents(".line_new_dico").remove();
                        }                        
                });

                $(".joy_"+count+" .update_line").on('click', function(){
                    var id = $(this).parents(".line_new_dico").data('index');
                    var type = $(this).parents(".line_new_dico").data('type');
                    updateDictionaryLine(id, type); 
                });                
                
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formJoyCtn.fadeOut("200");
                
            });
            
            formJoyCtn.find(".cancel_bt").on('click', function(){
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formJoyCtn.fadeOut("200");
            });
        }
        
        function createNewDisplay(){
            var formDispCtn = $(".dico_main_container .formulaire_create_display");
            formDispCtn.find(".title").html("Create new Display/Buzzer");
            
            $(".dico_step2").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formDispCtn.fadeIn("200");
            
            formDispCtn.find(".create_bt").off();
            formDispCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
    
            formDispCtn.find(".create_bt").on('click', function(){
                
                var newLineArrayDisp = {
                    type_array: "bt",
                    symbol_name:formDispCtn.find(".symbol_name").val(),
                    standard_name: formDispCtn.find(".standard_name").val(), 
                    description:formDispCtn.find(".description").val(),
                    is_cdrh:formDispCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formDispCtn.find(".is_final option:selected").val(), 
                    timer:formDispCtn.find(".timer").val(),
                    photo_link:formDispCtn.find(".photo_link").val(),
                    on_signal:formDispCtn.find(".on_signal").val(),
                    off_signal:formDispCtn.find(".off_signal").val(),
                    flash_signal:formDispCtn.find(".flash_signal").val(),
                    dim_signal:formDispCtn.find(".dim_signal").val(),
                    type:formDispCtn.find(".type option:selected").val()
                }
                
                if(newLineArrayDisp.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                if(newLineArrayDisp.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}   
                
                var count = ($(".dico_step2 .dictionary_type_listing.display-type .line_new_dico").length)+1;
                
                var newEntry = "<div class='line_new_dico disp_"+count+" created_state'data-index='disp_"+count+"' data-calibsubindexx='' data-calibsubindexy='' data-canid='' data-description='"+newLineArrayDisp.description+"' data-dimsignal='"+newLineArrayDisp.dim_signal+"' data-familyid='' data-flashsignal='"+newLineArrayDisp.flash_signal+"' data-id='' data-iscdrh='"+newLineArrayDisp.is_cdrh+"' data-isenable='0' data-isfinal='"+newLineArrayDisp.is_final+"' data-isled='0' data-issafety='0' data-offsignal='"+newLineArrayDisp.off_signal+"' data-onsignal='"+newLineArrayDisp.on_signal+"' data-photolink='"+newLineArrayDisp.photo_link+"' data-pressedval='' data-releasedval='' data-standardname='"+newLineArrayDisp.standard_name+"' data-symbolname='"+newLineArrayDisp.symbol_name+"' data-thresholdmaxaxis='' data-threshold_max_zero='' data-thresholdminaxis='' data-thresholdminzero='' data-timer='"+newLineArrayDisp.timer+"' data-type='"+newLineArrayDisp.type+"' data-value='' data-xpos='' data-ypos='' data-zone='50'>"
                    +"<div class='td_dico symbol_name'>"+newLineArrayDisp.symbol_name+"</div>"
                    +"<div class='td_dico standard_name'>"+newLineArrayDisp.standard_name+"</div>"
                    +"<div class='td_dico description'>"+newLineArrayDisp.description+"</div>"
                    +"<div class='td_dico photo_link'><img src='../images/"+newLineArrayDisp.photo_link+"'></div>"
                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"   
                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                +"</div>";
                
        
                $(".dictionary_type_listing.display-type .content_new_dico").append(newEntry);
                
                
                $(".disp_"+count+" .delete_line").on('click', function(){
                        var name = $(this).parents(".line_new_dico").data('standard_name');
                        if (confirm('Confirm the deletion of entry '+name+'. This action is irreversible.')) {
                            $(this).parents(".line_new_dico").remove();
                        }                        
                });

                $(".disp_"+count+" .update_line").on('click', function(){
                    var id = $(this).parents(".line_new_dico").data('index');
                    var type = $(this).parents(".line_new_dico").data('type');
                    updateDictionaryLine(id, type); 
                });
                
                
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formDispCtn.fadeOut("200");
                
            });
            
            formDispCtn.find(".cancel_bt").on('click', function(){
                $(".dico_step2").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formDispCtn.fadeOut("200");
            });
        }
        
        $(".create_new_dico").on('click', function(){
            saveDictionaryInDatabase(newID, description, refID, refFamily, refModel, refType);
        });
        
    }
    
    function saveDictionaryInDatabase(newID, description, refID, refFamily, refModel, refType){
        
        var newDictionaryData = [];
        
        $("#adm_content_dictionaries .dictionary_type_listing .line_new_dico").each(function(){
            
            var calib_subindex_x = $(this).data("calibsubindexx");
            var calib_subindex_y = $(this).data("calibsubindexy");
            var can_id =  $(this).data("canid");
            var description = $(this).data("description");
            var dim_signal = $(this).data("dimsignal");
            var family_id = newID;
            var flash_signal = $(this).data("flashsignal");
            var is_cdrh = $(this).data("iscdrh");
            var is_enable = $(this).data("isenable");
            var is_final = $(this).data("isfinal");
            var is_led = $(this).data("isled");
            var is_safety = $(this).data("issafety");
            var off_signal = $(this).data("offsignal");
            var on_signal = $(this).data("onsignal");
            var photo_link = $(this).data("photolink");
            var pressed_val = $(this).data("pressedval");
            var released_val = $(this).data("releasedval");
            var standard_name = $(this).data("standardname");
            var symbol_name = $(this).data("symbolname");
            var threshold_max_axis = $(this).data("thresholdmaxaxis");
            var threshold_max_zero = $(this).data("threshold_max_zero");
            var threshold_min_axis = $(this).data("thresholdminaxis");
            var threshold_min_zero = $(this).data("thresholdminzero");
            var timer = $(this).data("timer");
            var type_t = $(this).data("type");
            var value = $(this).data("value");
            var x_pos = $(this).data("xpos");
            var y_pos = $(this).data("ypos");
            var zone = $(this).data("zone");
            
            newDictionaryData.push({
                calib_subindex_x:calib_subindex_x,
                calib_subindex_y:calib_subindex_y,
                can_id:can_id,
                description:description,
                dim_signal:dim_signal,
                family_id:family_id,
                flash_signal:flash_signal,
                is_cdrh:is_cdrh,
                is_enable:is_enable,
                is_final:is_final,
                is_led:is_led,
                is_safety:is_safety,
                off_signal:off_signal,
                on_signal:on_signal,
                photo_link:photo_link,
                pressed_val:pressed_val,
                released_val:released_val,
                standard_name:standard_name,
                symbol_name:symbol_name,
                threshold_max_axis:threshold_max_axis,
                threshold_max_zero:threshold_max_zero,
                threshold_min_axis:threshold_min_axis,
                threshold_min_zero:threshold_min_zero,
                timer:timer,
                type:type_t,
                value:value,
                x_pos:x_pos,
                y_pos:y_pos,
                zone:zone
            });
                        
        });
        
        var newDictionaryJson = JSON.stringify(newDictionaryData);
        
         if (confirm('Confirm creation of dictionary ID '+ newID+". This action will add this dictionary in database.")) {
            $.ajax({
                url: '../php/api.php?function=save_new_dictionary',
                type: 'POST',
                dataType: 'JSON',
                data:{
                    newID:newID,
                    description:description,
                    refID:refID,
                    refFamily:refFamily,
                    refModel:refModel,
                    refType:refType,
                    jsonDico:newDictionaryJson
                },
                success: function (data, statut) {
                    
                }
            });
            setTimeout(function(){
                $(".dico_step2").fadeOut(200); 
                $(".dico_step3 .title").html("Congratulations, new dictionary ID "+newID+" - "+description+" - is now created and available.");
                $(".dico_step3").fadeIn("200");
            },500);
        }        
        
    }
    
    $(".dico_step3 .okay").on('click', function(){
        $(".dico_step3").fadeOut("200");
        $(".dico_step1").fadeIn("200");
    })
    
    //================================================ SHOW =====================
    
    $(".show_dictionary_page").on('click', function(){
        getDictionaryAdmin();
    });
    
    function getDictionaryAdmin(){
        $.ajax({
            url: '../php/api.php?function=get_all_dictionaries',
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                fillDictionariesTable(data);
            }
        });
    }
    
    function fillDictionariesTable(data){
        var dictionaryTable = $(".content_show_dico");        
        dictionaryTable.empty();
        
        console.log(data);
        if(data.length > 0){
            $(".adm_show_dictionary_container .result_description span").html(data.length);
            for(var i=0; i < data.length; i++){
                dictionaryTable.append(
                    "<div class='line_show_dico'>"
                        +"<div class='td_dico family_id'>"+data[i].family_id+"</div>"
                        +"<div class='td_dico description'>"+data[i].description+"</div>"
                        +"<div class='td_dico family_name'>"+data[i].family_name+"</div>"
                        +"<div class='td_dico model_name'>"+data[i].model_name+"</div>"   
                        +"<div class='td_dico type_name'>"+data[i].type_name+"</div>"
                        +"<div class='td_dico date'>"+data[i].date+"</div>"
                        +"<div class='td_dico action'><img class='next_adm' src='../images/next_adm.png' data-family='"+data[i].family_id+"' data-description='"+data[i].description+"' data-familyname='"+data[i].family_name+"' data-modelname='"+data[i].model_name+"' data-typename='"+data[i].type_name+"'></div>"
                    +"</div>"
                )
            }
        }else{
            $(".adm_show_dictionary_container .result_description span").html("0 ");
        }
        
        dictionaryTable.find(".next_adm").on('click', function(){
            var familyID = $(this).data('family');
            var description = $(this).data('description');
            var familyName = $(this).data('familyname');
            var modelName = $(this).data('modelname');
            var typeName = $(this).data('typename');
            openDictionary(familyID, description, familyID, familyName, modelName, typeName);
        });
    
    }
    
    function openDictionary(newID, description, refID, refFamily, refModel, refType){
        $(".step_two").fadeOut(500);
        $(".step_one").fadeOut(500);
        $(".step_two .presentation .newID").html(newID);
        $(".step_two .presentation .description_new_dico").html(description);
        $(".step_two .presentation .ref_model").html(refFamily+ " "+refModel+" "+refType);      
        $.ajax({
            url: '../php/api.php?function=get_dictionaries_by_id&param1='+refID,
            type: 'GET',
            dataType: 'JSON',
            data:{},
            success: function (data, statut) {
                if (data.length == 0) {
                    alert("error");
                }else {
                    console.log(data);
                    contentArrayDicoButtonShow.empty();
                    contentArrayDicoJoystickShow.empty();
                    contentArrayDicoDisplayShow.empty();
                    
                    for(var i=0; i< data.length; i++){
                        if(data[i].is_safety == 1){var isSafety = "<img src='../images/check_admin.png' title='This component is safety.'>"}else{var isSafety = "-"}
                        if(data[i].is_enable == 1){var isEnable = "<img src='../images/check_admin.png' title='This component is enable.'>"}else{var isEnable = "-"}
                        if(data[i].is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                        if(data[i].is_led == 1 || data[i].is_led == 2){var isLED = "<img src='../images/check_admin.png' title='This component is LED.'>"}else{var isLED = "-"}
                        if(data[i].is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}
                        
                        if(data[i].type == "button"){
                            contentArrayDicoButtonShow.append("<div class='line_new_dico bt_"+i+"' data-index='bt_"+i+"' data-calibsubindexx='"+data[i].calib_subindex_x+"' data-calibsubindexy='"+data[i].calib_subindex_y+"' data-canid='"+data[i].can_id+"' data-description='"+data[i].description+"' data-dimsignal='"+data[i].dim_signal+"' data-familyid='"+data[i].family_id+"' data-flashsignal='"+data[i].flash_signal+"' data-id='"+data[i].id+"' data-iscdrh='"+data[i].is_cdrh+"' data-isenable='"+data[i].is_enable+"' data-isfinal='"+data[i].is_final+"' data-isled='"+data[i].is_led+"' data-issafety='"+data[i].is_safety+"' data-offsignal='"+data[i].off_signal+"' data-onsignal='"+data[i].on_signal+"' data-photolink='"+data[i].photo_link+"' data-pressedval='"+data[i].pressed_val+"' data-releasedval='"+data[i].released_val+"' data-standardname='"+data[i].standard_name+"' data-symbolname='"+data[i].symbol_name+"' data-thresholdmaxaxis='"+data[i].threshold_max_axis+"' data-threshold_max_zero='"+data[i].threshold_max_zero+"' data-thresholdminaxis='"+data[i].threshold_min_axis+"' data-thresholdminzero='"+data[i].threshold_min_zero+"' data-timer='"+data[i].timer+"' data-type='"+data[i].type+"' data-value='"+data[i].value+"' data-xpos='"+data[i].x_pos+"' data-ypos='"+data[i].y_pos+"' data-zone='"+data[i].zone+"'>"
                                    +"<div class='td_dico symbol_name'>"+data[i].symbol_name+"</div>"
                                    +"<div class='td_dico standard_name'>"+data[i].standard_name+"</div>"
                                    +"<div class='td_dico description'>"+data[i].description+"</div>"
                                    +"<div class='td_dico photo_link'><img src='../images/"+data[i].photo_link+"'></div>"
                                    +"<div class='td_dico is_safety'>"+isSafety+"</div>"
                                    +"<div class='td_dico is_enable'>"+isEnable+"</div>"
                                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"      
                                    +"<div class='td_dico is_led'>"+isLED+"</div>"
                                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                                    +"<div class='td_dico can_info' title='CAN ID : "+data[i].can_id+"\nCAN Data Press : "+data[i].pressed_val+"\nCAN Data Release : "+data[i].released_val+"'><img src='../images/search.png' ></div>"
                                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                                +"</div>");
                        }else if(data[i].type == "joystick" || data[i].type == "mushroom"){
                            contentArrayDicoJoystickShow.append("<div class='line_new_dico joy_"+i+"' data-index='joy_"+i+"' data-calibsubindexx='"+data[i].calib_subindex_x+"' data-calibsubindexy='"+data[i].calib_subindex_y+"' data-canid='"+data[i].can_id+"' data-description='"+data[i].description+"' data-dimsignal='"+data[i].dim_signal+"' data-familyid='"+data[i].family_id+"' data-flashsignal='"+data[i].flash_signal+"' data-id='"+data[i].id+"' data-iscdrh='"+data[i].is_cdrh+"' data-isenable='"+data[i].is_enable+"' data-isfinal='"+data[i].is_final+"' data-isled='"+data[i].is_led+"' data-issafety='"+data[i].is_safety+"' data-offsignal='"+data[i].off_signal+"' data-onsignal='"+data[i].on_signal+"' data-photolink='"+data[i].photo_link+"' data-pressedval='"+data[i].pressed_val+"' data-releasedval='"+data[i].released_val+"' data-standardname='"+data[i].standard_name+"' data-symbolname='"+data[i].symbol_name+"' data-thresholdmaxaxis='"+data[i].threshold_max_axis+"' data-threshold_max_zero='"+data[i].threshold_max_zero+"' data-thresholdminaxis='"+data[i].threshold_min_axis+"' data-thresholdminzero='"+data[i].threshold_min_zero+"' data-timer='"+data[i].timer+"' data-type='"+data[i].type+"' data-value='"+data[i].value+"' data-xpos='"+data[i].x_pos+"' data-ypos='"+data[i].y_pos+"' data-zone='"+data[i].zone+"'>"
                                    +"<div class='td_dico symbol_name'>"+data[i].symbol_name+"</div>"
                                    +"<div class='td_dico standard_name'>"+data[i].standard_name+"</div>"
                                    +"<div class='td_dico description'>"+data[i].description+"</div>"
                                    +"<div class='td_dico photo_link'><img src='../images/"+data[i].photo_link+"'></div>"
                                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"   
                                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                                +"</div>");
                        }else if(data[i].type == "display" || data[i].type == "buzzer"){
                            contentArrayDicoDisplayShow.append("<div class='line_new_dico disp_"+i+"'data-index='disp_"+i+"' data-calibsubindexx='"+data[i].calib_subindex_x+"' data-calibsubindexy='"+data[i].calib_subindex_y+"' data-canid='"+data[i].can_id+"' data-description='"+data[i].description+"' data-dimsignal='"+data[i].dim_signal+"' data-familyid='"+data[i].family_id+"' data-flashsignal='"+data[i].flash_signal+"' data-id='"+data[i].id+"' data-iscdrh='"+data[i].is_cdrh+"' data-isenable='"+data[i].is_enable+"' data-isfinal='"+data[i].is_final+"' data-isled='"+data[i].is_led+"' data-issafety='"+data[i].is_safety+"' data-offsignal='"+data[i].off_signal+"' data-onsignal='"+data[i].on_signal+"' data-photolink='"+data[i].photo_link+"' data-pressedval='"+data[i].pressed_val+"' data-releasedval='"+data[i].released_val+"' data-standardname='"+data[i].standard_name+"' data-symbolname='"+data[i].symbol_name+"' data-thresholdmaxaxis='"+data[i].threshold_max_axis+"' data-threshold_max_zero='"+data[i].threshold_max_zero+"' data-thresholdminaxis='"+data[i].threshold_min_axis+"' data-thresholdminzero='"+data[i].threshold_min_zero+"' data-timer='"+data[i].timer+"' data-type='"+data[i].type+"' data-value='"+data[i].value+"' data-xpos='"+data[i].x_pos+"' data-ypos='"+data[i].y_pos+"' data-zone='"+data[i].zone+"'>"
                                    +"<div class='td_dico symbol_name'>"+data[i].symbol_name+"</div>"
                                    +"<div class='td_dico standard_name'>"+data[i].standard_name+"</div>"
                                    +"<div class='td_dico description'>"+data[i].description+"</div>"
                                    +"<div class='td_dico photo_link'><img src='../images/"+data[i].photo_link+"'></div>"
                                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"   
                                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                                +"</div>");
                        }
                    }
                    
                    $(".delete_line").on('click', function(){
                        var name = $(this).parents(".line_new_dico").data('standard_name');
                        if (confirm('Confirm the deletion of entry '+name+'. This action is irreversible.')) {
                            $(this).parents(".line_new_dico").remove();
                        }                        
                    });
                    
                    $(".update_line").on('click', function(){
                        var id = $(this).parents(".line_new_dico").data('index');
                        var type = $(this).parents(".line_new_dico").data('type');
                        updateDictionaryLineShow(id, type); 
                        console.log("update");
                    });
                    
                    
                    setTimeout(function(){
                        $(".step_two .entry-bt").addClass("selected");
                        $(".step_two .dictionary_type_listing.bouton-type").fadeIn(300);
                        $(".step_two").fadeIn(300);
                    },500);
                }
            }
        });
        
        function updateDictionaryLineShow(id, type){  
            var stepTwo = $(".adm_show_dictionary_container");
            console.log(id);
            
            var calib_subindex_x = stepTwo.find("."+id).data("calibsubindexx");
            var calib_subindex_y = stepTwo.find("."+id).data("calibsubindexy");
            var can_id = stepTwo.find("."+id).data("canid");
            var description = stepTwo.find("."+id).data("description");
            var dim_signal = stepTwo.find("."+id).data("dimsignal");
            var family_id = stepTwo.find("."+id).data("calibsubindexx");
            var flash_signal = stepTwo.find("."+id).data("flashsignal");
            var is_cdrh = stepTwo.find("."+id).data("iscdrh");
            var is_enable = stepTwo.find("."+id).data("isenable");
            var is_final = stepTwo.find("."+id).data("isfinal");
            var is_led = stepTwo.find("."+id).data("isled");
            var is_safety = stepTwo.find("."+id).data("issafety");
            var off_signal = stepTwo.find("."+id).data("offsignal");
            var on_signal = stepTwo.find("."+id).data("onsignal");
            var photo_link = stepTwo.find("."+id).data("photolink");
            var pressed_val = stepTwo.find("."+id).data("pressedval");
            var released_val = stepTwo.find("."+id).data("releasedval");
            var standard_name = stepTwo.find("."+id).data("standardname");
            var symbol_name = stepTwo.find("."+id).data("symbolname");
            var threshold_max_axis = stepTwo.find("."+id).data("thresholdmaxaxis");
            var threshold_max_zero = stepTwo.find("."+id).data("threshold_max_zero");
            var threshold_min_axis = stepTwo.find("."+id).data("thresholdminaxis");
            var threshold_min_zero = stepTwo.find("."+id).data("thresholdminzero");
            var timer = stepTwo.find("."+id).data("timer");
            var type_t = stepTwo.find("."+id).data("type");
            var value = stepTwo.find("."+id).data("value");
            var x_pos = stepTwo.find("."+id).data("xpos");
            var y_pos = stepTwo.find("."+id).data("ypos");
            var zone = stepTwo.find("."+id).data("zone");
            
            var lineArray = {
                symbol_name:symbol_name, standard_name: standard_name, description:description,
                is_led:is_led, is_safety:is_safety, is_enable:is_enable,
                is_cdrh:is_cdrh, is_final:is_final, zone:zone, timer:timer,
                photo_link:photo_link, can_id:can_id, pressed_val:pressed_val, released_val:released_val,
                on_signal:on_signal, off_signal:off_signal, flash_signal:flash_signal, dim_signal:dim_signal,
                x_pos:x_pos,y_pos:y_pos,threshold_max_axis:threshold_max_axis, threshold_max_zero:threshold_max_zero,
                threshold_min_axis:threshold_min_axis,threshold_min_zero:threshold_min_zero,
                calib_subindex_x:calib_subindex_x, calib_subindex_y:calib_subindex_y, type:type_t
            };
            if(type == "button"){
                updateFormButtonShow(id, lineArray);
            }else if(type == "joystick" || type == "mushroom"){
                console.log(lineArray);
                updateFormJoystickShow(id, lineArray);
            }else if(type == "display" || type == "buzzer"){
                updateFormDisplayShow(id, lineArray);
            }
        }
        
        function updateFormButtonShow(id, lineArray){            
            var formBtCtn = $(".adm_show_dictionary_container .formulaire_update_button");
            
            formBtCtn.find(".update_bt").off();
            formBtCtn.find(".cancel_bt").off();
            
            formBtCtn.find(".cancel_bt").on('click', function(){
                $(".step_two").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
            });
            
            formBtCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
            
            console.log(lineArray);
            formBtCtn.find(".title").html("Update Button <b>"+lineArray.symbol_name+"</b> <img src='../images/"+lineArray.photo_link+"'>");
            formBtCtn.find(".symbol_name").val(lineArray.symbol_name);
            formBtCtn.find(".photo_link").val(lineArray.photo_link);
            formBtCtn.find(".standard_name").val(lineArray.standard_name);
            formBtCtn.find(".timer").val(lineArray.timer);
            formBtCtn.find(".description").val(lineArray.description);
            
            formBtCtn.find(".can_id").val(lineArray.can_id);
            formBtCtn.find(".pressed_value").val(lineArray.pressed_val);
            formBtCtn.find(".released_value").val(lineArray.released_val);
            
            formBtCtn.find(".on_signal").val(lineArray.on_signal);
            formBtCtn.find(".off_signal").val(lineArray.off_signal);
            formBtCtn.find(".dim_signal").val(lineArray.dim_signal);
            formBtCtn.find(".flash_signal").val(lineArray.flash_signal);
            
            formBtCtn.find(".is_safety option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_safety){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".is_enable option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_enable){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".is_cdrh option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_cdrh){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".is_final option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_final){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".is_led option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_led){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".zone option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.zone){$(this).attr('selected', 'selected')};
            });
            
            $(".step_two").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formBtCtn.fadeIn("200");
            
            
            
            formBtCtn.find(".update_bt").on('click', function(){
                
                var newLineArrayBt = {
                    type_array:"bt",
                    symbol_name:formBtCtn.find(".symbol_name").val(),
                    standard_name: formBtCtn.find(".standard_name").val(), 
                    description:formBtCtn.find(".description").val(),
                    is_led:formBtCtn.find(".is_led option:selected").val(), 
                    is_safety:formBtCtn.find(".is_safety option:selected").val(), 
                    is_enable:formBtCtn.find(".is_enable option:selected").val(),
                    is_cdrh:formBtCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formBtCtn.find(".is_final option:selected").val(), 
                    zone:formBtCtn.find(".zone option:selected").val(), 
                    timer:formBtCtn.find(".timer").val(),
                    photo_link:formBtCtn.find(".photo_link").val(),
                    can_id:formBtCtn.find(".can_id").val(),
                    pressed_val:formBtCtn.find(".pressed_value").val(),
                    released_val:formBtCtn.find(".released_value").val(),
                    on_signal:formBtCtn.find(".on_signal").val(),
                    off_signal:formBtCtn.find(".off_signal").val(),
                    flash_signal:formBtCtn.find(".flash_signal").val(),
                    dim_signal:formBtCtn.find(".dim_signal").val()
                }
                
                $(".step_two").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
                
                updateLineNewInfoShow(id, newLineArrayBt)
            });
        }
        
        function updateFormJoystickShow(id, lineArray){
            
            var formBtCtn = $(".adm_show_dictionary_container .formulaire_update_joystick");
            formBtCtn.find(".update_bt").off();
            formBtCtn.find(".cancel_bt").off();
            
            
            formBtCtn.find(".cancel_bt").on('click', function(){
                $(".step_two").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
            });
            
            formBtCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
            
            console.log(lineArray);
            formBtCtn.find(".title").html("Update Joystick <b>"+lineArray.symbol_name+"</b> <img src='../images/"+lineArray.photo_link+"'>");
            
            formBtCtn.find(".symbol_name").val(lineArray.symbol_name);
            
            formBtCtn.find(".photo_link").val(lineArray.photo_link);
            formBtCtn.find(".standard_name").val(lineArray.standard_name);
            formBtCtn.find(".timer").val(lineArray.timer);
            formBtCtn.find(".description").val(lineArray.description);
            
            formBtCtn.find(".x_pos").val(lineArray.x_pos);
            formBtCtn.find(".y_pos").val(lineArray.y_pos);
            formBtCtn.find(".calib_subindex_x").val(lineArray.calib_subindex_x);
            formBtCtn.find(".calib_subindex_y").val(lineArray.calib_subindex_y);
            formBtCtn.find(".threshold_max_zero").val(lineArray.threshold_max_zero);
            formBtCtn.find(".threshold_max_axis").val(lineArray.threshold_max_axis);
            formBtCtn.find(".threshold_min_axis").val(lineArray.threshold_min_axis);
            formBtCtn.find(".threshold_min_zero").val(lineArray.threshold_min_zero);
            formBtCtn.find(".calib_subindex_x").val(lineArray.calib_subindex_x);
            formBtCtn.find(".calib_subindex_y").val(lineArray.calib_subindex_y);
            
            formBtCtn.find(".can_id").val(lineArray.can_id);
            formBtCtn.find(".pressed_value").val(lineArray.pressed_val);
            formBtCtn.find(".released_value").val(lineArray.released_val);
                                   
                        
            formBtCtn.find(".is_cdrh option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_cdrh){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".is_final option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_final){$(this).attr('selected', 'selected')};
            });
            
            formBtCtn.find(".type option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.type){$(this).attr('selected', 'selected')};
            });
            
            
            
            $(".step_two").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formBtCtn.fadeIn("200");
            
            formBtCtn.find(".update_bt").on('click', function(){
                
                var newLineArrayBt = {
                    type_array:"joy",
                    symbol_name:formBtCtn.find(".symbol_name").val(),
                    standard_name: formBtCtn.find(".standard_name").val(), 
                    description:formBtCtn.find(".description").val(),
                    is_cdrh:formBtCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formBtCtn.find(".is_final option:selected").val(),
                    timer:formBtCtn.find(".timer").val(),
                    photo_link:formBtCtn.find(".photo_link").val(),
                    can_id:formBtCtn.find(".can_id").val(),
                    x_pos:formBtCtn.find(".x_pos").val(),
                    y_pos:formBtCtn.find(".y_pos").val(),
                    threshold_max_axis:formBtCtn.find(".threshold_max_axis").val(), 
                    threshold_max_zero:formBtCtn.find(".threshold_max_zero").val(),
                    threshold_min_axis:formBtCtn.find(".threshold_min_axis").val(),
                    threshold_min_zero:formBtCtn.find(".threshold_min_zero").val(),
                    calib_subindex_x:formBtCtn.find(".calib_subindex_x").val(),
                    calib_subindex_y:formBtCtn.find(".calib_subindex_y").val(),
                    type:formBtCtn.find(".type option:selected").val()
                }
                
                $(".step_two").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
                
                updateLineNewInfoShow(id, newLineArrayBt)
            });
        }
        
        function updateFormDisplayShow(id, lineArray){
            
            var formDispCtn = $(".adm_show_dictionary_container .formulaire_update_display");
            
            formDispCtn.find(".update_bt").off();
            formDispCtn.find(".cancel_bt").off();
            
            formDispCtn.find(".cancel_bt").on('click', function(){
                $(".step_two").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formDispCtn.fadeOut("200");
            });
            
            formDispCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
            
            console.log(lineArray);
            formDispCtn.find(".title").html("Update Display/Buzzer <b>"+lineArray.symbol_name+"</b> <img src='../images/"+lineArray.photo_link+"'>");
            formDispCtn.find(".symbol_name").val(lineArray.symbol_name);
            formDispCtn.find(".photo_link").val(lineArray.photo_link);
            formDispCtn.find(".standard_name").val(lineArray.standard_name);
            formDispCtn.find(".timer").val(lineArray.timer);
            formDispCtn.find(".description").val(lineArray.description);
            formDispCtn.find(".on_signal").val(lineArray.on_signal);
            formDispCtn.find(".off_signal").val(lineArray.off_signal);
            formDispCtn.find(".dim_signal").val(lineArray.dim_signal);
            formDispCtn.find(".flash_signal").val(lineArray.flash_signal);
            
            
            formDispCtn.find(".is_cdrh option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_cdrh){$(this).attr('selected', 'selected')};
            });
            
            formDispCtn.find(".is_final option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.is_final){$(this).attr('selected', 'selected')};
            }); 
            
            formDispCtn.find(".type option").each(function(){
                $(this).removeAttr('selected');
                if($(this).val() == lineArray.type){$(this).attr('selected', 'selected')};
            });      
            
            $(".step_two").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formDispCtn.fadeIn("200");
            
            formDispCtn.find(".update_bt").on('click', function(){
                
                var newLineArrayBt = {
                    type_array:"disp",
                    symbol_name:formDispCtn.find(".symbol_name").val(),
                    standard_name: formDispCtn.find(".standard_name").val(), 
                    description:formDispCtn.find(".description").val(),                                         
                    is_cdrh:formDispCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formDispCtn.find(".is_final option:selected").val(),
                    timer:formDispCtn.find(".timer").val(),
                    photo_link:formDispCtn.find(".photo_link").val(),          
                    on_signal:formDispCtn.find(".on_signal").val(),
                    off_signal:formDispCtn.find(".off_signal").val(),
                    flash_signal:formDispCtn.find(".flash_signal").val(),
                    dim_signal:formDispCtn.find(".dim_signal").val(),
                    type:formDispCtn.find(".type option:selected").val()
                }
                
                $(".step_two").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formDispCtn.fadeOut("200");
                
                updateLineNewInfoShow(id, newLineArrayBt)
            });
        }
        
        function updateLineNewInfoShow(id, newLineArrayBt){
            console.log(id);
            console.log(newLineArrayBt);
            
            
            if(newLineArrayBt.type_array == "bt"){
                var formBtCtn = $(".adm_show_dictionary_container .formulaire_update_button");
                
                if(newLineArrayBt.is_safety == 1){var isSafety = "<img src='../images/check_admin.png' title='This component is safety.'>"}else{var isSafety = "-"}
                if(newLineArrayBt.is_enable == 1){var isEnable = "<img src='../images/check_admin.png' title='This component is enable.'>"}else{var isEnable = "-"}
                if(newLineArrayBt.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                if(newLineArrayBt.is_led == 1 || newLineArrayBt.is_led == 2){var isLED = "<img src='../images/check_admin.png' title='This component is LED.'>"}else{var isLED = "-"}
                if(newLineArrayBt.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}         
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('symbolname', newLineArrayBt.symbol_name);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('standardname', newLineArrayBt.standard_name);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('description', newLineArrayBt.description);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('isled', newLineArrayBt.is_led);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('issafety', newLineArrayBt.is_safety);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('isenable', newLineArrayBt.is_enable);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('iscdrh', newLineArrayBt.is_cdrh);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('isfinal', newLineArrayBt.is_final);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('zone', newLineArrayBt.zone);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('timer', newLineArrayBt.timer);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('photolink', newLineArrayBt.photo_link);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('canid', newLineArrayBt.can_id);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('pressedval', newLineArrayBt.pressed_val);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('releasedval', newLineArrayBt.released_val);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('onsignal', newLineArrayBt.on_signal);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('offsignal', newLineArrayBt.off_signal);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('flashsignal', newLineArrayBt.flash_signal);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('dimsignal', newLineArrayBt.dim_signal);
                
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .symbol_name").html(newLineArrayBt.symbol_name);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .standard_name").html(newLineArrayBt.standard_name);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .description").html(newLineArrayBt.description);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .photo_link").html("<img src='../images/"+newLineArrayBt.photo_link+"'>");
                
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .can_info").attr('title', "CAN ID : "+newLineArrayBt.can_id+"\nCAN Data Press : "+newLineArrayBt.pressed_val+"\nCAN Data Release : "+newLineArrayBt.released_val);
                
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .is_safety").html(isSafety);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .is_enable").html(isEnable);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .is_cdrh").html(isCDRH);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .is_led").html(isLED);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .is_final").html(isFinal);
                
                formBtCtn.find(".update_bt").off();
                formBtCtn.find(".cancel_bt").off();
                
            }else if(newLineArrayBt.type_array == "joy"){
                var formBtCtn = $(".adm_show_dictionary_container .formulaire_update_button");
                
                if(newLineArrayBt.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}                
                if(newLineArrayBt.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}                
                
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('symbolname', newLineArrayBt.symbol_name);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('standardname', newLineArrayBt.standard_name);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('description', newLineArrayBt.description);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('isenable', newLineArrayBt.is_enable);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('iscdrh', newLineArrayBt.is_cdrh);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('isfinal', newLineArrayBt.is_final);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('timer', newLineArrayBt.timer);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('photolink', newLineArrayBt.photo_link);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('canid', newLineArrayBt.can_id);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('type', newLineArrayBt.type);
                
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('xpos', newLineArrayBt.x_pos);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('ypos', newLineArrayBt.y_pos);
                
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('calibsubindexx', newLineArrayBt.calib_subindex_x);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('calibsubindexy', newLineArrayBt.calib_subindex_y);
                
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('thresholdmaxaxis', newLineArrayBt.threshold_max_axis);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('thresholdminaxis', newLineArrayBt.threshold_min_axis);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('thresholdminzero', newLineArrayBt.threshold_min_zero);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('threshold_max_zero', newLineArrayBt.threshold_max_zero);
                
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .symbol_name").html(newLineArrayBt.symbol_name);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .standard_name").html(newLineArrayBt.standard_name);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .description").html(newLineArrayBt.description);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .photo_link").html("<img src='../images/"+newLineArrayBt.photo_link+"'>");
                
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .is_cdrh").html(isCDRH);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .is_final").html(isFinal);
                
                formBtCtn.find(".update_bt").off();
                formBtCtn.find(".cancel_bt").off();
                
            }else if(newLineArrayBt.type_array == "disp"){
                var formBtCtn = $(".adm_show_dictionary_container .formulaire_update_button");
                
                if(newLineArrayBt.is_safety == 1){var isSafety = "<img src='../images/check_admin.png' title='This component is safety.'>"}else{var isSafety = "-"}
                if(newLineArrayBt.is_enable == 1){var isEnable = "<img src='../images/check_admin.png' title='This component is enable.'>"}else{var isEnable = "-"}
                if(newLineArrayBt.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                if(newLineArrayBt.is_led == 1 || newLineArrayBt.is_led == 2){var isLED = "<img src='../images/check_admin.png' title='This component is LED.'>"}else{var isLED = "-"}
                if(newLineArrayBt.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}                
                
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('symbolname', newLineArrayBt.symbol_name);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('standardname', newLineArrayBt.standard_name);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('description', newLineArrayBt.description);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('iscdrh', newLineArrayBt.is_cdrh);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('isfinal', newLineArrayBt.is_final);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('timer', newLineArrayBt.timer);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('photolink', newLineArrayBt.photo_link);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('canid', newLineArrayBt.can_id);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('onsignal', newLineArrayBt.on_signal);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('offsignal', newLineArrayBt.off_signal);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('flashsignal', newLineArrayBt.flash_signal);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('dimsignal', newLineArrayBt.dim_signal);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('type', newLineArrayBt.type);
                
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .symbol_name").html(newLineArrayBt.symbol_name);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .standard_name").html(newLineArrayBt.standard_name);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .description").html(newLineArrayBt.description);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .photo_link").html("<img src='../images/"+newLineArrayBt.photo_link+"'>");
                
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .can_info").attr('title', "CAN ID : "+newLineArrayBt.can_id+"\nCAN Data Press : "+newLineArrayBt.pressed_val+"\nCAN Data Release : "+newLineArrayBt.released_val);
                
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .is_cdrh").html(isCDRH);
                $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id+" .is_final").html(isFinal);
                
                formBtCtn.find(".update_bt").off();
                formBtCtn.find(".cancel_bt").off();
            }
            
            $(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).addClass("updated_state");
            
            console.log($(".adm_show_dictionary_container .dictionary_type_listing").find("."+id).data('symbolname'));
            
            
        }
        
        $(".adm_show_dictionary_container .add_new_entry_show").off();
        $(".adm_show_dictionary_container .add_new_entry_show").on('click', function(){
            if($(this).hasClass("bt")){
                createNewButtonShow();
            }else if($(this).hasClass("joy")){
                createNewJoystickShow();
            }else if($(this).hasClass("disp")){
                createNewDisplayShow();
            }
        })
        
        function createNewButtonShow(){
            var formBtCtn = $(".adm_show_dictionary_container .formulaire_create_button");
            
            $(".step_two").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formBtCtn.fadeIn("200");
            
            formBtCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
            formBtCtn.find(".create_bt").off();
            formBtCtn.find(".create_bt").on('click', function(){
                
                var newLineArrayBt = {
                    type_array: "bt",
                    symbol_name:formBtCtn.find(".symbol_name").val(),
                    standard_name: formBtCtn.find(".standard_name").val(), 
                    description:formBtCtn.find(".description").val(),
                    is_led:formBtCtn.find(".is_led option:selected").val(), 
                    is_safety:formBtCtn.find(".is_safety option:selected").val(), 
                    is_enable:formBtCtn.find(".is_enable option:selected").val(),
                    is_cdrh:formBtCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formBtCtn.find(".is_final option:selected").val(), 
                    zone:formBtCtn.find(".zone option:selected").val(), 
                    timer:formBtCtn.find(".timer").val(),
                    photo_link:formBtCtn.find(".photo_link").val(),
                    can_id:formBtCtn.find(".can_id").val(),
                    pressed_val:formBtCtn.find(".pressed_value").val(),
                    released_val:formBtCtn.find(".released_value").val(),
                    on_signal:formBtCtn.find(".on_signal").val(),
                    off_signal:formBtCtn.find(".off_signal").val(),
                    flash_signal:formBtCtn.find(".flash_signal").val(),
                    dim_signal:formBtCtn.find(".dim_signal").val()
                }
                
                if(newLineArrayBt.is_safety == 1){var isSafety = "<img src='../images/check_admin.png' title='This component is safety.'>"}else{var isSafety = "-"}
                if(newLineArrayBt.is_enable == 1){var isEnable = "<img src='../images/check_admin.png' title='This component is enable.'>"}else{var isEnable = "-"}
                if(newLineArrayBt.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                if(newLineArrayBt.is_led == 1 || newLineArrayBt.is_led == 2){var isLED = "<img src='../images/check_admin.png' title='This component is LED.'>"}else{var isLED = "-"}
                if(newLineArrayBt.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}   
                
                var count = ($(".adm_show_dictionary_container .dictionary_type_listing.bouton-type .line_new_dico").length)+50;;
                
                
                var newEntry = "<div class='line_new_dico bt_"+count+" created_state' data-index='bt_"+count+"' data-calibsubindexx='' data-calibsubindexy='' data-canid='"+newLineArrayBt.can_id+"' data-description='"+newLineArrayBt.description+"' data-dimsignal='"+newLineArrayBt.dim_signal+"' data-familyid='' data-flashsignal='"+newLineArrayBt.flash_signal+"' data-id='' data-iscdrh='"+newLineArrayBt.is_cdrh+"' data-isenable='"+newLineArrayBt.is_enable+"' data-isfinal='"+newLineArrayBt.is_final+"' data-isled='"+newLineArrayBt.is_led+"' data-issafety='"+newLineArrayBt.is_safety+"' data-offsignal='"+newLineArrayBt.off_signal+"' data-onsignal='"+newLineArrayBt.on_signal+"' data-photolink='"+newLineArrayBt.photo_link+"' data-pressedval='"+newLineArrayBt.pressed_val+"' data-releasedval='"+newLineArrayBt.released_val+"' data-standardname='"+newLineArrayBt.standard_name+"' data-symbolname='"+newLineArrayBt.symbol_name+"' data-thresholdmaxaxis='0' data-threshold_max_zero='0' data-thresholdminaxis='0' data-thresholdminzero='0' data-timer='"+newLineArrayBt.timer+"' data-type='button' data-value='' data-xpos='' data-ypos='' data-zone='"+newLineArrayBt.zone+"'>"
                    +"<div class='td_dico symbol_name'>"+newLineArrayBt.symbol_name+"</div>"
                    +"<div class='td_dico standard_name'>"+newLineArrayBt.standard_name+"</div>"
                    +"<div class='td_dico description'>"+newLineArrayBt.description+"</div>"
                    +"<div class='td_dico photo_link'><img src='../images/"+newLineArrayBt.photo_link+"'></div>"
                    +"<div class='td_dico is_safety'>"+isSafety+"</div>"
                    +"<div class='td_dico is_enable'>"+isEnable+"</div>"
                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"      
                    +"<div class='td_dico is_led'>"+isLED+"</div>"
                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                    +"<div class='td_dico can_info' title='CAN ID : "+newLineArrayBt.can_id+"\nCAN Data Press : "+newLineArrayBt.pressed_val+"\nCAN Data Release : "+newLineArrayBt.released_val+"'><img src='../images/search.png' ></div>"
                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                +"</div>";
        
                $(".adm_show_dictionary_container .dictionary_type_listing.bouton-type .content_new_dico").append(newEntry);
                
                
                $(".adm_show_dictionary_container .bt_"+count+" .delete_line").on('click', function(){
                        var name = $(this).parents(".line_new_dico").data('standard_name');
                        if (confirm('Confirm the deletion of entry '+name+'. This action is irreversible.')) {
                            $(this).parents(".line_new_dico").remove();
                        }                        
                });

                $(".adm_show_dictionary_container .bt_"+count+" .update_line").on('click', function(){
                    var id = $(this).parents(".line_new_dico").data('index');
                    var type = $(this).parents(".line_new_dico").data('type');
                    updateDictionaryLineShow(id, type); 
                });
                
                
                $(".step_two").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
                
            });
        
            formBtCtn.find(".cancel_bt").on('click', function(){
                $(".step_two").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formBtCtn.fadeOut("200");
            });
        
        }
        
        function createNewJoystickShow(){
            var formJoyCtn = $(".adm_show_dictionary_container .formulaire_create_joystick");
            formJoyCtn.find(".create_bt").off();
            $(".step_two").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formJoyCtn.fadeIn("200");
            formJoyCtn.find("input").val("");
            formJoyCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
    
            formJoyCtn.find(".create_bt").on('click', function(){
                
                var newLineArrayJoy = {
                    type_array:"joy",
                    symbol_name:formJoyCtn.find(".symbol_name").val(),
                    standard_name: formJoyCtn.find(".standard_name").val(), 
                    description:formJoyCtn.find(".description").val(),
                    is_cdrh:formJoyCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formJoyCtn.find(".is_final option:selected").val(),
                    type:formJoyCtn.find(".type option:selected").val(),
                    timer:formJoyCtn.find(".timer").val(),
                    photo_link:formJoyCtn.find(".photo_link").val(),
                    can_id:formJoyCtn.find(".can_id").val(),
                    x_pos:formJoyCtn.find(".x_pos").val(),
                    y_pos:formJoyCtn.find(".y_pos").val(),
                    threshold_max_axis:formJoyCtn.find(".threshold_max_axis").val(), 
                    threshold_max_zero:formJoyCtn.find(".threshold_max_zero").val(),
                    threshold_min_axis:formJoyCtn.find(".threshold_min_axis").val(),
                    threshold_min_zero:formJoyCtn.find(".threshold_min_zero").val(),
                    calib_subindex_x:formJoyCtn.find(".calib_subindex_x").val(),
                    calib_subindex_y:formJoyCtn.find(".calib_subindex_y").val()
                }
                               
                if(newLineArrayJoy.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                if(newLineArrayJoy.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}   
                
                var count = ($(".adm_show_dictionary_container .dictionary_type_listing.joystick-type .line_new_dico").length)+50;;
                                       
                var newEntry = "<div class='line_new_dico joy_"+count+" created_state' data-index='joy_"+count+"' data-calibsubindexx='"+newLineArrayJoy.calib_subindex_x+"' data-calibsubindexy='"+newLineArrayJoy.calib_subindex_y+"' data-canid='"+newLineArrayJoy.can_id+"' data-description='"+newLineArrayJoy.description+"' data-dimsignal='' data-familyid='' data-flashsignal='' data-id='' data-iscdrh='"+newLineArrayJoy.is_cdrh+"' data-isenable='0' data-isfinal='"+newLineArrayJoy.is_final+"' data-isled='0' data-issafety='0' data-offsignal='' data-onsignal='' data-photolink='"+newLineArrayJoy.photo_link+"' data-pressedval='' data-releasedval='' data-standardname='"+newLineArrayJoy.standard_name+"' data-symbolname='"+newLineArrayJoy.symbol_name+"' data-thresholdmaxaxis='"+newLineArrayJoy.threshold_max_axis+"' data-threshold_max_zero='"+newLineArrayJoy.threshold_max_zero+"' data-thresholdminaxis='"+newLineArrayJoy.threshold_min_axis+"' data-thresholdminzero='"+newLineArrayJoy.threshold_min_zero+"' data-timer='"+newLineArrayJoy.timer+"' data-type='"+newLineArrayJoy.type+"' data-value='' data-xpos='"+newLineArrayJoy.x_pos+"' data-ypos='"+newLineArrayJoy.y_pos+"' data-zone='50'>"
                    +"<div class='td_dico symbol_name'>"+newLineArrayJoy.symbol_name+"</div>"
                    +"<div class='td_dico standard_name'>"+newLineArrayJoy.standard_name+"</div>"
                    +"<div class='td_dico description'>"+newLineArrayJoy.description+"</div>"
                    +"<div class='td_dico photo_link'><img src='../images/"+newLineArrayJoy.photo_link+"'></div>"
                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"   
                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                +"</div>";
        
                $(".adm_show_dictionary_container .dictionary_type_listing.joystick-type .content_new_dico").append(newEntry);
                                
                $(".adm_show_dictionary_container .joy_"+count+" .delete_line").on('click', function(){
                        var name = $(this).parents(".line_new_dico").data('standard_name');
                        if (confirm('Confirm the deletion of entry '+name+'. This action is irreversible.')) {
                            $(this).parents(".line_new_dico").remove();
                        }                        
                });

                $(".adm_show_dictionary_container .joy_"+count+" .update_line").on('click', function(){
                    var id = $(this).parents(".line_new_dico").data('index');
                    var type = $(this).parents(".line_new_dico").data('type');
                    updateDictionaryLineShow(id, type); 
                });                
                
                $(".step_two").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formJoyCtn.fadeOut("200");
                
            });
            
            formJoyCtn.find(".cancel_bt").on('click', function(){
                $(".step_two").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formJoyCtn.fadeOut("200");
            });
        }
        
        function createNewDisplayShow(){
            var formDispCtn = $(".adm_show_dictionary_container .formulaire_create_display");
            formDispCtn.find(".title").html("Create new Display/Buzzer");
            
            $(".step_two").fadeOut(200);            
            $(".overlay_form").removeClass("hidden");
            formDispCtn.fadeIn("200");
            
            formDispCtn.find(".create_bt").off();
            formDispCtn.find(".tooltip_form").hover(
                function() {
                  $(this).find(".text_explain").fadeIn(100);
                }, function() {
                  $(this).find(".text_explain").fadeOut(100);
                }
            );
    
            formDispCtn.find(".create_bt").on('click', function(){
                
                var newLineArrayDisp = {
                    type_array: "bt",
                    symbol_name:formDispCtn.find(".symbol_name").val(),
                    standard_name: formDispCtn.find(".standard_name").val(), 
                    description:formDispCtn.find(".description").val(),
                    is_cdrh:formDispCtn.find(".is_cdrh option:selected").val(), 
                    is_final:formDispCtn.find(".is_final option:selected").val(), 
                    timer:formDispCtn.find(".timer").val(),
                    photo_link:formDispCtn.find(".photo_link").val(),
                    on_signal:formDispCtn.find(".on_signal").val(),
                    off_signal:formDispCtn.find(".off_signal").val(),
                    flash_signal:formDispCtn.find(".flash_signal").val(),
                    dim_signal:formDispCtn.find(".dim_signal").val(),
                    type:formDispCtn.find(".type option:selected").val()
                }
                
                if(newLineArrayDisp.is_cdrh == 1){var isCDRH = "<img src='../images/check_admin.png' title='This component is CDRH.'>"}else{var isCDRH = "-"}
                if(newLineArrayDisp.is_final == 1){var isFinal = "<img src='../images/check_admin.png' title='This component is in final test.'>"}else{var isFinal = "-"}   
                
                var count = ($(".adm_show_dictionary_container .dictionary_type_listing.display-type .line_new_dico").length)+50;
                
                var newEntry = "<div class='line_new_dico disp_"+count+" created_state'data-index='disp_"+count+"' data-calibsubindexx='' data-calibsubindexy='' data-canid='' data-description='"+newLineArrayDisp.description+"' data-dimsignal='"+newLineArrayDisp.dim_signal+"' data-familyid='' data-flashsignal='"+newLineArrayDisp.flash_signal+"' data-id='' data-iscdrh='"+newLineArrayDisp.is_cdrh+"' data-isenable='0' data-isfinal='"+newLineArrayDisp.is_final+"' data-isled='0' data-issafety='0' data-offsignal='"+newLineArrayDisp.off_signal+"' data-onsignal='"+newLineArrayDisp.on_signal+"' data-photolink='"+newLineArrayDisp.photo_link+"' data-pressedval='' data-releasedval='' data-standardname='"+newLineArrayDisp.standard_name+"' data-symbolname='"+newLineArrayDisp.symbol_name+"' data-thresholdmaxaxis='' data-threshold_max_zero='' data-thresholdminaxis='' data-thresholdminzero='' data-timer='"+newLineArrayDisp.timer+"' data-type='"+newLineArrayDisp.type+"' data-value='' data-xpos='' data-ypos='' data-zone='50'>"
                    +"<div class='td_dico symbol_name'>"+newLineArrayDisp.symbol_name+"</div>"
                    +"<div class='td_dico standard_name'>"+newLineArrayDisp.standard_name+"</div>"
                    +"<div class='td_dico description'>"+newLineArrayDisp.description+"</div>"
                    +"<div class='td_dico photo_link'><img src='../images/"+newLineArrayDisp.photo_link+"'></div>"
                    +"<div class='td_dico is_cdrh'>"+isCDRH+"</div>"   
                    +"<div class='td_dico is_final'>"+isFinal+"</div>"
                    +"<div class='td_dico action'><img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'></div>"
                +"</div>";
                
        
                $(".adm_show_dictionary_container .dictionary_type_listing.display-type .content_new_dico").append(newEntry);
                
                
                $(".adm_show_dictionary_container .disp_"+count+" .delete_line").on('click', function(){
                        var name = $(this).parents(".line_new_dico").data('standard_name');
                        if (confirm('Confirm the deletion of entry '+name+'. This action is irreversible.')) {
                            $(this).parents(".line_new_dico").remove();
                        }                        
                });

                $(".adm_show_dictionary_container .disp_"+count+" .update_line").on('click', function(){
                    var id = $(this).parents(".line_new_dico").data('index');
                    var type = $(this).parents(".line_new_dico").data('type');
                    updateDictionaryLineShow(id, type); 
                });
                
                
                $(".step_two").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formDispCtn.fadeOut("200");
                
            });
            
            formDispCtn.find(".cancel_bt").on('click', function(){
                $(".step_two").fadeIn(200);            
                $(".overlay_form").addClass("hidden");
                formDispCtn.fadeOut("200");
            });
        }
        
        $(".adm_show_dictionary_container .update_new_dico").off();
        $(".adm_show_dictionary_container .update_new_dico").on('click', function(){
            updateDictionaryInDatabase(newID, description, refID, refFamily, refModel, refType);
        });
        
        $(".adm_show_dictionary_container .cancel_new_dico").off();
        $(".adm_show_dictionary_container .cancel_new_dico").on('click',function(){
            $(".step_two").fadeOut(200);
            setTimeout(function(){
                $(".step_one").fadeIn(200);
            },200)            
        });
        
    }
    
    function updateDictionaryInDatabase(newID, description, refID, refFamily, refModel, refType){
        
        var newDictionaryData = [];
        
        $("#adm_content_show_dictionary .dictionary_type_listing .line_new_dico").each(function(){
            
            var calib_subindex_x = $(this).data("calibsubindexx");
            var calib_subindex_y = $(this).data("calibsubindexy");
            var can_id =  $(this).data("canid");
            var description = $(this).data("description");
            var dim_signal = $(this).data("dimsignal");
            var family_id = newID;
            var flash_signal = $(this).data("flashsignal");
            var is_cdrh = $(this).data("iscdrh");
            var is_enable = $(this).data("isenable");
            var is_final = $(this).data("isfinal");
            var is_led = $(this).data("isled");
            var is_safety = $(this).data("issafety");
            var off_signal = $(this).data("offsignal");
            var on_signal = $(this).data("onsignal");
            var photo_link = $(this).data("photolink");
            var pressed_val = $(this).data("pressedval");
            var released_val = $(this).data("releasedval");
            var standard_name = $(this).data("standardname");
            var symbol_name = $(this).data("symbolname");
            var threshold_max_axis = $(this).data("thresholdmaxaxis");
            var threshold_max_zero = $(this).data("threshold_max_zero");
            var threshold_min_axis = $(this).data("thresholdminaxis");
            var threshold_min_zero = $(this).data("thresholdminzero");
            var timer = $(this).data("timer");
            var type_t = $(this).data("type");
            var value = $(this).data("value");
            var x_pos = $(this).data("xpos");
            var y_pos = $(this).data("ypos");
            var zone = $(this).data("zone");
            
            newDictionaryData.push({
                calib_subindex_x:calib_subindex_x,
                calib_subindex_y:calib_subindex_y,
                can_id:can_id,
                description:description,
                dim_signal:dim_signal,
                family_id:family_id,
                flash_signal:flash_signal,
                is_cdrh:is_cdrh,
                is_enable:is_enable,
                is_final:is_final,
                is_led:is_led,
                is_safety:is_safety,
                off_signal:off_signal,
                on_signal:on_signal,
                photo_link:photo_link,
                pressed_val:pressed_val,
                released_val:released_val,
                standard_name:standard_name,
                symbol_name:symbol_name,
                threshold_max_axis:threshold_max_axis,
                threshold_max_zero:threshold_max_zero,
                threshold_min_axis:threshold_min_axis,
                threshold_min_zero:threshold_min_zero,
                timer:timer,
                type:type_t,
                value:value,
                x_pos:x_pos,
                y_pos:y_pos,
                zone:zone
            });
                        
        });
        
        var newDictionaryJson = JSON.stringify(newDictionaryData);
        
         if (confirm('Confirm the update of dictionary ID '+ newID+". This action will modify this dictionary in database.")) {
            $.ajax({
                url: '../php/api.php?function=modify_dictionary',
                type: 'POST',
                dataType: 'JSON',
                data:{
                    newID:newID,
                    description:description,
                    refID:refID,
                    refFamily:refFamily,
                    refModel:refModel,
                    refType:refType,
                    jsonDico:newDictionaryJson
                },
                success: function (data, statut) {
                    
                }
            });
            setTimeout(function(){
                $(".step_two").fadeOut(200); 
                $(".step_three .title").html("Congratulations, dictionary ID "+newID+" - "+description+" - is now updated and available.");
                $(".step_three").fadeIn("200");
            },500);
        }        
        
    }
    
    $(".step_three .okay").on('click', function(){
        $("#adm_content_show_dictionary .dictionary_type_listing .content_new_dico").empty();
        $(".step_three").fadeOut("200");
        $(".step_one").fadeIn("200");
    })
    
    
    //============================================================================//
    //                              TSUI  ADMIN                                   //
    //============================================================================//
    
    $(".tsui_page").on('click', function(){
        getTsuiAdmin();
    });
    
    function getTsuiAdmin(){
    
        $.ajax({
            url: '../php/api.php?function=get_all_tsui',
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                fillTsuiTable(data);
            }
        });
    }
    
    function fillTsuiTable(data){        
        var tsuiTable = $(".content_array_tsui"); 
        tsuiTable.find(".delete_line").off();
        tsuiTable.find(".update_line").off();
        
        tsuiTable.empty();
        
        console.log(data);
        if(data.length > 0){
            $(".adm_tsui_container .result_description span").html(data.length);
            for(var i=0; i < data.length; i++){
                
                if(data[i].has_service_bt == 1){var hasService = "<img src='../images/check_admin.png' title='This TSUI has Service Button.'>"}else{var hasService = "-"}
                if(data[i].has_SRTL == 1){var hasSRTL = "<img src='../images/check_admin.png' title='This TSUI has SRTL.'>"}else{var hasSRTL = "-"}
                
                tsuiTable.append(
                    "<div class='line_tsui'>"
                        +"<div class='td_tsui part_number'>"+data[i].part_number+"</div>"
                        +"<div class='td_tsui name'>"+data[i].name+"</div>"
                        +"<div class='td_tsui photo_link'><img src='../images/"+data[i].photo_link+"'></div>"
                        +"<div class='td_tsui family'>"+data[i].family+"</div>"
                        +"<div class='td_tsui family_name'>"+data[i].family_name+"</div>"
                        +"<div class='td_tsui model'>"+data[i].model+"</div>"   
                        +"<div class='td_tsui type'>"+data[i].type+"</div>"
                        +"<div class='td_tsui switch_pos_number'>"+data[i].switch_pos_number+"</div>"
                        +"<div class='td_tsui has_service_bt'>"+hasService+"</div>"
                        +"<div class='td_tsui has_SRTL'>"+hasSRTL+"</div>"
                        +"<div class='td_tsui action' data-id='"+data[i].id+"' data-part_number='"+data[i].part_number+"' data-name='"+data[i].name+"' data-photo_link='"+data[i].photo_link+"' data-family='"+data[i].family+"' data-family_name='"+data[i].family_name+"' data-model='"+data[i].model+"' data-type='"+data[i].type+"' data-switch_pos_number='"+data[i].switch_pos_number+"' data-has_service_bt='"+data[i].has_service_bt+"' data-has_srtl='"+data[i].has_SRTL+"' data-tst_name='"+data[i].tst_name+"'>"
                            +"<img class='update_line' src='../images/update_admin.png' title='Modify this entry.' style='margin-right: 17px;'><img class='delete_line' src='../images/delete.png' title='Delete this entry.'>"
                        +"</div>"
                    +"</div>"
                )
            }
            
            
            tsuiTable.find(".delete_line").on('click', function(){
                var idLine = $(this).parent().data("id");
                var part_number = $(this).parent().data("part_number");
                if (confirm('Confirm the deletion of TSUI '+part_number+'. This action is irreversible.')) {
                    deleteLineByID(idLine, "tsui");
                    setTimeout(function(){
                        getTsuiAdmin();
                    },250);
                }
            });
            
            tsuiTable.find(".update_line").on('click', function(){
                var idLine_ = $(this).parent().data("id");
                var partNumber_ = $(this).parent().data("part_number");
                var name_ = $(this).parent().data("name");
                var photoLink_ = $(this).parent().data("photo_link");
                var family_ = $(this).parent().data("family");
                var familyName_ = $(this).parent().data("family_name");  
                var model_ = $(this).parent().data("model");  
                var type_ = $(this).parent().data("type");  
                var switchPosNumber_ = $(this).parent().data("switch_pos_number");  
                var hasServiceBt_ = $(this).parent().data("has_service_bt");  
                var hasSRTL_ = $(this).parent().data("has_srtl");  
                var tstName_ = $(this).parent().data("tst_name"); 
                
                openTsuiUpdateBox(idLine_, partNumber_, name_, photoLink_, family_, familyName_, model_, type_, switchPosNumber_, hasServiceBt_, hasSRTL_, tstName_);
            });
        }
        else{
            $(".adm_tsui_container .result_description span").html("0 ");
        }
        
       
    
    }
    
    //Ouverture de la fenetre d'update user
    function openTsuiUpdateBox(idLine, partNumber, name, photoLink, family, familyName, model, type, switchPosNumber, hasServiceBt, hasSRTL, tstName){
        var updateTsuiBox = $(".adm_tsui_container .update_tsui_box");
        updateTsuiBox.find(".update_tsui_btn").off();
        
        updateTsuiBox.find("select option").each(function(){
            $(this).removeAttr('selected');
        });
        
        updateTsuiBox.find(".update_tsui_family").empty();        
        $.ajax({
            url: '../php/api.php?function=get_all_dictionaries',
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                console.log(data);
                for(var i =0; i<data.length;i++){
                    updateTsuiBox.find(".update_tsui_family").append("<option value='"+data[i].family_id+"'>"+data[i].family_id+" - <i>"+data[i].description+"</i></option>")
                }
                
                updateTsuiBox.find(".update_tsui_family option").each(function(){
                    console.log($(this).val());
                    if($(this).val()== family){
                        $(this).attr("selected","selected");
                    }
                });
            }
        });
        
        updateTsuiBox.find(".id_tsui_span").html(idLine);
        updateTsuiBox.find(".update_tsui_part_number").val(partNumber);
        updateTsuiBox.find(".update_tsui_name").val(name);
        updateTsuiBox.find(".update_tsui_photo_link").val(photoLink);
        updateTsuiBox.find(".update_tsui_family_name").val(familyName);
        updateTsuiBox.find(".update_tsui_model").val(model);
        updateTsuiBox.find(".update_tsui_type").val(type);
        updateTsuiBox.find(".update_tsui_tst_name").val(tstName);
       
        
        updateTsuiBox.find(".update_tsui_switch_pos_number option").each(function(){
            if($(this).val()== switchPosNumber){
                $(this).attr("selected","selected");
            }
        });
        
        updateTsuiBox.find(".update_tsui_has_service_bt option").each(function(){
            if($(this).val()== hasServiceBt){
                $(this).attr("selected","selected");
            }
        });
        
        updateTsuiBox.find(".update_tsui_has_SRTL option").each(function(){
            if($(this).val()== hasSRTL){
                $(this).attr("selected","selected");
            }
        });

        $(".adm_tsui_container .overlay_udpdate").fadeIn(300);
        updateTsuiBox.find(".update_tsui_btn").off();
        updateTsuiBox.find(".update_tsui_btn").on('click', function(){            
            var _partNumber = updateTsuiBox.find(".update_tsui_part_number").val();
            var _name = updateTsuiBox.find(".update_tsui_name").val();
            var _photoLink = updateTsuiBox.find(".update_tsui_photo_link").val();
            var _family = updateTsuiBox.find(".update_tsui_family").val();
            var _familyName = updateTsuiBox.find(".update_tsui_family_name").val();
            var _model = updateTsuiBox.find(".update_tsui_model").val();
            var _type = updateTsuiBox.find(".update_tsui_type").val();
            var _switchPosNumber = updateTsuiBox.find(".update_tsui_switch_pos_number").val();
            var _hasServiceBt = updateTsuiBox.find(".update_tsui_has_service_bt").val();
            var _hasSRTL = updateTsuiBox.find(".update_tsui_has_SRTL").val();
            var _tstName = updateTsuiBox.find(".update_tsui_tst_name").val();
            
            
            //var adminLine = updateTsuiBox.find(".update_user_admin option:selected").val();
            updateTsuiByID(idLine, _partNumber, _name, _photoLink, _family, _familyName, _model, _type, _switchPosNumber, _hasServiceBt, _hasSRTL, _tstName);
        });
        updateTsuiBox.find(".cancel_tsui_btn").off();
        updateTsuiBox.find(".cancel_tsui_btn").on('click', function(){  
            closeTsuiUpdateBox();
        });
    }
    
     //Appel ajax pour modifier un TSUI
    function updateTsuiByID(idLine, partNumber, name, photoLink, family, familyName, model, type, switchPosNumber, hasServiceBt, hasSRTL, tstName){        
        $.ajax({
            url: '../php/api.php?function=update_tsui_by_id',
            type: 'POST',
            dataType: 'JSON',
            data:{id:idLine,partNumber:partNumber, name:name, photoLink:photoLink, family:family, familyName:familyName,model:model,switchPosNumber:switchPosNumber,
                hasServiceBt:hasServiceBt,hasSRTL:hasSRTL,tstName:tstName, type:type}
        });
        setTimeout(function(){
            getTsuiAdmin();
            closeTsuiUpdateBox();
        },200);
    }
    
    //Fermeture de la fenetre d'update user
    function closeTsuiUpdateBox(){        
        $(".adm_tsui_container .overlay_udpdate").fadeOut(300);
    }  
    
    $(".add_tsui_description").on('click', function(){
        openCreateTsuiBox();
    });
    
    //Ouverture de la fenetre de creation user
    function openCreateTsuiBox(){
        var createTsuiBox = $('.adm_tsui_container .create_tsui_box');
        createTsuiBox.find("select option").each(function(){
            $(this).removeAttr('selected');
        });        
        createTsuiBox.find("input").each(function(){
            $(this).val('');
        });
        createTsuiBox.find(".create_tsui_family").empty();
        
        
        $.ajax({
            url: '../php/api.php?function=get_all_dictionaries',
            type: 'GET',
            dataType: 'JSON',
            success: function (data, statut) {
                console.log(data);
                for(var i =0; i<data.length;i++){
                    console.log(data[i].family_id);
                    createTsuiBox.find(".create_tsui_family").append("<option value='"+data[i].family_id+"'>"+data[i].family_id+" - <i>"+data[i].description+"</i></option>")
                }
            }
        });
        
        
        $(".adm_tsui_container .overlay_create").fadeIn(300);
        
        createTsuiBox.find(".create_tsui_btn").off();
        createTsuiBox.find(".create_tsui_btn").on('click', function(){
            var _partNumber = createTsuiBox.find(".create_tsui_part_number").val();
            var _name = createTsuiBox.find(".create_tsui_name").val();
            var _photoLink = createTsuiBox.find(".create_tsui_photo_link").val();
            var _family = createTsuiBox.find(".create_tsui_family").val();
            var _familyName = createTsuiBox.find(".create_tsui_family_name").val();
            var _model = createTsuiBox.find(".create_tsui_model").val();
            var _type = createTsuiBox.find(".create_tsui_type").val();
            var _switchPosNumber = createTsuiBox.find(".create_tsui_switch_pos_number").val();
            var _hasServiceBt = createTsuiBox.find(".create_tsui_has_service_bt").val();
            var _hasSRTL = createTsuiBox.find(".create_tsui_has_SRTL").val();
            var _tstName = createTsuiBox.find(".create_tsui_tst_name").val();
            
            createTsui(_partNumber, _name, _photoLink, _family, _familyName, _model, _type, _switchPosNumber, _hasServiceBt, _hasSRTL, _tstName);
        });
        
        createTsuiBox.find(".cancel_tsui_btn").off();
        createTsuiBox.find(".cancel_tsui_btn").on('click', function(){
            closeTsuiCreateBox();
        });
    }
    //Appel ajax pour creer un utilisateur
    function createTsui(partNumber, name, photoLink, family, familyName, model, type, switchPosNumber, hasServiceBt, hasSRTL, tstName){        
        $.ajax({
            url: '../php/api.php?function=create_tsui',
            type: 'POST',
            dataType: 'JSON',
            data:{partNumber:partNumber, name:name, photoLink:photoLink, family:family, familyName:familyName, model:model, type:type, switchPosNumber:switchPosNumber,
                hasServiceBt:hasServiceBt, hasSRTL:hasSRTL, tstName:tstName}
        });
        setTimeout(function(){
            getTsuiAdmin();
            closeTsuiCreateBox();
        },200);
    }   
    
    //Fermeture de la fenetre de creation user
    function closeTsuiCreateBox(){        
        $(".adm_tsui_container .overlay_create").fadeOut(300);
    }
    
    
});

