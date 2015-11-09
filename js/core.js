/*!
 * Flagwind.UI [Core] v1.0.0
 * Copyright 2014 Flagwind Inc. All rights reserved.
 * Licensed under the MIT License.
 * https://github.com/Flagwind/Flagwind.UI/blob/master/LICENSE
!*/

+function($, window, document, undefined)
{
    "use strict";

    String.prototype.trim = function()
    {
         return this.replace(/^\s+/g,"").replace(/\s+$/g,"");
    };

    String.prototype.escape = function()
    {
        return this.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    $.fw = $.fw || {};

    $.extend($.fw, 
    {
        /**
         * @public 版本号。
         * @type {String}
         */
        version : "1.0.1",

        /**
         * @public 用于展示不同浏览器的特性。
         * @type {Object}
         */
        support :
        {
            /**
             * @public 是否支持触摸。
             * @type {Boolean}
             */
            hasTouch    :    ("ontouchstart" in document.documentElement)
        },

        /**
         * @public 键盘值。
         * @type {Object}
         */
        keyCodes:
        {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        },

        /**
         * @public 空函数。
         * @type {Function}
         */
        empty : function(){},

        /**
         * @public 动态执行函数调用。
         * @param  {Object} instance   实例
         * @param  {String} name       函数名称
         * @param  {Object} parameters 函数参数
         * @param  {Object} scope      作用域实例
         * @return {Object}            函数执行后的返回值
         */
        invoke : function(instance, name, parameters, scope)
        {
            var names,
                maxDepth,
                found,
                response;

            if(typeof name === "string")
            {
                names = name.split(/[\. ]/);
                maxDepth = names.length - 1;

                $.each(names, function(depth, value)
                {
                    var camelCaseValue = (depth !== maxDepth) ? value + names[depth + 1].charAt(0).toUpperCase() + names[depth + 1].slice(1) : names[0];

                    if($.isPlainObject(instance[camelCaseValue]) && (depth !== maxDepth))
                    {
                        instance = instance[camelCaseValue];
                    }
                    else if(instance[camelCaseValue] !== undefined)
                    {
                        found = instance[camelCaseValue];

                        return false;
                    }
                    else if($.isPlainObject(instance[value]) && (depth !== maxDepth))
                    {
                        instance = instance[value];
                    }
                    else if(instance[value] !== undefined)
                    {
                        found = instance[value];

                        return false;
                    }
                    else
                    {
                        return false;
                    }
                });
            }

            if($.isFunction(found))
            {
                response = found.apply(scope || instance, parameters);
            }
            else if(found !== undefined)
            {
                response = found;
            }

            return response;
        },

        /**
         * @public 解析JSON参数。
         * @param  {String} parameters 参数
         * @return {Object}            解析后的JSON对象
         */
        parseOptions : function(parameters)
        {
            if($.isPlainObject(parameters))
            {
                return parameters;
            }

            var start = (parameters ? parameters.indexOf("{") : -1);
            var result = {};

            if(start != -1)
            {
                result = (new Function("", "var json = " + parameters.substr(start) +"; return JSON.parse(JSON.stringify(json));"))();
            }

            return result;
        }
    });

}(jQuery, window, document);