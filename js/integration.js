$(document).ready(function(){
    var width = 0;
    //gestion des liens des boutons
    $(".bouton").on('click', function(){
        var link = $(this).data('link');
        if(link !== ""){
            $(".page_content.active").removeClass("active");
            setTimeout(function(){
                $(document).find("#content_"+link).addClass("active");
            },100);
        }
    });
    
    //gestion du bouton retour page accueil//
    $(".head_logo").on('click', function(){
        $(".page_content.active").removeClass("active")
        if($(this).hasClass("repair_mode")){
            $(document).find("#content_home").addClass("active");            
        }else if($(this).hasClass("inge_mode")){
            $(document).find("#content_homeE").addClass("active");            
        }else if($(this).hasClass("manufacturing_mode")){
            $(document).find("#content_homeM").addClass("active");
        }
    });
    
    $(".inge_choice").on('click', function(){
        $(".head_logo").addClass("inge_mode");
        $(".head_logo").removeClass("repair_mode");
        $(".head_logo").removeClass("manufacturing_mode");
        $(".exit_role").addClass("inge_mode");
        $(".exit_role").removeClass("repair_mode");
        $(".exit_role").removeClass("manufacturing_mode");
        $(".login_inge").removeClass("hidden");
        $(".bloc.information").addClass("hidden");
        $(document).find(".exit_role").removeClass("hidden");
    });
    $(".repair_choice").on('click', function(){
        $(".head_logo").addClass("repair_mode");
        $(".head_logo").removeClass("inge_mode");
        $(".head_logo").removeClass("manufacturing_mode");
        $(".exit_role").addClass("repair_mode");
        $(".exit_role").removeClass("inge_mode");
        $(".exit_role").removeClass("manufacturing_mode");
        $(".bloc.information").addClass("hidden");
        $(document).find(".exit_role").removeClass("hidden");
    });
    $(".manufacturing_choice").on('click', function(){
        $(".head_logo").addClass("manufacturing_mode");
        $(".head_logo").removeClass("inge_mode");
        $(".head_logo").removeClass("repair_mode");
        $(".exit_role").addClass("manufacturing_mode");
        $(".exit_role").removeClass("inge_mode");
        $(".exit_role").removeClass("repair_mode");
        $(".login_manufacturing").removeClass("hidden");
        
        $(".bloc.information").addClass("hidden");
        $(document).find(".exit_role").removeClass("hidden");
    });
    $(".vision_choice").on('click', function(){
//        $(".head_logo").addClass("vision_mode");
//        $(".head_logo").removeClass("inge_mode");
//        $(".bloc.information").addClass("hidden");
//        $(document).find(".exit_role").removeClass("hidden");
    });
    $(".exit_role").on('click', function(){
        $(this).addClass("hidden");
        $(".page_content.active").removeClass("active");
        $(".head_userinfo").addClass("hidden");
        setTimeout(function(){
            $(document).find("#content_role").addClass("active");
        },100);
    });
    
    
    //----------------------------------------------------//
     $(".calibration_bt").on('click', function(){
        $(".overlay_choice").removeClass("hidden");
    });
    
    $(".overlay_choice .go_calib").on('click', function(){
        $(".overlay_choice").addClass("hidden");
        $(".page_content.active").removeClass("active");
        setTimeout(function(){
            $(document).find("#content_calibration").addClass("active");
        },100);
    });
    
    $(".overlay_choice .go_download").on('click', function(){
        $(".overlay_choice").addClass("hidden");
        $(".page_content.active").removeClass("active");
        setTimeout(function(){
            $(document).find("#content_download").addClass("active");
        },100);
    });
    
    $(".bt_section").on("click", function(){
        if($(this).hasClass("diagnostic")){
            $(".bt_section").addClass("opacity_off");
            $(this).removeClass("opacity_off");
            $(".bloc_container .bloc").addClass('hidden');
            $(".bloc_container .information_finaltest").addClass('hidden');
            $(".bloc_container .information_diag").addClass('hidden');
            $(".login_diag").removeClass("hidden");
        }
        if($(this).hasClass("history")){
            $(".bt_section").addClass("opacity_off");
            $(this).removeClass("opacity_off");
            $(".bloc_container .bloc").addClass('hidden');
            $(".bloc_container .information_diag").addClass('hidden');
            $(".bloc_container .information_finaltest").addClass('hidden');
            $(".history_search").removeClass("hidden");
        }
        if($(this).hasClass("finaltest")){
            $(".bt_section").addClass("opacity_off");
            $(this).removeClass("opacity_off");
            $(".bloc_container .bloc").addClass('hidden');
            $(".bloc_container .information_diag").addClass('hidden');
            $(".login_finaltest").removeClass("hidden");
            $(".bloc_container .information_diag").addClass('hidden');
        }
    });
    
    $(".popup_test_fw .bt_yes").on("click", function(){
        $(".download_test_fw_content").removeClass("hidden");
        $(".popup_test_fw").addClass("hidden");
    });
    
    $(".popup_test_fw_final .bt_yes").on("click", function(){
        $(".download_test_fw_content_final").removeClass("hidden");
        $(".popup_test_fw_final").addClass("hidden");
    });
    $(".popup_test_fw_final.fct .bt_yes").on("click", function(){
        $(".download_test_fw_content_final.fct").removeClass("hidden");
        $(".popup_test_fw_final.fct").addClass("hidden");
    });
    
    
    
});