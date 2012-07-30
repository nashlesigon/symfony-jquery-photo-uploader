(function($){

    $.azulphotouploader = {version: '2.0a'};
    // alert($.azulphotouploader.version);
    $.fn.azulphotouploader = function(options){

        var defaults = {
            context: '',
            context_id: 0,
            loaderImage: 'images/ajax-loader.gif',
            inqueueClass: 'apu-upload-queue',
            uploadingClass: 'apu-uploading',
            uploadedClass: 'apu-uploaded',
            errorClass: 'apu-error',
            hasTitle: false
        }

        var options = $.extend(defaults, options);
        
        var uploader = null;

        var isSupported = function(){
            var input = document.createElement('input');
            input.type = 'file';        
            
            return (
                'multiple' in input &&
                typeof File != "undefined" &&
                typeof (new XMLHttpRequest()).upload != "undefined" );       
        }

        var initialize = function(element){
            if(isSupported() == true){
                uploader = new $.fn.apuXHR(options);
            }
            else {
                uploader = new $.fn.apuNONXHR(options);
            }

            uploader.initialize(element);
        }

        

        return this.each(function(){
            initialize(this);
        });
    }

    $.fn.apuXHR = function(options){
        var defaults = {
            files: [],
            template:   '<div id="azulphotouploader-wrapper">'+
                            '<div class="upload-header">'+
                                '<input class="button" type="button" value="Select Photos" id="select-photos">'+
                                '<input type="file" id="file-upload" name="images[]" size="2" multiple="multiple" style="visibility:hidden; position: absolute;" />'+
                                '<input class="button" type="button" value="Start Upload" id="start-upload" />'+
                                '<span class="generating-preview">Generating preview...</span>'+
                            '</div>'+
                            '<div id="file-upload-queue">'+
                                '<ul class="clearfix"></ul>'+
                            '</div>'+
                        '</div>'
        };

        var options = $.extend(defaults, options);

        var uploadQueue = function(obj)
        {
            for (var i=0, file; file=obj.files[i]; i++)
            {
                if($.fn.apufilter(file.type))
                {
                    insertPreview(file.name);
                    options.files.push(file);
                }
            }
        }

        var toggleUploadButton = function(){
            if($("li."+options.inqueueClass).length > 0){
                $("input#start-upload").show();
            }
            else
            {
                $("input#start-upload").hide();
            }

            $("div.upload-header > input[type=button]").removeClass('disabled');
        }

        var removePhoto = function(){
            $("a[name=apu-remove-photo]").each(function(){
                $(this)
                    .unbind('click')
                    .click(function(){
                        if(confirm("Are you sure you want to remove this photo from queue?"))
                        {
                            $(this).parents('li').remove();
                            toggleUploadButton();
                        }
                    });
            });
            
        }

        var insertPreview = function(filename){
            var cnt = $("#file-upload-queue > ul > li").length;
            var e_id = "image_"+cnt;
            var html = '<li class="clearfix '+options.inqueueClass+'" id="'+e_id+'">'+
                            '<div class="to-left">'+
                                '<div>'+    
                                    '<span class="queue-text">In Queue</span>'+
                                    '<span class="loader"></span>'+
                                    '<div class="image-file" ></div>'+
                                '</div>'+
                                '<div class="filename">'+filename+'</div>'+
                            '</div>'+
                            '<div class="to-right">';
                        if(options.hasTitle === true)
                        {
                            html += '<h2>Title <a href="javascript:void(0);" name="apu-remove-photo" class="remove to-right" title="Remove from queue">Remove</a></h2>'+
                                    '<input type="text" name="title" />'+
                                    '<h2>Title Link</h2>'+
                                    '<input type="text" name="title_link" />'+
                                    '<h2>Caption (<span class="count">300</span>)</h2>';
                        }
                        else
                        {
                            html += '<h2>Caption (<span class="count">300</span>)<a href="javascript:void(0);" name="apu-remove-photo" class="remove to-right" title="Remove from queue">Remove</a></h2>';
                        }
                            html += '<textarea name="caption" onkeydown="return $.fn.ApuUtilityCaptionCounter(event, this);" onkeyup="return $.fn.ApuUtilityCaptionCounter(event, this);"></textarea>'+
                            '</div>'+
                    '</li>';
            $("#file-upload-queue > ul").append(html);
            removePhoto();
            toggleUploadButton();
        }

        var startUpload = function(){
                
            for (var i=0, file; file=options.files[i]; i++){
                
                $("div.upload-header > input[type=button]").addClass('disabled');

                var e_id = "image_"+i;
                if($("li#"+e_id).hasClass(options.inqueueClass))
                {
                    var name = file.name;
                    
                    var qString = buildQstring(name, e_id);
                    
                    $.ajax({
                        url: qString,
                        data: file,
                        processData: false,
                        type: "POST",
                        contentType: "application/octet-stream",
                        dataType: "JSON",
                        async: false,
                        beforeSend: function(xhr){
                            xhr.setRequestHeader("X-File-Name", encodeURIComponent(name));
                            $("#"+e_id).removeClass(options.inqueueClass);
                            $("#"+e_id).addClass(options.uploadingClass);
                            $("li#"+e_id).find("span.queue-text").text("Uploading...");
                        },
                        success: function(data){
                            
                            $("#"+data.e_id).removeClass(options.uploadingClass);
                            $("#"+data.e_id).addClass(options.uploadedClass);
                            $("li#"+data.e_id).find("span.queue-text").text("Done");
                            $("li#"+data.e_id).find("input[type=text]").attr('readonly','readonly');
                            $("li#"+data.e_id).find("textarea").attr('readonly','readonly');
                            $("li#"+data.e_id).find("div.image-file").append("<img src='"+data.thumbnail+"' />");
                            // thumbnail
                            toggleUploadButton();
                        },
                        statusCode: {
                            301: function() {
                                alert("Redirected!");
                            },
                            404: function() {
                                alert("Page not found!");
                            },
                            500: function() {
                                alert("Internal Server Error!");
                            }
                        }
                    });
                }
            }
        }

        var buildQstring = function(filename, e_id){
            var qString = options.post_url+"?file="+filename+"&e_id="+e_id+"&context="+options.context+"&context_id="+options.context_id;

            if($("#"+e_id).find('input[name=title]').val() !== 'undefined'){
                qString += "&title="+$("#"+e_id).find('input[name=title]').val()+"&link="+$("#"+e_id).find('input[name=title_link]').val()
            }

            qString += "&caption="+$("#"+e_id).find('textarea[name=caption]').val();
            return qString;
            
        }

        return {
            getName: function(){
                return "apuXHR";
            },
            initialize: function(element){
                $(element).append(options.template);
                $(".generating-preview").hide();
                $("input[type=file]", element)
                    .unbind("change")
                    .change(function(){
                        uploadQueue(this);
                    });

                $("input#select-photos", element).click(function(){
                    $("input#file-upload", element).click();
                });

                $("input#start-upload", element).click(function(){
                    startUpload();    
                });

                toggleUploadButton();
            }
        }
    }

    $.fn.apuNONXHR = function(options){
        var defaults = {
            files: [],
            template:   '<div id="azulphotouploader-wrapper">'+
                            '<div class="upload-header">'+
                                '<input type="file" id="file-upload" name="images" />'+
                                '<input class="button" type="button" value="Start Upload" id="start-upload" />'+
                                '<span class="generating-preview">Generating preview...</span>'+
                            '</div>'+
                            '<div id="file-upload-queue">'+
                                '<ul class="clearfix"></ul>'+
                            '</div>'+
                        '</div>'
        };

        var options = $.extend(defaults, options);

        var toggleUploadButton = function(){
            if($("li."+options.inqueueClass).length > 0){
                $("input#start-upload").show();
            }
            else
            {
                $("input#start-upload").hide();
            }

            $("div.upload-header > input[type=button]").removeClass('disabled');
        }

        var removePhoto = function(){
            $("a[name=apu-remove-photo]").each(function(){
                $(this)
                    .unbind('click')
                    .click(function(){
                        if(confirm("Are you sure you want to remove this photo from queue?"))
                        {
                            $(this).parents('li').remove();
                            toggleUploadButton();
                        }
                    });
            });
            
        }        

        var insertPreview = function(obj){
            var cnt = $("#file-upload-queue > ul > li").length;
            var e_id = "image_"+cnt;
            var form_id = "jUploadForm_"+cnt;
            var iframe_id = "jUploadFrame_"+cnt;
            var filename = $(obj).val();
            var fname = filename.split("\\");
            var html = '<li class="clearfix '+options.inqueueClass+'" id="'+e_id+'">'+
                            '<form name="'+form_id+'" id="'+form_id+'" enctype="multipart/form-data" method="post">'+
                            '<div class="to-left">'+
                                '<div>'+    
                                    '<span class="queue-text">In Queue</span>'+
                                    '<span class="loader"></span>'+
                                    '<div class="image-file" ></div>'+
                                '</div>'+
                                '<div class="filename">'+fname[2]+'</div>'+
                            '</div>'+
                            '<div class="to-right">';
                        if(options.hasTitle === true)
                        {
                            html += '<h2>Title <a href="javascript:void(0);" name="apu-remove-photo" class="remove to-right" title="Remove from queue">Remove</a></h2>'+
                                    '<input type="text" name="title" />'+
                                    '<h2>Title Link</h2>'+
                                    '<input type="text" name="title_link" />'+
                                    '<h2>Caption (<span class="count">300</span>)</h2>';
                        }
                        else
                        {
                            html += '<h2>Caption (<span class="count">300</span>)<a href="javascript:void(0);" name="apu-remove-photo" class="remove to-right" title="Remove from queue">Remove</a></h2>';
                        }
                        
                        html += '<textarea name="caption" onkeydown="return $.fn.ApuUtilityCaptionCounter(event, this);" onkeyup="return $.fn.ApuUtilityCaptionCounter(event, this);"></textarea>'+
                            '</div>'+
                            '</form>'+
                            '<iframe id="'+iframe_id+'" name="'+iframe_id+'" src="javascript:false" style="visibility:hidden; position:absolute;" />'+
                    '</li>';
            $("#file-upload-queue > ul").append(html);
            $("#"+e_id+" div.to-right").append(obj);
            $(obj).hide();

            removePhoto();
            toggleUploadButton();
        }

        var startUpload = function(){
            $("li."+options.inqueueClass).each(function(){

                var me = this;
                var form = $(me).find('form');
                var iframe = $(me).find('iframe');
                var qString = options.post_url+"?context="+options.context+"&context_id="+options.context_id;

                $(form).attr('action',qString);
                $(form).attr('target', $(iframe).attr('id'));
                $(me)
                    .removeClass(options.inqueueClass)
                    .addClass(options.uploadingClass)
                    .find("span.queue-text").text("Uploading");
                $(form).submit();
                
                $(iframe).load(function(){
                    var resultText = $(iframe).contents().find('body').text();
                    var data = $.parseJSON(resultText);
                    
                    $(me)
                        .removeClass(options.uploadingClass)
                        .addClass(options.uploadedClass)
                        .find("span.queue-text").text("Done");
                    $(me)
                        .find("input[type=file]").remove();
                    $(me)
                        .find("div.image-file")
                        .append("<img src='"+data.thumbnail+"' />");

                    toggleUploadButton();
                });

                
            });
            
        }

        return {
            getName: function(){
                return "apuNONXHR";
            },
            initialize: function(element){
                $(element).append(options.template);
                
                $(".generating-preview").hide();
                $("#file-upload", element)
                    .unbind('change')
                    .change(function(){
                        
                        var clone = $(this).clone(true);
                        $(this).after(clone);
                        $(this).attr('id', '');
                        insertPreview(this);
                    });
                
                
                $("input#start-upload", element).click(function(){
                    startUpload();
                });

                toggleUploadButton();
            }
        }
    }

    $.fn.apufilter = function(type){
        var rFilter = /^(image\/bmp|image\/cis-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x-cmu-raster|image\/x-cmx|image\/x-icon|image\/x-portable-anymap|image\/x-portable-bitmap|image\/x-portable-graymap|image\/x-portable-pixmap|image\/x-rgb|image\/x-xbitmap|image\/x-xpixmap|image\/x-xwindowdump)$/i;
        if(rFilter.test(type)) { return true; }
        alert("You must select a valid image file!");
        return false;
    }

    $.fn.ApuUtilityRemovePhoto = function(element)
    {
        if(confirm("Are you sure you want to remove this photo from queue?"))
        {
            $(element).parents('li').remove();
            // $.fn.ApuUtilityToggleUploadButton();
        }
    }

    $.fn.ApuUtilityCaptionCounter = function(e, me)
    {
        var limit = 300;
        // alert(e.value.length);
        var keycode =  e.keyCode ? e.keyCode : e.which;
        // alert(keycode);
        if(keycode >= 37 && keycode <= 39){
            return true;
        }
        var initialCount = me.value.length;
        var cntr = $(me).prev('h2').find('span.count').text();
        if(keycode == 8){
            $(me).prev('h2').find('span.count').text(limit - initialCount);
            return true;
        }
        else {
            if(cntr == 0){
                return false;
            }
            else if(cntr < 0 || initialCount > limit){
                var nCaption = $(me).val();
                $(me).val(nCaption.substring(0,limit));
                $(me).prev('h2').find('span.count').text(0);
                return false;
            }
            $(me).prev('h2').find('span.count').text(limit - initialCount);
        }
    }    
})(jQuery);