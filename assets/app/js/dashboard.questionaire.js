var topicDT = null
var questionaireDT = null
var questionItemDT = null
var app = null

$(document).ready(function () {
    app = new Vue({
        el: '#app',
        data: {
            gameData: [],
            topicData: [],
            questionaireData: [],
            questionaireItemData: [],
            showUploadModal: false,
            selectedFilter_game: -1,
            selectedFilter_topic: -1,
            selectedFilter_questionaire: -1,
            selectedFileName: '',
            selectedTopic: -1,
            topicName: '',
            questionaireName: '',
        },
        methods: {
            uploadQuestionClick () {
                this.showUploadModal = true
                swal({
                    target: document.getElementById('app'),
                    titleText: '문제 업로드',
                    html: $('#SelectExcel').html(),
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
                            gameId: selectedFilter_game,
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
            createQuestionItem () {
                console.log('Click: create question item', this.questionaireName)
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
                                map: raw => {
                                    this.topicData = raw.message
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
                                map: raw => {
                                    this.questionaireData = raw.message
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
                                    this.questionaireItemData = items
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
            $.ajax(API_V1 + '/game', {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                dataType: 'json',
                success: res => {
                    this.gameData = res.message
                },
                error: (xhr, errStatus, error) => {
                    alert('대분류 데이터를 가져오지 못했습니다.')
                }
            })
        },
        mounted () {
            this.initTopicDataTable()
            this.initQuestionaireTable()
            this.initQuestionItemTable()
        }
    });
})