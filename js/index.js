var pagesize = 10; //每页的总条数
var nowpage = 1;  //当前页
var allpage = 1;  //总页数
var tablearr = [];
var user = getCookie('username');
if (user) {
    $('.username').text(user);
} else {
    location.href = './login.html'
}


/**
 * 绑定事件
 */
function bindEvent() {
    $('.menu').on('click', 'dd', function () {
        $(this).addClass('active').siblings().removeClass('active');
        var id = $(this).data('id');
        $('#' + id).fadeIn().siblings().fadeOut();
    });

    $('#addbtn').click(function (e) {
        e.preventDefault();
        var formdata = $('.add-form').serializeArray();
        var checkform = checkformdata(formdata);
        console.log(checkform);
        if (checkform.status == 'success') {
            console.log(checkform.status);
            transferData('/api/student/addStudent', checkform.data, function () {
                alert('添加成功');
                $('.add-form')[0].reset();
                $('.menu > dd[data-id=stu-list]').trigger('click')
            })
        }else{
            alert(checkform.msg)
        }
    })


    $('#tbody').on('click', '.edit', function () {
        var index = $(this).parents('tr').index();
        console.log(index)
        $('.modal').slideDown();
        renderform(tablearr[index])
    }).on('click', '.remove', function () {
        var index = $(this).parents('tr').index();
        var isDelete = confirm('确认删除学号为' + tablearr[index].sNo + '的学生吗？');
        if (isDelete) {
            transferData('/api/student/delBySno', {
                sNo: tablearr[index].sNo
            }, function () {
                alert('删除成功');
                getTableData();
            })
        }
    })

    $('#editbtn').click(function (e) {
        e.preventDefault();
        var formdata = $('.edit-form').serializeArray();
        var checkform = checkformdata(formdata);
        //   console.log(formdata)
        if (checkform.status == 'success') {
            console.log(checkform.status);
            transferData('/api/student/updateStudent', checkform.data, function () {
                alert('修改成功');
                $('.modal').slideUp();
                getTableData();
            })
        } else {
            alert(checkform.msg);
        }
    })

    $('.modal').click(function () {
        $('.modal-content').click(function (e) {
            e.stopPropagation();
        })
        $(this).slideUp();
    })

}
bindEvent();

/**
 * 表单数据回填
 * @param {点击某一行回填到对应表单的数据} data 
 */
function renderform(data) {
    var form = $('.edit-form')[0]
    for (prop in data) {
        if (form[prop]) {
            form[prop].value = data[prop];
        }
    }
}










/**
 * ajax请求拿数据
 * @param {*} url 
 * @param {*} data 
 * @param {*} callback
 */

function transferData(url, data, callback) {
    $.ajax({
        url: 'http://open.duyiedu.com' + url,
        type: 'get',
        dataType: 'json',
        data: $.extend({
            appkey: 'yilin10_1590726255501',
        }, data),
        success: function (res) {
            if (res.status === 'success') {
                callback(res.data);
            } else if (res.status === 'fail') {
                alert(res.msg);
            }
        }
    })
}

/**
 * 表单校验
 * @param {表单数据} formdata 
 */
function checkformdata(formdata) {
    var result = {
        status: 'success',
        data: {},
        msg: '校验成功',
    }
    for (let i = 0; i < formdata.length; i++) {
        if (!formdata[i].value) {
            result.status = 'fail';
            result.data = {}
            result.msg = formdata[i].name + '不存在';
            break;
        }
        else if (formdata[i].name === 'sNo' && !(/^\d{4,16}$/.test(formdata[i].value))) {
            result.status = 'fail';
            result.data = {}
            result.msg = '学号格式为4-16位的数字';
            break;
        }
        else if (formdata[i].name === 'birth' && !(formdata[i].value > 1920 && formdata[i].value <= 2020)) {
            result.status = 'fail';
            result.data = {}
            result.msg = '出生年份格式不正确';
            break;
        }
        else if (formdata[i].name === 'phone' && !(/^1\d{10}$/.test(formdata[i].value))) {
            result.msg = 'fail';
            result.data = {}
            result.msg = '手机号不正确';
        }
        result.data[formdata[i].name] = formdata[i].value
    }
    return result;
}

/**
 * 得到表格数据 按页查询并渲染
 */
function getTableData() {
    transferData('/api/student/findByPage', {
        page: nowpage,
        size: pagesize,
    }, function (data) {
        // console.log(data)
        allpage = Math.ceil(data.cont / pagesize);
        tablearr = data.findByPage;
        // console.log(tablearr)
        rendertable(data.findByPage);
    })
}
getTableData();


/**
 * 渲染表格
 * @param {表格数据} data 
 */
function rendertable(data) {
    var str = data.reduce(function (prevstr, current) {
        return prevstr + ` <tr>
       <td>${current.sNo}</td>
       <td>${current.name}</td>
       <td>${current.sex == 0 ? '男' : '女'}</td>
       <td>${current.email}</td>
       <td>${new Date().getFullYear() - current.birth}</td>
       <td>${current.phone}</td>
       <td>${current.address}</td>
       <td>
           <button class="btn edit">编辑</button>
           <button class="btn remove">删除</button>
       </td>
   </tr>`
    }, '')
    $('#tbody').html(str);
    $('.turn-page').Page({
        onepageSize: pagesize,
        current: nowpage,
        allPage: allpage,
        changePage: function (current, onepagesize) {
            nowpage = current;
            pagesize = onepagesize;
            getTableData();
        }
    })
}