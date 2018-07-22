$(document).ready(function () {
    var app = new Vue({
        el: '#app',
        data: {
            showUploadModal: false,
            selectedFileName: ''
        },
        methods: {
            loadQuestionaireData () {

            },
            uploadQuestionClick: function () {
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
            }
        },
        created: function () {
        }
    });
})