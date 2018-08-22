var topicDT = null
var questionaireDT = null
var questionItemDT = null

$(document).ready(function () {
    var app = new Vue({
        el: '#app',
        data: {
            topicData: [],
            showUploadModal: false,
            selectedFileName: '',
            selectedTopic: -1,
            topicName: '',
            questionaireName: '',
        },
        methods: {
            loadData () {
                getTopics(res => {
                    if (res.statusCode == 200) {
                        this.topicData = res.message
                    }
                })
            },
            uploadQuestionClick () {
                this.showUploadModal = true
                swal({
                    target: document.getElementById('app'),
                    titleText: '문제 업로드',
                    html:
                    `<div class="row">
                        <div class="col-12">
                            <input class="custom-file-input" id="selected_excel_file" type="file" accept=".xlsx">
                            <label class="custom-file-label" for="selected_excel_file">선택된 엑셀 파일 없음</label>
                        </div>
                    </div>`,
                    confirmButtonText: '완료',
                    cancelButtonText: '취소',
                    showCancelButton: true,
                    width: '40rem'
                })
                $('#selected_excel_file').change(function(event) {
                    console.log('file selected')
                    try {
                        var rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer
                        var files = event.target.files, f = files[0];
                        this.selectedFileName = f.name
                        $('.custom-file-label').text(f.name)
                        var fileReader = new FileReader()
                        
                        fileReader.onload = function(e) {
                            var data = e.target.result;
                            if(!rABS) data = new Uint8Array(data);
                            var workbook = XLSX.read(data, {type: rABS ? 'binary' : 'array'});
                            app.parseExcelQuestionaireFile(workbook)
                        }

                        if(rABS) fileReader.readAsBinaryString(f); else fileReader.readAsArrayBuffer(f);
                    } catch (e) {
                        console.error('cannot parse file.', e)
                    }
                })
            },
            parseExcelQuestionaireFile (workbook) {
                console.log(workbook)
                var parsedSheet = workbook.Sheets[workbook.SheetNames[0]]
                console.log('parsed sheet', parsedSheet)
                var row = 2
                var result = []
                while(true) {
                    var content = parsedSheet[`A${row}`]
                    if (content) {
                        result.push({
                            subject: content.v,
                            episode: parsedSheet[`B${row}`].v,
                            number: parsedSheet[`C${row}`].v,
                            question: parsedSheet[`D${row}`].v,
                            example: parsedSheet[`E${row}`] ? parsedSheet[`E${row}`].f || parsedSheet[`E${row}`].v : '',
                            case_1: parsedSheet[`F${row}`].v,
                            case_2: parsedSheet[`G${row}`].v,
                            case_3: parsedSheet[`H${row}`].v,
                            case_4: parsedSheet[`I${row}`].v,
                            answer: parsedSheet[`J${row}`].v,
                        })
                        console.log('formatted text: ', parsedSheet[`E${row}`] ? parsedSheet[`E${row}`].h : '')
                        row++
                    } else {
                        break
                    }
                }
                console.log(result)
            },
            createTopic () {
                console.log('Click: create topic', this.topicName)
                if (this.topicName) {
                    $.ajax({
                        method: 'POST',
                        url: API_V1 + '/topic/createTopic',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        dataType: 'json',
                        data: JSON.stringify({
                            gameId: Number.parseInt($('.radio-game:checked').val()),
                            topicName: this.topicName
                        }),
                        success: res => {
                            this.topicName = ''
                            topicDT.reload()
                            this.loadData()
                        },
                        error: (xhr, errStatus, error) => {

                        }
                    })
                }
            },
            createQuestionaire () {
                console.log('Click: create questionaire', this.questionaireName)
                if (this.questionaireName && this.selectedTopic > 0) {
                    $.ajax({
                        method: 'POST',
                        url: API_V1 + '/questionaire/create',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        dataType: 'json',
                        data: JSON.stringify({
                            topicId: Number.parseInt(this.selectedTopic),
                            questionaireName: this.questionaireName
                        }),
                        success: res => {
                            this.questionaireName = ''
                            this.selectedTopic = -1
                            questionaireDT.reload()
                            this.loadData()
                        },
                        error: (xhr, errStatus, error) => {

                        }
                    })
                }
            },
            initTopicDataTable () {
                console.log('[datatable] init topic datatable from ' + API_V1 + '/topic')
                topicDT = $('.topic-table').mDatatable({
                    data: {
                        type: 'remote',
                        source: {
                            read: {
                                url : API_V1 + '/topic',
                                method: 'GET',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                map: function (raw) {
                                    raw.message.forEach((topic, index) => {
                                        raw.message[index].questionaires_count = topic.questionaires.length
                                    })
                                    return raw.message
                                }
                            }
                        },
                        pageSize: 10,
                        serverPaging: false,
                        serverFiltering: false,
                        serverSorting: false,
                    },
                    columns: [
                        {
                            field: 'topicName',
                            title: '이름'
                        },
                        {
                            field: 'questionaires_count',
                            title: '포함된 소분류'
                        }
                    ]
                })
            },
            initQuestionaireTable () {
                questionaireDT = $('.questionaire-table').mDatatable({
                    data: {
                        type: 'remote',
                        source: {
                            read: {
                                url: API_V1 + '/questionaire',
                                method: 'GET',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                map: function (raw) {
                                    raw.message.forEach((questionaire, index) => {
                                        raw.message[index].items_count = questionaire.items.length
                                    })
                                    return raw.message
                                }
                            }
                        },
                        pageSize: 10,
                        serverPaging: false,
                        serverFiltering: false,
                        serverSorting: false,
                    },
                    columns: [
                        {
                            field: 'questionaireName',
                            title: '이름',
                        },
                        {
                            field: 'items_count',
                            title: '문제 수'
                        }
                    ]
                })
            },
            initQuestionItemTable () {
                questionItemDT = $('.question-item-table').mDatatable({
                    data: {
                        type: 'remote',
                        source: {
                            read: {
                                url: API_V1 + '/questionaire',
                                method: 'GET',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                map: function (raw) {
                                    let items = []
                                    raw.message.forEach((questionaire, index) => {
                                        questionaire.items.forEach(item => items.push(item))
                                    })
                                    return items
                                }
                            }
                        },
                        pageSize: 10,
                        serverPaging: false,
                        serverFiltering: false,
                        serverSorting: false,
                    },
                    columns: [
                        {
                            field: 'id',
                            title: '#',
                        }
                    ]
                })
            }            
        },
        created () {
            this.loadData()
        },
        mounted () {
            this.initTopicDataTable()
            this.initQuestionaireTable()
            this.initQuestionItemTable()
        }
    });
})