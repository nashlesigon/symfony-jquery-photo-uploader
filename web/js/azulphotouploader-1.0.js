(function($){
    $.azulphotouploader = {version: '1.0'};

    $.fn.azulphotouploader = function(options){

        var defaults = {
            context: '',
            context_id: 0,
            dimensions: [],
            post_url: '',
            extensions: ["jpg","png"],
            template:   '<div id="azulphotouploader-wrapper">'+
                            '<div class="upload-header">'+
                                '<input class="button" type="button" value="Select Photos" id="select-photos">'+
                                '<input type="file" id="file-upload" size="2" multiple="multiple">'+
                                '<input class="button" type="button" value="Start Upload" id="start-upload" />'+
                                '<span class="generating-preview">Generating preview...</span>'+
                            '</div>'+
                            '<div id="file-upload-queue"><ul class="clearfix"></ul></div>'+
                        '</div>',
            loaderImage: 'images/ajax-loader.gif',
            inqueueClass: 'apu-upload-queue',
            uploadingClass: 'apu-uploading',
            uploadedClass: 'apu-uploaded',
            errorClass: 'apu-error',
            hasTitle: false,
            externalLink: '',
            files: []
        }

        var options = $.extend(defaults, options);
        // var files_queue = [];

        return this.each(function(){
            var me = this;
            initialize = function(){
                $(me).append(options.template);
                $(".generating-preview").hide();
                initializeActions();
            }

            initializeActions = function(){
                prepareUploader();
                $("input#select-photos", me).click(function(){
                    $("input#file-upload", me).click();
                });
                $("input#start-upload", me).click(function(){
                    startUpload();
                });

                toggleUploadButton();
            }

            captionCounter = function(e, me){
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

            toggleUploadButton = function(){
                // alert($("."+options.inqueueClass).length);
                if($("."+options.inqueueClass).length > 0){
                    $("input#start-upload", me).show();
                }
                else
                {
                    $("input#start-upload", me).hide();
                }

                $("div.upload-header > input[type=button]").removeClass('disabled');
            }

            prepareUploader = function(){
                $("input[type=file]", me)
                    .unbind("change")
                    .change(function(){
                        prepareQueue(this);
                    });

                // $("#file-upload-queue > ul").empty();
            }

            prepareQueue = function(obj){
                var index = 0;
                for (var i=0, file; file=obj.files[i]; i++)
                {

                    if(filter(file.type))
                    {
                        
                        if(typeof(FileReader) !== "undefined")
                        {
                            var reader = new FileReader();
                            reader.onload = (function (file, e_id) {
                                
                                return function(e){

                                    var cnt = $("#file-upload-queue > ul > li").length;
                                    var e_id = "image_"+cnt;
                                    var html = '<li class="clearfix '+options.inqueueClass+'" id="'+e_id+'">'+
                                                    '<div class="to-left">'+
                                                        '<div>'+    
                                                                '<span class="queue-text">In Queue</span>'+
                                                            '<span class="loader"></span>'+
                                                            '<img src="'+e.target.result+'" class="image-file" width="100%" />'+
                                                        '</div>'+
                                                        '<div class="filename">'+file.name+'</div>'+
                                                    '</div>'+
                                                    '<div class="to-right">'
                                                if(options.hasTitle === true)
                                                {
                                                    html += '<h2>Title <a href="javascript:void(0);" name="remove-photo" class="remove to-right" title="Remove from queue" onclick="return removePhoto(event, this)">Remove</a></h2>'+
                                                            '<input type="text" name="title" />'+
                                                            '<h2>Title Link</h2>'+
                                                            '<input type="text" name="title_link" onblur="urlOnlyInput(this)" />'+
                                                            '<h2>Caption (<span class="count">300</span>)</h2>';
                                                }
                                                else
                                                {
                                                    html += '<h2>Caption (<span class="count">300</span>)<a href="javascript:void(0);" name="remove-photo" class="remove to-right" title="Remove from queue" onclick="return removePhoto(event, this)">Remove</a></h2>';
                                                }
                                                    html += '<textarea name="caption" onkeydown="return captionCounter(event, this);" onkeyup="return captionCounter(event, this);"></textarea>'+
                                                    '</div>'+
                                            '</li>';
                                    $("#file-upload-queue > ul").append(html);

                                    toggleUploadButton();
                                };

                                // initializeRemovePhoto();
                            })(file, e_id);

                            reader.onloadstart = function(){
                                $(".generating-preview").show();
                            }

                            reader.onloadend = function(){
                                $(".generating-preview").hide();
                                resetInputFile();
                            }


                            reader.readAsDataURL(file);
                        }
                        else 
                        {
                            var cnt = $("#file-upload-queue > ul > li").length;
                            var e_id = "image_"+cnt;
                            var html = '<li class="safari '+options.inqueueClass+'" id="'+e_id+'">'+
                                                '<div class="clearfix header">'+
                                                    '<span class="filename">'+file.name+'</span>'+
                                                    '<a class="remove to-right" onclick="return removePhoto(event, this)" name="remove-photo" href="javascript:void(0);">Remove</a>'+
                                                '</div>'+
                                                '<div class="apu-body">';
                                                if(options.hasTitle === true)
                                                {
                                                    html += '<h2>Title</h2>'+
                                                            '<input type="text" name="title" />'+
                                                            '<h2>Link</h2>'+
                                                            '<input type="text" name="title_link" onblur="urlOnlyInput(this)" />';
                                                }
                                                    
                                                html += '<h2>Caption (<span class="count">100</span>)</h2>'+
                                                    '<textarea name="caption"></textarea>'+
                                                '</div>'+
                                        '</li>';
                            $("#file-upload-queue > ul").append(html);
                        }

                        options.files.push(file);
                    }
                }
                
            }

            filter = function(type){
                var rFilter = /^(image\/bmp|image\/cis-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x-cmu-raster|image\/x-cmx|image\/x-icon|image\/x-portable-anymap|image\/x-portable-bitmap|image\/x-portable-graymap|image\/x-portable-pixmap|image\/x-rgb|image\/x-xbitmap|image\/x-xpixmap|image\/x-xwindowdump)$/i;
                if(rFilter.test(type)) { return true; }
                alert("You must select a valid image file!");
                return false;
            }

            resetInputFile = function(){
                $("#azulphotouploader-wrapper").html($("#azulphotouploader-wrapper").html());
                initializeActions();
            }

            startUpload = function(){
                
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
                                $("li#"+data.e_id).find("a[name=remove-photo]").remove();
                                toggleUploadButton();
                            },
                            statusCode: {
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

            removePhoto = function(e, element){
                if(confirm("Are you sure you want to remove this photo from queue?"))
                {
                    $(element).parents('li').remove();
                    toggleUploadButton();
                }
            }

            urlOnlyInput = function(element){
                var errorHtml = "<span>Please enter a valid link!</span>";
                var isValidUrl = validateURL($(element).val());
                $(element).next('span').remove();
                
                if(isValidUrl)
                {
                    return true;
                }
                
                $(element).after(errorHtml);
            }

            validateURL = function(textval) {
                var urlregex = new RegExp( "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
                return urlregex.test(textval);
            }

            buildQstring = function(filename, e_id){
                var qString = options.post_url+"?file="+filename+"&e_id="+e_id+"&context="+options.context+"&context_id="+options.context_id;

                if($("#"+e_id).find('input[name=title]').val() !== 'undefined'){
                    qString += "&title="+$("#"+e_id).find('input[name=title]').val()+"&link="+$("#"+e_id).find('input[name=title_link]').val()
                }

                qString += "&caption="+$("#"+e_id).find('textarea[name=caption]').val();
                return qString;
                
            }

            initialize();
        });
    }

})(jQuery);