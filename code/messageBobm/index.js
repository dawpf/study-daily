/**
 * 第三方网站短信接口
 * 最后更新：2021-03-12
 * @type {*[]}
 */
var requestList = [
    {
        name: '工图网',
        fn: function (phone) {
            $.ajax({
                url: "http://www.900ppt.com/api/login/getSmsCode",
                data: {
                    phone: phone,
                    easy: 1
                },
                type: "GET",
                dataType: "json",
            });
        }
    },
    {
        name: '千库编辑',
        fn: function (phone) {
            $.ajax({
                url: 'https://editor.588ku.com/site-api/send-tel-login-code',
                type: 'GET',
                data: {
                    num: phone,
                },
                async: false
            });
        }
    },
    {
        name: '少儿编程',
        fn: function (phone) {
            $.ajax({
                url: "http://test.marketing.i.vipcode.com/api/marketing/dataStatistics/sendCode",
                type: "post",
                data: {phone: phone,},
                dataType: "json",
            })
        }
    },
    {
        name: '图怪兽',
        fn: function (phone) {
            $.ajax({
                type: 'GET',
                url: 'https://818ps.com/site-api/send-tel-login-code?num=' + phone,
                dataType: 'json',
                async: false,
            });
        }
    },
    {
        name: '泰康在线',
        fn: function (phone) {
            function encrypt(data) {
                var key = CryptoJS.enc.Utf8.parse("AE74AF98D6BF55BF");
                var srcs = CryptoJS.enc.Utf8.parse(data);
                var encrypted = CryptoJS.AES.encrypt(srcs, key, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                return encrypted + "";
            }

            phone = encodeURIComponent(encrypt(phone))
            $.ajax({
                'url': 'http://ecs.tk.cn/eservice/member/login',
                'type': 'post',
                'data': 'syn=Y&functioncode=getmark&mobile=' + phone,
                'dataType': 'json',
            });
        }
    },
    {
        name: '大麦网',
        fn: function (phone) {
            $.ajax({
                'url': 'https://ipassport.damai.cn/newlogin/sms/send.do?appName=damai&fromSite=18',
                'type': 'post',
                'data': {
                    phoneCode: '86',
                    loginId: phone,
                    countryCode: 'CN',
                    umidGetStatusVal: 255,
                    navlanguage: 'zh-CN',
                    navPlatform: 'MacIntel',
                    appName: 'damai',
                    appEntrance: 'damai',
                    _csrf_token: '23oX2Nx9U8f1fAY70GEnkA',
                    umidToken: '3052e89b053c39db7435508f6158f606acf913f8',
                    isMobile: false,
                },
                dataType: 'json',
            });
        }
    },
    {
        name: "快名网",
        fn: function (phone) {
            $.ajax({
                url: "http://www.kuaiming.com/user_zhu/getsjcode1",
                type: "POST",
                dataType: "json",
                data: {
                    userName: phone
                },
            })
        }
    },
    {
        name: '光大永明人寿',
        fn: function (phone) {
            $.ajax({
                url: "https://www.sunlife-everbright.com/eportal/ui?struts.portlet.mode=view&struts.portlet.action=/portlet/CommonPageAjaxFront!memberCookies.action&moduleId=dc3a284c84fd4b818a3681828fcd2775&action=SendSmsCode\n",
                type: "POST",
                dataType: "json",
                data: {
                    mobile: phone,
                    action: 'SendSmsCode',
                },
            })
        }
    },
    {
        name: "迅捷",
        fn: function (phone) {
            $.ajax({
                url: 'http://user.api.hudunsoft.com/v1/sms',
                type: 'post',
                data: {
                    client: "web",
                    client_ver: "4.3.6.0",
                    code: "",
                    device_id: "209a642e56584b2c820b83a95245daf1",
                    domain: "http://huatu.98youxi.com",
                    phone: phone,
                    soft_version: "1.3",
                    source: "122",
                    uuid: "209a642e56584b2c820b83a95245daf1",
                    version: "v1.0.0",
                },
                dataType: 'json',
            })
        }
    },
    {
        name: "学而思",
        fn: function (phone) {
            $.ajax({
                url: 'https://api-www.izhikang.com/api/sms/send_sms',
                type: 'post',
                data: {
                    sign: '3ca53d66c8d4d90bc9d373894d554799',
                    phone: phone,
                },
                dataType: 'json',
            })
        }
    },
    {
        name: "火花思维",
        fn: function (phone) {
            $.ajax({
                url: 'https://www.huohua.cn/passport/auth_code/send',
                contentType: "application/json;charset=UTF-8",
                type: 'post',
                data: '{"authType": "2", "countryCode": "86", "phone": "' + phone + '"}',
                dataType: 'json',
            })
        }
    },
    {
        name: "编程猫",
        fn: function (phone) {
            $.ajax({
                url: 'https://open-service.codemao.cn/captcha/rule',
                contentType: "application/json;charset=UTF-8",
                type: 'post',
                data: '{"deviceId": "89b5cb3b00a910b2a123d882a6255caf", "identity": "' + phone + '", "pid": "4ceH5ekc", "timestamp": 1614589965}',
                dataType: 'json',
                success: function (data) {
                    $.ajax({
                        url: 'https://api-marketing.codemao.cn/admin/marketing/sms/captcha/new',
                        contentType: "application/json;charset=UTF-8",
                        type: 'post',
                        data: '{"app_id":"", "phone_number": "' + phone + '", "ticket": "' + data.ticket + '"}',
                        dataType: 'json',
                    })
                }
            })
        }
    },
    {
        name: "掌门少儿",
        fn: function (phone) {
            $.ajax({
                url: 'https://app-gateway.zmlearn.com/api/operation-web-server/v1/ow/validateChildCode',
                type: 'POST',
                headers: {'Content-Type': 'application/json; charset=utf-8'},
                dataType: 'json',
                data: JSON.stringify({mobile: '86-' + phone}),
            })
        },
    },
    {
        name: '92素材网',
        fn: function (phone) {
            $.ajax({
                url: 'http://www.92sucai.com/send_code',
                type: 'post',
                data: {
                    type: 1,
                    phone_num: phone,
                },
            })
        }
    },
    {
        name: 'gif中文网',
        fn: function () {
            $.ajax({
                url: 'https://api.gif.cn/register/sms',
                type: 'post',
                data: {
                    phone: phone,
                },
            })
        }
    },
    {
        name: '店透视',
        fn: function () {
            $.ajax({
                url: 'https://www.diantoushi.com/user/v2/captcha',
                type: 'get',
                data: {
                    mobile: phone,
                },
            })
        }
    }
]
