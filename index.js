const API_URL = "https://qftaj3fbob.execute-api.ap-northeast-1.amazonaws.com/test/";

const TARGETS = [
    "contact-type",
    "company",
    "name",
    "email",
    "phone",
    "url",
    "content",
    "file",
    "check",
    "btn",
];

function validation(label, validation_line, value) {

    let error = null;
    let pattern = null;

    let validations = validation_line.split(":");

    switch (validations[0]){

        // 必須の場合
        case 'required':
            if (value == "") {
                error = label + "を入力してください。"
            }
            break;

        // 最大文字数の場合
        case 'max':
            let length = value.length;
            let maximum = validations[1];
            if (length > maximum) {
                error = label + "は" + maximum + "文字以内で入力してください。"
            }
            break;

        // メールアドレス形式
        case 'email':
            pattern = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;
            if (!pattern.test(value)) {
                error = label + "の形式が正しくありません。"
            }
            break;

        // 電話番号の場合
        case 'phone':
            pattern = /^\d{10,11}$/;
            let pattern_sub = /^\d{2,5}-\d{1,4}-\d{4}$/;
            if (value != "" && !pattern.test(value) && !pattern_sub.test(value)) {
                error = label + "の形式が正しくありません。"
            }
            break;

        // URLの場合
        case 'url':
            pattern = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/;
            if (!pattern.test(value)) {
                error = label + "の形式が正しくありません。"
            }
            break;

        // Fileの場合
        case 'file':

            // ファイル形式のチェック

            // ファイルの容量のチェック
            break;

        default:

    }

    return error;
}

function addError(target, message) {
    let sub_target = target.querySelector(".form-preview-alert-text");
    target.classList.add('form-preview-haserror');
    sub_target.innerHTML = message;
    sub_target.classList.remove("fadeOutDown");
    sub_target.classList.add('animated');
    sub_target.classList.add("fadeInUp");
}

function removeError(target) {
    let sub_target = target.querySelector(".form-preview-alert-text");
    target.classList.remove('form-preview-haserror');
    sub_target.classList.remove('animated');
    sub_target.classList.remove("fadeInUp");
    sub_target.classList.add("fadeOutDown");
    sub_target.innerHTML = "";
}

function submitToAPI() {
    let bln_check = validateForm();

    if (!bln_check) return;

    hideInput();
}

function cancelAPI() {
    hideConfirm();
}

function hideInput() {
    for(let i = 0; i < TARGETS.length; i++) {
        document.querySelector("#contact-field-confirm-" + TARGETS[i] + "-dl").style.display = "block";
        document.querySelector("#contact-field-preview-" + TARGETS[i] + "-dl").style.display = "none";

    }
}

function hideConfirm() {
    for(let i = 0; i < TARGETS.length; i++) {
        document.querySelector("#contact-field-confirm-" + TARGETS[i] + "-dl").style.display = "none";
        document.querySelector("#contact-field-preview-" + TARGETS[i] + "-dl").style.display = "block";
    }
}

function validateForm(e) {

    let check_array = [
        {
            "id": "contact-type",
            "dl": "contact-type",
            "input": "text",
            "label": "お問合せの種別",
            "validation": "required",
        },
        {
            "id": "company",
            "dl": "company",
            "input": "text",
            "label": "御社名",
            "validation": "required|max:255",
        },
        {
            "id": "family-name",
            "dl": "name",
            "input": "text",
            "label": "ご担当者様名",
            "validation": "required|max:50",
        },
        {
            "id": "given-name",
            "dl": "name",
            "input": "text",
            "label": "ご担当者様名",
            "validation": "required|max:50",
        },
        {
            "id": "email",
            "dl": "email",
            "input": "text",
            "label": "ご連絡先メールアドレス",
            "validation": "required|max:255|email",
        },
        {
            "id": "phone",
            "dl": "phone",
            "input": "text",
            "label": "ご連絡先電話番号",
            "validation": "max:13|phone",
        },
        {
            "id": "url",
            "dl": "url",
            "input": "text",
            "label": "ご利用WebサイトURL",
            "validation": "required|max:255|url",
        },
        {
            "id": "content",
            "dl": "content",
            "input": "text",
            "label": "お問い合わせ内容",
            "validation": "required|max:1000",
        }
        ,
        {
            "id": "check",
            "dl": "check",
            "input": "checkbox",
            "label": "個人情報の取扱い",
            "validation": "required",
        }
    ]
    let error_count = 0;

    for (let i = 0; i < check_array.length; i++) {

        let result = null;

        let value = null;

        // 値の取得
        let info_json = check_array[i];
        let target_dom = document.querySelector("#contact-field-preview-" + info_json.id);

        if (info_json.input == "checkbox") {
            value = target_dom.checked;
        } else {
            value = target_dom.value;
        }

        // validation
        let validation_array = info_json.validation.split("|");

        // validationごとのチェックを行う。一つエラーが発生したら終了する
        for (let j = 0; j < validation_array.length; j++) {
            let validation_line = validation_array[j];
            result = validation(info_json.label, validation_line, value);

            if (result != null) {
                break;
            }
        }

        let target = document.querySelector("#contact-field-preview-" + info_json.dl + "-dl");

        if (result != null) {
            addError(target, result)
            error_count++;
        } else {
            removeError(target)
        }
    }

    if (error_count >0) return false;

    return true;


    // お問い合わせの種類：必須

    // 御社名：必須、255文字以下
    // 御社名を入力してください。
    // 御社名は255文字以内で入力してください。

    // 担当者名：姓、名、どちらも必須、どちらも50文字いない
    // ご担当者様名は50文字以内で入力してください。
    // ご担当者様名を入力してください。

    // メールアドレス形式、255文字以下
    // ご連絡先メールアドレスを入力してください。
    // ご連絡先メールアドレスの形式が正しくありません。

    // 電話番号、50文字以下（13文字以下で良い）
    // ご連絡先電話番号は50文字以内で入力してください。

    // URL
    // ご利用WebサイトURLの形式が正しくありません。
    // ご利用WebサイトURLは255文字以内で入力してください。

    // お問い合わせ内容
    // お問い合わせ内容を入力してください。
    // お問い合わせ内容は1000文字以内で入力してください。

    // 添付ファイル（単一）
    // 添付ファイル（単一）のファイル形式は送信できません。

    // 個人情報の取扱い
    // 個人情報の取扱規程の同意がないため送信できません。

}

function sendAPI(e) {

    let json_asocc = [];

    let json_text = JSON.stringify(json_asocc);

    let xhr = new XMLHttpRequest;

    //レスポンスを受け取った時の処理（非同期）
    xhr.onload = function(){
        let res = xhr.responseText;
        if (res.length > 0)  {
            let parse = JSON.parse(res)
            console.log(parse);
        }
    };

    //エラーが起きた時の処理（非同期）
    xhr.onerror = function(){
        console.log("error!");
    }

    xhr.open('post', API_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(json_text);
}