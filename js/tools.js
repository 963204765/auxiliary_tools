chrome.contentSettings.plugins.set({
    primaryPattern: "<all_urls>",
    resourceIdentifier: { id: "adobe-flash-player" },
    setting: "allow"
});

var app = new (function(){
    
    this.timmer1 = null;
    this.clipboard = null;

    /** 
     * 工具初始化
     * @synopsis function 
     * @return 
     */
    this.init = function(){
        this.unixtimeInit();
        $('#client_ip').val(returnCitySN.cip)
        $('#client_area').val(returnCitySN.cname)
    }

    /** 
     * 时间戳初始化
     * @synopsis function 
     * @return 
     */
    this.unixtimeInit = function(){
        $('#unixtime1').val(Date.parse(new Date()) / 1000);
        this.startUnixtime();
    }

    /** 
     * 时间戳开始
     * @synopsis function 
     * @return 
     */
    this.startUnixtime = function(){
        this.stopUnixtime();
        this.timmer1 = setInterval(function(){
            $('#unixtime1').val(Date.parse(new Date()) / 1000);
        },1000);
    }

    /** 
     * 时间戳停止
     * @synopsis function 
     * @return 
     */
    this.stopUnixtime = function(){
        clearInterval(this.timmer1);
    }

    /** 
     * 格式化时间戳
     * @synopsis function 
     * @return 
     */
    this.formatUnixtime = function(){
        var unixtime = $('#unixtime2').val();
        if(!unixtime){
            alert('请先输入时间戳');
            return;
        }

        var date = new Date(unixtime * 1000);
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()

        const t1 = [year, month, day].map(this.preambleZero).join('-')
        const t2 = [hour, minute, second].map(this.preambleZero).join(':')

        $('#date2').val(`${t1} ${t2}`);
    }

    /** 
     * 前导0
     * @synopsis function 
     * @param num
     * @return 
     */
    this.preambleZero = function(num){
        return num < 10 ? '0' + num : num;
    }

    /** 
     * 格式化日期
     * @synopsis function 
     * @return 
     */
    this.formatDate = function(){
        var date3 = $('#date3').val();
        if(!date3){
            alert('请输入日期');
            return;
        }
        
        var unixtime3 = Date.parse(new Date(date3)) / 1000;
        if(isNaN(unixtime3)){
            alert('日期格式有误');
            return;
        }

        $('#unixtime3').val(unixtime3);
    }

    /** 
     * 统计字符串长度
     * @synopsis function 
     * @param obj
     * @return 
     */
    this.stringLength = function(obj){
        $(obj).parent().next().val('');
        var text = $(obj).parent().prev().val();
        if(!text){
            alert('请输入要统计的字符串');
            return;
        }

        $(obj).parent().next().val(text.length);
    }

    this.stringReplace = function(obj){
        $(obj).parent().next().val('');
        var text = $(obj).parent().prev().val();
        var find = $(obj).prev().val()
        var replace = $(obj).next().val();
        if(!text){
            alert('请输入要替换的内容');
            return;
        }

        if(!find){
            alert('请输入要搜索的字符串');
            return
        }

        if(!replace){
            alert('请输入要替换的字符串');
            return;
        }

        $(obj).parent().next().val(text.replace(new RegExp(find,'g'),replace));
    }

    /** 
     * urlEncode
     * @synopsis function 
     * @return 
     */
    this.urlEncode = function(){
        var url = $('#url').val();
        if(!url){
            alert('请输入要编码的URL地址');
            return;
        }
        $('#url').val(encodeURIComponent(url));
    }

    /** 
     * urlDecode
     * @synopsis function 
     * @return 
     */
    this.urlDecode = function(){
        var url = $('#url').val();
        if(!url){
            alert('请输入要编码的URL地址');
            return;
        }
        $('#url').val(decodeURIComponent(url));
    }

    /** 
     * jsonEncode
     * @synopsis function 
     * @return 
     */
    this.jsonEncode = function(){
        var json = $('#json').val();
        if(!json){
            alert('请输入要编码的JSON字符串');
            return;
        }
        try{
            $('#json').val(JSON.stringify(JSON.parse(json)));
        }catch(e){
            alert('JSON字符串格式有误');
        }
    }

    /** 
     * jsonDecode
     * @synopsis function 
     * @return 
     */
    this.jsonDecode = function(){
        var json = $('#json').val();
        if(!json){
            alert('请输入要编码的JSON字符串');
            return;
        }
        try{
            $('#json').val(JSON.stringify(JSON.parse(json),null,4));
        }catch(e){
            alert('JSON字符串格式有误');
        }
    }

    /** 
     * MD5加密
     * @synopsis function 
     * @return 
     */
    this.md5 = function(){
        var md = $('#md5').val();
        if(!md){
            alert('请输入要加密的内容');
            return;
        }
        $('#md5').val(md5(md));
    }

    /** 
     * base64Encode
     * @synopsis function 
     * @return 
     */
    this.base64Encode = function(){
        var base64 = $('#base64').val();
        if(!base64){
            alert('请输入要Base64编码的字符串');
            return;
        }
        $('#base64').val(window.btoa(unescape(encodeURIComponent(base64))));
    }

    /** 
     * base64Decode
     * @synopsis function 
     * @return 
     */
    this.base64Decode = function(){
        var base64 = $('#base64').val();
        if(!base64){
            alert('请输入要Base64编码的字符串');
            return;
        }
        $('#base64').val(decodeURIComponent(escape(window.atob(base64))));
    }

    /** 
     * 图片转base64
     * @synopsis function 
     * @param obj
     * @return 
     */
    this.imageToBase64 = function(obj){
        switch(obj.files[0].type) {
            case 'image/png':
            case 'image/jpg':
            case 'image/jpeg':
                break;
            default:
                alert('仅支持jpg、jpeg、png格式');
                return;
                break;
        }

        var reader = new FileReader();
        imgUrlBase64 = reader.readAsDataURL(obj.files[0]);
        reader.onload = function (e) {
            $('#base64_to_image').val(reader.result)
        }
    }

    /** 
     * base64转图片
     * @synopsis function 
     * @return 
     */
    this.base64ToImage = function(){
        var base64 = $('#base64_to_image').val();
        if(!base64){
            alert('请输入base64图片编码内容')
            return;
        }

        var arr = base64.split(',');
        if(arr.length < 2){
            alert('图片base64编码格式错误')
            return;
        }
        var mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
        switch(mime) {
            case 'image/png':
            case 'image/jpg':
            case 'image/jpeg':
                break;
            default:
                alert('仅支持jpg、jpeg、png格式');
                return;
                break;
        }

        $('#image_to_base64').html('<img src="'+ base64 +'" />')
    }

    /** 
     * 生成二维码
     * @synopsis function 
     * @return 
     */
    this.createQrcode = function(){
        var text = $('#qrcode_text').val();
        if(!text){
            alert('请输入二维码内容');
            return;
        }

        $('#qrcode_img').html('').qrcode({
            text: text,
            height: 250,
            width: 250,
        });
    }

    /** 
     * 解析二维码
     * @synopsis function 
     * @param obj
     * @return 
     */
    this.decodeQrcode = function(obj){
        switch(obj.files[0].type) {
            case 'image/png':
            case 'image/jpg':
            case 'image/jpeg':
                break;
            default:
                alert('仅支持jpg、jpeg、png格式');
                return;
                break;
        }
        var url = this.getObjectURL(obj.files[0]);
        qrcode.decode(url);
        qrcode.callback = function(text){
            
            $('#qrcode_text').val(text);
            $('#qrcode_img').html('<img src="'+ url +'" />')
        }
    }

    /** 
     * 获取图片文件url
     * @synopsis function 
     * @param file
     * @return 
     */
    this.getObjectURL = function(file){
        var url = null ;
        if(window.createObjectURL != undefined){
            url = window.createObjectURL(file) ;
        }else if(window.URL != undefined){
            url = window.URL.createObjectURL(file) ;
        }else if(window.webkitURL != undefined){
            url = window.webkitURL.createObjectURL(file) ;
        }
        return url;
    }

    /** 
     * 异或转换
     * @synopsis function 
     * @return 
     */
    this.yihuoTransform = function(){
        var text = $('#yihuo_text').val();
        if(!text){
            alert('请输入要转换的字符');
            return;
        }

        var arr = {"!":"00100001","\"":"00100010","#":"00100011","$":"00100100","%":"00100101","&":"00100110","'":"00100111","(":"00101000",")":"00101001","*":"00101010","+":"00101011",",":"00101100","-":"00101101",".":"00101110","\/":"00101111","0":"00110000","1":"00110001","2":"00110010","3":"00110011","4":"00110100","5":"00110101","6":"00110110","7":"00110111","8":"00111000","9":"00111001",":":"00111010",";":"00111011","<":"00111100","=":"00111101",">":"00111110","?":"00111111","@":"01000000","A":"01000001","B":"01000010","C":"01000011","D":"01000100","E":"01000101","F":"01000110","G":"01000111","H":"01001000","I":"01001001","J":"01001010","K":"01001011","L":"01001100","M":"01001101","N":"01001110","O":"01001111","P":"01010000","Q":"01010001","R":"01010010","S":"01010011","T":"01010100","U":"01010101","V":"01010110","W":"01010111","X":"01011000","Y":"01011001","Z":"01011010","[":"01011011","\\":"01011100","]":"01011101","^":"01011110","_":"01011111","`":"01100000","a":"01100001","b":"01100010","c":"01100011","d":"01100100","e":"01100101","f":"01100110","g":"01100111","h":"01101000","i":"01101001","j":"01101010","k":"01101011","l":"01101100","m":"01101101","n":"01101110","o":"01101111","p":"01110000","q":"01110001","r":"01110010","s":"01110011","t":"01110100","u":"01110101","v":"01110110","w":"01110111","x":"01111000","y":"01111001","z":"01111010","{":"01111011","|":"01111100","}":"01111101","~":"01111110"}

        if(!arr[text]){
            alert('暂不支持该字符转换');
            $('#yihuo_result').html(`
                <tr>
                    <th>字符A</th>
                    <th>字符B</th>
                </tr>
                <tr>
                    <td colspan="2">暂无数据</td>
                </tr>
            `);
            return;
        }

        var tables = [];
        
        for(key in arr){
            for(k in arr){
                var str_arr = [];
                for(var i=0;i<arr[key].length;i++){
                    str_arr.push(arr[key][i] == arr[k][i] ? 0 : 1);
                }

                if(str_arr.join('') == arr[text]){
                    var str = [key,k].sort().toString();
                    if(!tables.includes(str)){
                        tables.push(str)
                    }
                }
            }
        }
        
        $('#yihuo_result').html(`
            <tr>
                <th>字符A</th>
                <th>字符B</th>
            </tr>
            ${
                tables.map(function(val){
                    var items = val.split(',');
                    return `
                        <tr>
                            <td>${items[0]}</td>
                            <td>${items[1]}</td>
                        </tr>
                    `;
                }).join('')
            }
        `);
    }

    /** 
     * 创建短网址
     * @synopsis function 
     * @return 
     */
    this.createDwz = function(){
        var url = $('#dwz_url').val();
        if(!url){
            alert('请输入要转换的网址');
            return;
        }

        $.ajax({
            url:'https://www.98api.cn/api/sinaDwz.php?url=' + url,
            type:'GET',
            dataType:'json',
            success:function(res){
                if(!res.short_url){
                    alert("转换失败");
                    return;
                }
                $('#dwz_url_result').val(res.short_url).parent().removeClass('dis_n');
            }
        });
    }

    /** 
     * 复制短网址
     * @synopsis function 
     * @return 
     */
    this.copyDwz = function(){
        var text = $('#dwz_url_result').val();
        if(!text){
            alert('请先生成短网址');
            return;
        }

        if(app.clipboard){
            app.clipboard.destroy();
        }

        this.clipboard = new Clipboard('#dwz_url_copy',{
            text:function(){
                return text;
            }
        });

        this.clipboard.on('success',function(e) {
            alert('内容已复制到剪切板');
        });

        this.clipboard.on('error',function(e){
            alert('很抱歉，内容复制错误！');
        });
    }

    /** 
     * 打开微博
     * @synopsis function 
     * @return 
     */
    this.openWeibo = function(){
        let gui = require('nw.gui');
        gui.Shell.openExternal("https://weibo.com/2620925637");
    }

    /** 
     * 导航栏点击事件
     * @synopsis function 
     * @param obj
     * @return 
     */
    this.navbarClick = function(obj){
        $(obj).addClass('active').siblings().removeClass('active');
        $('.navbar_box').children('div').eq($(obj).index()).removeClass('dis_n').siblings().addClass('dis_n');
    }
});

$(function(){
    app.init();
});
