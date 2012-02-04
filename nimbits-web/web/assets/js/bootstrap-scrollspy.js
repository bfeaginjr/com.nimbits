/*
 * Copyright (c) 2010 Tonic Solutions LLC.
 *
 * http://www.nimbits.com
 *
 *
 * Licensed under the GNU GENERAL PUBLIC LICENSE, Version 3.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.gnu.org/licenses/gpl.html
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the license is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, eitherexpress or implied. See the License for the specific language governing permissions and limitations under the License.
 */


!function ($) {

    "use strict"

    var $window = $(window)

    function ScrollSpy(topbar, selector) {
        var processScroll = $.proxy(this.processScroll, this)
        this.$topbar = $(topbar)
        this.selector = selector || 'li > a'
        this.refresh()
        this.$topbar.delegate(this.selector, 'click', processScroll)
        $window.scroll(processScroll)
        this.processScroll()
    }

    ScrollSpy.prototype = {

        refresh:function () {
            this.targets = this.$topbar.find(this.selector).map(function () {
                var href = $(this).attr('href')
                return /^#\w/.test(href) && $(href).length ? href : null
            })

            this.offsets = $.map(this.targets, function (id) {
                return $(id).offset().top
            })
        }, processScroll:function () {
            var scrollTop = $window.scrollTop() + 10
                , offsets = this.offsets
                , targets = this.targets
                , activeTarget = this.activeTarget
                , i

            for (i = offsets.length; i--;) {
                activeTarget != targets[i]
                    && scrollTop >= offsets[i]
                    && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
                && this.activateButton(targets[i])
            }
        }, activateButton:function (target) {
            this.activeTarget = target

            this.$topbar
                .find(this.selector).parent('.active')
                .removeClass('active')

            this.$topbar
                .find(this.selector + '[href="' + target + '"]')
                .parent('li')
                .addClass('active')
        }

    }

    /* SCROLLSPY PLUGIN DEFINITION
     * =========================== */

    $.fn.scrollSpy = function (options) {
        var scrollspy = this.data('scrollspy')

        if (!scrollspy) {
            return this.each(function () {
                $(this).data('scrollspy', new ScrollSpy(this, options))
            })
        }

        if (options === true) {
            return scrollspy
        }

        if (typeof options == 'string') {
            scrollspy[options]()
        }

        return this
    }

    $(document).ready(function () {
        $('body').scrollSpy('[data-scrollspy] li > a')
    })

}(window.jQuery || window.ender);