(function (win, $) {
    if (!$ || (typeof $ != 'function')) {
        throw new Error('BrowserVersionTips\'s JavaScript requires jQuery');
    }

    // 浏览器版本判断
    function getBrowserVersion() {
        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.match(/msie ([\d.]+)/) != null) {
            //ie6--ie9                
            uaMatch = userAgent.match(/msie ([\d.]+)/);
            return parseInt(uaMatch[1]);
        } else if (userAgent.match(/(trident)\/([\w.]+)/)) {
            uaMatch = userAgent.match(/trident\/([\w.]+)/);
            switch (uaMatch[1]) {
                case "4.0":
                    return 8;
                case "5.0":
                    return 9;
                case "6.0":
                    return 10;
                case "7.0":
                    return 11;
                default:
                    return 0;
            }
        }
        return 0;
    }

    // 默认配置
    // var DEFAULT_CFG = {
    //     ieUrl: 'https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads',
    //     chromeUrl: 'http://www.google.cn/intl/zh-CN/chrome/browser/desktop/',
    //     useIE: true,
    //     useChrome: true,
    //     forbidden: 7,
    //     alert: 8,
    //     tips: 9
    // };

    var DEFAULT_CFG = {
        ieUrl: 'https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads',
        chromeUrl: 'http://www.google.cn/intl/zh-CN/chrome/browser/desktop/',
        ie: {
            use: true,
            forbidden: 7,
            alert: 8,
            tips: 9
        },
        chrome: {
            use: true
        }
    };

    // 公用样式和结构
    function preCommon(cfg) {
        var commonStyle = 'p{margin:0 auto}.browser-check-warning{font-size:22px;font-weight:700;color:#586373;margin-bottom:20px}.browser-check-suggestion{font-size:15PX;color:#9ba7b9}.browser-check-browser-item{display:inline-block;margin:0 30px;text-decoration:none;font-size:14px;color:#555}.browser-check-browser-icon{display:block;width:70px;height:50px;background:no-repeat center}.icon-newie{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAtCAMAAADWf7iKAAAC+lBMVEVMaXEuhbzw7X0qeLX99s9nm8f05WRlmcY0icCLkoUfaqr60igxe7jy6nTy6G/52Dz71S4xjMIynM8zj8QVaq/W4u9Pj8EeX5371CsxkcUtc7AabrD///8TbrQgV5E1rNxAhLtil8V2o80wgrowfLfJwoAyir/H2er80iD71THz5mvdzT/y6nQ4jMElerb71S780yj71CsYUo1Fh70vgbk1mcsoe7ZHgLgsm9EukMdXlMU+g7o5ebQcZqYjdLL61jP24lz90R371Cv24Vb43EM3otMgeLYxlcn33k370yovmM0eZKA8iL0yqtktdbEnkMdPjL380SAohb733klDi77kzDTy6XNKhbpymYlCv+X80iX61jT24FX71CuqxeFSkaf70ygjdLL71CkyfLYodbAue7Q1qNcrerQkg75Cwekkjcf80B790BcuerM0ibQpgrt6l4bUwz780iIpgLm8uFft0Tupr2o7jsH14VX33UY6qNf14VM7j8L14VX80SP33ET70iYkiMSVnlzi6/Q/g6X90Bskf7z30zNrvLAibqyBrY9OqrpHrsg2hbhpm8YtebP80B371C39zxQvq+EnjMsrpNwtquA9xvExreIspt0mk9Asp941uOk7xPAuqN8ontgggcP80SEjg8UnkM761zoqodooh8gmldIoisr80yknnNf52D733Ery6G43u+v90Bg5v+0lhcb70ib+zhAwruMztecxseT+zg40tugxsOM7we82vOsml9MlmtUys+b04l7x63Y3tOM5vuwYe8Dx7Hn33k4lmdQuq+H231H05GHz5mn42kQ3vewUc7jw0TIXeb761jU2suAcfMAcf8L2zyFQxtrx6XPz5WQpnNT24FVGxudKx+I7xfFkycf14VU1uupByfHm0DsooNkvq948uuSByqVbydTCzFw/xu40r9+GwpjMylDZ0Exau794ybL14lvRzEXnzi+Oype7zmcUdrw/yPHtzSStzXlNscVCwecqjMmuy29suaidzIqSDa3MAAAAkHRSTlMA1TzCBHY+dr4BTGy2PioN+eHv1e4Xmh665D/jCvwH/Zp1Y8GlCNMtsxcU/jHJ33nq0hKg0O3TMPnqhahQNM6uUe3e34f05ukk5PEouP6483Wh6pyy/Dddz/6cwPlRPMnD3JGMlZP5mvb+9fWCkfPpYPs06uTEkL7wZfXbvrJC77/0ZCDtqu/r/mvd9fexXoKA4I/aAAAFLklEQVR4Xo3VZXgTWRgF4FTIbqpCW1qkpUILW0px1+Is7uyy2Kq7u7uMxN3dU3V3d8HdfV2eZ7+ZSdImlIXzI8mPvDnfvXNnQruPTHj3w+V764yNyrBpj9HuK6EZ7/eYSqsNbToEwxzYxP8HjFGLAgI+e7O0ynTdqLRjGLJs7TIZYnnhriDu26CRq1fG/3PlWJmp1NiGOJZt+Ygc9JD9+buQRUmrz1xoKrya1thQ1lutRLBXdwe4+gPtwy7r4aT3TohEBd3nUajpN8iwy3+IT8+dPdqppm4ZZiVPrzzBgdzqUvZW1RtRR9rVfC4u5rE2bYwjUcydWzFq5rME6b4hM/aY+pWWrkvC7BJSqfqmzCHQkjvQonCy5myX7lhVrxHFLv9ZUSjMo5Sk5uWFRNMj3suJJcyFvx1t9VWlBqTrLEdUYKUUW8DSa7aCygz0NNPJnsM3MGVDT78y92Q3lB4BBRNm4Wyeqkbx+pzQsEkehjGTMOd2WBpNpjrUcptDBLoqzMLsnKxaMU+vUUwJXOtZ9OIeMEd/Q4xlDUY7cqs9Nv2Dt9Nj40XWpuPUgKpixV9veC5p1CzSyKrLehuRrm985qf6Q33UiJR4GNBVxXzpFQ+UdII0dVX1Bqzl++1RrgH8oyMqiCocqmoU6tkeRRGwnptgSg25LT9EQ4s7CRFkFS5m6fnaZxYOQckXON1phIFt25MOZki2l0MVIJ5Ew7T5DUEjOYfPI5QZWL3P6y4MN5Pz8U4VKdSrJgxOt3LgX6QajOPkACed5pX1QmFJDpdaVMcuN/p54BrsdT2s5zDHHO2Ndl10LqqYr5UGudGP5242wl5jLXAM2lMe9ErSU4NIPrio/bcNpoZGi/0oB/KrVzgFTe7tY8rdmz7pu7YGU7VMdpYzXAqs5iFoitOETk6r76nTIb8Pa47A8cuDjcAF5HirKOMfsuJY1fU2yxXOsHGePpxNIqmzaU3wx9TGOacp90z7xdOneSxVX18fn2mTth6khtu5zdRgROzXjlAoPnqEdx5wJyEhkTCMEN93iAWdtxaISFQ+n3bPPOS7Ak4C1nKmsKJARJatv6dhTPZdTlyhS3lCc5OVZLFx9y5aaupHLTvyS7KFxwsrgInOjPcCT44kkpLi4+MzeyOBQny31RscurfmZuWU5AmPm5sqrNZZoz1MQAQX7lt4HCnU0mbiB/19g5dX65BMhg/OzS8BRrrYoSpgXn6tGB5hRQqtvGNMFDkdfa8h1x5I2zy3lpsFLDsPoHnW4wwniXsiIh8HIymCq9TZPIOcLngpFIX5wxNMwK7FuTAkwOzs9vDk0dMZ0wOSw9txNjEbGDVc2SgCTQ5eYcDsnwCfs5UnZuM4F/pyiORtWDdv3YZyLlss4KkoUxmZSLb70pe0YboMwm/exOIJwJEwK4vLxSEEYUmKNQrCjJtBDR1Mf9SOoK+Rn2c8J1HxwInZbKDwIgbBYxE1Cq0NTNBYmgtZZOgEEjEWfFqjl6hYPIhAAN8HcUpfDISplne6DGQnfYlDhk6iUSr6K76mqFivl5wiItGD0BDEJu1ojVwAhkoIPSPXjrr/P346aGMq+HwNFT5foWBq1XIgzWPm+w+eIjodmjIZLhW1+wubWsukotWqbXJpZ2XrL5F+qR7nlf4lokMPUAOuOZSJfr1/VYdUTkYq7SREc6RfoqvGda/TJ9pRNGxaTMy0qfAGk6aOXzymubWysrUVwLjIxQv2AfFK6JrHDkxFwa2NyQh1/tLnieOD/CBByQmpY73Bf4FIP4YEuuwmAAAAAElFTkSuQmCC")}.icon-chrome{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAMAAAANxBKoAAAC/VBMVEVMaXFhvVzvPTfvPTdhvVzvPTfvPTfvoR752gbvPTfvPTdhvVz52gbOYED52gZhvVz52gZit1T52gbvPTdhvVxhvVxhvVz52gbvPTf52gbvPTdhvVzvPTf52gbvPTfvPTdhvVz52gbvPTf52gb52gb52gbvPTf52gZhvVxhvVxhvVz52gZhvVz52gbn9ef52gZhvVxhvVz3/Pb////vnh+n2aXvPTfviIP52gZhvVxhvVz52gZhvVz52gbvPTdhvVxhvVzvPTfvPTf52gbvPTdxu0z52gZhvVzvPTdhvVywbkOvyS5hvVz52gZhvVz52gbvPTdur1jvPTdhvVzXTjthvVzvPTfvPTfvPTf52gbvPTfvPTfvPTdhvVzJVTvvPTdwrlfdSzuBnFLZRTbvPTedgElhvVxctFXT0hphvVz52gbymR3ePzT52gaRjE387Hz1+/XzbWj87pD87Yj640PvQjy34bT75lb//v753BX///2JwEHS7NGm2qP2jov709L99brf8t763h/++M7USjf64jvyXln71NP0eHP4r636wsB4pVT97Ovm1hD///7jPzfBXT6keUfhiXxptVqWxYb1iIXxmJT2k5DpYVv52gbP686Swju4zCn98qn342LKzyDyflN3wXSmyTnr9urm8tvy3Fr+/fT+/PHv1DeKyYfz32nJ5sf///9hvVzvPTdZslXhOjL52gbqyhn32gdjvl7w0RFjvFz+/v/H3fHd6/emyOXv9fujxufvPznx9/wmgcKuzeiMveKhxuSCteLL4vT1+f1Rkc1lntVeuVlct1hKjcpqo9hEiMhgvFtww2twqNs+hMUxgMN2rd4kfMB9s+HpPDWDuOQaeL5fmdJZltDrzBb32An01Qx9sdpJi8js9PqcxeOJzoX52wrz1A3W6PZGlMsjgMG00Omjyuvr1w3p8vrU5vWEtOB5r9+Uu+JfmtFbl9FyptZvo9cSdrxlndHQ4vH22g4zgcTo8vqy0+5Vnc+/2e35/P03icYmfcA2uel/AAAArHRSTlMA/ZAa2PIy5/T6wDArAuCArvL63Q5S86AUD16VenYjZ+kW6z8Ebh7qo/odTzyF6MzwsfD75fLq5cf2NCBb7vXkpm9aSwrqM0xCz+btBySekdX4pEPxa8V04cP205vM7TuREuz39+Yr+fa42Kr7l+fQ69zKzeX96Nnz/fDo3PfWy8XY49j0+e3b4tjW8N388v3p5eX66dXm2O3j2+nl28zy1P7q6uLX7+jh+9XsYXxDJwAAAppJREFUeF6N1HN0HFEUwOEXNkaTtI3bRm1jN7Vt27Zt27Z5BxvbKW3btnE6m8nu3Lezm+T7+3fuuXv3nSGavJ30zexqsGz5Dt3c3UihDFxasVjXjmV0tm5tTFlN/fQNtLb19FGLGNW2lMfGdqwuZrLxddBgmQhjOnZnC2XUCMdObBGM0PSepmxRItS79+7EFs1MdZle7dhicBHjShX7Xy1G3cWbKFVg4vtS+fjRMzau3xVWghY2VBzNMH14KV8wcxIoHTwSLbkVdydGYSHU1oyghypPWxwK6U9yE3OT8uDAIVV6W6E0XKgNlXVrXszTFsKrF9dEP/Ngf3R03GMhFfl4kgFMviZivgRe51xRyfoBOxSYB2kv1vHDlPkiSHp7SZKTvmIOrl2Fi4hG8EK+LOHNeSwVZuHahnRnCszj+ZWQeJqWMuURqoeQsqp6Kc9vgnfHaYkwDtUmhFFbxUfCpxu0TBipQFC9lt8AH27SsmEMXUtWR8L7Y7RUGEvVQVIdvwY+nqI9h4ko9iGGjGQdJJ+hJYVORnUgCUZ1bEjKvQvYF5irQEoTawaZDskXke9fYT6uvUhbXMcGJNy9rPYvE7YrMAvSrBTOz41KeJBxXfT3N+z7hmMrQkgLhsoD4H7W02efM35l/4GjexSYv1D7MZTY8BAQ7T1sq6A0J4LGjEb/cMK02VvCd3PcTiq2IUoNGS1OcBxXX0FpQPLVYuROCvVyBX1skX1NeS3EU6nYypEUqBKlGZ/luIExODaxIGoOevK1m+K4ZF2CVNPTXNuWin0JxSFKY+1BKK7uQTSYG+K1qetVrkpk7J310Novpd/n6km0MR+sXnurum1Zjuhi7ix+MGwLrtfZy5EUxtLPOtgwaNtmq0Abf1/Z2P9/XCM1lgFnTQAAAABJRU5ErkJggg==")}',
            $box = $('<div class="browser-check-box"></div>'),
            $middle = $('<div class="browser-check-middle">' + (cfg.chrome.use ? '<a class="browser-check-browser-item" href="' + cfg.chromeUrl + '" target="_blank"><span class="browser-check-browser-icon icon-chrome"></span><span class="browser-check-name">Chrome</span></a>' : '') + (cfg.ie.use ? '<a class="browser-check-browser-item" href="' + cfg.ieUrl + '" target="_blank"><span class="browser-check-browser-icon icon-newie"></span><span class="browser-check-name">IE最新版</span></a>' : '') + '</div>'),
            $toolbar = $('<div class="browser-check-toolbar"><label class="browser-check-label"><input class="browser-check-checkbox" type="checkbox">近期不再提醒</label><span class="browser-check-close">X</span></div>');
        return {
            commonStyle: commonStyle,
            $box: $box,
            $middle: $middle,
            $toolbar: $toolbar
        };
    }

    // 关闭事件
    function initClose($el, $style) {
        $el.on('click', '.browser-check-close', function () {
            var $checkbox = $('.browser-check-checkbox', $el);
            if ($checkbox.prop('checked')) {
                setCookie('_browser_not_tip', true, 7);
            }
            $el.remove();
            $style.remove();
        });
    }

    function forbidden(cfg) {
        var common = preCommon(cfg),
            $box = common.$box,
            $top = $('<div class="browser-check-top"><img class="browser-check-tip-icon" src="data:image/png;base64,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" ><p class="browser-check-warning">您的浏览器版本过低</p><p class="browser-check-suggestion">很抱歉，您的浏览器版本过低，系统无法使用，请尽快升级。</p><p class="browser-check-suggestion">推荐您使用以下浏览器：</p></div>').appendTo($box),
            $middle = common.$middle.appendTo($box),
            $foot = $('<div class="browser-check-foot"><img class="browser-check-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAUCAMAAADBcy/zAAAB4FBMVEUxsPf///8xsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPcxsPdY38sDAAAAn3RSTlMAAECA0LAHkBT+8LkCXgEL+DRwYH4Wye3oCAQ+ngOCtaQM1TegrC3lh2x5L6fgVzmlPA9IwE5HhjAe/Mv5mGJK6hoOzj8JBsw1OPTyDfX7XJWR7Bx75IgoakSWVcOdKhM2/Xx11BL3qUwY6/rYM7KXK8QKMiLcj2sXs40pzxXNo4rFGUN3LnpPpht/O314PXTnVoQFW93v37irx+Nymk0ugRcpAAAB2UlEQVR4XoXSVXPbUBCG4T2SLJkpxthBZqjD1DBzU2ZmZmZm5n5/taudqcdtkulz8+nilebMGZHKon9UbiqKlbo9Ggnics14q2cx5CXaXb638X9xV9G2gyT8nmNmTlxS7mAVQzmt70QL0Vif4ww3bZjMiX2wTZnZtOBSzxWeDLCLpw6ZnLgeDZZlbVfZtvnuOmKVVpjYBMqI2vVOiQviKPzrzI3NdpvV4iihQC9qJG4CXmublRrUbKn3gRF5cPqbJimqidE2oF/TJkgVgp1V3o0Q559A7O9Hd/IARPtpmUOkxsG2qDKIuOmGCDmw4wLE8ZkG2Z0UdSFPMR3ufOrB4RSwhzqwZE5j32XMDdFVtF4Hjsht+ICjisVQQU5+8R2WvDSMYg04eQqtZM7iQRjBcxLXo9swjEXuEsZFYHAYU4YB+KoxkJxFLd0HOj0IcnNNURy2vnmIGzddsq7oLdzWgDq6g6pkUBpLUVhntfeK8Zk38jDwSLc9przlp12ReaKRZ8/za15w89KpSAnvAKqJ6for+sO5vF52xS8aAlLE3iDmJ+F/m1gwV48j9sWxNJCe4Q18GP/I3109XvjUoYhtqAKmv3z91vv9xyitEQuS+mcCc6XpX2NEK+PfCE6bEOESY9kAAAAASUVORK5CYII=">技术支持：0512-58188000</div>').appendTo($box);

        var style = '.browser-check-box{font-family:"Microsoft YaHei";line-height:1.67;background:#fff;position:absolute;top:0;left:0;bottom:0;right:0;min-height:600px;z-index:9999;text-align:center}.browser-check-top{height:415px}.browser-check-tip-icon{width:60px;margin:140px auto 60px}.browser-check-middle{position:absolute;top:415px;bottom:60px;left:0;padding-top:30px;width:100%;background-color:#f8f8f8}.browser-check-foot{position:absolute;bottom:0;left:0;height:20px;width:100%;padding:20px 0;color:#586373;font-size:12px}.browser-check-logo{vertical-align:middle;margin-right:10px}',
            $style = $('<style>' + common.commonStyle + style + '</style>').appendTo('head');

        $box.appendTo('body');

    }

    function alert(cfg) {
        var common = preCommon(cfg),
            $mask = $('<div class="browser-check-mask"></div>'),
            $box = common.$box.appendTo($mask),
            $top = $('<div class="browser-check-top"><img class="browser-check-tip-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAA3CAYAAACYV8NnAAAGyUlEQVR4Xr1ZXWxUVRC+c5ddW6nF8huJYiEEMIAIBhFAAI3GBxF94AWNKkYlUY2KkSg8GSJogokJkfAX0BqMBkmjCfJCgACYqA8FLBSriIhBUWkppe1uYa/fNl89l06Gs3fbeMKXb5g755y5c86cnXsqURQFxbaN9e1BHub4B44C/BuQD4LZ4LnQT4BmDOTB0FWACzbtoGbIjeDjsDkAeQ/sfo84DplyRIaCunhbNaOyi8MgYRPp6vOoBFIbSPCXBMGXUL8G/QOQqyFXgGkr5ZBvgjgbeB5yDezOQN6Pvs+By8GqwcZqyZzefKxdMNjjEI9hzB2YbAE43T2Jc5RsOMFns4D1wGkolgFlAPTCfn3g9JbjHeMx3H6INRh0bEAntcPiHKZeAqcTUaEcDGk19PXgB53H7F+q0x81dCxB5+8xwkxx4xECOJ12WE8uDvEHo4CvgfeBDG2SR/qTE9lUzYmOtei8DiOUMV72VhByjyVWK0LQrideFZFdEAc4qyKd3vZjNoVJPkaHF9TEpsNa72RRY1ChGJgH7AMGiCSINIzXgRZBik1sOSxar2woi7FNFGQS9DshXF+U0581Zl8EPSt21MiBwVZC6rGoVduEz2cAH7K/7fTnP2WnwGKN2pPereD2OnCSL70YvMf5JzohrTd3eBKqp81Ib/85l8KwGyBmOEc8sXSy2VvhK/AmCFsKeUG9mZBiwb3kGmCoGJF+BlZ3ugnUJDrCyRNSjyvii3YVdKtUpHeczGVgu8Itpdp7emzCTkh7a+lIG82t8hOgET0jvRC4Rf+U2tEUCkZCWlvLDoqRkGz9gKVXOV3Y7C4prL3HyTwJSb29tUpISI712FuHWtJdTtf+khsKvpe2BHv5EtJcBbuI8iek3iDUDQLuZ6ThsLYNxKzUPAUSZctGJ6SewL20SoD7ChRCN0fEMLR/GCAbiZmgiALMIsoI4pzuSN+mDbgsqkxUkU1eREHQsich3SqMo9MyRnlMNvehKJ03IfVYCYooh/7Lv2kZHkJf5RJHQxc78eUvreojeYooOyFDSGWB73CnInERJeQkXzVOZ+31ijA+rTchkxVRKnJxplDKmd0ZQndRrpWx8V5JiyjDppdFVGsI+Zx6JSPKviJK/p8i6o8QdLxbrxPSrhf68KvG9fcn5LmV0yubQwhH2Nlq/iKqyK8a+6yn7E/II92/iHtopRKyxCJqeCyyw+JntvS+iNrdXXscBFqN5SiliFqI5xfBzVCtpr7XCcm2q0DhQ9Xpdii3q7UGelFEVQivAPyVoT8haVb/9t031MU/AjaryIpi48z2f9UkL6IAXURtuOojANE+ANqXKCHF/JH5AlbzIMyD/K6viKLOHJd2/wCbnNPOdjlIZ66viNKROgNhL3gvtA0lfdXouVeC25TTiPZB0FbVwVNEWaWnFeGkV8MQDwNrAfOGaSkMTl87IcVMSOrng2phVQt+mUOVejWcBT0F6bJ5wzS/On2eX+adrmPir5pRoAW8dJ9MU5UTRRZRL0GuEyhMp+n4t7BZBMM8Vb3/qimtiHoH8kY3jXJaOb6dy3Il6VdNH10NfwBaYZ3ZdFrj4ep0jYCAVruIAvq2iMqDlkHxCjiinRFpy/GR6Z2gKUCdt4jq/dXwWcgPQPGeOkaNPW1iwchMI/pMQ8c3wW3FFlEk700UEIHWgyeAd5tXw8ppv+O5R0ZmVkMcDazBAJf64CbqCvAphIngJdCc9xRRhtN+nAVexyjDwYsZmWyCm6g8xO/AbwAjoFgEri+2iHK3kT3aqT+bTI8n9/9PbAG2AFvrWsvLcoHcJVHX8o6Juv42KBWBRKko6vqea8LZ2QhuCCU6NHdQ9kJQQtv2W9oFI4oiv9Nq2yrWthqR/r9mJRPVw6pUpC1IDGGMKZMJv9Nkh7xjymQH1Uyn446maJcm+sWQIkLjBQDtKHGFuBxDJ3GZz9wLmE7rJM0A5fx7Xv+CTFzHZ2kiFYPoBOfkdJToJHJAFmgnLgFtlHO09Z4eQn2azg4EbuZxNx6YxB+cqcA0YDowE5hF3EPMJiADfE7b6ew7lWNN4tijOddAzp2mL+I/8pzTFcAQ4FZgLDCRE9xRYOJ26pMAfdifY1E/jnMN4dx0urhzWrjUGW6LSuBGoIpRcEzZwek9z9VYnKOSc2bogxQXabf/ctxjLcAFoAk4H2cDzXEYNmos2l7knDn6EBFep/NMklbgb+BXoAE4ChwG6shHiKPEDx7Qjv3iY0HPOU5xzlb6kC/myItiTrcBETO5yTw99PEnhDvu9DHnPz3odJIjLx9bog4um31OE55zOp/8nNbtX5H1qF1lsXxCAAAAAElFTkSuQmCC"><p class="browser-check-warning">您的浏览器版本过低</p><p class="browser-check-suggestion">很抱歉，您的浏览器版本过低，部分功能可能将因此无法正常使用，建议您尽快升级。</p><p class="browser-check-suggestion">推荐您使用以下浏览器：</p></div>').appendTo($box),
            $middle = common.$middle.appendTo($box),
            $toolbar = common.$toolbar.appendTo($box);

        var style = '.browser-check-mask{position:absolute;top:0;left:0;bottom:0;right:0;z-index:9999;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlNNSIvlSwAAAApJREFUeF5jYAAAAAIAAd6ej78AAAAASUVORK5CYII=")}.browser-check-box{font-family:"Microsoft YaHei";line-height:1.67;background:#fff;position:absolute;width:570px;height:390px;left:50%;margin-left:-285px;top:50%;margin-top:-195px;z-index:10000;text-align:center}.browser-check-top{height:255px}.browser-check-tip-icon{width:45px;margin:40px auto 15px}.browser-check-suggestion{max-width:350px}.browser-check-middle{height:105px;padding-top:30px;width:100%;background-color:#f8f8f8}.browser-check-foot{position:absolute;bottom:0;height:20px;width:100%;padding:20px 0;color:#586373;font-size:12px}.browser-check-logo{vertical-align:middle;margin-right:10px}.browser-check-toolbar{position:absolute;right:5px;top:5px}.browser-check-label{color:#c9c9c9;font-size:14px;margin-right:15px;cursor:pointer}.browser-check-checkbox{margin-right:5px}.browser-check-close{padding:0 5px;cursor:pointer}',
            $style = $('<style>' + common.commonStyle + style + '</style>').appendTo('head');

        $mask.appendTo('body');

        initClose($mask, $style);
    }

    function tips(cfg) {
        var common = preCommon(cfg),
            $box = common.$box,
            $toolbar = common.$toolbar.appendTo($box),
            $warning = $('<div class="browser-check-warning">您的浏览器版本过低，为保障最佳的体验效果，推荐您使用以下浏览器：</div>').appendTo($box),
            $middle = common.$middle.appendTo($box);

        var style = '.browser-check-box{font-family:"Microsoft YaHei";line-height:1.67;background:#fff1da;position:absolute;height:40px;left:0;right:0;bottom:0;border:1px solid #ffdea8;overflow:hidden;z-index:9999}.browser-check-warning,.browser-check-middle{float:left;height:40px;line-height:40px}.browser-check-warning{padding:0 25px;margin-left:75px;font-size:15px;color:#333;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAqFBMVEX////8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi/8Wi91sfdKAAAAOHRSTlMAoP79yds+ZDUz3WLfsDQyFTb5Y9wOoqH495dg+jmWmjFang202gzeWTyxpZkTsjsqKQu2ClvZlRajz7oAAACbSURBVHheZczXsoJAEEXRzQxDjqIgBhTMOev//5nl1LUuVZ63Xt2nAXD23U6nO3DRoZfL0D9t/K0olno21d8q8syP7BYH4LEGEq+AVMYAhqFvRMwk5B84DgiGbfAVo3EbrP4vrNoVMvV9er5omFc40gWwbQBHTCFXCVDXQBI0wMz0InTSwLzyEUPMM8uyb7K5o0NcLcry+ZoCvAHhBAmQB4P1EgAAAABJRU5ErkJggg==) no-repeat 0 center}.browser-check-middle{font-size:14px}.browser-check-browser-item{display:inline-block;color:#555;text-decoration:none;margin-right:30px}.browser-check-browser-icon{display:inline-block;width:25px;height:40px;background:no-repeat center;margin-right:5px}.icon-chrome{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAB9VBMVEUAAADszBbvPTdhvVzvPTdhvVzvPTfvPTfvPTfvPTfvPTfCY0LvPTfvPTfvPTfvPTfvPTfvPTdhvVzvPTfzaGT81tXvPTfvPTf335juzSLvPTftzRXyzxD20gv52gZhvVzvPTf+9PHvPTf3pKFhvVzq8fHu0zHvPTfj7/n52gZhvVxyq1fvPTf0dXFkuVvm8Pn64TX52gaIlU+5ZUD0sK3+9PT+98f52gZmuFrfPTP45+fvPTf//fSbg0nPTznvPTf//vb52gbv6N/vPTf++ND52gab1ZfvPTf740T52gZhvVzK6cnNVT3W5qH52gZhvVxhvVya1Zfs9+v4+/z2+/rg8eCJyYTi1RL52gb52gZhvVz45+eDv0P52gZhvVxhvVxbtFX52gb52gZhvVxhvVyoyDH52gb52gZhvVxhvVxitlP52gb52gZhvVxhvVxhvVxduFnN0B352gb52gb52gZhvVxhvVxhvVyCwUb52gb52gb52gb52gb52gZhvVzvPTf52gYdeb/nOzRZslXhOjJbtVdvo9T02AlIismAtOHx0hDmPTW40upupto5g8TM3/A3gsRfulpdt1ijy+uHvOWv0Og1h8aEtOA/jcm+2e2JveaVvuSozux6seBindTszRVivFz21wpjntTc6/dbls98suBUk85N5xi5AAAAfnRSTlMA+wjpH8Di8Gf0CxezL4Haht/3a+XK0e7U8Q358ukZbf3ZtNQT+u0s/Xm59OTgjPvgv+nm4NzK6/398xPf5e/o4Pzeh8/m6tDssHzZ6tZvIPzo3fb05ff6+Rec+eWUEN/63Q4q6+nkKSnb8s8jCo75/PP0gQcZeO3b8NurYw9JClGXAAABHUlEQVR4Xl3M03oDURRA4V0ktW3btm3btq19TlDbNp6zM3uSL23+y3WxQJLhYCn3ZTn+pu6gY15gxjRMrA21NcSG/VFiDMTKhf0TSd3CjulxFj/RlUyfLUCgffyhGBydkvxc3QwEHp5e3uCDmK1kLCD08urhKSj49eCdcx4G4YgRamXU5/ezYD8mloviwAgRE9SJt8fkMZlyCqAgNS39RfKRyQllzOr40cilmkcTfMv/2iM7hZSLQIai4qMz0clpKeUyKEdScX2jUNzdV3FSDTW1SOrqGxqbmluotrYBtKPWhaqTky4A6O7R5u3eXap9/SAYGESJaojq8AiQ0TGq5+NUJyZBY2p6Rsizc0KcX1gEnaVl2crq2vrG5haQX/Z3sa7dLhrNAAAAAElFTkSuQmCC)}.icon-newie{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAWCAYAAAA1vze2AAAFiElEQVR4XqWUeWwUVQCHf++92Vl2abuVsqVbqEdBEGu1qFBOMRxNiahBMCIeAYwQI6jxCBDAeqB4RYxJNVE0UKyoEQSiCR5JTcQociggaK2iVi29u7NH53qHb7dg0mjV6Jd8efPXfPNLXgb/F3F46Aynceq7iZZlVuqXxcL+4VrlfjNN+ccu6fG/vqgKGoJ/Sez2t0aXjI7dwEODRprMi942vL70+vOOlJKiySaz2xFIN8FwmtoUYQeBYCMImQLplRN4EQP/wOQN708iw4vWkNjQ6Spo5l1nbMeywS/ALJwASS+G2bEPB3uieOzbtSc7WsztB9fPXofT+MfGvgORuO5vl0yr/fwJMuac5Soczi8hJ/Fg4C6MDFlIF85F0Poazd1tuLPjFXS5EQhfQAoOtLTuD3fFV36xce4B73j5csrT4QGXTHn50GZaPmqJlKCz6C6sCjwAFRkHe/A4mK0f4Mnee/BB7xz4AQGmODIQKHjRaGXaDNZXPf7RcuDeKIAjbKAFrGLMSiUVWWY8hRXGw/Ci1ZAsgnT7Z7glvRMnxMWgAQYCAglAKYBoFQg8RQpSLh+/uPSjPFPGN7A/LdiwdyKtGPMsDCN0n7EaC4wtSMcWgvpJHG9L+EsObdqd22q9bv58aie648dc1wux/LxiZAIqWwEhBEIgGu8xTs2q3vUKQX9wxdajb6vzz5m/0ngI841tSBUvgpn8Hh92lKTfPHnHovqbK/bgD7IvHjR9y9FtTknxAun44B6H1DoJG6zHSp3HU9W03zW9ZUuBHJp/5Ty2VQfqdOAmHWjEm/GJeP7o0tq+QH8IIc5j49hi1drRBEZBKAEIBTMNSDOY8xsnS/pFii44+/oLhjYXrDAeRTq7oBG745ei9seFyZ23jX9iwFtYcVE65Nifg5JMNBtiBgPRUQesvN/tCkWM0oeNO+EOuwaBdDM+S8RQ66+GGfUGV+354deJO5owEL5hMAZA6ojqWwillRTD+0VqxtbOyC8YBQgbbVYratw6ZKBBk9JYYRh/g3A5pBZKIYNEHwok+EfEOzG+jNOWCh4og9m2C8ucL3EGbiV7SSLVjIGQCpxLKC2kANEn4wLScRFQXGQj/Mi5hlRujV8wk4Xa9mKdXYuUCoFRZKGMuWf/1Hzj9lVVX+E/kI30RueUU+Vea1pH8W0qKhuSUykzOEiAAgYDzQmf1ZmbMx/AgJGSFTtmgJLhUICSClL0LeICh6nTOGtwwGm+WilqmokDav03d33KHR++q3U4Ms/CE7BjwxbNe2n/KPwFlRsbJsdmjtseq66sG1Z1ed2Q6RV1QyZcWBcee+7m2ZeNqKRepLxYGLlzzVQTFMs56HTlvqRsxxE6wjM6WtuDF84tbYnkfzhl074NY+YtZdCMuH3bsMpN+57xS0t2eIIVOgkX6W4bTnsKvC0FxK2G11ZMfZX0dNVMClqHdwat/UWK5txsXHKyfvxz+7a6RcW3EsZAKYHSQkuJVp+8S7+JC0sZ7CySlxcUvgSERPbDUg6MtAMrnmyeWTxocd3KqQ0GlU6A+lZYkSAAsRuaL+6esrzsqU8KSVFRNQsw6BJA+mICmnBuSCoVIlJB2T4EF/D1YqoX014Xlm13jhyEmkwAGoNInzPf8kEzEWWe+VUs3Lh3aWPLb8+mQpEFCAcNyiiy6lgGISWUkJC+APU4mF7h6pBv9zaNDuORhvWzX8NpqAJtV+CfQgGKmlvloTwCzRtrqk8dmHPrC3suv//wRP7Jd2iLQ3YmwE+LriSolnQn4fSkYHXGO0N2ov7G83OuOhM4A4l3rqXU6y4Jt7/3omI5V4AYAGSrAojmOyix2Sg7/t7cpz++6ac0n2YrjBQgQ5QEpUolDaVaI1SdWDRhxLb7rik7jr/gd8okrR+Fs5aFAAAAAElFTkSuQmCC)}.browser-check-name{float:right}.browser-check-toolbar{position:absolute;right:5px;top:5px;line-height:30px}.browser-check-label{color:#ffb337;font-size:14px;margin-right:15px;cursor:pointer}.browser-check-checkbox{margin-right:5px}.browser-check-close{padding:0 5px;cursor:pointer}',
            $style = $('<style>' + style + '</style>').appendTo('head');

        $box.appendTo('body');

        initClose($box, $style);
    }



    function getCookie(sName) {
        var aCookie = document.cookie.split("; ");
        var lastMatch = null;
        for (var i = 0; i < aCookie.length; i++) {
            var aCrumb = aCookie[i].split("=");
            if (sName == aCrumb[0]) {
                lastMatch = aCrumb;
            }
        }
        if (lastMatch) {
            var v = lastMatch[1];
            if (v === undefined) return v;
            return decodeURI(v);
        }
        return null;
    }

    function setCookie(name, value, expires, domain) {
        var largeExpDate = new Date();
        if (expires != null) {

            largeExpDate = new Date(largeExpDate.getTime() + (expires * 1000 * 3600 * 24)); //expires天数
        }

        document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + largeExpDate.toGMTString())) + ";path=/" + (domain ? "; domain=" + domain : "");
    }

    // dom ready 时才能触发显示
    $(function () {
        var cfg = DEFAULT_CFG;
        if (win.BROWSER_TIPS_CFG) {
            cfg = $.extend({}, cfg, win.BROWSER_TIPS_CFG);
        }


        var ieV = getBrowserVersion();
        if (ieV) {
            if(ieV <= cfg.ie.forbidden) {
                forbidden(cfg);
                return;
            }
            
            var notTip = getCookie('_browser_not_tip');

            if(notTip === 'true') {
                return;
            }
            if(ieV <= cfg.ie.alert) {
                alert(cfg);
            } else if(ieV <= cfg.ie.tips) {
                tips(cfg);
            }
        }

    });
})(this, this.jQuery);