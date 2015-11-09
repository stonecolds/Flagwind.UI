/*!
 * Flagwind.UI [Dropdown] v1.0.1
 * Copyright 2014 Flagwind Inc. All rights reserved.
 * Licensed under the MIT License.
 * https://github.com/Flagwind/Flagwind.UI/blob/master/LICENSE
!*/

+function($, window, document, undefined)
{
    "use strict";

    /**
     * @private @class 初始化 Dropdown 类的新实例。
     * @param {Object} element 元素实例
     */
    var Dropdown = function(element, options)
    {
        this.options = options;
        
        this.$element = $(element);
        this.$toggle = this.$element.children(options.selector.toggle);
        this.$content = this.$element.children(options.selector.content);
        this.$menu = this.$element.children(options.selector.menu);
        this.$items = this.$menu.find(options.selector.item);
        this.$text = this.$element.find(options.selector.text);
        this.$search = this.$element.find(options.selector.search);
        this.$input = this.$element.find(options.selector.input);
        this.activated = false;

        this.setTabbable();
        this.saveDefaults();
        this.setSelected();

        this.bindMouseEvents();
        this.bindKeyboardEvents();
    };

    /**
     * Dropdown 类的原型实例。
     * @type {Object}
     */
    Dropdown.prototype =
    {
        /**
         * @private 重新指定原型的构造函数。
         * @type {function}
         */
        constructor : Dropdown,

        /**
         * @public 初始化函数。
         * @param  {Object} options 选项配置
         * @return {Void}
         */
        initialize : function(options)
        {
            var parameters = arguments,
                methodName = parameters[0],                             //截取第一个参数作为函数名
                methodInvoked = (typeof methodName === "string");       //根据函数名判断是否为函数调用

            // 执行函数调用
            if(methodInvoked)
            {
                $.fw.invoke(this, methodName, ([].slice.call(parameters, 1)));
            }
        },

        /**
         * @public 切换下拉内容的显示或隐藏。
         * @return {Void}
         */
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

        /**
         * 显示下拉内容。
         * @param  {Function} callback 回调函数
         * @return {Void}
         */
        show : function(callback)
        {
            var self = this;

            if(this.isSearchable() && this.isAllFiltered())
            {
                return;
            }

            if(!this.canShow() || this.isActive())
            {
                return;
            }

            // 隐藏其他菜单
            this.hideMenus();

            // 设置滚动条位置
            this.setScrollPosition(this.getActiveItem(), true);

            // 动画完毕回调函数
            var complete = function()
            {
                // 添加激活样式
                self.$element.addClass(self.options.className.active);

                // 绑定清除其他下拉组件事件
                if(self.canClick())
                {
                    self.bindIntent();
                }

                // 调用回调函数
                $.isFunction(callback) && callback.call(self);

                // 激发"show"相关事件
                self.onShow();
            };

            // 执行展开动画效果
            this.$content.animation
            ({
                animation   :    this.isUpward() ? "slide up in" : "slide down in",
                duration    :    this.options.duration,
                noSupport   :    complete,
                onComplete  :    complete
            });
        },

        /**
         * 隐藏下拉内容。
         * @param  {Function} callback 回调函数
         * @return {Void}
         */
        hide : function(callback)
        {
            var self = this;

            if(!this.isActive())
            {
                return;
            }

            // 取消绑定清除其他下拉组件事件
            if(self.canClick())
            {
                self.unbindIntent();
            }

            // 动画完毕回调函数
            var complete = function()
            {
                // 移除激活样式
                self.$element.removeClass(self.options.className.active);

                // 调用回调函数
                $.isFunction(callback) && callback.call(self);

                // 激发"hide"相关事件
                self.onHide();
            };

            // 执行隐藏动画效果
            this.$content.animation
            ({
                animation   :    this.isUpward() ? "slide up out" : "slide down out",
                duration    :    this.options.duration,
                noSupport   :    complete,
                onComplete  :    complete
            });
        },

        /**
         * 隐藏其他下拉菜单。
         * @return {Void}
         */
        hideMenus : function()
        {
            $(".dropdown").not(this.$element).has(this.options.selector.content + ":visible:not(." + this.options.className.animating + ")").dropdown("hide");
        },

        /**
         * 激活菜单项。
         * @param  {String} text       文本
         * @param  {String} value      值
         * @param  {Boolean} isBubbled 是否为冒泡的
         * @return {Void}
         */
        activate : function(text, value, isBubbled)
        {
            value = (value !== undefined) ? value : text;

            // 选中指定项
            this.setSelected(value);

            if(!isBubbled)
            {
                // 隐藏下拉菜单
                this.hide(function()
                {
                    this.removeFilteredItem();
                });
            }
            else
            {
                this.removeFilteredItem();
            }
        },

        /**
         * 搜索菜单项。
         * @return {Void}
         */
        search : function()
        {
            var keywords = this.$search.val();

            this.filter(keywords);

            if(this.canShow())
            {
                this.show();
            }
        },

        /**
         * 过滤搜索条件。
         * @param  {String} keywords 关键字
         * @return {Void}
         */
        filter : function(keywords)
        {
            var self = this,
                $results = $(),
                escapedKeywords = keywords.escape(),
                exactRegExp = new RegExp("^" + escapedKeywords, "igm"),
                fullTextRegExp = new RegExp(escapedKeywords, "ig"),
                allItemsFiltered;

            this.$items.each(function()
            {
                var $choice = $(this),
                    text = String(self.getChoiceText($choice, false)),
                    value = String(self.getChoiceValue($choice, text));

                if(text.match(exactRegExp) || value.match(exactRegExp))
                {
                    $results = $results.add($choice);
                }
            });

            this.removeFilteredItem();
            this.$items.not($results).addClass(this.options.className.filtered);

            this.removeSelectedItem();
            $results.eq(0).addClass(this.options.className.selected);

            if(this.isAllFiltered())
            {
                this.hide();

                this.onNoResults();
            }
        },

        /**
         * 选中搜索项。
         * @return {Void|
         */
        forceSelection : function()
        {
            var $currentlySelected = this.$items.not(this.options.className.filtered).filter("." + this.options.className.selected).eq(0),
                $activeItem = this.$items.filter("." + this.options.className.active).eq(0),
                $selectedItem = ($currentlySelected.length > 0) ? $currentlySelected : $activeItem,
                hasSelected = ($selectedItem.size() > 0);

            if(hasSelected)
            {
                this.onItemClick({target : $selectedItem.context}, $selectedItem);

                this.removeFilteredItem();
            }
            else
            {
                this.hide();
            }
        },

        /**
         * 设置组件的 tabindex。
         * @return {Void}
         */
        setTabbable : function()
        {
            if(this.isSearchable())
            {
                // 获取触发元素的 tabindex
                var tabindex = this.isDisabled() ? "-1" : (this.$toggle.attr("tabindex") || 0);

                // 设置搜索框的 tabindex
                this.$search.val("").attr("tabindex", tabindex);

                // 删除触发元素的 tabindex
                this.$toggle.removeAttr("tabindex");
            }
            else
            {
                if(!this.$toggle.attr("tabindex"))
                {
                    this.$toggle.attr("tabindex", this.isDisabled() ? "-1" : "0");
                    this.$toggle.siblings("button").attr("tabindex", "-1");
                }
            }

            //this.$content.attr("tabindex", "-1");
        },

        /**
         * 根据指定的值选中菜单项。
         * @param {String} value 值
         * @return {Void}
         */
        setSelected : function(value) 
        {
            var selectedText,
                selectedValue,
                $selectedItem = this.getItem(value);

            if($selectedItem && !$selectedItem.hasClass(this.options.className.active))
            {
                // 移除选中项样式
                this.removeActiveItem();
                this.removeSelectedItem();

                // 添加选中项选中样式
                $selectedItem.addClass(this.options.className.active)
                             .addClass(this.options.className.selected);

                selectedText = this.getChoiceText($selectedItem);
                selectedValue = this.getChoiceValue($selectedItem, selectedText);

                // 设置文本和值
                this.setText(selectedText);
                this.setValue(selectedValue);

                // 激发"change"相关事件
                this.onChange(selectedValue, selectedText, $selectedItem);
            }
        },

        /**
         * 设置组件文本。
         * @param {String} text 文本
         * @return {Void}
         */
        setText : function(text)
        {
            if(this.options.action !== "combobox")
            {
                // 移除文本样式
                this.$text.removeClass(this.options.className.filtered)
                          .removeClass(this.options.className.placeholder);

                // 设置文本内容
                if(this.options.preserveHTML)
                {
                    this.$text.html(text);
                }
                else
                {
                    this.$text.text(text);
                }
            }
        },

        /**
         * 设置组件值。
         * @param {String} value 值
         * @return {Void}
         */
        setValue : function(value)
        {
            if(this.$input.length > 0)
            {
                // 触发隐藏域的"change"事件
                this.$input.val(value).trigger("change");
            }
            else
            {
                this.$element.data(this.options.metadata.value, value);
            }
        },

        /**
         * 设置菜单滚动条的位置。
         * @param {Object} $item         菜单项
         * @param {Boolean} forceScroll 是否强制滚动
         * @return {Void}
         */
        setScrollPosition : function($item, forceScroll)
        {
            var edgeTolerance = 5,
                hasActive,
                offset,
                itemHeight,
                itemOffset,
                menuOffset,
                menuScroll,
                menuHeight,
                abovePage,
                belowPage;

            $item = $item || this.getActiveItem();

            hasActive = ($item && $item.length > 0);
            forceScroll = (forceScroll !== undefined) ? forceScroll : false;

            if($item && hasActive)
            {
                if(!this.$menu.hasClass(this.options.className.visible))
                {
                    this.$menu.addClass(this.options.className.loading);
                }

                menuHeight = this.$menu.height();
                itemHeight = $item.height();
                menuScroll = this.$menu.scrollTop();
                menuOffset = this.$menu.offset().top;
                itemOffset = $item.offset().top;
                offset     = menuScroll - menuOffset + itemOffset;
                belowPage  = menuScroll + menuHeight < (offset + edgeTolerance);
                abovePage  = ((offset - edgeTolerance) < menuScroll);

                if(abovePage || belowPage || forceScroll)
                {
                    this.$menu.scrollTop(offset)
                         .removeClass(this.options.className.loading);
                }
            }
        },

        /**
         * 设置过滤文本。
         * @return {Void}
         */
        setFiltered : function()
        {
            var searchValue = this.$search.val(),
                hasSearchValue = (typeof searchValue === "string" && searchValue.length > 0);

            if(hasSearchValue)
            {
                this.$text.addClass(this.options.className.filtered);
            }
            else
            {
                this.$text.removeClass(this.options.className.filtered);
            }
        },

        /**
         * 获取文本。
         * @return {String} 文本内容
         */
        getText : function()
        {
            return this.$text.text();
        },

        /**
         * 获取值。
         * @return {String} 值
         */
        getValue : function()
        {
            return String((this.$input.length > 0) ? this.$input.val() : this.$element.data(this.options.metadata.value));
        },

        /**
         * 根据指定的值获取菜单项。
         * @param  {String} value 值
         * @return {Object}       菜单项
         */
        getItem : function(value)
        {
            var self = this,
                $item = null;

            value = (value !== undefined) ? value : (this.getValue() !== undefined) ? this.getValue() : this.getText();

            if(value !== undefined)
            {
                this.$items.each(function()
                {
                    var $choice = $(this),
                        itemText = self.getChoiceText($choice),
                        itemValue = self.getChoiceValue($choice, itemText);

                    if(itemValue === value)
                    {
                        $item = $(this);

                        return true;
                    }
                    else if(!$item && itemText === value)
                    {
                        $item = $(this);

                        return true;
                    }
                });
            }

            return $item;
        },
        
        /**
         * 获取当前选择的菜单项。
         * @return {Object} 菜单项
         */
        getSelectedItem : function()
        {
            return this.$items.filter("."  + this.options.className.selected);
        },

        /**
         * 获取当前激活的菜单项。
         * @return {Object} 菜单项
         */
        getActiveItem : function()
        {
            return this.$items.filter("."  + this.options.className.active);
        },
        
        /**
         * 获取菜单项的文本。
         * @param  {Object} $item         菜单项
         * @param  {Boolean} preserveHTML 是否保存HTML
         * @return {String}               菜单项文本
         */
        getChoiceText : function($item, preserveHTML)
        {
            preserveHTML = (preserveHTML !== undefined) ? preserveHTML : this.options.preserveHTML;

            if($item !== undefined)
            {
                // 获取"data-text"属性中的内容
                if($item.data(this.options.metadata.text) !== undefined)
                {
                    return $item.data(this.options.metadata.text);
                }

                return preserveHTML ? $item.html().trim() : $item.text().trim();
            }
        },

        /**
         * 获取菜单项的值，如果值为空，则返回文本。
         * @param  {Object} $item 菜单项
         * @param  {String} text  菜单项文本
         * @return {String}       菜单项值
         */
        getChoiceValue : function($item, text)
        {
            // 解析菜单项文本
            text = text || this.getChoiceText($item);

            // 获取"data-value"属性中的内容
            if($item.data(this.options.metadata.value) !== undefined)
            {
                return String($item.data(this.options.metadata.value));
            }

            return text;
        },

        /**
         * 获取搜索框的事件名。
         * @return {[type]} [description]
         */
        getSearchEventName : function()
        {
            var input = this.$search[0];

            if(input)
            {
                return (input.oninput !== undefined) ? "input" : "keyup";
            }

            return null;
        },
        
        /**
         * 移除搜索框的文本。
         * @return {Void}
         */
        removeSearchText : function()
        {
            this.$search.val("");
        },

        /**
         * 移除选择的菜单项。
         * @return {Void}
         */
        removeSelectedItem : function()
        {
            this.$items.removeClass(this.options.className.selected);
        },

        /**
         * 移除激活的选择项。
         * @return {Void}
         */
        removeActiveItem : function()
        {
            this.$items.removeClass(this.options.className.active);
        },

        /**
         * 移除过滤的菜单项。
         * @return {Void}
         */
        removeFilteredItem : function()
        {
            this.$items.removeClass(this.options.className.filtered);
        },

        /**
         * 保存默认数据。
         * @return {Void}
         */
        saveDefaults : function()
        {
            this.saveDefaultText();
            this.savePlaceholderText();
            this.saveDefaultValue();
        },

        /**
         * 保存默认文本。
         * @return {Void}
         */
        saveDefaultText : function()
        {
            this.$element.data(this.options.metadata.defaultText, this.getText());
        },

        /**
         * 保存默认值。
         * @return {Void}
         */
        saveDefaultValue : function()
        {
            this.$element.data(this.options.metadata.defaultValue, this.getValue());
        },

        /**
         * 保存占位文本。
         * @return {Void}
         */
        savePlaceholderText : function()
        {
            if(this.$text.hasClass(this.options.className.placeholder))
            {
                this.$element.data(this.options.metadata.placeholderText, this.$text.text());
            }
        },

        /**
         * 检测当前下拉菜单是否为激活的。
         * @return {Boolean}
         */
        isActive : function()
        {
            return this.$element.hasClass(this.options.className.active);
        },

        /**
         * 检测当前菜单方向是否为向上。
         * @return {Boolean}
         */
        isUpward : function()
        {
            return this.$element.hasClass(this.options.className.upward);
        },

        /**
         * 检测当前下拉内容是否为隐藏状态。
         * @return {Boolean}
         */
        isHidden : function()
        {
            return this.$content.is(":hidden");
        },

        /**
         * 检测当前下拉组件是否支持查找。
         * @return {Boolean}
         */
        isSearchable : function()
        {
            return this.$search.length > 0;
        },

        /**
         * 检测菜单项是否全过滤。
         * @return {Boolean}
         */
        isAllFiltered : function()
        {
            return (this.$items.filter("." + this.options.className.filtered).length === this.$items.length);
        },

        /**
         * 检测组件是否为禁用状态。
         * @return {Boolean}
         */
        isDisabled : function()
        {
            return this.$toggle.hasClass(this.options.className.disabled) || this.$toggle.attr("disabled") === "disabled";
        },

        /**
         * 检测当前触发元素是否为可点击的。
         * @return {Boolean}
         */
        canClick : function()
        {
            return ($.fw.support.hasTouch || this.options.trigger === "click");
        },

        /**
         * 检测菜单项是否能被选中。
         * @param  {Object} $item 菜单项
         * @return {Boolean}
         */
        canSelect : function($item)
        {
            return !$item.hasClass(this.options.className.disabled) && !$item.hasClass(this.options.className.divider);
        },

        /**
         * 检测菜单是否为可呈现的。
         * @return {Boolean}
         */
        canShow : function()
        {
            return !this.$toggle.hasClass(this.options.className.disabled) && this.$toggle.attr("disabled") !== "disabled";
        },

        /**
         * 绑定清除其他下拉组件事件
         * @return {Void}
         */
        bindIntent : function()
        {
            var self = this;

            $(document).on("click" + this.options.eventSuffix, function(e)
            {
                if($(e.target).closest(self.$element).length === 0)
                {
                    self.hide();
                }
            });
        },

        /**
         * 解除绑定清除其他下拉组件事件。
         * @return {Void}
         */
        unbindIntent : function()
        {
             $(document).off("click" + this.options.eventSuffix);
        },

        /**
         * 绑定鼠标相关事件。
         * @return {Void}
         */
        bindMouseEvents : function()
        {
            var self = this,
                trigger = this.options.trigger;

            // 绑定下拉组件鼠标事件
            this.$element.on("mousedown" + this.options.eventSuffix, $.proxy(this.onMousedown, this))
                         .on("mouseup" + this.options.eventSuffix, $.proxy(this.onMouseup, this));

            if(this.isSearchable())
            {
                // 绑定搜索文本框焦点事件
                this.$search.on("focus" + this.options.eventSuffix, $.proxy(this.onFocus, this))
                            .on("blur" + this.options.eventSuffix, $.proxy(this.onBlur, this))
                            .on("click" + this.options.eventSuffix, $.proxy(this.onSearchClick, this));

                this.$element.on("click" + this.options.eventSuffix, this.options.selector.text, $.proxy(this.onSearchClick, this));
            }
            else
            {
                // 点击触发处理
                if(trigger === "click")
                {
                    this.$toggle.on("click" + this.options.eventSuffix, function(e)
                    {
                        e.preventDefault();

                        self.toggle();
                    });
                }
                // 移入触发处理
                else if(trigger === "hover")
                {
                    this.$element.on("mouseenter" + this.options.eventSuffix, function(e)
                    {
                        e.preventDefault();

                        clearTimeout(self.timer);

                        self.timer = setTimeout($.proxy(self.show, self), self.options.delay.show);
                    });

                    this.$element.on("mouseleave" + this.options.eventSuffix, function(e)
                    {
                        e.preventDefault();

                        clearTimeout(self.timer);

                        self.timer = setTimeout($.proxy(self.hide, self), self.options.delay.hide);
                    });
                }

                // 绑定触发元素焦点事件
                this.$toggle.on("focus" + this.options.eventSuffix, $.proxy(this.onFocus, this))
                             .on("blur" + this.options.eventSuffix, $.proxy(this.onBlur, this));
            }

            // 绑定菜单项点击事件
            this.$menu.on("click" + this.options.eventSuffix, this.options.selector.item, $.proxy(this.onItemClick, this));
        },

        /**
         * 绑定键盘相关事件。
         * @return {Void}
         */
        bindKeyboardEvents : function()
        {
            // 绑定键盘(上/下/回车)事件。
            this.$element.on("keydown" + this.options.eventSuffix, $.proxy(this.onKeydown, this));

            //绑定搜索事件。
            if(this.isSearchable())
            {
                this.$element.on(this.getSearchEventName(), this.options.selector.search, $.proxy(this.onSearch, this));
            }
        },

        /**
         * 当菜单激活时调用。
         * @return {Void}
         */
        onMenuActivate : function()
        {
            this.itemActivated = true;
        },

        /**
         * 当菜单取消激活时调用。
         * @return {Void}
         */
        onMenuDeactivate : function()
        {
            this.itemActivated = false;
        },

        /**
         * 当菜单项点击时调用。
         * @param  {Object} e 事件参数
         * @return {Void}
         */
        onItemClick : function(e, $selectedItem)
        {
            var $choice = $selectedItem || $(e.currentTarget),
                isBubbled = $(e.target).is("button"),
                text = this.getChoiceText($choice),
                value = this.getChoiceValue($choice, text);

            // 检测是否能被选中
            if(!this.canSelect($choice))
            {
                return;
            }

            this.removeSearchText();

            // 选择处理动作
            if($.isFunction(this[this.options.action]))
            {
                this[this.options.action](text, value, isBubbled);
            }
            else if($.isFunction(this.options.action))
            {
                this.options.action.call(this, text, value, isBubbled);
            }
        },

        /**
         * 当键盘按下时调用。
         * @param  {Object} e 事件参数
         * @return {Void}
         */
        onKeydown : function(e)
        {
            var $nextItem,
                pressedKey = e.which,
                $currentlySelected = this.$items.not(this.options.className.filtered).filter("." + this.options.className.selected).eq(0),
                $activeItem = this.$menu.children("." + this.options.className.active).eq(0),
                $selectedItem = ($currentlySelected.length > 0) ? $currentlySelected : $activeItem,
                $visibleItems = ($selectedItem.length > 0) ? $selectedItem.siblings(":not(." + this.options.className.filtered + ")").andSelf() : this.$menu.children(":not(." + this.options.className.filtered + ")"),
                hasSelectedItem  = ($selectedItem.length > 0);

            if(this.isActive())
            {
                // 向上键
                if(pressedKey == $.fw.keyCodes.UP)
                {
                    $nextItem = hasSelectedItem ? $selectedItem.prevAll(this.options.selector.item + ":not(." + this.options.className.filtered + ")").eq(0) : this.$items.eq(0);

                    if ($visibleItems.index($nextItem) < 0)
                    {
                        return;
                    }
                    else
                    {
                        $selectedItem.removeClass(this.options.className.selected);
                        $nextItem.addClass(this.options.className.selected);

                        this.setScrollPosition($nextItem);
                    }

                    e.preventDefault();
                }
                // 向下键
                else if(pressedKey == $.fw.keyCodes.DOWN)
                {
                    $nextItem = hasSelectedItem ? $selectedItem.nextAll(this.options.selector.item + ":not(." + this.options.className.filtered + ")").eq(0) : this.$items.eq(0);

                    if($nextItem.length === 0)
                    {
                        return;
                    }
                    else
                    {
                        this.$items.removeClass(this.options.className.selected);
                        $nextItem.addClass(this.options.className.selected);
                        
                        this.setScrollPosition($nextItem);
                    }
                }
                // 回车键
                else if(pressedKey == $.fw.keyCodes.ENTER)
                {
                    this.onItemClick(e, $selectedItem);

                    if(this.isSearchable())
                    {
                        e.preventDefault();
                    }
                }
                // ESC 键
                else if(pressedKey == $.fw.keyCodes.ESCAPE)
                {
                    this.hide();
                }
            }
            else
            {
                // 内容朝上时按上键显示内容
                if(this.isUpward() && (pressedKey == $.fw.keyCodes.UP || pressedKey == $.fw.keyCodes.DOWN))
                {
                    this.show();
                }

                // 内容朝下时按下键显示内容
                if(!this.isUpward() && pressedKey == $.fw.keyCodes.DOWN)
                {
                    this.show();
                }
            }
        },

        /**
         * 当触发搜索时调用。
         * @param  {Object} e 事件参数
         * @return {Void}
         */
        onSearch : function(e)
        {
            var pressedKey = e.which;

            if(pressedKey == $.fw.keyCodes.UP || pressedKey == $.fw.keyCodes.DOWN || pressedKey == $.fw.keyCodes.ENTER)
            {
                return;
            }

            // 设置过滤样式。
            this.setFiltered();

            clearTimeout(this.timer);

            this.timer = setTimeout($.proxy(this.search, this), this.options.delay.search);
        },

        /**
         * 当搜索框点击时调用。
         * @param  {Object} e 事件参数
         * @return {Void}
         */
        onSearchClick : function(e)
        {
            this.$search.focus();
        },

        /**
         * 当下拉组件鼠标按下时调用。
         * @return {Void}
         */
        onMousedown : function()
        {
            this.activated = true;
        },

        /**
         * 当下拉组件鼠标弹起时调用。
         * @return {Void}
         */
        onMouseup : function()
        {
            this.activated = false;
        },

        /**
         * 当触发元素获得焦点时调用。
         * @return {Void}
         */
        onFocus : function()
        {
            // 添加焦点样式
            this.$toggle.addClass("focus");

            if(!this.activated && this.isHidden())
            {
                this.show();
            }
        },

        /**
         * 当触发元素失去焦点时调用。
         * @return {Void}
         */
        onBlur : function(e)
        {
            // 移除焦点样式
            this.$toggle.removeClass("focus");

            var pageLostFocus = (document.activeElement === e.target);

            if(!this.activated && !pageLostFocus)
            {
                if(this.isSearchable() && this.options.forceSelection)
                {
                    this.forceSelection();
                }
                else
                {
                    this.hide();
                }
            }
        },

        /**
         * 当下拉菜单发生改变时调用。
         * @param  {String} value 值
         * @param  {String} text  文本
         * @param  {Object} $item 菜单项
         * @return {Void}
         */
        onChange : function(value, text, $item)
        {
            // 触发元素事件
            this.$element.trigger("change" + this.options.eventSuffix, [value, text, $item]);

            // 调用回调函数
            this.options.onChange.call(this, value, text, $item);
        },

        /**
         * 当下拉菜单显示时调用。
         * @return {Void}
         */
        onShow : function()
        {
            // 触发元素事件
            this.$element.trigger("show" + this.options.eventSuffix);

            // 调用回调函数
            this.options.onShow.call(this);
        },

        /**
         * 当下拉菜单隐藏时调用。
         * @return {Void}
         */
        onHide : function()
        {
            // 触发元素事件
            this.$element.trigger("hide" + this.options.eventSuffix);

            // 调用回调函数
            this.options.onHide.call(this);
        },

        /**
         * 当没有搜索结果时调用。
         * @return {Void}
         */
        onNoResults : function()
        {
            // 触发元素事件
            this.$element.trigger("noresults" + this.options.eventSuffix);

            // 调用回调函数
            this.options.onNoResults.call(this);
        }
    };
    
    $.fn.dropdown = function(options)
    {
        var parameters = arguments;

        return this.each(function()
        {
            var plainObject,
                $element = $(this),
                instance   = $element.data($.fn.dropdown.settings.namespace);

            if(!instance)
            {
                plainObject = $.extend(true, {}, $.fn.dropdown.settings, $.fw.parseOptions($element.data("dropdown")), options);

                $element.data($.fn.dropdown.settings.namespace, (instance = new Dropdown(this, plainObject)));
            }

            instance.initialize.apply(instance, parameters);
        });
    };

    $.fn.dropdown.settings =
    {
        namespace       :    "fw.dropdown",
        eventSuffix     :    ".dropdown",
        trigger         :    "click",                               // 触发类型：click(点击) | hover(移入)
        action          :    "activate",                            // 点击动作：activate(激活)
        duration        :    250,                                   // 动画时长
        preserveHTML    :    false,                                 // 是否支持HTML
        forceSelection  :    true,
        className       :
        {
            active      :    "active",
            animating   :    "animating",
            selected    :    "selected",
            disabled    :    "disabled",
            filtered    :    "filtered",
            placeholder :    "default",
            loading     :    "loading",
            visible     :    "visible",
            divider     :    "divider",
            upward      :    "dropdown-up"
        },
        selector        :
        {
            toggle      :    ".dropdown-toggle",
            content     :    ".dropdown-content",
            text        :    ".text:not(.icon)",
            search      :    ".search",
            input       :    "> input[type='hidden'], > select",
            menu        :    "ul.dropdown-content",
            item        :    "li:not(.divider):not(.disabled)"
        },
        metadata        :
        {
            defaultText         :   "defaultText",
            defaultValue        :   "defaultValue",
            placeholderText     :   "placeholderText",
            text                :   "text",
            value               :   "value"
        },
        delay           :
        {
            show        :     200,
            hide        :     300,
            search      :     50
        },
        onShow          :    $.fw.empty,
        onHide          :    $.fw.empty,
        onChange        :    $.fw.empty,
        onNoResults     :    $.fw.empty
    };

}(jQuery, window, document);

$(function()
{
    $(".dropdown").dropdown
    ({

    });
});