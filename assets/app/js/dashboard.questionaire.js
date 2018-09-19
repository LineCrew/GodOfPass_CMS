var topicDT = null
var questionaireDT = null
var questionItemDT = null
var app = null

function normalizeNumber(number, length) {
    number = number.toString()
    const count = length - number.length
    for (let i = count; i > 0; i--) {
        number = '0' + number
    }
    return number
}

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
                if (this.selectedFilter_questionaire < 1) {
                    return
                }
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
                $('#selected_excel_file').change(event => {
                    console.log('file selected')
                    try {
                        // true: readAsBinaryString ; false: readAsArrayBuffer
                        var rABS = true;
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

                        if (rABS) fileReader.readAsBinaryString(f); else fileReader.readAsArrayBuffer(f);
                    } catch (e) {
                        console.error('cannot parse file.', e)
                    }
                })
            },
            parseExcelQuestionaireFile (workbook) {
                // console.log(workbook)
                var parsedSheet = workbook.Sheets[workbook.SheetNames[0]]
                // console.log('parsed sheet', parsedSheet)
                let row = 2
                let result = []
                //  questionaire case count: 4 = default, 5 = determine
                let case_count = parsedSheet[`K${row}`] ? 5 : 4

                while (true) {
                    var content = parsedSheet[`A${row}`]
                    if (content) {
                        try {
                            result.push({
                                questionaireId: this.selectedFilter_questionaire,
                                number: content.v + normalizeNumber(parsedSheet[`B${row}`].v, 6) + normalizeNumber(parsedSheet[`C${row}`].v, 4),
                                content: (parsedSheet[`D${row}`].h).trim(),
                                example: parsedSheet[`E${row}`] ? parsedSheet[`E${row}`].h || parsedSheet[`E${row}`].v + '' || '' : '',
                                case1: (parsedSheet[`F${row}`].h + '' || '').trim(),
                                case2: (parsedSheet[`G${row}`].h + '' || '').trim(),
                                case3: (parsedSheet[`H${row}`].h + '' || '').trim(),
                                case4: (parsedSheet[`I${row}`].h + '' || '').trim(),
                                case5: case_count === 5 ? parsedSheet[`J${row}`].h || '' : '',
                                answer: case_count === 4 ? parsedSheet[`J${row}`].v || 0 : parsedSheet[`K${row}`].v || 0,
                            })
                            row++
                        } catch (e) {
                            alert('데이터를 읽어들이는 중 ' + row + '줄에서 오류가 발생했습니다.')
                            return
                        }
                        // console.log('formatted text: ', parsedSheet[`E${row}`] ? parsedSheet[`E${row}`].h : '')
                    } else {
                        break
                    }
                }
                result.forEach(item => {
                    if (JSON.stringify(result[result.length - 1]) == JSON.stringify(item)) {
                        this.uploadQuestionItem(item, _ => {
                            swal.close()
                            questionItemDT.reload()
                        })
                    } else {
                        this.uploadQuestionItem(item)
                    }
                })
            },
            async uploadQuestionItem (item, callback) {
                item.number = Number.parseInt(item.number)
                $.ajax({
                    method: 'POST',
                    url: API_V1 + '/questionaire/' + this.selectedFilter_questionaire + '/addQuestionItem',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    dataType: 'json',
                    data: JSON.stringify(item),
                    success: res => {
                        console.log('upload succeeded: ' + item.number)
                        if (callback != undefined) {
                            callback()
                        }
                    },
                    error: (xhr, errStatus, error) => {
                        console.log('upload failed: ', item.number)
                        if (callback != undefined) {
                            callback()
                        }
                    }
                })
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
                            gameId: this.selectedFilter_game,
                            topicName: this.topicName
                        }),
                        success: res => {
                            this.topicName = ''
                            topicDT.reload()
                        },
                        error: (xhr, errStatus, error) => {

                        }
                    })
                }
            },
            createQuestionaire () {
                console.log('Click: create questionaire', this.questionaireName)
                if (this.questionaireName && this.selectedFilter_topic > 0) {
                    $.ajax({
                        method: 'POST',
                        url: API_V1 + '/questionaire/create',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        dataType: 'json',
                        data: JSON.stringify({
                            topicId: Number.parseInt(this.selectedFilter_topic),
                            questionaireName: this.questionaireName
                        }),
                        success: res => {
                            this.questionaireName = ''
                            this.selectedTopic = -1
                            questionaireDT.reload()
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
                        },
                        {
                            field: 'number',
                            title: 'number'
                        },
                        {
                            field: 'content',
                            title: 'question'
                        },
                        {
                            field: 'example',
                            title: 'example'
                        },
                        {
                            field: 'case1',
                            title: 'case 1'
                        },
                        {
                            field: 'case2',
                            title: 'case 2'
                        },
                        {
                            field: 'case3',
                            title: 'case 3'
                        },
                        {
                            field: 'case4',
                            title: 'case 4'
                        },
                        {
                            field: 'case5',
                            title: 'case 5'
                        },
                        {
                            field: 'answer',
                            title: 'answer'
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
        },
        watch: {
            selectedFilter_game (newGame) {
                if (newGame == -1) {

                } else {
                    
                }
            }
        }
    });
})