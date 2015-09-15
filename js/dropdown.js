/*!
 * Flagwind.UI [Dropdown] v1.0.1
 * Copyright 2014 Flagwind Inc. All rights reserved.
 * Licensed under the MIT License.
 * https://github.com/Flagwind/Flagwind.UI/blob/master/LICENSE
!*/

+function($)
{
    "use strict";

    /*
     * @private @typedef 插件所需样式类名
     * @type {object}
     */
    var className =
    {
        active    :    "active",
        upward    :    "dropdown-up"
    };

    var support =
    {
        hasTouch : ("ontouchstart" in document.documentElement)
    };
    
    var Dropdown = function(element, options)
    {
        this.options = options;
        
        this.$element = $(element);
        this.$toggle = this.$element.children(options.selector.toggle);
        this.$content = this.$element.children(options.selector.content);

        this.bindMouseEvents();
        this.bindKeyboardEvents();
    };

    Dropdown.prototype =
    {
        constructor : Dropdown,

        initialize : function(options)
        {
            var parameters = arguments,
                methodName = parameters[0],                             //截取第一个参数作为函数名
                methodInvoked = (typeof methodName === "string");       //根据函数名判断是否为函数调用

            // 执行函数调用
            if(methodInvoked)
            {
                this.invoke(methodName, ([].slice.call(parameters, 1)));
            }
        },

        /**
         * @private 动态执行函数调用
         * @param  {string} name       函数名称
         * @param  {object} parameters 函数参数
         * @param  {object} scope      作用域实例
         * @return {object}            函数执行后的返回值
         */
        invoke : function(name, parameters, scope)
        {
            var self = this,
                instance = self,
                names,
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
                response = found.apply(scope || self, parameters);
            }
            else if(found !== undefined)
            {
                response = found;
            }

            return response;
        },

        toggle : function()
        {
            if(this.isActive())
            {
                this.hide();
            }
            else
            {
                this.show();
            }
        },

        show : function()
        {
            var self = this;

            if(this.isActive())
            {
                return;
            }

            this.$toggle.trigger("focus");

            this.$content.animation
            ({
                animation : "slide down in",
                duration   : self.options.duration,
                noSupport : function()
                {
                    self.$element.addClass("active");
                },
                onComplete : function()
                {
                    self.$element.addClass("active");
                }
            });
        },

        hide : function()
        {
            var self = this;

            if(!this.isActive())
            {
                return;
            }

            //animation 
            ////transition

            this.$content.animation
            ({
                animation : "slide down out",
                duration   : self.options.duration,
                noSupport : function()
                {

                },
                onComplete : function()
                {
                    self.$element.removeClass("active");
                }
            });
        },

        clear : function()
        {

        },

        isActive : function()
        {
            return this.$element.hasClass(className.active);
        },

        isUpward : function()
        {
            return this.$element.hasClass(className.upward);
        },

        bindMouseEvents : function()
        {
            
        },

        bindKeyboardEvents : function()
        {

        },

        bindEvents : function()
        {
            var self = this;

            this.$toggle.on("click" + this.options.eventSuffix, function(e)
            {
                e.preventDefault();

                self.toggle();
            });
        }
    };
    
    $.fn.dropdown = function(options)
    {
        var parameters = arguments;

        return this.each(function()
        {
            var $element = $(this),
                instance   = $element.data($.fn.dropdown.settings.namespace);

            if(!instance)
            {
                $element.data($.fn.dropdown.settings.namespace, (instance = new Dropdown(this, $.extend(true, {}, $.fn.dropdown.settings, options))));
            }

            instance.initialize.apply(instance, parameters);
        });
    };
 
    $.fn.dropdown.settings =
    {
        namespace       :    "fw.dropdown",
        eventSuffix     :    ".dropdown",
        duration        :    250,
        selector        :
        {
            toggle      :    ".dropdown-toggle",
            content     :    ".dropdown-content"
        }
    };

}(jQuery);

$(function()
{
    $(".dropdown").dropdown();
});
