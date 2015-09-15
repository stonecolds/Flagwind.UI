/*!
 * Flagwind.UI [Animation] v1.0.3
 * Copyright 2014 Flagwind Inc. All rights reserved.
 * Licensed under the MIT License.
 * https://github.com/Flagwind/Flagwind.UI/blob/master/LICENSE
!*/

+function($, window, document, undefined)
{
    "use strict";

    /*
     * @private @typedef 插件所需样式类名
     * @type {object}
     */
    var className =
    {
        animation: "animation",
        disabled: "disabled",
        animating: "animating",
        visible: "visible",
        hidden: "hidden",
        looping: "looping",
        inward: "in",
        outward: "out"
    };
   
    /**
     * @private @typedef 插件所需辅助实例
     * @type {object}
     * @property {string} animationEnd 动画完成后触发的事件名称
     * @property {string} animationName 动画规定名称
     */
    var support = (function()
    {
        var getAnimationInfo = function(animations)
        {
            var element = document.body || document.documentElement;

            for(var animation in animations)
            {
                if(element.style[animation] !== undefined)
                {
                    return animations[animation];
                }
            }

            return null;
        };

        var getAnimationName = function()
        {
            var animations = 
            {
                "animation": "animationName",
                "OAnimation": "oAnimationName",
                "MozAnimation": "mozAnimationName",
                "WebkitAnimation": "webkitAnimationName"
            };

            return getAnimationInfo(animations);
        };

        var getAnimationEnd = function()
        {
            var animations = 
            {
                "animation": "animationend",
                "OAnimation": "oAnimationEnd",
                "MozAnimation": "mozAnimationEnd",
                "WebkitAnimation": "webkitAnimationEnd"
            };

            return getAnimationInfo(animations);
        };

        var combineUnit = function(value, units)
        {
            if ((typeof value === "string") && (!value.match(/^[\-0-9\.]+$/)))
            {
                return value;
            }
            else
            {
                return "" + value + units;
            }
        }

        var parseDuration = function(duration)
        {
            if (typeof duration === "string" && (!duration.match(/^[\-0-9\.]+/)))
            {
                duration = $.fx.speeds[duration] || $.fx.speeds._default;
            }

            return combineUnit(duration, "ms");
        }

        return {
            animationEnd : getAnimationEnd(),
            animationName : getAnimationName(),
            parseDuration : parseDuration
        };
    })();
    
    /**
     * @private @class 初始化 Animation 类的新实例
     * @param {object} element 元素实例
     */
    var Animation = function(element)
    {
        this.$element = $(element);
    };

    /**
     * @public @static @property 受插件支持的动画名称表
     * @type {Object}
     */
    Animation.animations = {};

    /**
     * Animation 类的原型实例
     * @type {object}
     */
    Animation.prototype =
    {
        /**
         * @private 重新指定原型的构造函数
         * @type {function}
         */
        constructor : Animation,

        /**
         * @public 初始化函数
         * @param  {object} options 选项配置
         * @return {void}
         */
        initialize : function(options)
        {
            var parameters = arguments,
                methodName = parameters[0],                             //截取第一个参数作为函数名
                methodInvoked = (typeof methodName === "string");       //根据函数名判断是否为函数调用

            // 合并选项
            this.options = $.extend(true, {}, $.fn.animation.settings, options);

            if(!methodInvoked)
            {
                // 执行动画
                this.animate();
            }
            else
            {
                // 执行函数调用
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

        /**
         * @private 执行动画效果
         * @return {void}
         */
        animate : function()
        {
            // 检测是否支持 CSS 动画
            if(!this.isSupport())
            {
                this.onNoSupport();

                return;
            }

            // 检测是否需要加入队列
            if(this.isAnimating())
            {
                if(this.options.queue)
                {
                    if (!settings.allowRepeats && module.has.direction() && module.is.occurring() && module.queuing !== true)

                    if(this.options.allowRepeats || !this.hasDirection() || !this.isOccurring() || module.queuing !== false)
                    {
                        this.queue(this.options.animation);
                    }

                    return;
                }
                else if (!this.options.allowRepeats && this.isOccurring())
                {
                    return;
                }
                else
                {
                    this.complete();
                }
            }

            // 检测是否可支持动画
            if(this.canAnimate())
            {
                this.setAnimating(this.options.animation);
            }
            else
            {
                throw new Error("There is no css animation matching the one you specified.");
            }
        },

        /**
         * @private 将动画加入执行队列
         * @param  {string} animation 动画名
         * @return {void}
         */
        queue: function(animation)
        {
            var self = this;
            self.queuing = true;
            self.$element.one(support.animationEnd + ".queue" + this.options.eventSuffix, function(){ self.queuing = false; self.animate(); });
        },

        /**
         * @public 刷新动画效果
         * @return {void}
         */
        refresh : function()
        {
            delete this.displayType;
        },

        /**
         * @public 显示动画目标元素
         * @return {void}
         */
        show : function()
        {
            this.removeHidden();
            this.setVisible();
            this.setDisplay();
        },

        /**
         * @public 隐藏动画目标元素
         * @return {void}
         */
        hide : function()
        {
            if(this.isAnimating())
            {
                this.reset();
            }

            this.removeDisplay();
            this.removeVisible();
            this.setHidden();
        },

        /**
         * @public 切换动画目标元素
         * @return {void}
         */
        toggle : function()
        {
            if(this.isVisible())
            {
                this.hide();
            }
            else
            {
                this.show();
            }
        },

        /**
         * @public 停止当前正在执行的动画
         * @return {void}
         */
        stop : function()
        {
            this.$element.trigger(support.animationEnd);
        },

        /**
         * @public 停止当前正在执行的所有动画
         * @return {void}
         */
        stopAll : function()
        {
            this.removeQueueCallback();
            this.$element.trigger(support.animationEnd);
        },

        /**
         * @public 清除当前待执行的所有动画
         * @return {void}
         */
        clear : function()
        {
            this.removeQueueCallback();
        },

        /**
         * @public 启用动画目标元素
         * @return {void}
         */
        enable : function()
        {
            this.$element.removeClass(className.disabled);
        },

        /**
         * @public 禁用动画目标元素
         * @return {void}
         */
        disable : function()
        {
            this.$element.addClass(className.disabled);
        },

        /**
         * @public 重设动画目标元素
         * @return {void}
         */
        reset : function()
        {
            this.removeAnimationCallbacks();
            this.restoreConditions();
            this.removeAnimating();
        },

        /**
         * @private 动画执行完毕时调用
         * @return {void}
         */
        complete : function()
        {
            this.removeCompleteCallback();
            this.removeFailSafe();

            if(!this.isLooping())
            {
                if(this.isOutward())
                {
                    // 隐藏元素
                    this.restoreConditions();
                    this.hide();
                    this.onHide();
                }
                else if(this.isInward())
                {
                    // 显示元素
                    this.restoreConditions();
                    this.show();
                    this.onShow();
                }
                else
                {
                    this.restoreConditions();
                }

                this.removeAnimation();
                this.removeAnimating();
            }

            this.onComplete();
        },
        
        /**
         * @private 检测能否执行动画
         * @param  {boolean} forced 是否为强制的
         * @return {boolean}        能否执行动画
         */
        canAnimate : function(forced)
        {
            var elementClass = this.$element.attr("class"),             // 元素样式
                tagName = this.$element.prop("tagName"),                // 元素标签
                animation = this.options.animation,                     // 动画效果名
                animationExists = Animation.animations[animation],
                $clone,
                currentAnimation,
                inAnimation,
                directionExists,
                displayType;

            if(animationExists === undefined || forced)
            {
                $clone = $("<" + tagName + " />").addClass(elementClass).insertAfter(this.$element);

                currentAnimation = $clone
                    .addClass(animation)
                    .removeClass(className.inward)
                    .removeClass(className.outward)
                    .addClass(className.animating)
                    .addClass(className.animation)
                    .css(support.animationName);

                inAnimation = $clone
                    .addClass(className.inward)
                    .css(support.animationName);

                displayType = $clone
                    .attr("class", elementClass)
                    .removeAttr("style")
                    .removeClass(className.hidden)
                    .removeClass(className.visible)
                    .show()
                    .css("display");

                this.$element.data("display", displayType);

                $clone.remove();

                directionExists = currentAnimation !== inAnimation;

                Animation.animations[animation] = directionExists;
            }

            return (animationExists !== undefined) ? animationExists : directionExists;
        },

        /**
         * @private 检测指定的动画名是否包含方向
         * @param  {string}  animation 动画名
         * @return {boolean}           检测结果
         */
        hasDirection : function(animation)
        {
            var result = false;

            animation = animation || this.options.animation;

            if(typeof animation === "string")
            {
                animation = animation.split(" ");

                $.each(animation, function(index, word)
                {
                    if(word === className.inward || word === className.outward)
                    {
                        result = true;
                    }
                });
            }

            return result;
        },

        /**
         * @private 开始执行动画
         * @param {string} animation 动画名
         */
        setAnimating : function(animation)
        {
            var self = this;

            animation = animation || self.options.animation;

            if(!self.isAnimating())
            {
                self.saveConditions();
            }

            self.removeDirection();
            self.removeCompleteCallback();

            if(self.canAnimate() && !self.hasDirection())
            {
                self.setDirection();
            }

            self.removeHidden();
            self.setDisplay();

            self.$element.addClass(className.animating + " " + className.animation + " " + animation)
                   .addClass(animation)
                   .one(support.animationEnd + ".complete" + self.options.eventSuffix, function(){self.complete();});

            if(self.options.useFailSafe)
            {
                self.addFailSafe();
            }

            self.setDuration(self.options.duration);

            self.onStart();
        },

        /**
         * @private 设置显示方式
         * @return {void}
         */
        setDisplay : function()
        {
            var style = this.getStyle(),
                displayType = this.getDisplayType(),
                overrideStyle = style + "display: " + displayType + " !important;";

            this.$element.css("display", "");
            this.refresh();

            if(this.$element.css("display") !== displayType)
            {
                this.$element.attr("style", overrideStyle);
            }
        },

        /**
         * @private 设置为显示状态
         * @return {void}
         */
        setVisible : function()
        {
            this.$element.addClass(className.animation)
                         .addClass(className.visible);
        },

        /**
         * @private 设置为隐藏状态
         * @return {void}
         */
        setHidden : function()
        {
            if(!this.isHidden())
            {
                this.$element.addClass(className.animation)
                             .addClass(className.hidden);
            }

            if(this.$element.css("display") !== "none")
            {
                this.$element.css("display", "none");
            }
        },

        /**
         * @private 设置方向
         * @return {void}
         */
        setDirection : function()
        {
            if(this.$element.is(":visible") && !this.isHidden())
            {
                this.$element.removeClass(className.inward)
                             .addClass(className.outward);
            }
            else
            {
                this.$element.removeClass(className.outward)
                             .addClass(className.inward);
            }
        },

        /**
         * @private 设置动画时长
         * @param {number} duration 动画时长
         * @return {void}
         */
        setDuration : function(duration)
        {
            duration = support.parseDuration(duration || this.options.duration);

            if(duration || duration === 0)
            {
                this.$element
                    .css
                    ({
                        "-webkit-animation-duration": duration,
                        "-moz-animation-duration": duration,
                        "-ms-animation-duration": duration,
                        "-o-animation-duration": duration,
                        "animation-duration": duration
                    });
            }
        },

        /**
         * @private 保存条件
         * @return {void}
         */
        saveConditions : function()
        {
            var options = this.options,
                clasName = this.$element.attr("class") || false,
                style = this.$element.attr("style") || "";

            this.$element.removeClass(options.animation);
            this.removeDirection();

            this.cache =
            {
                className   :    this.$element.attr("class"),
                style       :    this.getStyle()
            };
        },

        /**
         * @private 添加超时定时器
         * @return {void}
         */
        addFailSafe : function()
        {
            var self = this,
                duration = self.getDuration() + self.options.failSafeDelay;

            self.timer = setTimeout(function()
            {
                self.$element.trigger(support.animationEnd);

            }, duration);
        },

        /**
         * @private 移除正在动画中标示
         * @return {void}
         */
        removeAnimating : function()
        {
            this.$element.removeClass(className.animating);
        },

        /**
         * @private 移除动画效果
         * @return {void}
         */
        removeAnimation : function()
        {
            this.$element.css
            ({
                "-webkit-animation": "",
                "-moz-animation": "",
                "-ms-animation": "",
                "-o-animation": "",
                "animation": ""
            });
        },

        /**
         * @private 移除超时定时器
         * @return {void}
         */
        removeFailSafe : function()
        {
            if(this.timer)
            {
                clearTimeout(this.timer);
            }
        },

        /**
         * @private 移除显示方式
         * @return {void}
         */
        removeDisplay : function()
        {
            this.$element.css("display", "");
        },

        /**
         * @private 移除隐藏模式
         * @return {void}
         */
        removeHidden : function()
        {
            this.$element.removeClass(className.hidden);
        },

        /**
         * @private 移除显示模式
         * @return {void}
         */
        removeVisible : function()
        {
            this.$element.removeClass(className.visible);
        },

        /**
         * @private 移除循环
         * @return {void}
         */
        removeLooping : function()
        {
            if(this.isLooping())
            {
                this.reset();
                this.$element.removeClass(className.looping)
            }
        },

        /**
         * @private 移除过渡
         * @return {void}
         */
        removeTransition : function()
        {
            this.$element.removeClass(className.visible)
                         .removeClass(className.hidden);
        },

        /**
         * @private 移除方向
         * @return {void}
         */
        removeDirection : function()
        {
            this.$element.removeClass(className.inward)
                         .removeClass(className.outward);
        },

        /**
         * @private 移除队列回调
         * @return {void}
         */
        removeQueueCallback : function()
        {
            this.$element.off(".queue" + this.options.eventSuffix);
        },

        /**
         * @private 移除完成回调
         * @return {void}
         */
        removeCompleteCallback : function()
        {
            this.$element.off(".complete" + this.options.eventSuffix);
        },

        /**
         * @private 移除所有回调
         * @return {void}
         */
        removeAnimationCallbacks : function()
        {
            this.removeQueueCallback();
            this.removeCompleteCallback();
        },

        /**
         * @private 重置条件
         * @return {void}
         */
        restoreConditions : function()
        {
            var self = this;

            if(self.cache === undefined)
            {
                return;
            }

            if(self.cache.className)
            {
                self.$element.attr("class", self.cache.className);
            }
            else
            {
                self.$element.removeAttr("class");
            }

            if(self.cache.style)
            {
                self.$element.attr("style", self.cache.style);
            }
            else
            {
                self.$element.removeAttr("style");
            }
        },

        /**
         * @private 获取 Style 内容
         * @return {string}
         */
        getStyle : function()
        {
            var self = this,
                style = self.$element.attr("style") || "";

            return style.replace(/display.*?;/, "");
        },

        /**
         * @private 获取显示方式
         * @return {string}
         */
        getDisplayType : function()
        {
            var self = this;

            if(self.options.displayType !== null)
            {
                return self.options.displayType;
            }

            if(self.$element.data("display") === undefined)
            {
                self.canAnimate(true);
            }

            return self.$element.data("display");
        },

        /**
         * @private 获取动画时长
         * @return {string}
         */
        getDuration : function(duration)
        {
            duration = duration || this.options.duration;

            if(!duration)
            {
                duration = this.$element.css("animation-duration") || 0;
            }

            return parseFloat(support.parseDuration(duration));
        },

        /**
         * @private 判断是否正在执行动画中
         * @return {boolean}
         */
        isAnimating : function()
        {
            return this.$element.hasClass(className.animating);
        },

        /**
         * @private 判断是否为 in 模式
         * @return {boolean}
         */
        isInward : function()
        {
            return this.$element.hasClass(className.inward);
        },

        /**
         * @private 判断是否为 out 模式
         * @return {boolean}
         */
        isOutward : function()
        {
            return this.$element.hasClass(className.outward);
        },

        /**
         * @private 判断是否为循环模式
         * @return {boolean}
         */
        isLooping : function()
        {
            return this.$element.hasClass(className.looping);
        },

        /**
         * @private 判断是否为事故模式
         * @return {boolean}
         */
        isOccurring : function(animation)
        {
            animation = animation || this.options.animation;
            
            animation = "." + animation.replace(" ", ".");

            return (this.$element.filter(animation).length > 0);
        },

        /**
         * @private 判断是否为显示模式
         * @return {boolean}
         */
        isVisible : function()
        {
            return this.$element.is(":visible");
        },

        /**
         * @private 判断是否为隐藏模式
         * @return {boolean}
         */
        isHidden : function()
        {
            return this.$element.css("visibility") === "hidden";
        },

        /**
         * @private 判断是否支持CSS动画
         * @return {boolean}
         */
        isSupport : function()
        {
            return(support.animationName !== null && support.animationEnd !== null);
        },

        /**
         * @private 当动画开始时调用
         * @return {void}
         */
        onStart : function()
        {
            // 触发元素事件
            this.$element.trigger("start" + this.options.eventSuffix);

            // 回调回调函数
            this.options.onStart.call(this);
        },

        /**
         * @private 当动画目标元素显示时调用
         * @return {void}
         */
        onShow : function()
        {
            // 触发元素事件
            this.$element.trigger("show" + this.options.eventSuffix);

            // 调用回调函数
            this.options.onShow.call(this);
        },

        /**
         * @private 当动画目标元素隐藏时调用
         * @return {void}
         */
        onHide : function()
        {
            // 触发元素事件
            this.$element.trigger("hide" + this.options.eventSuffix);

            // 调用回调函数
            this.options.onHide.call(this);
        },

        /**
         * @private 当动画完毕时调用
         * @return {void}
         */
        onComplete : function()
        {
            // 触发元素事件
            this.$element.trigger("complete" + this.options.eventSuffix);

            // 回调回调函数
            this.options.onComplete.call(this);
        },

        /**
         * @private 当CSS动画不支持时时调用
         * @return {void}
         */
        onNoSupport : function()
        {
            // 触发元素事件
            this.$element.trigger("nosupport" + this.options.eventSuffix);

            // 回调回调函数
            this.options.noSupport.call(this);
        }
    };

    $.fn.animation = function(options)
    {
        var parameters = arguments;

        return this.each(function()
        {
            var $element = $(this),
                instance   = $element.data($.fn.animation.settings.namespace);

            if(!instance)
            {
                $element.data($.fn.animation.settings.namespace, (instance = new Animation(this)));
            }

            instance.initialize.apply(instance, parameters);
        });
    };

    $.fn.animation.settings =
    {
        namespace        :    "fw.animation",
        eventSuffix      :    ".animation",
        displayType      :    null,
        useFailSafe      :    true,
        failSafeDelay    :    100,
        allowRepeats     :    false,
        queue            :    true,
        duration         :    "normal",
        onStart          :    function(){},
        onShow           :    function(){},
        onHide           :    function(){},
        onComplete       :    function(){},
        noSupport        :    function(){}
    };

}(jQuery, window, document);
