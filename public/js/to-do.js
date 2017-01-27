(function(document, $) {
    var mapper = {
        '#completed-shared-body': '#pending-shared-body',
        '#pending-shared-body': '#completed-shared-body',
        '#completed-priv-body': '#pending-priv-body',
        '#pending-priv-body': '#completed-priv-body'
    }

    var checkboxMap = {
        'Mark Completed': 'Unmark',
        'Unmark': 'Mark Completed'
    }

    function changeHead(signin, signup, inBox, upBox) {
        console.log(inBox, upBox);
        signin.on('click', function() {
            signup.removeClass('active');
            signin.addClass('active');
            inBox.css('display', 'block');
            upBox.css('display', 'none');
        });

        signup.on('click', function() {
            signin.removeClass('active');
            signup.addClass('active');
            inBox.css('display', 'none');
            upBox.css('display', 'block');
        });

    }

    changeHead($("#private-complete"), $("#shared-complete"), $("#completed-private"), $("#completed-shared"));
    changeHead($("#private-pending"), $("#shared-pending"), $("#pending-private"), $("#pending-shared"));


    function AddMemo(memoContainer) {
        this.container = memoContainer;
        this.memo = this.container.find('#to-do');
        this.addButton = this.container.find('#addTodo');
        this.context = $('#pending-priv-body');
        this.attachMemo(this.memo, this.context);

        this.attachEvents(this.context);

    }

    AddMemo.prototype = {
        attachMemo: function(memo, context) {
            this.addButton.on('click', function() {
                if (memo.val().trim().length > 0) {
                    var request = $.ajax({
                        url: '/to-do/addMemo',
                        method: 'POST',
                        data: { memo: memo.val() }
                    });
                    request.done(function(response) {
                        var str = '<tr>' +
                            '<td class="checkbox-cell"><label class="checkbox-inline"><input type="checkbox" id="tick"><span>Mark Completed</span></label></td>' +
                            '<td class="task-cell">' + memo.val() + '</td>' +
                            '<td><button class="btn btn-info" id="shareTodo">Share</button></td>' +
                            '</tr>';
                        $(context).append(str);
                        $('body').append('<div class="success-response">' + response + '</div>');
                        setTimeout(function() {
                            $('.success-response').remove();
                        }, 2000)
                    });

                    request.fail(function(err) {
                        console.log('error', err);
                    });
                }

            });

        },

        attachEvents: function() {
            this.context.on('DOMNodeInserted', function(event) {
                if (event.target.tagName === 'TR') {
                    new Mapping($('#pending-priv-body'), $(event.target));
                }
            });
        }

    }

    new AddMemo($('#memo-box'));




    function Mapping(table, tr) {
        this.table = table;
        this.tr = tr || table.find('tr');
        this.tr.find('#tick').on('click', function() {
            var label = $(this).parent().find("span");
            var tr = $(this).closest('tr');
            var fromContext = '#' + tr.closest('tbody').attr('id');
            var request = $.ajax({
                url: '/to-do/modify',
                method: 'POST',
                data: { memo: $(this).closest('tr').find('td:nth-child(2)').text(), fromContext: fromContext, toContext: mapper[fromContext] }
            });
            request.done(function(response) {

                tr.detach();
                label.text(checkboxMap[label.text()]);
                $(mapper[fromContext]).append(tr);
                $('body').append('<div class="success-response">' + response + '</div>');
                setTimeout(function() {
                    $('.success-response').remove();
                }, 2000);
            });
            request.fail(function() {
                console.log('error');
            });
        });

        this.tr.find('#shareTodo').on('click', function() {
            console.log($('#share'));
            $('#share').css({ 'display': 'block' });
            $('#todoContent').val($(this).closest('tr').find('td:nth-child(2)').text());
        });

    }

    new Mapping($('#completed-shared-body'));
    new Mapping($('#completed-priv-body'));
    new Mapping($('#pending-shared-body'));
    new Mapping($('#pending-priv-body'));


    function Share(shareBox) {
        shareBox.find("#findUsers").keyup(function() {
            document.getElementById('suggestionBox').innerHTML = '';
            if ($(this).val().length > 1) {
                var request = $.ajax({
                    url: '/to-do/searchUsers',
                    method: 'POST',
                    data: { keyword: $('#findUsers').val() }
                });
                request.done(function(response) {
                    response.forEach(function(elm) {
                        var div = document.createElement('div');
                        div.setAttribute('class', 'suggest-response');
                        div.setAttribute('id', 'suggestResponse');
                        var h3 = document.createElement('h3');
                        h3.appendChild(document.createTextNode(elm.name));
                        var p = document.createElement('p');
                        p.appendChild(document.createTextNode(elm.email));
                        div.appendChild(h3);
                        div.appendChild(p);
                        document.getElementById('suggestionBox').appendChild(div);
                        $(div).on('click', function() {
                            shareBox.find('#findUsers').val($(this).find('p').text());
                            document.getElementById('suggestionBox').innerHTML = '';
                        });
                    });


                });
                request.fail(function() {
                    console.log('error');
                });
            }
        });
        shareBox.find('#closeShare').on('click', function() {
            shareBox.css({ 'display': 'none' });
        });
        shareBox.find('#shareMemo').on('click', function() {
            var toUser = shareBox.find('#findUsers').val();
            var memo = shareBox.find('#todoContent').val();

            var request = $.ajax({
                url: '/to-do/share',
                method: 'POST',
                data: { memo: memo, toUser: toUser }
            });
            request.done(function(response) {
                shareBox.css({ 'display': 'none' });
                $('body').append('<div class="success-response">' + response + '</div>');
                setTimeout(function() {
                    $('.success-response').remove();
                }, 2000);
            });
            request.fail(function() {
                console.log('error');
            });

        });

    }
    Share($('#share'));


    // setInterval(function() {
    //     var request = $.ajax({
    //         url: '/to-do/searchShared',
    //         method: 'POST',
    //         data: { oldShared: data }
    //     });
    //     request.done(function(response) {
    //         data = response;
    //         console.log(response);
    //     });
    //     request.fail(function(err) {
    //         console.log('err')
    //     })
    // }, 5000);

    var socket = io.connect('http://localhost:3000/to-do');
    socket.on('change', function(data) {
        var str = '<tr>' +
            '<td class="checkbox-cell"><label class="checkbox-inline"><input type="checkbox" id="tick"><span>Mark Completed</span></label></td>' +
            '<td class="task-cell">' + data.shared + '</td>' +
            '<td><button class="btn btn-info" id="shareTodo">Share</button></td>' +
            '</tr>';
        $('#pending-shared-body').append(str);
        setTimeout(function() {
            $('body').append('<div class="success-response"> New Shared Memo </div>');
        }, 5000)



        setTimeout(function() {
            $('.success-response').remove();
        }, 8000)
    });


})(this.document, this.$);