(function () {
    function Turnpage(options, wrap) {
        this.wrap = wrap;
        this.onepageSize = options.onepageSize || 5;
        this.current = options.current || 1;
        this.allPage = options.allPage || (options.allSize ? Math.ceil(options.allSize / this.onepageSize) : 1);
        this.changePage = options.changePage || function () { }
    }

    Turnpage.prototype.init = function () {
        this.fillHtml();
        this.bindEvent()
    }


    /**
     * 元素填充
     */
    Turnpage.prototype.fillHtml = function () {
        $(this.wrap).empty();
        const mypagediv = $('<div class="my-page"></div>');
        const everypagesize = $('<div class="my-page-size">每一页条数:<input class="my-page-inp" type="number" min=1 max=50 value=' + this.onepageSize + ' /></div>');
        const pagelist = $('<ul class="my-turn-page"></ul>');
        if (this.current > this.allPage) {
            alert('当前页码大于总页码');
        } else {
            //添加上一页
            if (this.current > 1) {
                $('<li class="my-page-prev">上一页</li>').appendTo(pagelist);
            }

            //添加第一页
            $('<li class="my-page-num">1</li>').appendTo(pagelist).addClass(this.current === 1 ? "current-page" : '');

            //添加中间五页
            if (this.current - 1 >= 4) {
                $('<span>...</span>').appendTo(pagelist);
            }
            for (let i = this.current - 2; i <= this.current + 2; i++) {
                if (i > 1 && i < this.allPage) {
                    $('<li class="my-page-num">' + i + '</li>').appendTo(pagelist).addClass(this.current === i ? 'current-page' : '');
                }
            }
            //添加最后一页
            if (this.allPage - this.current > 3) {
                $('<span>...</span>').appendTo(pagelist);
            }
            if(this.allPage>1){
                $('<li class="my-page-num">' + this.allPage + '</li>').appendTo(pagelist).addClass(this.current === this.allPage ? 'current-page' : '');
            }
            if (this.current < this.allPage) {
                $('<li class="my-page-next">下一页</li>').appendTo(pagelist)
            }
        }
        mypagediv.append(everypagesize).append(pagelist).appendTo(this.wrap)
    }


    /**
     * 绑定事件
     * 
     */
    Turnpage.prototype.bindEvent = function () {
        const self = this;
        $('.my-page-prev', this.wrap).click(() => {
            this.current--;
            this.change();
        })
        $('.my-page-next', this.wrap).click(() => {
            this.current++;
            this.change();
        })
        $('.my-page-num', this.wrap).click(function () {
            self.current = parseInt($(this).text());
            self.change();
        })
        $('.my-page-inp', this.wrap).change(function () {
            self.onepageSize = parseInt($(this).val())
            self.current = 1;
            self.change();
        })
    }

    Turnpage.prototype.change = function () {
        this.fillHtml();
        this.bindEvent();
        this.changePage(this.current, this.onepageSize);
    }


    $.fn.extend({
        Page: function (options) {
            const obj = new Turnpage(options, this);
            obj.init();
        }
    })
})();


